import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";
import { chromium } from "playwright";

const root = new URL("./", import.meta.url);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
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
  if (failures.length) {
    throw new Error(`browser errors:\n${failures.join("\n")}`);
  }
} finally {
  await browser?.close();
  server.close();
}
