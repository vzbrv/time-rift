import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { chromium } from "playwright";

const root = new URL("./", import.meta.url);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

const server = createServer(async (req, res) => {
  const requestUrl = new URL(req.url || "/", "http://127.0.0.1");
  let pathname = decodeURIComponent(requestUrl.pathname);
  if (pathname === "/") pathname = "/index.html";
  if (pathname === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (pathname.includes("..")) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(new URL(`.${pathname}`, root));
    res.writeHead(200, {
      "content-type": types[extname(pathname)] || "application/octet-stream",
    });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const failures = [];
let browser;

try {
  browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHROME_CHANNEL || "chrome",
  });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  page.on("pageerror", (error) => failures.push(error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (message.text().includes("favicon.ico")) return;
    failures.push(message.text());
  });

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  const desktop = await page.locator("iq-time-rift").evaluate((element) => {
    const rootNode = element.shadowRoot;
    if (!rootNode) return { ok: false, error: "missing shadow root" };

    const howTo = [...rootNode.querySelectorAll("button")].find((button) =>
      /how to play/i.test(button.textContent || "")
    );
    howTo?.click();

    return {
      ok: Boolean(
        rootNode.querySelector(".rift-shell") &&
          rootNode.querySelector(".modal:not([hidden])")
      ),
      title: rootNode.querySelector("h1")?.textContent?.trim() || "",
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    };
  });

  if (!desktop.ok) throw new Error(desktop.error || "widget did not render");
  if (!desktop.title.includes("Repair the Web3 timeline")) {
    throw new Error(`unexpected title: ${desktop.title}`);
  }
  if (desktop.scrollWidth > desktop.clientWidth + 1) {
    throw new Error(
      `desktop horizontal overflow: ${desktop.scrollWidth} > ${desktop.clientWidth}`
    );
  }

  await page.waitForTimeout(50);
  const modalFocus = await page.locator("iq-time-rift").evaluate((element) => {
    const active = element.shadowRoot.activeElement;
    return {
      activeDismiss: Boolean(active?.matches("[data-tutorial-dismiss]")),
      activeHowTo: Boolean(active?.matches("[data-howto]")),
    };
  });
  if (!modalFocus.activeDismiss || modalFocus.activeHowTo) {
    throw new Error(`unexpected tutorial focus target: ${JSON.stringify(modalFocus)}`);
  }

  const content = await page.locator("iq-time-rift").evaluate((element) => {
    const debug = window.__IQ_TIME_RIFT_DEBUG__;
    const contentErrors = debug?.validateContent?.() || ["missing debug validator"];
    const externalLinks = [...element.shadowRoot.querySelectorAll('a[target="_blank"]')].map((link) => ({
      href: link.href,
      rel: link.rel,
    }));
    const insecureLinks = externalLinks.filter((link) => {
      const tokens = link.rel.split(/\s+/);
      return !tokens.includes("noopener") || !tokens.includes("noreferrer");
    });
    return {
      contentErrors,
      insecureLinks,
      storageKey: debug?.storageKey || "",
    };
  });
  if (content.contentErrors.length) {
    throw new Error(`content validation failed: ${JSON.stringify(content.contentErrors)}`);
  }
  if (content.insecureLinks.length) {
    throw new Error(`unsafe external links: ${JSON.stringify(content.insecureLinks)}`);
  }
  if (!/^iq-time-rift-v2:\d{4}-\d{2}-\d{2}$/.test(content.storageKey)) {
    throw new Error(`unexpected storage key: ${content.storageKey}`);
  }

  const gameplay = await page.locator("iq-time-rift").evaluate((element) => {
    const fail = (message) => ({ ok: false, error: message });
    const reset = () => {
      element.state = element.newState(element.theme.id, "Standard");
      element.showTutorial = false;
      element.save();
      element.render();
    };
    const eventTime = (id) => new Date(element.event(id).date).getTime();
    const expectedGap = (plan) => {
      const targetTime = eventTime(plan.target);
      return plan.anchors
        .map((id) => eventTime(id))
        .filter((time) => time < targetTime).length;
    };

    reset();
    element.openModal();
    if (element.initialModalFocus()?.matches("[data-howto]")) {
      return fail("modal initial focus lands on help button");
    }
    element.closeModal();

    reset();
    const placePlan = element.plans().find((plan) => plan.type === "place");
    element.submitPlacement(placePlan, expectedGap(placePlan));
    if (element.state.phase !== "revealing" || !element.state.pendingReveal) {
      return fail("placement round did not solve");
    }

    reset();
    const corruptIndex = element.plans().findIndex((plan) => plan.type === "corrupt");
    element.state.roundIndex = corruptIndex;
    element.save();
    element.render();
    const corruptPlan = element.currentPlan();
    const corruptCards = [...element.shadowRoot.querySelectorAll("[data-corrupt]")];
    if (!corruptCards.length || corruptCards.some((card) => card.querySelector("span, small, .drag-cue"))) {
      return fail("corrupt cards expose ordering metadata");
    }
    if (element.roundGuidance(corruptPlan).toLowerCase().includes("date")) {
      return fail("corrupt guidance refers to hidden dates");
    }
    const wrongCorruptId = corruptPlan.anchors.find((id) => id !== corruptPlan.misplaced);
    element.submitCorrupt(corruptPlan, wrongCorruptId);
    const answerCard = [...element.shadowRoot.querySelectorAll("[data-corrupt]")]
      .find((card) => card.dataset.corrupt === corruptPlan.misplaced);
    if (answerCard?.classList.contains("rift-card") || answerCard?.querySelector(".drag-cue")) {
      return fail("failed corrupt attempt revealed the answer");
    }
    element.submitCorrupt(corruptPlan, corruptPlan.misplaced);
    if (element.state.phase !== "revealing" || !element.state.pendingReveal) {
      return fail("corrupt round did not solve");
    }

    reset();
    element.roundState().hintLevel = element.rulesForDifficulty().hintsBeforeReveal;
    element.revealAndContinue();
    if (element.state.phase !== "revealing" || element.state.revealsUsed !== 1) {
      return fail("reveal path did not enter reveal phase");
    }

    reset();
    const bossIndex = element.plans().findIndex((plan) => plan.type === "boss");
    element.state.roundIndex = bossIndex;
    element.state.bossOrder = element.orderedEvents().map((item) => item.id);
    element.roundState().bossAttempts = element.rulesForDifficulty().bossAttempts;
    element.save();
    element.render();
    element.submitBoss();
    if (element.state.phase !== "revealing" || element.state.pendingReveal?.title !== "Timeline complete.") {
      return fail("boss correct order was blocked after checks were exhausted");
    }

    let keyCalls = 0;
    const originalHandleKeys = element.handleKeys.bind(element);
    element.handleKeys = (event) => {
      keyCalls += 1;
      return originalHandleKeys(event);
    };
    element.render();
    element.render();
    element.shadowRoot.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    if (keyCalls !== 1) return fail(`keydown handler fired ${keyCalls} times`);

    return { ok: true };
  });

  if (!gameplay.ok) throw new Error(gameplay.error);

  const storageRecovery = await page.evaluate(() => {
    const debug = window.__IQ_TIME_RIFT_DEBUG__;
    if (!debug?.storageKey) return { ok: false, error: "missing storage key" };
    localStorage.setItem(
      debug.storageKey,
      JSON.stringify({
        themeId: "road-to-defi",
        roundIndex: 999,
        phase: "playing",
        restoredRounds: 999,
        rifts: -5,
        hintsUsed: "bad",
        roundState: [],
      })
    );
    localStorage.setItem("iq-time-rift-tutorial-seen-v1", "1");
    return { ok: true };
  });
  if (!storageRecovery.ok) throw new Error(storageRecovery.error);

  await page.reload({ waitUntil: "networkidle" });
  const recovered = await page.locator("iq-time-rift").evaluate((element) => {
    const totalRounds = element.totalRounds();
    return {
      ok:
        element.state.roundIndex >= 0 &&
        element.state.roundIndex < totalRounds &&
        element.state.restoredRounds <= totalRounds &&
        element.state.rifts === 0 &&
        Boolean(element.shadowRoot.querySelector(".rift-shell")),
      state: element.state,
      totalRounds,
    };
  });
  if (!recovered.ok) {
    throw new Error(`stored-state recovery failed: ${JSON.stringify(recovered)}`);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle" });
  const mobile = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  if (mobile.scrollWidth > mobile.clientWidth + 1) {
    throw new Error(
      `mobile horizontal overflow: ${mobile.scrollWidth} > ${mobile.clientWidth}`
    );
  }
  const mobileWidget = await page.locator("iq-time-rift").evaluate((element) => {
    const rootNode = element.shadowRoot;
    const preview = rootNode.querySelector(".preview");
    return {
      sourceLabel: rootNode.querySelector(".selected-source")?.textContent?.trim() || "",
      previewRingDisplay: preview ? getComputedStyle(preview, "::after").display : "",
    };
  });
  if (!mobileWidget.sourceLabel) throw new Error("mobile source label missing");
  if (mobileWidget.previewRingDisplay !== "none") {
    throw new Error(`mobile preview ring still visible: ${mobileWidget.previewRingDisplay}`);
  }
  if (failures.length) {
    throw new Error(`browser errors:\n${failures.join("\n")}`);
  }
} finally {
  await browser?.close();
  server.close();
}
