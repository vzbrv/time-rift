(() => {
  const WIKI_BASE = "https://iq.wiki/wiki/";

  const getLocalDateKey = (date = new Date()) => {
    const yearPart = date.getFullYear();
    const monthPart = String(date.getMonth() + 1).padStart(2, "0");
    const dayPart = String(date.getDate()).padStart(2, "0");
    return `${yearPart}-${monthPart}-${dayPart}`;
  };

  const hashString = (value = "") => {
    let hash = 2166136261;
    const text = String(value);
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  };

  const pickDailyIndex = (key, length) => (length ? hashString(key) % length : 0);
  const TODAY_KEY = getLocalDateKey(new Date());
  const STORAGE_KEY = `iq-time-rift-v2:${TODAY_KEY}`;
  const TUTORIAL_KEY = "iq-time-rift-tutorial-seen-v1";
  const WIKI_SOURCE_LABEL = "Lore from IQ.wiki";

  const readStorage = (key) => {
    try {
      return window.localStorage?.getItem(key) || null;
    } catch {
      return null;
    }
  };

  const writeStorage = (key, value) => {
    try {
      window.localStorage?.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  };

  const esc = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const safeUrl = (value = "") => {
    try {
      const url = new URL(value, window.location.href);
      return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : "#";
    } catch {
      return "#";
    }
  };

  const slugUrl = (slug) => `${WIKI_BASE}${slug}`;
  const year = (date) => String(date).slice(0, 4);
  const source = (label, url) => ({ label, url });
  const event = (id, title, date, era, wikiSlug, shortWhy, dependencyHint, extra = {}) => ({
    id,
    title,
    date,
    yearLabel: extra.yearLabel || year(date),
    datePrecision: extra.datePrecision || "day",
    era,
    wikiSlug,
    shortWhy,
    dependencyHint,
    sources: extra.sources || [{ label: "IQ.wiki article", url: slugUrl(wikiSlug) }],
  });

  const themes = [
    {
      id: "road-to-defi",
      title: "The Road to DeFi",
      difficulty: "Medium",
      featurePath: {
        title: "IQ.wiki wiki sources",
        label: WIKI_SOURCE_LABEL,
        description: "Timeline lore built from IQ.wiki pages on crypto and DeFi.",
        ctaText: "Read the DeFi article on IQ.wiki",
        ctaUrl: "https://iq.wiki/wiki/decentralized-finance-defi",
      },
      teaser: ["Bitcoin Origins", "Smart Contract Era", "DeFi Boom"],
      story:
        "Bitcoin made crypto possible. Ethereum made it programmable. DeFi showed what on-chain finance could become.",
      events: [
        event(
          "bitcoin-whitepaper",
          "Bitcoin whitepaper",
          "2008-10-31",
          "Bitcoin Origins",
          "bitcoin",
          "The whitepaper introduced peer-to-peer electronic cash and the design that made Bitcoin possible.",
          "This event had to come before Bitcoin could run.",
          {
            sources: [
              source("IQ.wiki Bitcoin article", slugUrl("bitcoin")),
              source("Bitcoin whitepaper", "https://bitcoin.org/bitcoin.pdf"),
            ],
          }
        ),
        event(
          "bitcoin-genesis",
          "Bitcoin genesis block",
          "2009-01-03",
          "Bitcoin Origins",
          "bitcoin",
          "The genesis block started the Bitcoin network and proved the whitepaper could become live software.",
          "This could not happen before the whitepaper existed."
        ),
        event(
          "ethereum-mainnet",
          "Ethereum mainnet",
          "2015-07-30",
          "Smart Contract Era",
          "ethereum",
          "Ethereum brought general-purpose smart contracts to a public blockchain.",
          "This had to happen before most DeFi applications could exist.",
          {
            sources: [
              source("IQ.wiki Ethereum article", slugUrl("ethereum")),
              source("Ethereum launch notice", "https://blog.ethereum.org/2015/07/30/ethereum-launches"),
            ],
          }
        ),
        event(
          "dai-launch",
          "DAI launches",
          "2017-12-18",
          "Stablecoin Era",
          "dai",
          "DAI showed that a decentralized stablecoin could be created and managed on-chain.",
          "This needed Ethereum smart contracts first.",
          { yearLabel: "Dec 2017" }
        ),
        event(
          "uniswap-launch",
          "Uniswap launches",
          "2018-11-02",
          "DEX Era",
          "uniswap",
          "Uniswap helped make automated token swaps simple and accessible on Ethereum.",
          "This belongs after Ethereum mainnet, but before DeFi Summer.",
          {
            yearLabel: "Nov 2018",
            sources: [
              source("IQ.wiki Uniswap article", slugUrl("uniswap")),
              source("Uniswap v1 launch post", "https://blog.uniswap.org/uniswap-history"),
            ],
          }
        ),
        event(
          "defi-summer",
          "DeFi Summer",
          "2020-06-01",
          "DeFi Boom",
          "decentralized-finance-defi",
          "DeFi Summer marked a surge of lending, trading, liquidity mining, and on-chain finance experiments.",
          "This came after DEX and stablecoin foundations were in place.",
          { yearLabel: "mid-2020", datePrecision: "approximate" }
        ),
        event(
          "ethereum-merge",
          "Ethereum Merge",
          "2022-09-15",
          "Protocol Upgrade",
          "the-merge",
          "The Merge moved Ethereum from proof of work to proof of stake.",
          "This is later than the first DeFi boom.",
          {
            yearLabel: "Sep 2022",
            sources: [
              source("IQ.wiki The Merge article", slugUrl("the-merge")),
              source("Ethereum Merge announcement", "https://blog.ethereum.org/2022/08/24/mainnet-merge-announcement"),
            ],
          }
        ),
      ],
    },
    {
      id: "ai-x-crypto",
      title: "AI, Identity, and Crypto Infrastructure",
      difficulty: "Hard",
      teaser: ["Crypto Networks", "Proof of Personhood", "Agent Era"],
      story:
        "Crypto networks supplied rails for value, storage, identity, compute, and coordination. AI pressure made the order of those building blocks matter.",
      events: [
        event(
          "bitcoin-whitepaper",
          "Bitcoin whitepaper",
          "2008-10-31",
          "Crypto Networks",
          "bitcoin",
          "Bitcoin introduced the first durable crypto network for peer-to-peer value transfer.",
          "This is the earliest foundation in the set."
        ),
        event(
          "ethereum-mainnet",
          "Ethereum mainnet",
          "2015-07-30",
          "Programmable Crypto",
          "ethereum",
          "Ethereum made programmable on-chain applications broadly accessible.",
          "This came after Bitcoin and before most crypto AI networks."
        ),
        event(
          "filecoin-mainnet",
          "Filecoin mainnet",
          "2020-10-15",
          "Decentralized Storage",
          "filecoin",
          "Filecoin brought a large decentralized storage network into production.",
          "This belongs after the early smart contract era.",
          {
            sources: [
              source("IQ.wiki Filecoin article", slugUrl("filecoin")),
              source("Filecoin mainnet launch", "https://filecoin.io/blog/posts/mainnet-is-live/"),
            ],
          }
        ),
        event(
          "bittensor-growth",
          "Bittensor network momentum",
          "2023-03-01",
          "AI Network Era",
          "bittensor",
          "Bittensor made decentralized machine intelligence incentives a clearer crypto category before the broader agent narrative took over.",
          "This sits after Filecoin and before the identity and compute events in this path.",
          {
            yearLabel: "Mar 2023",
            datePrecision: "month",
            sources: [source("IQ.wiki Bittensor article", slugUrl("bittensor"))],
          }
        ),
        event(
          "akash-gpu",
          "Akash GPU marketplace expands",
          "2023-08-01",
          "Compute Markets",
          "akash-network",
          "Akash expanded decentralized compute access as AI workloads drove GPU demand.",
          "This belongs in the same broad era as Bittensor growth.",
          {
            yearLabel: "Aug 2023",
            datePrecision: "month",
            sources: [
              source("IQ.wiki Akash Network article", slugUrl("akash-network")),
              source("Akash GPU marketplace", "https://akash.network/blog/akash-gpu-mainnet-is-live/"),
            ],
          }
        ),
        event(
          "agent-wave",
          "On-chain AI agent wave",
          "2024-10-01",
          "Agent Era",
          "artificial-intelligence-ai",
          "AI agents became a major late-2024 crypto narrative for wallets, trading, automation, and social coordination.",
          "This is later than the first decentralized compute and AI network surge.",
          {
            yearLabel: "late 2024",
            datePrecision: "approximate",
            sources: [source("IQ.wiki Artificial Intelligence article", slugUrl("artificial-intelligence-ai"))],
          }
        ),
        event(
          "worldcoin-launch",
          "Worldcoin launches",
          "2023-07-24",
          "Identity Era",
          "worldcoin",
          "Worldcoin brought proof-of-personhood into a large public crypto identity rollout as AI made human verification more urgent.",
          "This came after early crypto AI networks gained attention and before the late-2024 agent wave.",
          {
            yearLabel: "Jul 2023",
            sources: [
              source("IQ.wiki Worldcoin article", slugUrl("worldcoin")),
              source("Worldcoin launch announcement", "https://world.org/blog/announcements/introducing-worldcoin"),
            ],
          }
        ),
      ],
    },
    {
      id: "stablecoin-path",
      title: "Stablecoin Stress Test",
      difficulty: "Medium",
      teaser: ["Dollar Tokens", "On-chain Credit", "Stablecoin Stress"],
      story:
        "Stablecoins made crypto easier to price, trade, lend, and use, while major stress events showed why design and collateral matter.",
      events: [
        event("tether-launch", "Tether launches", "2014-10-06", "Dollar Tokens", "tether", "Tether helped popularize blockchain-issued dollar tokens for crypto markets.", "This came before Ethereum-native stablecoin experiments.", { yearLabel: "Oct 2014" }),
        event("ethereum-mainnet", "Ethereum mainnet", "2015-07-30", "Smart Contract Era", "ethereum", "Ethereum made programmable stablecoin contracts broadly possible.", "This had to happen before DAI and many tokenized dollars."),
        event("dai-launch", "DAI launches", "2017-12-18", "On-chain Credit", "dai", "DAI showed that a decentralized stablecoin could be created and governed on-chain.", "This needed Ethereum smart contracts first.", { yearLabel: "Dec 2017" }),
        event("usdc-launch", "USDC launches", "2018-09-26", "Regulated Dollar Tokens", "usd-coin-usdc", "USDC became a major fiat-backed stablecoin used across exchanges, wallets, and DeFi.", "This followed early stablecoin demand and Ethereum token standards.", { yearLabel: "Sep 2018" }),
        event("terrausd-launch", "TerraUSD launches", "2020-09-01", "Algorithmic Stablecoins", "terrausd", "TerraUSD became a prominent algorithmic stablecoin experiment before its collapse.", "This belongs before the 2022 stablecoin stress event.", { yearLabel: "Sep 2020", datePrecision: "month" }),
        event("ust-collapse", "UST loses its peg", "2022-05-09", "Stablecoin Stress", "terrausd", "UST's collapse reshaped stablecoin risk conversations across crypto.", "This happened after TerraUSD grew into a major experiment.", { yearLabel: "May 2022", datePrecision: "month" }),
        event("paypal-usd", "PayPal USD launches", "2023-08-07", "Mainstream Payments", "paypal-usd", "PayPal USD brought a large consumer payments brand into regulated stablecoins.", "This is later than the major 2022 stablecoin stress cycle.", { yearLabel: "Aug 2023", sources: [source("IQ.wiki PayPal USD article", slugUrl("paypal-usd")), source("PayPal USD launch release", "https://newsroom.paypal-corp.com/2023-08-07-PayPal-Launches-U-S-Dollar-Stablecoin")] }),
      ],
    },
    {
      id: "nft-culture",
      title: "NFT Culture Chain",
      difficulty: "Easy",
      teaser: ["Collectibles", "NFT Marketplaces", "Culture Boom"],
      story:
        "NFTs grew from early Ethereum collectibles into marketplaces, games, sports moments, and avatar communities.",
      events: [
        event("ethereum-mainnet", "Ethereum mainnet", "2015-07-30", "Smart Contract Era", "ethereum", "Ethereum made programmable collectibles and NFT marketplaces broadly possible.", "This is the base layer before the later NFT projects."),
        event("cryptopunks-launch", "CryptoPunks launches", "2017-06-23", "Collectibles", "cryptopunks", "CryptoPunks became one of the most influential early NFT collectible projects.", "This came before the wider marketplace and avatar boom.", { yearLabel: "Jun 2017" }),
        event("opensea-launch", "OpenSea launches", "2017-12-20", "NFT Marketplaces", "opensea", "OpenSea helped make NFT discovery and trading more accessible.", "This followed the first wave of Ethereum collectibles.", { yearLabel: "late 2017", datePrecision: "approximate" }),
        event("axie-launch", "Axie Infinity launches", "2018-03-01", "Play-to-Earn", "axie-infinity", "Axie Infinity helped connect NFTs with games, economies, and digital ownership.", "This came after the earliest Ethereum collectibles.", { yearLabel: "Mar 2018", datePrecision: "month" }),
        event("nba-top-shot", "NBA Top Shot rises", "2020-10-01", "Mainstream NFTs", "nba-top-shot", "NBA Top Shot introduced many mainstream sports fans to NFT collectibles.", "This came before the 2021 avatar collection surge.", { yearLabel: "late 2020", datePrecision: "approximate" }),
        event("bayc-mint", "Bored Ape Yacht Club mints", "2021-04-23", "Avatar Boom", "bored-ape-yacht-club", "BAYC became a symbol of the 2021 NFT avatar and community boom.", "This belongs after earlier marketplaces and mainstream collectible experiments.", { yearLabel: "Apr 2021" }),
        event("blur-launch", "Blur launches", "2022-10-19", "NFT Trading", "blur", "Blur pushed NFT trading toward faster, more professional marketplace mechanics.", "This is later than the 2021 avatar boom.", { yearLabel: "Oct 2022" }),
      ],
    },
    {
      id: "ethereum-scaling",
      title: "Ethereum Scaling Path",
      difficulty: "Hard",
      teaser: ["Rollups", "L2 Networks", "Blob Era"],
      story:
        "Ethereum scaling moved from early sidechain relief to rollups, public L2 networks, and protocol support for cheaper rollup data.",
      events: [
        event("ethereum-mainnet", "Ethereum mainnet", "2015-07-30", "Base Layer", "ethereum", "Ethereum created the settlement layer that later scaling systems extended.", "This is the starting point for Ethereum scaling."),
        event("polygon-pos", "Polygon PoS mainnet", "2020-05-30", "Sidechains", "polygon", "Polygon PoS gave Ethereum users a cheaper execution environment before rollups matured.", "This came after Ethereum mainnet and before the L2 boom.", { yearLabel: "May 2020", datePrecision: "month" }),
        event("arbitrum-one", "Arbitrum One opens", "2021-08-31", "Optimistic Rollups", "arbitrum", "Arbitrum One became a major optimistic rollup ecosystem for Ethereum applications.", "This belongs after earlier scaling networks and before later zkEVM launches.", { yearLabel: "Aug 2021" }),
        event("optimism-mainnet", "Optimism mainnet opens", "2021-12-16", "Optimistic Rollups", "optimism", "Optimism helped establish rollups as a central Ethereum scaling path.", "This sits in the same rollup wave as Arbitrum.", { yearLabel: "Dec 2021", datePrecision: "month" }),
        event("polygon-zkevm", "Polygon zkEVM launches", "2023-03-27", "ZK Rollups", "polygon-zkevm", "Polygon zkEVM brought EVM-compatible zero-knowledge scaling into public use.", "This came before Base and before Ethereum's blob upgrade.", { yearLabel: "Mar 2023" }),
        event("base-mainnet", "Base mainnet opens", "2023-08-09", "L2 Networks", "base", "Base brought Coinbase's Ethereum L2 into public mainnet use.", "This followed earlier rollup launches.", { yearLabel: "Aug 2023", sources: [source("IQ.wiki Base article", slugUrl("base")), source("Base mainnet launch", "https://www.base.org/blog/base-mainnet-is-here")] }),
        event("dencun-upgrade", "Ethereum Dencun upgrade", "2024-03-13", "Blob Era", "dencun-upgrade", "Dencun introduced blob transactions that lowered costs for Ethereum rollups.", "This belongs after the major L2 networks were live.", { yearLabel: "Mar 2024", sources: [source("IQ.wiki Dencun article", slugUrl("dencun-upgrade")), source("Ethereum Dencun announcement", "https://blog.ethereum.org/2024/02/27/dencun-mainnet-announcement")] }),
      ],
    },
  ];

  const difficultyRules = {
    Easy: { revealAfterAttempts: 1, hintsBeforeReveal: 2, bossAttempts: 4, hintLimit: 5 },
    Medium: { revealAfterAttempts: 2, hintsBeforeReveal: 3, bossAttempts: 3, hintLimit: 5 },
    Hard: { revealAfterAttempts: 3, hintsBeforeReveal: 4, bossAttempts: 3, hintLimit: 5 },
  };

  const difficultyLabels = Object.keys(difficultyRules);

  const DAILY_THEME_ID = themes[pickDailyIndex(TODAY_KEY, themes.length)]?.id || themes[0]?.id;

  const roundPlans = {
    "road-to-defi": [
      { type: "place", target: "bitcoin-genesis", anchors: ["bitcoin-whitepaper", "ethereum-mainnet", "defi-summer"], showAnchorYears: true },
      { type: "place", target: "uniswap-launch", anchors: ["bitcoin-whitepaper", "ethereum-mainnet", "dai-launch", "defi-summer", "ethereum-merge"], showAnchorYears: true },
      { type: "place", target: "dai-launch", anchors: ["ethereum-mainnet", "uniswap-launch", "defi-summer"], showAnchorYears: false },
      { type: "corrupt", misplaced: "uniswap-launch", anchors: ["bitcoin-whitepaper", "ethereum-mainnet", "defi-summer", "uniswap-launch", "ethereum-merge"] },
      { type: "boss" },
    ],
    "ai-x-crypto": [
      { type: "place", target: "ethereum-mainnet", anchors: ["bitcoin-whitepaper", "filecoin-mainnet", "agent-wave"], showAnchorYears: true },
      { type: "place", target: "bittensor-growth", anchors: ["bitcoin-whitepaper", "ethereum-mainnet", "filecoin-mainnet", "akash-gpu", "agent-wave"], showAnchorYears: true },
      { type: "place", target: "akash-gpu", anchors: ["filecoin-mainnet", "bittensor-growth", "agent-wave"], showAnchorYears: false },
      { type: "corrupt", misplaced: "agent-wave", anchors: ["bitcoin-whitepaper", "ethereum-mainnet", "filecoin-mainnet", "bittensor-growth", "agent-wave", "worldcoin-launch", "akash-gpu"] },
      { type: "boss" },
    ],
    "stablecoin-path": [
      { type: "place", target: "ethereum-mainnet", anchors: ["tether-launch", "dai-launch", "ust-collapse"], showAnchorYears: true },
      { type: "place", target: "usdc-launch", anchors: ["tether-launch", "ethereum-mainnet", "dai-launch", "terrausd-launch", "ust-collapse"], showAnchorYears: true },
      { type: "place", target: "dai-launch", anchors: ["ethereum-mainnet", "usdc-launch", "terrausd-launch"], showAnchorYears: false },
      { type: "corrupt", misplaced: "usdc-launch", anchors: ["tether-launch", "ethereum-mainnet", "dai-launch", "terrausd-launch", "usdc-launch", "paypal-usd"] },
      { type: "boss" },
    ],
    "nft-culture": [
      { type: "place", target: "cryptopunks-launch", anchors: ["ethereum-mainnet", "axie-launch", "bayc-mint"], showAnchorYears: true },
      { type: "place", target: "opensea-launch", anchors: ["ethereum-mainnet", "cryptopunks-launch", "axie-launch", "nba-top-shot", "bayc-mint"], showAnchorYears: true },
      { type: "place", target: "axie-launch", anchors: ["cryptopunks-launch", "opensea-launch", "nba-top-shot"], showAnchorYears: false },
      { type: "corrupt", misplaced: "bayc-mint", anchors: ["ethereum-mainnet", "cryptopunks-launch", "opensea-launch", "bayc-mint", "nba-top-shot", "blur-launch"] },
      { type: "boss" },
    ],
    "ethereum-scaling": [
      { type: "place", target: "arbitrum-one", anchors: ["ethereum-mainnet", "base-mainnet", "dencun-upgrade"], showAnchorYears: true },
      { type: "place", target: "optimism-mainnet", anchors: ["ethereum-mainnet", "polygon-pos", "arbitrum-one", "polygon-zkevm", "base-mainnet"], showAnchorYears: true },
      { type: "place", target: "base-mainnet", anchors: ["optimism-mainnet", "polygon-zkevm", "dencun-upgrade"], showAnchorYears: false },
      { type: "corrupt", misplaced: "polygon-zkevm", anchors: ["ethereum-mainnet", "polygon-pos", "arbitrum-one", "base-mainnet", "polygon-zkevm", "dencun-upgrade"] },
      { type: "boss" },
    ],
  };

  const resultLabels = {
    perfect: "Perfect Restore",
    clean: "Clean Restore",
    survivor: "Timeline Repairer",
    help: "Restored With Help",
    partial: "Partial Restore",
  };

  class IQTimeRift extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.theme = themes.find((theme) => theme.id === DAILY_THEME_ID) || themes[0];
      this.state = this.loadState();
      this.dragId = null;
      this.liveMessage = "";
      this.modalOpener = null;
      this.tutorialSeen = readStorage(TUTORIAL_KEY) === "1";
      this.showTutorial = !this.tutorialSeen;
      this.handleKeydown = (event) => this.handleKeys(event);
      this.keyHandlerBound = false;
    }

    connectedCallback() {
      if (!this.keyHandlerBound) {
        this.shadowRoot.addEventListener("keydown", this.handleKeydown);
        this.keyHandlerBound = true;
      }
      this.render();
    }

    disconnectedCallback() {
      this.shadowRoot.removeEventListener("keydown", this.handleKeydown);
      this.keyHandlerBound = false;
    }

    loadState() {
      try {
        const stored = JSON.parse(readStorage(STORAGE_KEY) || "null");
        if (stored && themes.some((theme) => theme.id === stored.themeId)) {
          return this.normalizeState(stored);
        }
      } catch {}
      return this.newState(DAILY_THEME_ID);
    }

    normalizeState(state) {
      const themeId = themes.some((theme) => theme.id === state.themeId) ? state.themeId : DAILY_THEME_ID;
      const totalRounds = (roundPlans[themeId] || roundPlans["road-to-defi"]).length;
      const roundIndex = this.clampWholeNumber(state.roundIndex, 0, Math.max(0, totalRounds - 1));
      const completed = Boolean(state.completed);
      const pendingReveal = state.pendingReveal && typeof state.pendingReveal === "object" ? state.pendingReveal : null;
      const phase = completed ? "complete" : state.phase === "revealing" && pendingReveal ? "revealing" : "playing";
      const roundState = state.roundState && typeof state.roundState === "object" && !Array.isArray(state.roundState) ? state.roundState : {};
      return {
        themeId,
        roundIndex,
        phase,
        restoredRounds: this.clampWholeNumber(state.restoredRounds ?? state.restoredEvents, 0, totalRounds),
        difficulty: difficultyRules[state.difficulty] ? state.difficulty : null,
        rifts: this.clampWholeNumber(state.rifts, 0),
        hintsUsed: this.clampWholeNumber(state.hintsUsed, 0),
        revealsUsed: this.clampWholeNumber(state.revealsUsed, 0),
        completed,
        roundResults: Array.isArray(state.roundResults) ? state.roundResults.slice(0, totalRounds) : [],
        roundState,
        pendingReveal,
        bossOrder: Array.isArray(state.bossOrder) ? state.bossOrder : null,
        shareOpen: Boolean(state.shareOpen),
      };
    }

    clampWholeNumber(value, min, max = Number.POSITIVE_INFINITY) {
      const number = Number(value);
      if (!Number.isFinite(number)) return min;
      return Math.min(max, Math.max(min, Math.trunc(number)));
    }

    newState(themeId, difficulty) {
      const theme = themes.find((item) => item.id === themeId) || themes[0];
      return this.normalizeState({
        themeId: theme.id,
        difficulty: difficulty || theme.difficulty,
        roundIndex: 0,
        phase: "playing",
      });
    }

    save() {
      writeStorage(STORAGE_KEY, JSON.stringify(this.state));
    }

    setTheme(themeId) {
      this.theme = themes.find((theme) => theme.id === themeId) || themes[0];
    }

    plans() {
      return roundPlans[this.theme.id] || roundPlans["road-to-defi"];
    }

    totalRounds() {
      return this.plans().length;
    }

    selectedDifficulty() {
      return difficultyRules[this.state.difficulty] ? this.state.difficulty : this.theme.difficulty;
    }

    rulesForDifficulty() {
      return difficultyRules[this.selectedDifficulty()] || difficultyRules.Medium;
    }

    difficultySummary() {
      const rules = this.rulesForDifficulty();
      const missWord = rules.revealAfterAttempts === 1 ? "miss" : "misses";
      return `${this.selectedDifficulty()}: reveal unlocks after ${rules.revealAfterAttempts} ${missWord} or ${rules.hintsBeforeReveal} hints`;
    }

    difficultyOptionsMarkup() {
      return difficultyLabels
        .map((label) => `<option value="${esc(label)}" ${label === this.selectedDifficulty() ? "selected" : ""}>${esc(label)}</option>`)
        .join("");
    }

    themeOptionsMarkup() {
      return themes
        .map((theme) => `<option value="${esc(theme.id)}" ${theme.id === this.theme.id ? "selected" : ""}>${esc(theme.title)}</option>`)
        .join("");
    }

    currentPlan() {
      return this.plans()[this.state.roundIndex];
    }

    event(id) {
      return this.theme.events.find((item) => item.id === id);
    }

    orderedEvents() {
      return [...this.theme.events].sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    roundState() {
      const key = String(this.state.roundIndex);
      this.state.roundState[key] ||= {
        hintLevel: 0,
        attempts: 0,
        rifts: 0,
        solved: false,
        revealed: false,
        selected: false,
        lastRift: null,
        bossAttempts: 0,
        bossLockedIds: [],
        bossFeedback: "",
      };
      return this.state.roundState[key];
    }

    render() {
      this.setTheme(this.state.themeId);
      this.shadowRoot.innerHTML = `
        <style>${this.styles()}</style>
        <section class="rift-shell">
          <div class="ambient"></div>
          <div class="hero">
            <div class="hero-copy">
              <span class="eyebrow">IQ.wiki mini-game</span>
              <h1>Repair the Web3 timeline.</h1>
              <p>Choose a wiki source set, order events, and fix timeline breaks using clues from IQ.wiki wiki pages.</p>
              <div class="quick-rules" aria-label="Quick game rules">
                <span><b>1</b> Drag event cards onto glowing timeline targets.</span>
                <span><b>2</b> In broken rounds, find the one card whose date is out of order.</span>
                <span><b>3</b> Use hints for clues, or reveal after misses.</span>
              </div>
              <div class="hero-actions">
                <button class="primary" data-open>Start restoring</button>
                <label class="select-control">
                  <span>Difficulty</span>
                  <select data-difficulty-select>${this.difficultyOptionsMarkup()}</select>
                </label>
                <label class="select-control source-select">
                  <span>Wiki source set</span>
                  <select data-theme-select>${this.themeOptionsMarkup()}</select>
                </label>
                <button class="ghost" data-howto>How to play</button>
              </div>
            </div>
            <div class="preview" aria-label="Timeline preview">
              ${this.previewMarkup()}
            </div>
          </div>
          <div class="stat-row" aria-label="Game features">
            <span>${this.totalRounds()} rounds</span>
            <span>${esc(this.difficultySummary())}</span>
            <span>${WIKI_SOURCE_LABEL}</span>
          </div>
        </section>
        <div class="modal-backdrop" data-backdrop hidden></div>
        <section class="modal" role="dialog" aria-modal="true" aria-labelledby="rift-title" hidden>
          <div class="modal-head">
            <div>${this.themeHeader()}</div>
            <div class="modal-head-actions">
              <button class="icon-btn" data-howto aria-label="How to play">?</button>
              <button class="icon-btn" data-close aria-label="Close">×</button>
            </div>
          </div>
          <div class="game-slot">${this.renderGame()}</div>
        </section>
        <div class="sr-only" aria-live="polite">${esc(this.liveMessage)}</div>
      `;
      this.bindShell();
      if (this.hasAttribute("open")) this.openModal();
    }

    themeHeader() {
      const featurePath = this.theme.featurePath;
      return `
        <span class="eyebrow">${esc(featurePath?.label || WIKI_SOURCE_LABEL)}</span>
        <h2 id="rift-title">${esc(this.theme.title)}</h2>
        ${featurePath ? this.featurePathMarkup(featurePath) : ""}
      `;
    }

    tutorialMarkup() {
      return `
        <article class="reveal-card tutorial-card">
          <span class="eyebrow">How IQ Time Rift works</span>
          <h3>Restore the timeline before the break spreads.</h3>
          <div class="tutorial-grid">
            <div class="term-row"><b>Timeline placement</b><span>Drag the bottom event card onto the glowing slot where the shown event belongs.</span></div>
            <div class="term-row"><b>Broken timeline</b><span>One event card is out of order. Drop it on the rift check, or tap it.</span></div>
            <div class="term-row"><b>Final restore</b><span>Drag unlocked rows into earliest-to-latest order, or use Earlier / Later as fallback controls.</span></div>
            <div class="term-row"><b>Timeline break</b><span>A wrong guess marks a break and lowers your final result quality.</span></div>
            <div class="term-row"><b>Hints &amp; reveal</b><span>Hints are optional clues. Reveal unlocks after enough misses, failed checks, or hints; once it unlocks, you can keep taking clues or reveal the answer.</span></div>
            <div class="term-row"><b>Difficulty</b><span>Easy / Medium / Hard changes how many misses or hints you get before reveal unlocks.</span></div>
          </div>
          <button class="primary wide" data-tutorial-dismiss>Got it — start restoring</button>
        </article>
      `;
    }

    featurePathMarkup(path) {
      return `
        <div class="feature-path">
          <strong>${esc(path.title || path.label || "IQ.wiki")}</strong>
          <p>${esc(path.description || "Timeline lore built from IQ.wiki pages.")}</p>
          ${path.ctaUrl ? `<a href="${safeUrl(path.ctaUrl)}" target="_blank" rel="noreferrer">${esc(path.ctaText || "Explore on IQ.wiki")}</a>` : ""}
        </div>
      `;
    }

    previewMarkup() {
      const eras = this.theme.teaser
        .map(
          (item, index) => `
            <div class="preview-era">
              <b>${esc(item)}</b>
              <span>Era ${index + 1} of ${this.theme.teaser.length}</span>
            </div>
          `
        )
        .join("");
      return `
        <div class="rift-label">Timeline break map: ${esc(this.theme.title)}</div>
        <div class="preview-count">${this.theme.events.length} events across ${this.theme.teaser.length} eras</div>
        <div class="teaser-path">${this.theme.teaser.map((item) => `<span>${esc(item)}</span>`).join("<i></i>")}</div>
        <div class="schematic-rift" aria-hidden="true">
          <span class="axis"></span>
          <i class="node n1"></i>
          <i class="node n2"></i>
          <b class="fracture"></b>
          <i class="node n3"></i>
          <i class="node n4"></i>
        </div>
        <div class="preview-eras">
          ${eras}
        </div>
      `;
    }

    renderGame() {
      if (this.showTutorial) return this.tutorialMarkup();
      if (this.state.completed || this.state.phase === "complete") return this.resultMarkup();
      const plan = this.currentPlan();
      const totalRounds = this.totalRounds();
      const restoredCount = this.state.restoredRounds;
      return `
        <div class="progress-block">
          <div class="progress-copy"><strong>Rounds restored: ${restoredCount}/${totalRounds}</strong><span>Current round ${this.state.roundIndex + 1}/${totalRounds}</span></div>
          <p class="current-objective">${esc(this.objectiveCopy(plan))}</p>
          <div class="blocks" style="--round-count:${totalRounds}" aria-label="Rounds restored">${Array.from({ length: totalRounds }, (_, i) => `<b class="${i < restoredCount ? "on" : ""}"></b>`).join("")}</div>
        </div>
        ${
          this.state.phase === "revealing"
            ? this.revealMarkup()
            : `
              <div class="round-head">
                <span>${plan.type === "boss" ? "Final restore" : plan.type === "corrupt" ? "Find the break" : "Timeline placement"}</span>
                <h3>${esc(this.roundTitle(plan))}</h3>
                <p>${esc(this.roundGuidance(plan))}</p>
                ${this.roundTaskMarkup(plan)}
                ${this.starterClueMarkup(plan)}
              </div>
              ${this.roundMarkup(plan)}
              ${this.feedbackMarkup()}
              <div class="sticky-actions">
                ${this.hintMarkup(plan)}
                ${this.revealButtonMarkup(plan)}
              </div>
            `
        }
      `;
    }

    roundTitle(plan) {
      if (plan.type === "boss") return "Drag rows until the timeline reads earliest to latest.";
      if (plan.type === "corrupt") return "Find the one card out of order.";
      return "Move the event card into one timeline slot.";
    }

    objectiveCopy(plan) {
      if (plan.type === "boss") return "Objective: drag rows into earliest-to-latest order, then check the order.";
      if (plan.type === "corrupt") return "Objective: find the event that does not fit left to right.";
      return "Objective: drag the event card onto the slot where it fits between the anchors.";
    }

    roundTaskMarkup(plan) {
      if (plan.type === "boss") return `
        <div class="round-task">
          <span><b>Drag</b> unlocked rows into place</span>
          <span><b>Where</b> earliest at top, latest at bottom</span>
          <span><b>Check</b> anchor correct rows</span>
        </div>
      `;
      if (plan.type === "corrupt") return `
        <div class="round-task">
          <span><b>1 Scan</b> dates left to right</span>
          <span><b>2 Find</b> the date that jumps backward</span>
          <span><b>3 Check</b> drop or tap it</span>
        </div>
      `;
      const target = this.event(plan.target);
      return `
        <div class="round-task">
          <span><b>Move</b> ${esc(target.title)}</span>
          <span><b>Where</b> drag onto a glowing slot</span>
          <span><b>Check</b> left is earlier, right is later</span>
        </div>
      `;
    }

    roundGuidance(plan) {
      if (plan.type === "boss") return "Correct rows anchor and reveal dates after each check; drag only rows still drifting.";
      if (plan.type === "corrupt") return "Dates should increase from left to right. Pick the one card that breaks the order.";
      if (plan.showAnchorYears === false) return "The exact year is hidden; drag by era tags and neighboring events before spending a hint.";
      return "Use visible dates first, then drag the hidden event onto the matching slot.";
    }

    starterClueMarkup(plan) {
      const rs = this.roundState();
      if (this.state.roundIndex !== 0 || rs.hintLevel > 0 || rs.attempts > 0 || rs.rifts > 0 || rs.solved) return "";
      const target = this.hintTarget(plan);
      const clue = this.freeClueCopy(plan, target);
      if (!clue) return "";
      return `<p class="free-clue"><b>Free clue</b> ${esc(clue)}</p>`;
    }

    freeClueCopy(plan, target) {
      if (plan.type === "boss") return "Start by moving rows with visible date clues near their chronological neighbors.";
      if (plan.type === "corrupt") return "Look for the card whose date belongs between different neighbors.";
      const anchors = plan.anchors.map((id) => this.event(id)).sort((a, b) => new Date(a.date) - new Date(b.date));
      const before = anchors.filter((item) => new Date(item.date) < new Date(target.date));
      const previous = before[before.length - 1];
      const next = anchors.find((item) => new Date(item.date) > new Date(target.date));
      if (previous && next) return `${target.title} fits after ${previous.title} and before ${next.title}.`;
      if (previous) return `${target.title} fits after ${previous.title}.`;
      if (next) return `${target.title} fits before ${next.title}.`;
      return target.dependencyHint || target.shortWhy;
    }

    roundMarkup(plan) {
      if (plan.type === "boss") return this.bossMarkup(plan);
      if (plan.type === "corrupt") return this.corruptMarkup(plan);
      return this.placeMarkup(plan);
    }

    placeMarkup(plan) {
      const anchors = plan.anchors.map((id) => this.event(id)).sort((a, b) => new Date(a.date) - new Date(b.date));
      const target = this.event(plan.target);
      const rs = this.roundState();
      const rift = rs.lastRift;
      return `
        <div class="timeline-board ${rift ? "cracked" : ""} armed">
          <div class="line-glow"></div>
          ${anchors.map((anchor, index) => `
            ${this.gapButton(index, rift, true, anchors)}
            ${this.timelineCard(anchor, { locked: true, showYear: plan.showAnchorYears !== false })}
          `).join("")}
          ${this.gapButton(anchors.length, rift, true, anchors)}
        </div>
        <div class="candidate ${rift ? "rift-shake" : ""}" data-placement-card role="button" tabindex="0" aria-live="polite" aria-label="Drag this event card to a timeline slot">
          <b class="card-role">Place this event</b>
          <span>${esc(target.era)}</span>
          <strong>${esc(target.title)}</strong>
          <small>${rift ? "That slot breaks order - drag this card to another slot." : "Drag this card onto Before, Between, or After."}</small>
        </div>
      `;
    }

    corruptMarkup(plan) {
      const rift = this.roundState().lastRift;
      return `
        <div class="corrupt-play">
          <div class="timeline-board corrupt ${rift ? "cracked" : ""}">
            <div class="line-glow"></div>
            ${plan.anchors.map((id, index) => {
              const item = this.event(id);
              const misplaced = id === plan.misplaced;
              const dateLabel = this.formatDate(item);
              return `
                <button class="event-card ${misplaced && rift ? "rift-card" : ""}" data-corrupt="${esc(id)}" aria-label="${esc(`Check ${item.title} as the out-of-order card`)}">
                  <b class="drag-cue">${misplaced && rift ? "Found" : "Check this?"}</b>
                  <span>${esc(item.era)}</span>
                  <strong>${esc(item.title)}</strong>
                  <small>${misplaced && rift ? "Correct - this date is out of order" : `Date: ${esc(dateLabel)}`}</small>
                </button>
                ${index < plan.anchors.length - 1 ? '<i class="connector"></i>' : ""}
              `;
            }).join("")}
          </div>
          <div class="corrupt-drop" data-corrupt-drop>
            <b>Rift check</b>
            <span>Drop suspect card here</span>
          </div>
        </div>
      `;
    }

    bossMarkup() {
      const rs = this.roundState();
      if (!this.state.bossOrder) {
        this.state.bossOrder = this.shuffle(this.theme.events.map((item) => item.id), `${this.theme.id}:${TODAY_KEY}:boss`);
        this.save();
      }
      const locked = new Set(rs.bossLockedIds);
      const attemptsUsed = Number(rs.bossAttempts || 0);
      const attemptsLeft = Math.max(0, this.rulesForDifficulty().bossAttempts - attemptsUsed);
      const canCheck = attemptsLeft > 0;
      const checkLabel = canCheck ? "Check order" : "Use Anchor timeline";
      const tip = canCheck
        ? "Drag unlocked rows so the list runs earliest to latest. Check order anchors correct rows and reveals dates."
        : "Checks are used up. Use Anchor timeline, or spend hints if you want more clues first.";
      return `
        <div class="boss-panel">
          <div class="boss-status">
            <strong>${locked.size}/${this.theme.events.length} anchored</strong>
            <span>${attemptsUsed} checked / ${attemptsLeft ? `${attemptsLeft} left` : "Anchor timeline available"}</span>
          </div>
          <p class="boss-tip">${tip}</p>
          <div class="boss-list" role="list">
            ${this.state.bossOrder.map((id, index) => {
              const item = this.event(id);
              const isLocked = locked.has(id);
              const detail = isLocked ? this.formatDate(item) : `${String(index + 1).padStart(2, "0")} · ${item.era} · date hidden`;
              return `
                <div class="boss-row ${isLocked ? "locked" : ""}" data-boss-id="${esc(id)}" tabindex="${isLocked ? "-1" : "0"}" role="listitem" aria-label="${esc(`${item.title} ${isLocked ? "anchored" : "drifting"}`)}">
                  <span class="drag-handle" title="${isLocked ? "Anchored" : "Drag to reorder"}" aria-hidden="true">${isLocked ? "✓" : "⋮⋮"}</span>
                  <div>
                    <strong>${esc(item.title)}</strong>
                    <small>${esc(detail)}</small>
                  </div>
                  <div class="mobile-move">
                    <button data-move="${index}" data-dir="-1" ${isLocked ? "disabled" : ""} aria-label="Move earlier">↑ Earlier</button>
                    <button data-move="${index}" data-dir="1" ${isLocked ? "disabled" : ""} aria-label="Move later">↓ Later</button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
          <button class="primary wide" data-submit-boss ${canCheck ? "" : "disabled"}>${esc(checkLabel)}</button>
        </div>
      `;
    }

    timelineCard(item, opts = {}) {
      return `
        <div class="event-card ${opts.locked ? "locked" : ""}">
          <span>${esc(item.era)}</span>
          <strong>${esc(item.title)}</strong>
          <small>${opts.showYear ? esc(this.formatDate(item)) : "Date hidden"}</small>
        </div>
      `;
    }

    gapButton(index, rift, armed = true, anchors = []) {
      const before = anchors[index - 1];
      const after = anchors[index];
      const hit = rift?.gap === index;
      const slot = index + 1;
      const label = hit ? "Break" : before && after ? "Between" : before ? "After" : "Before";
      const detail = hit ? `Slot ${slot}` : before && after ? `Slot ${slot}` : before ? "After last" : after ? "Before first" : `Slot ${slot}`;
      const context = hit
        ? `Wrong slot ${slot}`
        : before && after
          ? `Between ${before.title} and ${after.title}`
          : before
            ? `After ${before.title}`
            : after
              ? `Before ${after.title}`
              : `Slot ${slot}`;
      const aria = hit
        ? `Wrong slot ${slot}`
        : before && after
          ? `Place event between ${before.title} and ${after.title}`
          : before
            ? `Place event after ${before.title}`
            : after
              ? `Place event before ${after.title}`
              : `Place event in slot ${slot}`;
      return `
        <button class="gap portal ${hit ? "rift-hit" : ""} ${armed ? "armed" : "disabled"}" data-gap="${index}" ${armed ? "" : "disabled"} aria-label="${esc(aria)}" title="${esc(context)}">
          <i></i><span>${esc(label)}</span><small>${esc(detail)}</small>
        </button>
      `;
    }

    feedbackMarkup() {
      const rs = this.roundState();
      if (!rs.lastRift && !rs.bossFeedback) return "";
      return `
        <div class="feedback ${rs.lastRift ? "rift" : ""}">
          <strong>${rs.lastRift ? "Timeline break detected" : "Timeline feedback"}</strong>
          <p>${esc(rs.lastRift?.message || rs.bossFeedback)}</p>
        </div>
      `;
    }

    hintMarkup(plan) {
      const rs = this.roundState();
      const target = this.hintTarget(plan);
      const hints = this.hintsFor(plan, target);
      const hintLimit = hints.length;
      const hintLevel = Math.min(rs.hintLevel, hintLimit);
      const nextHint = Math.min(hintLevel + 1, hintLimit);
      const hintButton = hintLevel >= hintLimit ? "All hints shown" : hintLevel ? `Show hint ${nextHint}` : "Show first hint";
      const shownHint = hintLevel > 0 ? hints[hintLevel - 1] : "";
      return `
        <div class="hint-box">
          <button class="secondary" data-hint ${hintLevel >= hintLimit ? "disabled" : ""}>${hintButton}</button>
          <div class="hint-copy">
            ${shownHint ? `<p><b>Hint ${hintLevel}/${hintLimit}:</b> ${esc(shownHint)}</p>` : ""}
            <small class="hint-meta">${esc(this.hintUnlockCopy(plan, hintLimit))}</small>
          </div>
        </div>
      `;
    }

    hintTarget(plan) {
      if (plan.type === "boss") return this.orderedEvents()[0];
      return this.event(plan.type === "corrupt" ? plan.misplaced : plan.target);
    }

    countPhrase(count, singular, plural = `${singular}s`) {
      if (count <= 0) return "";
      return `${count} more ${count === 1 ? singular : plural}`;
    }

    revealUnlockNeedCopy(plan, hintLimit = this.hintsFor(plan, this.hintTarget(plan)).length) {
      const rs = this.roundState();
      const rules = this.rulesForDifficulty();
      const revealAt = Math.min(rules.hintsBeforeReveal, hintLimit);
      const hintsLeft = Math.max(0, revealAt - Number(rs.hintLevel || 0));
      const attemptsUsed = plan.type === "boss" ? Number(rs.bossAttempts || 0) : Number(rs.attempts || 0);
      const attemptsNeeded = plan.type === "boss" ? rules.bossAttempts : rules.revealAfterAttempts;
      const attemptsLeft = Math.max(0, attemptsNeeded - attemptsUsed);
      const parts = [
        this.countPhrase(hintsLeft, "hint"),
        plan.type === "boss"
          ? this.countPhrase(attemptsLeft, "failed check")
          : this.countPhrase(attemptsLeft, "miss", "misses"),
      ].filter(Boolean);
      return parts.length ? parts.join(" or ") : "no more hints or misses";
    }

    hintUnlockCopy(plan, hintLimit) {
      if (this.canReveal(plan)) return "Reveal is available now; more hints are optional.";
      return `Reveal unlocks after ${this.revealUnlockNeedCopy(plan, hintLimit)}.`;
    }

    canReveal(plan) {
      const rs = this.roundState();
      const rules = this.rulesForDifficulty();
      if (plan.type === "boss") return rs.bossAttempts >= rules.bossAttempts || rs.hintLevel >= rules.hintsBeforeReveal;
      if (rs.hintLevel >= rules.hintsBeforeReveal) return true;
      return rs.attempts >= rules.revealAfterAttempts;
    }

    revealButtonMarkup(plan) {
      const canReveal = this.canReveal(plan);
      const label = plan.type === "boss" ? "Anchor timeline" : "Reveal placement";
      const note = canReveal
        ? "Reveal available: solves this round with help and affects result quality."
        : `Reveal locked: ${this.revealUnlockNeedCopy(plan)} needed.`;
      return `
        <div class="reveal-action">
          <button class="ghost" data-reveal-round ${canReveal ? "" : "disabled"}>${label}</button>
          <span class="action-note">${esc(note)}</span>
        </div>
      `;
    }

    revealMarkup() {
      const reveal = this.state.pendingReveal;
      const item = this.event(reveal?.eventId);
      if (!item) return "";
      const sources = (item.sources || []).slice(0, 2);
      return `
        <article class="reveal-card">
          <span class="eyebrow">${reveal.revealed ? "Timeline anchored" : reveal.riftRepaired ? "Break repaired" : "Timeline stabilized"}</span>
          <h3>${reveal.title || "Timeline stabilized."}</h3>
          <p><strong>${esc(item.title)}</strong> happened in ${esc(this.formatDate(item))}.</p>
          <p>${esc(reveal.explanation || item.shortWhy)}</p>
          <div class="why">
            <strong>Why it mattered</strong>
            <span>${esc(item.shortWhy)}</span>
          </div>
          <div class="source-row">
            <a href="${safeUrl(slugUrl(item.wikiSlug))}" target="_blank" rel="noreferrer">Read on IQ.wiki →</a>
            ${sources.map((source) => `<a href="${safeUrl(source.url)}" target="_blank" rel="noreferrer">${esc(source.label)}</a>`).join("")}
          </div>
          <button class="primary wide" data-continue>Continue</button>
        </article>
      `;
    }

    resultMarkup() {
      const label = this.qualityLabel();
      const timeline = this.orderedEvents();
      const totalRounds = this.totalRounds();
      return `
        <div class="result">
          <div class="badge">${esc(label)}</div>
          <h3>Timeline restored.</h3>
          <p>You repaired today’s wiki-sourced timeline: ${esc(this.theme.title)}.</p>
          <div class="result-grid">
            <span><b>${this.state.restoredRounds}/${totalRounds}</b>Rounds restored</span>
            <span><b>${this.state.rifts}</b>Breaks repaired</span>
            <span><b>${this.state.hintsUsed}</b>Hints used</span>
          </div>
          ${this.resultQualityMarkup(label, totalRounds)}
          <div class="restored-path">
            ${timeline.map((item) => `<div><b>${esc(this.formatDate(item))}</b><span>${esc(item.title)}</span></div>`).join("")}
          </div>
          <p class="story">${esc(this.theme.story)}</p>
          <div class="reading-path">
            <strong>Reading path</strong>
            ${timeline.slice(0, 5).map((item) => `<a href="${safeUrl(slugUrl(item.wikiSlug))}" target="_blank" rel="noreferrer">${esc(item.title)}</a>`).join("")}
          </div>
          ${this.theme.featurePath ? this.featurePathResultMarkup(this.theme.featurePath) : ""}
          <div class="result-actions">
            <button class="primary" data-share>${this.state.shareCopied ? "Copied" : "Share result"}</button>
            <button class="secondary" data-toggle-share>${this.state.shareOpen ? "Hide share text" : "View share text"}</button>
            <button class="ghost" data-replay>Replay</button>
          </div>
          ${this.state.shareOpen ? `<textarea class="share-text" readonly>${esc(this.shareText())}</textarea>` : ""}
        </div>
      `;
    }

    featurePathResultMarkup(path) {
      return `
        <div class="feature-path result-path">
          <strong>${esc(path.label || path.title || "Timeline complete")}</strong>
          <span>${esc(path.description || "Educational timeline complete.")}</span>
          ${path.ctaUrl ? `<a href="${safeUrl(path.ctaUrl)}" target="_blank" rel="noreferrer">${esc(path.ctaText || "Read more on IQ.wiki")}</a>` : ""}
        </div>
      `;
    }

    bindShell() {
      this.shadowRoot.querySelector("[data-open]")?.addEventListener("click", () => this.openModal());
      this.shadowRoot.querySelector("[data-close]")?.addEventListener("click", () => this.closeModal());
      this.shadowRoot.querySelector("[data-backdrop]")?.addEventListener("click", () => this.closeModal());
      this.shadowRoot.querySelector("[data-theme-select]")?.addEventListener("change", (event) => {
        this.state = this.newState(event.currentTarget.value, this.selectedDifficulty());
        this.save();
        this.render();
      });
      this.shadowRoot.querySelector("[data-difficulty-select]")?.addEventListener("change", (event) => {
        this.state = this.newState(this.theme.id, event.currentTarget.value);
        this.save();
        this.render();
      });
      this.shadowRoot.querySelectorAll("[data-howto]").forEach((button) => {
        button.addEventListener("click", () => {
          this.showTutorial = true;
          this.render();
          this.openModal();
        });
      });
      this.bindGame();
    }

    bindGame() {
      this.shadowRoot.querySelector("[data-hint]")?.addEventListener("click", () => this.showHint());
      this.shadowRoot.querySelector("[data-reveal-round]")?.addEventListener("click", () => this.revealAndContinue());
      this.shadowRoot.querySelector("[data-continue]")?.addEventListener("click", () => this.continueRound());
      this.shadowRoot.querySelectorAll("[data-replay]").forEach((button) => button.addEventListener("click", () => this.replay()));
      this.shadowRoot.querySelectorAll("[data-share]").forEach((button) => button.addEventListener("click", () => this.share()));
      this.shadowRoot.querySelector("[data-tutorial-dismiss]")?.addEventListener("click", () => this.dismissTutorial());
      this.shadowRoot.querySelector("[data-toggle-share]")?.addEventListener("click", () => {
        this.state.shareOpen = !this.state.shareOpen;
        this.save();
        this.render();
        this.openModal();
      });
      const plan = this.currentPlan();
      if (!plan || this.state.phase !== "playing") return;
      if (plan.type === "place") this.bindPlace(plan);
      if (plan.type === "corrupt") this.bindCorrupt(plan);
      if (plan.type === "boss") this.bindBoss();
    }

    bindPlace(plan) {
      const gaps = Array.from(this.shadowRoot.querySelectorAll("[data-gap]"));
      const card = this.shadowRoot.querySelector("[data-placement-card]");
      const board = this.shadowRoot.querySelector(".timeline-board.armed");
      const clearDropState = () => {
        card?.classList.remove("dragging");
        board?.classList.remove("dragging-placement");
        gaps.forEach((gap) => gap.classList.remove("drop-target"));
      };

      gaps.forEach((button) => {
        button.addEventListener("click", () => this.submitPlacement(plan, Number(button.dataset.gap)));
      });
      if (card) this.bindPlacementDrag(plan, card, board, gaps, clearDropState);
    }

    bindPlacementDrag(plan, card, board, gaps, clearDropState) {
      let startX = 0;
      let startY = 0;
      let activeGap = null;
      let dragging = false;

      const resetCard = () => {
        card.style.transform = "";
        card.style.zIndex = "";
      };
      const gapAt = (x, y) => gaps.find((gap) => {
        const rect = gap.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      });
      const setActiveGap = (gap) => {
        if (gap === activeGap) return;
        activeGap?.classList.remove("drop-target");
        activeGap = gap;
        activeGap?.classList.add("drop-target");
      };
      const finishDrag = (pointerId) => {
        try {
          card.releasePointerCapture(pointerId);
        } catch {}
        resetCard();
        clearDropState();
        activeGap = null;
        dragging = false;
      };

      card.addEventListener("pointerdown", (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        startX = event.clientX;
        startY = event.clientY;
        activeGap = null;
        dragging = false;
        card.setPointerCapture?.(event.pointerId);

        const move = (moveEvent) => {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;
          if (!dragging && Math.hypot(dx, dy) < 8) return;
          dragging = true;
          moveEvent.preventDefault();
          card.classList.add("dragging");
          board?.classList.add("dragging-placement");
          card.style.transform = `translate(${dx}px, ${dy}px) scale(.98)`;
          card.style.zIndex = "10";
          setActiveGap(gapAt(moveEvent.clientX, moveEvent.clientY));
        };

        let end;
        let cancel;
        const cleanup = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", end);
          window.removeEventListener("pointercancel", cancel);
        };
        end = (endEvent) => {
          cleanup();
          const targetGap = dragging ? gapAt(endEvent.clientX, endEvent.clientY) : null;
          const didDrag = dragging;
          finishDrag(event.pointerId);
          if (targetGap) this.submitPlacement(plan, Number(targetGap.dataset.gap));
          else if (didDrag) this.showDropMiss(card, "Drop the event on a glowing timeline slot.");
        };
        cancel = () => {
          cleanup();
          finishDrag(event.pointerId);
        };

        window.addEventListener("pointermove", move, { passive: false });
        window.addEventListener("pointerup", end);
        window.addEventListener("pointercancel", cancel);
      });

      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        gaps[0]?.focus();
      });
    }

    showDropMiss(element, message) {
      this.liveMessage = message;
      const live = this.shadowRoot.querySelector(".sr-only[aria-live]");
      if (live) live.textContent = message;
      if (!element) return;
      element.classList.remove("drop-miss");
      void element.offsetWidth;
      element.classList.add("drop-miss");
      window.setTimeout(() => element.classList.remove("drop-miss"), 450);
    }

    submitCorrupt(plan, id) {
      if (id === plan.misplaced) {
        this.solveRound(this.event(id), "Timeline stabilized.", this.neighborExplanation(id));
        return;
      }
      this.openRift(this.corruptFeedback(id), { cardId: id });
    }

    bindCorrupt(plan) {
      const board = this.shadowRoot.querySelector(".timeline-board.corrupt");
      const drop = this.shadowRoot.querySelector("[data-corrupt-drop]");
      this.shadowRoot.querySelectorAll("[data-corrupt]").forEach((button) => {
        button.addEventListener("click", (event) => {
          if (button.dataset.skipClick === "true") {
            event.preventDefault();
            button.dataset.skipClick = "";
            return;
          }
          this.submitCorrupt(plan, button.dataset.corrupt);
        });
        this.bindCorruptDrag(plan, button, board, drop);
      });
    }

    bindCorruptDrag(plan, card, board, drop) {
      if (!drop) return;
      let startX = 0;
      let startY = 0;
      let dragging = false;
      let overDrop = false;

      const resetCard = () => {
        card.style.transform = "";
        card.style.zIndex = "";
      };
      const isOverDrop = (x, y) => {
        const rect = drop.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      };
      const setDrop = (active) => {
        if (active === overDrop) return;
        overDrop = active;
        drop.classList.toggle("drop-target", active);
      };
      const finishDrag = (pointerId) => {
        try {
          card.releasePointerCapture(pointerId);
        } catch {}
        resetCard();
        card.classList.remove("dragging");
        board?.classList.remove("dragging-corrupt");
        drop.classList.remove("drop-target");
        overDrop = false;
        dragging = false;
      };

      card.addEventListener("pointerdown", (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        startX = event.clientX;
        startY = event.clientY;
        overDrop = false;
        dragging = false;
        card.setPointerCapture?.(event.pointerId);

        const move = (moveEvent) => {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;
          if (!dragging && Math.hypot(dx, dy) < 8) return;
          dragging = true;
          moveEvent.preventDefault();
          card.classList.add("dragging");
          board?.classList.add("dragging-corrupt");
          card.style.transform = `translate(${dx}px, ${dy}px) scale(.98)`;
          card.style.zIndex = "10";
          setDrop(isOverDrop(moveEvent.clientX, moveEvent.clientY));
        };

        let end;
        let cancel;
        const cleanup = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", end);
          window.removeEventListener("pointercancel", cancel);
        };
        end = (endEvent) => {
          cleanup();
          const shouldSubmit = dragging && isOverDrop(endEvent.clientX, endEvent.clientY);
          const didDrag = dragging;
          finishDrag(event.pointerId);
          if (shouldSubmit) {
            card.dataset.skipClick = "true";
            window.setTimeout(() => {
              if (card.dataset.skipClick === "true") card.dataset.skipClick = "";
            }, 0);
            this.submitCorrupt(plan, card.dataset.corrupt);
          } else if (didDrag) {
            this.showDropMiss(drop, "Drop the suspect card on Rift check.");
          }
        };
        cancel = () => {
          cleanup();
          finishDrag(event.pointerId);
        };

        window.addEventListener("pointermove", move, { passive: false });
        window.addEventListener("pointerup", end);
        window.addEventListener("pointercancel", cancel);
      });
    }

    bindBoss() {
      this.shadowRoot.querySelectorAll("[data-move]").forEach((button) => {
        button.addEventListener("click", () => this.moveBoss(Number(button.dataset.move), Number(button.dataset.dir)));
      });
      this.shadowRoot.querySelector("[data-submit-boss]")?.addEventListener("click", () => this.submitBoss());
      const rows = Array.from(this.shadowRoot.querySelectorAll("[data-boss-id]"));
      rows.forEach((row) => this.bindBossPointerDrag(row, rows));
    }

    bindBossPointerDrag(row, rows) {
      if (row.classList.contains("locked")) return;
      let startX = 0;
      let startY = 0;
      let dragging = false;
      let activeRow = null;
      const interactive = "button,a,select,input,textarea";

      const rowAt = (x, y) => rows.find((candidate) => {
        if (candidate === row || candidate.classList.contains("locked")) return false;
        const rect = candidate.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      });
      const setActiveRow = (candidate) => {
        if (candidate === activeRow) return;
        activeRow?.classList.remove("drop-target");
        activeRow = candidate;
        activeRow?.classList.add("drop-target");
      };
      const resetRow = () => {
        row.style.transform = "";
        row.style.zIndex = "";
        row.classList.remove("dragging");
        setActiveRow(null);
        dragging = false;
      };

      row.addEventListener("pointerdown", (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        if (event.target.closest(interactive)) return;
        startX = event.clientX;
        startY = event.clientY;
        activeRow = null;
        dragging = false;
        row.setPointerCapture?.(event.pointerId);

        const move = (moveEvent) => {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;
          if (!dragging && Math.hypot(dx, dy) < 8) return;
          dragging = true;
          moveEvent.preventDefault();
          row.classList.add("dragging");
          row.style.transform = `translate(${dx}px, ${dy}px) scale(.99)`;
          row.style.zIndex = "10";
          setActiveRow(rowAt(moveEvent.clientX, moveEvent.clientY));
        };

        let end;
        let cancel;
        const cleanup = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", end);
          window.removeEventListener("pointercancel", cancel);
        };
        end = (endEvent) => {
          cleanup();
          const target = dragging ? rowAt(endEvent.clientX, endEvent.clientY) : null;
          const didDrag = dragging;
          try {
            row.releasePointerCapture(event.pointerId);
          } catch {}
          resetRow();
          if (target) {
            this.dragId = row.dataset.bossId;
            this.dropBoss(target.dataset.bossId);
          } else if (didDrag) {
            this.showDropMiss(row, "Drop the row on another unlocked row to reorder.");
          }
        };
        cancel = () => {
          cleanup();
          try {
            row.releasePointerCapture(event.pointerId);
          } catch {}
          resetRow();
        };

        window.addEventListener("pointermove", move, { passive: false });
        window.addEventListener("pointerup", end);
        window.addEventListener("pointercancel", cancel);
      });
    }

    submitPlacement(plan, gap) {
      const rs = this.roundState();
      const anchors = plan.anchors.map((id) => this.event(id)).sort((a, b) => new Date(a.date) - new Date(b.date));
      const target = this.event(plan.target);
      const expected = anchors.filter((anchor) => new Date(anchor.date) < new Date(target.date)).length;
      if (gap === expected) {
        const repaired = rs.rifts > 0;
        this.solveRound(target, repaired ? "Break repaired." : "Timeline stabilized.", this.neighborExplanation(target.id), repaired);
        return;
      }
      const direction = gap < expected ? "later" : "earlier";
      this.openRift(`Timeline break detected - this event belongs ${direction} in the timeline.`, { gap });
    }

    openRift(message, detail = {}) {
      const rs = this.roundState();
      rs.attempts += 1;
      rs.rifts += 1;
      rs.lastRift = { ...detail, message };
      this.state.rifts += 1;
      this.liveMessage = message;
      this.save();
      this.render();
      this.openModal();
    }

    solveRound(item, title, explanation, riftRepaired = false, revealed = false) {
      const rs = this.roundState();
      if (!rs.solved) {
        rs.solved = true;
        rs.revealed = revealed;
        if (revealed) this.state.revealsUsed += 1;
        this.state.restoredRounds += 1;
        this.state.roundResults[this.state.roundIndex] = {
          success: true,
          rifts: rs.rifts,
          hintLevel: rs.hintLevel,
          revealed,
        };
      }
      rs.lastRift = null;
      this.state.phase = "revealing";
      this.state.pendingReveal = {
        eventId: item.id,
        title,
        explanation,
        riftRepaired,
        revealed,
      };
      this.liveMessage = title;
      this.save();
      this.render();
      this.openModal();
    }

    dismissTutorial() {
      this.showTutorial = false;
      if (!this.tutorialSeen) {
        this.tutorialSeen = true;
        writeStorage(TUTORIAL_KEY, "1");
      }
      this.render();
      this.openModal();
    }

    continueRound() {
      this.state.pendingReveal = null;
      if (this.state.roundIndex >= this.totalRounds() - 1) {
        this.state.completed = true;
        this.state.phase = "complete";
      } else {
        this.state.roundIndex += 1;
        this.state.phase = "playing";
      }
      this.save();
      this.render();
      this.openModal();
    }

    revealAndContinue() {
      const plan = this.currentPlan();
      const rs = this.roundState();
      if (!this.canReveal(plan)) {
        this.liveMessage = "Reveal becomes available after more repair attempts or hints.";
        this.save();
        this.render();
        this.openModal();
        return;
      }
      rs.revealed = true;
      if (plan.type === "boss") {
        const first = this.orderedEvents()[0];
        this.state.bossOrder = this.orderedEvents().map((item) => item.id);
        rs.bossLockedIds = [...this.state.bossOrder];
        this.solveRound(first, "Timeline anchored.", "The full path is now anchored from earliest to latest.", rs.rifts > 0, true);
        return;
      }
      const item = this.event(plan.type === "corrupt" ? plan.misplaced : plan.target);
      this.solveRound(item, "Timeline anchored.", this.neighborExplanation(item.id), rs.rifts > 0, true);
    }

    showHint() {
      const plan = this.currentPlan();
      if (!plan) return;
      const rs = this.roundState();
      const hintLimit = this.hintsFor(plan, this.hintTarget(plan)).length;
      if (rs.hintLevel >= hintLimit) {
        this.liveMessage = "All hints are already shown. Use reveal when it is available.";
        this.save();
        this.render();
        this.openModal();
        return;
      }
      rs.hintLevel += 1;
      this.state.hintsUsed += 1;
      this.liveMessage = this.canReveal(plan) ? `Hint ${rs.hintLevel} revealed. Reveal is now available.` : `Hint ${rs.hintLevel} revealed.`;
      this.save();
      this.render();
      this.openModal();
    }

    hintsFor(plan, target) {
      const ordered = this.orderedEvents();
      if (plan.type === "boss") {
        const first = ordered[0];
        const last = ordered[ordered.length - 1];
        const middle = ordered.slice(1, -1);
        return [
          `Start with ${first.title}; it is the earliest event in this path.`,
          `End with ${last.title}; it is the latest event in this path.`,
          "Correct rows anchor after each check, so only move the cards that remain drifting.",
          `Middle anchors: ${middle.map((item) => `${item.title} (${this.formatDate(item)})`).join(" -> ")}.`,
          `Full order: ${ordered.map((item) => item.title).join(" -> ")}.`,
        ];
      }
      const index = ordered.findIndex((item) => item.id === target.id);
      const before = ordered[index - 1];
      const after = ordered[index + 1];
      return [
        `This belongs to the ${target.era}.`,
        target.dependencyHint,
        `${before ? `This happened after ${before.title}` : "This is near the start"}${after ? ` and before ${after.title}` : " and near the end"}.`,
        `This happened in ${this.formatDate(target)}.`,
        `${before ? `Place this after ${before.title}` : "Place this at the beginning"}${after ? ` and before ${after.title}` : ""}.`,
      ];
    }

    moveBoss(index, dir) {
      const order = [...this.state.bossOrder];
      const locked = new Set(this.roundState().bossLockedIds);
      if (locked.has(order[index])) return;
      let next = index + dir;
      while (next >= 0 && next < order.length && locked.has(order[next])) next += dir;
      if (next < 0 || next >= order.length) return;
      [order[index], order[next]] = [order[next], order[index]];
      this.state.bossOrder = order;
      this.save();
      if (!this.syncBossDomOrder()) this.render();
    }

    dropBoss(targetId) {
      if (!this.dragId || this.dragId === targetId) {
        this.dragId = null;
        return;
      }
      const order = [...this.state.bossOrder];
      const locked = new Set(this.roundState().bossLockedIds);
      if (locked.has(this.dragId) || locked.has(targetId)) {
        this.dragId = null;
        return;
      }
      const from = order.indexOf(this.dragId);
      const to = order.indexOf(targetId);
      order.splice(from, 1);
      order.splice(to, 0, this.dragId);
      this.state.bossOrder = order;
      this.dragId = null;
      this.save();
      if (!this.syncBossDomOrder()) this.render();
    }

    syncBossDomOrder() {
      const list = this.shadowRoot.querySelector(".boss-list");
      if (!list) return false;
      const rows = new Map(Array.from(list.querySelectorAll("[data-boss-id]")).map((row) => [row.dataset.bossId, row]));
      const fragment = document.createDocumentFragment();
      this.state.bossOrder.forEach((id) => {
        const row = rows.get(id);
        if (row) fragment.appendChild(row);
      });
      list.appendChild(fragment);
      this.refreshBossMoveIndexes();
      return true;
    }

    refreshBossMoveIndexes() {
      this.shadowRoot.querySelectorAll("[data-boss-id]").forEach((row, index) => {
        row.querySelectorAll("[data-move]").forEach((button) => {
          button.dataset.move = String(index);
        });
      });
    }

    positionLockedBossCards(correct, lockedIds) {
      const locked = new Set(lockedIds);
      const drifting = this.state.bossOrder.filter((id) => !locked.has(id));
      this.state.bossOrder = correct.map((id) => (locked.has(id) ? id : drifting.shift()));
    }

    submitBoss() {
      const rs = this.roundState();
      const correct = this.orderedEvents().map((item) => item.id);
      if (this.state.bossOrder.every((id, index) => id === correct[index])) {
        this.solveRound(correct.map((id) => this.event(id))[0], "Final timeline stabilized.", "Every event is anchored from earliest to latest.", rs.rifts > 0);
        return;
      }
      if (Number(rs.bossAttempts || 0) >= this.rulesForDifficulty().bossAttempts) {
        rs.bossFeedback = "Checks are used up. Use Anchor timeline when you are ready.";
        this.liveMessage = rs.bossFeedback;
        this.save();
        this.render();
        this.openModal();
        return;
      }
      const lockedIds = new Set(rs.bossLockedIds);
      const previousLocked = lockedIds.size;
      this.state.bossOrder.forEach((id, index) => {
        if (id === correct[index]) lockedIds.add(id);
      });
      rs.bossLockedIds = [...lockedIds];
      this.positionLockedBossCards(correct, rs.bossLockedIds);
      if (this.state.bossOrder.every((id, index) => id === correct[index])) {
        this.solveRound(correct.map((id) => this.event(id))[0], "Final timeline stabilized.", "Every event is anchored from earliest to latest.", rs.rifts > 0);
        return;
      }
      rs.bossAttempts += 1;
      rs.attempts += 1;
      rs.rifts += 1;
      this.state.rifts += 1;
      const drifting = this.theme.events.length - lockedIds.size;
      const newlyLocked = lockedIds.size - previousLocked;
      if (newlyLocked > 0) {
        const eventWord = newlyLocked === 1 ? "event" : "events";
        const driftWord = drifting === 1 ? "is" : "are";
        rs.bossFeedback = `${newlyLocked} new ${eventWord} anchored. ${drifting} ${driftWord} still drifting.`;
      } else {
        const firstOpenId = this.state.bossOrder.find((id) => !lockedIds.has(id));
        const firstOpen = firstOpenId ? this.event(firstOpenId) : null;
        rs.bossFeedback = firstOpen
          ? `No new anchors. Compare ${firstOpen.title} against nearby anchored rows before moving the rest.`
          : "No new anchors. Compare the drifting middle cards against nearby anchored rows.";
      }
      if (rs.bossAttempts >= this.rulesForDifficulty().bossAttempts) {
        rs.bossFeedback += " Anchor timeline is available when you are ready.";
      }
      this.liveMessage = rs.bossFeedback;
      this.save();
      this.render();
      this.openModal();
    }

    qualityLabel() {
      const restored = this.state.restoredRounds;
      const totalRounds = this.totalRounds();
      if (restored === totalRounds && this.state.rifts === 0 && this.state.hintsUsed === 0 && this.state.revealsUsed === 0) return resultLabels.perfect;
      if (restored === totalRounds && this.state.revealsUsed > 0) return resultLabels.help;
      if (restored === totalRounds && this.state.rifts > 0) return resultLabels.survivor;
      if (restored === totalRounds) return resultLabels.clean;
      return resultLabels.partial;
    }

    resultQualityMarkup(label, totalRounds) {
      const helpedRounds = this.state.roundResults.filter((result) => result?.hintLevel > 0 || result?.revealed).length;
      const revealedRounds = this.state.roundResults.filter((result) => result?.revealed).length;
      const breakRounds = this.state.roundResults.filter((result) => result?.rifts > 0).length;
      return `<p class="story result-note">${esc(this.resultQualityCopy(label, totalRounds, helpedRounds, revealedRounds, breakRounds))}</p>`;
    }

    resultQualityCopy(label, totalRounds, helpedRounds, revealedRounds, breakRounds) {
      const helped = helpedRounds ? `${helpedRounds} round${helpedRounds === 1 ? "" : "s"} used hints or reveal help` : "no rounds used hints or reveals";
      const revealed = revealedRounds ? `${revealedRounds} round${revealedRounds === 1 ? "" : "s"} were anchored by reveal` : "no rounds were revealed";
      const breaks = breakRounds ? `${breakRounds} round${breakRounds === 1 ? "" : "s"} needed repaired breaks` : "no rounds needed repaired breaks";
      return `${label} is based on ${this.state.restoredRounds}/${totalRounds} restored rounds, ${this.state.rifts} total breaks, and ${this.state.hintsUsed} hints. ${helped}; ${revealed}; ${breaks}.`;
    }

    shareText() {
      const totalRounds = this.totalRounds();
      const markers = this.state.roundResults.map((result) => {
        if (result?.revealed) return "🧭";
        if (result?.rifts) return "🕳️";
        if (result?.hintLevel) return "💡";
        return "🟣";
      });
      while (markers.length < totalRounds) markers.push("◌");
      return [
        `IQ Time Rift — ${this.theme.title}`,
        `${this.qualityLabel()}: ${this.state.restoredRounds}/${totalRounds} rounds`,
        `Breaks repaired: ${this.state.rifts} · Hints: ${this.state.hintsUsed}`,
        markers.join(""),
        "https://iq.wiki",
      ].join("\n");
    }

    async share() {
      try {
        await navigator.clipboard.writeText(this.shareText());
        this.state.shareCopied = true;
        this.liveMessage = "Share result copied.";
      } catch {
        this.state.shareOpen = true;
        this.liveMessage = "Share text opened.";
      }
      this.save();
      this.render();
      this.openModal();
    }

    replay() {
      this.state = this.newState(this.theme.id, this.selectedDifficulty());
      this.save();
      this.render();
      this.openModal();
    }

    formatDate(item) {
      if (item.datePrecision === "year" || item.datePrecision === "month" || item.datePrecision === "approximate") return item.yearLabel;
      return item.yearLabel || year(item.date);
    }

    neighborExplanation(id) {
      const ordered = this.orderedEvents();
      const index = ordered.findIndex((item) => item.id === id);
      const item = ordered[index];
      const before = ordered[index - 1];
      const after = ordered[index + 1];
      const relation = `${before ? `It came after ${before.title}` : "It opened the path"}${after ? ` and before ${after.title}` : " and completed this timeline"}.`;
      return `${item.title} belongs in ${this.formatDate(item)}. ${relation}`;
    }

    corruptFeedback(id) {
      const item = this.event(id);
      const ordered = this.orderedEvents();
      const index = ordered.findIndex((event) => event.id === id);
      const before = ordered[index - 1];
      const after = ordered[index + 1];
      const window = before && after
        ? `between ${before.title} and ${after.title}`
        : before
          ? `after ${before.title}`
          : after
            ? `before ${after.title}`
            : "in this timeline";
      return `${item.title} is stable; it belongs ${window}. Look for the card sitting away from its real date neighbors.`;
    }

    shuffle(values, seed = `${this.theme.id}:${TODAY_KEY}`) {
      const scored = [...values].sort((a, b) => a.localeCompare(b)).map((value, index) => ({
        value,
        score: hashString(`${seed}:${value}:${index}`),
      }));
      scored.sort((a, b) => a.score - b.score);
      return scored.map((item) => item.value);
    }

    openModal() {
      if (!this.hasAttribute("open")) {
        const active = this.shadowRoot.activeElement;
        this.modalOpener = active instanceof HTMLElement ? active : null;
      }
      this.setAttribute("open", "");
      const modal = this.shadowRoot.querySelector(".modal");
      const backdrop = this.shadowRoot.querySelector("[data-backdrop]");
      if (modal) modal.hidden = false;
      if (backdrop) backdrop.hidden = false;
      setTimeout(() => this.modalFocusables()[0]?.focus(), 0);
    }

    closeModal() {
      if (!this.hasAttribute("open")) return;
      this.removeAttribute("open");
      this.shadowRoot.querySelector(".modal")?.setAttribute("hidden", "");
      this.shadowRoot.querySelector("[data-backdrop]")?.setAttribute("hidden", "");
      const opener = this.modalOpener;
      this.modalOpener = null;
      if (opener?.isConnected) setTimeout(() => opener.focus(), 0);
    }

    modalFocusables() {
      return [...this.shadowRoot.querySelectorAll('.modal button:not([disabled]), .modal a[href], .modal textarea:not([disabled]), .modal input:not([disabled]), .modal select:not([disabled]), .modal [tabindex]:not([tabindex="-1"])')];
    }

    handleKeys(event) {
      if (event.key === "Escape") this.closeModal();
      if (event.key !== "Tab" || !this.hasAttribute("open")) return;
      const focusables = this.modalFocusables();
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && this.shadowRoot.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && this.shadowRoot.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    styles() {
      return `
        :host{display:block;max-width:100%;color:#FAFCF8;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--iq-pink:#FF1A88;--iq-pink-light:#FF5CAA;--iq-navy:#17202B;--iq-navy-dark:#0F172A;--iq-blue:#272D38;--iq-off:#FAFCF8;--iq-muted:#F3F4F6;--iq-white:#FFFFFF}
        *{box-sizing:border-box}
        button,a,textarea,select{font:inherit}
        button{cursor:pointer}
        button:disabled{cursor:not-allowed;opacity:.58}
        .rift-shell{position:relative;overflow:hidden;width:100%;max-width:1180px;margin:0 auto;border-radius:18px;min-height:640px;padding:34px;background:radial-gradient(circle at 78% 24%,rgba(255,92,170,.28),transparent 28%),radial-gradient(circle at 86% 68%,rgba(255,26,136,.16),transparent 32%),linear-gradient(135deg,rgba(15,23,42,.99) 0%,rgba(23,32,43,.97) 48%,rgba(39,45,56,.92) 100%),var(--iq-navy-dark);box-shadow:0 24px 80px rgba(15,23,42,.48)}
        .rift-shell::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,26,136,.18) 1px,transparent 1px),linear-gradient(0deg,rgba(255,92,170,.11) 1px,transparent 1px),linear-gradient(115deg,transparent 0 55%,rgba(255,26,136,.18) 55.2%,transparent 55.9%);background-size:72px 72px,72px 72px,100% 100%;mask-image:linear-gradient(90deg,rgba(0,0,0,.52),rgba(0,0,0,.18) 52%,transparent 86%);pointer-events:none}
        .rift-shell::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 0,rgba(250,252,248,.06) 50%,transparent 100%);background-size:100% 5px;opacity:.18;pointer-events:none}
        .ambient{position:absolute;inset:0;background:linear-gradient(115deg,transparent 0 20%,rgba(255,26,136,.18) 20.2%,transparent 20.8% 54%,rgba(255,92,170,.14) 54.2%,transparent 55%),linear-gradient(180deg,rgba(15,23,42,.05),rgba(15,23,42,.72));animation:scan 9s ease-in-out infinite alternate;pointer-events:none}
        .hero{position:relative;display:grid;grid-template-columns:minmax(0,.86fr) minmax(300px,1.14fr);gap:32px;align-items:start;min-height:500px;z-index:1}
        .hero-copy{align-self:center;min-width:0;max-width:620px;padding:26px;border-left:4px solid var(--iq-pink);background:linear-gradient(90deg,rgba(15,23,42,.82),rgba(23,32,43,.46));box-shadow:inset 0 0 0 1px rgba(255,255,255,.10)}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;color:var(--iq-pink-light);text-transform:uppercase;letter-spacing:0;font-size:12px;font-weight:900}
        .eyebrow::before{content:"";width:10px;height:10px;background:var(--iq-pink);box-shadow:0 0 18px rgba(255,26,136,.95)}
        h1,h2,h3,p{margin:0}
        h1{max-width:760px;margin-top:14px;font-size:68px;line-height:.92;letter-spacing:0;text-wrap:balance}
        h2{font-size:24px;margin-top:4px}
        h3{font-size:28px;line-height:1.05}
        .hero-copy p{max-width:580px;margin-top:18px;color:rgba(250,252,248,.82);font-size:17px;line-height:1.55}
        .quick-rules{display:grid;gap:9px;margin-top:20px;color:rgba(243,244,246,.82);font-size:13px;font-weight:800;line-height:1.35}
        .quick-rules span{display:flex;align-items:flex-start;gap:10px}
        .quick-rules b{display:grid;place-items:center;flex:0 0 24px;width:24px;height:24px;border-radius:50%;background:var(--iq-pink);color:var(--iq-white);font-size:12px;box-shadow:0 0 14px rgba(255,26,136,.42)}
        .hero-actions,.result-actions,.sticky-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}
        .hero-actions{align-items:end}
        .select-control{position:relative;display:grid;gap:7px;min-width:min(100%,190px)}
        .select-control::after{content:"";position:absolute;right:15px;bottom:18px;width:8px;height:8px;border-right:2px solid var(--iq-pink-light);border-bottom:2px solid var(--iq-pink-light);transform:rotate(45deg);pointer-events:none}
        .select-control span{font-size:11px;font-weight:950;color:var(--iq-pink-light);text-transform:uppercase}
        .select-control select{appearance:none;-webkit-appearance:none;width:100%;min-height:48px;border-radius:8px;padding:0 40px 0 14px;background:linear-gradient(135deg,rgba(255,26,136,.18),rgba(15,23,42,.82));color:var(--iq-white);border:1px solid rgba(255,92,170,.42);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08),0 12px 28px rgba(0,0,0,.18);font-weight:900}
        .select-control:focus-within select{border-color:var(--iq-pink-light);box-shadow:0 0 0 3px rgba(255,26,136,.22),0 14px 34px rgba(255,26,136,.18)}
        .select-control select option{background:var(--iq-navy);color:var(--iq-white)}
        .source-select{min-width:min(100%,300px)}
        .primary,.secondary,.ghost,.icon-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;text-align:center;line-height:1.12;white-space:normal;border:0;border-radius:8px;min-height:48px;padding:0 18px;font-weight:850;transition:transform .18s ease,box-shadow .18s ease,background .18s ease}
        .primary{background:linear-gradient(135deg,var(--iq-pink),var(--iq-pink-light));color:var(--iq-white);box-shadow:0 14px 34px rgba(255,26,136,.30)}
        .secondary{background:rgba(15,23,42,.62);color:var(--iq-white);border:1px solid rgba(255,255,255,.18)}
        .ghost{background:rgba(15,23,42,.24);color:var(--iq-muted);border:1px solid rgba(243,244,246,.28)}
        .primary:hover,.secondary:hover,.ghost:hover,.event-card:hover,.candidate:hover,.gap:hover{transform:translateY(-2px)}
        .primary:disabled:hover,.secondary:disabled:hover,.ghost:disabled:hover,.gap:disabled:hover{transform:none}
        .wide{width:100%;justify-content:center}
        .preview{align-self:start;position:relative;min-width:0;min-height:430px;padding:24px;border:1px solid rgba(255,255,255,.18);border-radius:12px;background:linear-gradient(180deg,rgba(15,23,42,.34),rgba(15,23,42,.82));backdrop-filter:blur(8px);box-shadow:inset 0 0 0 1px rgba(255,26,136,.16),0 24px 52px rgba(0,0,0,.28)}
        .preview::before{content:"";position:absolute;inset:16px;border:1px solid rgba(255,92,170,.26);clip-path:polygon(0 0,70% 0,100% 18%,100% 100%,18% 100%,0 82%);pointer-events:none}
        .preview::after{content:"";position:absolute;right:24px;top:24px;width:92px;height:92px;border:1px solid rgba(255,92,170,.72);border-radius:50%;box-shadow:0 0 0 10px rgba(255,26,136,.08),0 0 34px rgba(255,26,136,.54);pointer-events:none}
        .rift-label{font-size:20px;font-weight:900}
        .preview-count{margin-top:8px;color:var(--iq-muted)}
        .teaser-path{display:flex;align-items:center;gap:8px;margin:22px 0;color:var(--iq-pink-light);font-weight:800;flex-wrap:wrap}
        .teaser-path i{width:32px;height:2px;background:linear-gradient(90deg,var(--iq-pink-light),var(--iq-pink))}
        .schematic-rift{position:relative;height:88px;margin:18px 0 20px;border-radius:12px;background:rgba(15,23,42,.54);border:1px solid rgba(255,255,255,.12);overflow:hidden}
        .schematic-rift .axis{position:absolute;left:18px;right:18px;top:50%;height:3px;background:linear-gradient(90deg,var(--iq-pink),rgba(255,92,170,.35),var(--iq-pink-light));box-shadow:0 0 18px rgba(255,26,136,.45)}
        .schematic-rift .node{position:absolute;top:50%;width:14px;height:14px;border-radius:50%;background:var(--iq-navy-dark);border:2px solid var(--iq-pink-light);transform:translate(-50%,-50%);box-shadow:0 0 14px rgba(255,26,136,.62)}
        .schematic-rift .n1{left:18%}.schematic-rift .n2{left:38%}.schematic-rift .n3{left:68%}.schematic-rift .n4{left:86%}
        .schematic-rift .fracture{position:absolute;left:52%;top:9px;bottom:9px;width:24px;transform:translateX(-50%);background:linear-gradient(180deg,var(--iq-pink-light),var(--iq-pink));clip-path:polygon(42% 0,82% 23%,58% 23%,95% 52%,55% 48%,70% 100%,20% 62%,42% 62%,8% 28%,38% 30%);filter:drop-shadow(0 0 16px rgba(255,26,136,.9))}
        .preview-eras{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
        .preview-era{padding:16px;border-radius:8px;background:linear-gradient(135deg,rgba(255,255,255,.11),rgba(255,255,255,.035));border:1px solid rgba(255,255,255,.14)}
        .preview-era b,.preview-era span{display:block}.preview-era span{color:rgba(243,244,246,.62);margin-top:8px}
        .stat-row{position:relative;z-index:1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:22px}.stat-row span{display:grid;place-items:center;align-content:center;min-height:72px;padding:0 16px;border-radius:8px;background:rgba(15,23,42,.70);border:1px solid rgba(255,255,255,.12);font-weight:850;text-align:center;line-height:1.15;white-space:normal}
        [hidden]{display:none!important}
        .modal-backdrop{position:fixed;inset:0;background:rgba(15,23,42,.72);backdrop-filter:blur(8px);z-index:30}
        .modal{position:fixed;top:18px;bottom:18px;left:max(18px,calc((100vw - 1060px)/2));right:max(18px,calc((100vw - 1060px)/2));display:grid;grid-template-rows:auto minmax(0,1fr);z-index:40;overflow:hidden;border-radius:24px;background:var(--iq-navy);border:1px solid rgba(255,255,255,.16);box-shadow:0 30px 90px rgba(0,0,0,.55);animation:rise .24s ease-out}
        .modal-head{position:sticky;top:0;z-index:2;display:flex;align-items:flex-start;justify-content:space-between;gap:18px;min-width:0;padding:22px 24px;background:rgba(23,32,43,.88);backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.12)}
        .modal-head>div:first-child{min-width:0}
        .modal-head-actions{display:flex;gap:8px;flex-shrink:0}
        .icon-btn{width:42px;min-height:42px;padding:0;border-radius:50%;font-size:26px;background:rgba(255,255,255,.10);color:var(--iq-white)}
        .game-slot{min-height:0;overflow:auto;overscroll-behavior:contain;padding:24px}
        .progress-block{margin-bottom:22px}.progress-copy{display:flex;justify-content:space-between;color:var(--iq-muted);margin-bottom:8px}.current-objective{margin-bottom:12px;color:rgba(243,244,246,.84);font-weight:850;line-height:1.35}.blocks{display:grid;grid-template-columns:repeat(var(--round-count,5),1fr);gap:8px;margin-top:10px}.blocks b{height:8px;border-radius:999px;background:rgba(15,23,42,.82);border:1px solid rgba(255,92,170,.20)}.blocks .on{background:linear-gradient(90deg,var(--iq-pink),var(--iq-pink-light));box-shadow:0 0 14px rgba(255,26,136,.45)}
        .round-head{display:grid;gap:6px;margin-bottom:20px}.round-head span{color:var(--iq-pink-light);font-weight:900;text-transform:uppercase;font-size:12px;letter-spacing:0}.round-head p{color:var(--iq-muted);line-height:1.45}
        .round-task{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}
        .round-task span{display:grid;gap:3px;padding:10px 12px;border-radius:10px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);color:rgba(243,244,246,.78);font-size:12px;line-height:1.35}
        .round-task b,.card-role{color:var(--iq-pink-light);font-size:11px;text-transform:uppercase;letter-spacing:0}
        .card-role{display:block}
        .free-clue{margin-top:12px;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,92,170,.24);background:rgba(255,26,136,.10);color:var(--iq-muted);line-height:1.4}
        .free-clue b{margin-right:6px;color:var(--iq-pink-light)}
        .timeline-board{position:relative;display:flex;align-items:center;gap:10px;min-height:190px;padding:28px 16px;margin:18px 0;border-radius:20px;background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035));overflow-x:auto}
        .line-glow{position:absolute;left:24px;right:24px;top:50%;height:6px;background:linear-gradient(90deg,rgba(15,23,42,.74),var(--iq-pink) 18%,var(--iq-pink-light) 50%,var(--iq-pink) 82%,rgba(15,23,42,.74));box-shadow:0 0 24px rgba(255,26,136,.60);opacity:.86}
        .timeline-board:not(.armed) .line-glow{background:linear-gradient(90deg,rgba(15,23,42,.78),rgba(255,92,170,.42),rgba(15,23,42,.78));opacity:.58}
        .timeline-board.armed .gap{box-shadow:0 0 22px rgba(255,26,136,.24)}
        .timeline-board.dragging-placement .gap.armed{border-color:var(--iq-pink-light);box-shadow:0 0 26px rgba(255,26,136,.42);transform:scale(1.04)}
        .timeline-board.dragging-corrupt .event-card:not(.dragging){opacity:.72}
        .timeline-board.cracked .line-glow{background:linear-gradient(90deg,var(--iq-pink),var(--iq-white) 38%,var(--iq-pink-light) 48%,var(--iq-pink) 58%,var(--iq-blue));animation:crack .45s ease 2}
        .event-card,.candidate{position:relative;z-index:1;display:grid;gap:7px;min-width:170px;padding:16px;border-radius:16px;background:var(--iq-blue);color:var(--iq-white);border:1px solid rgba(255,255,255,.14);box-shadow:0 10px 28px rgba(0,0,0,.20);text-align:left}
        .event-card span,.candidate span{color:var(--iq-pink-light);font-size:12px;font-weight:850;text-transform:uppercase}.event-card small,.candidate small{color:rgba(243,244,246,.72)}
        .event-card.locked{border-color:rgba(255,92,170,.50);box-shadow:0 0 0 1px rgba(255,26,136,.20),0 18px 36px rgba(255,26,136,.12)}
        .gap{position:relative;z-index:1;display:grid;place-items:center;gap:6px;min-width:82px;height:82px;border-radius:50%;border:1px solid rgba(255,92,170,.48);background:radial-gradient(circle,rgba(255,92,170,.22),rgba(255,26,136,.10) 52%,rgba(23,32,43,.95));color:var(--iq-muted)}
        .gap:not(.armed){border-color:rgba(255,255,255,.18);background:radial-gradient(circle,rgba(255,255,255,.08),rgba(23,32,43,.85));color:rgba(243,244,246,.62)}
        .gap i{width:28px;height:28px;border-radius:50%;border:2px solid var(--iq-pink-light);box-shadow:0 0 18px var(--iq-pink-light)}.gap span{font-size:11px;font-weight:900;text-transform:uppercase}.gap small{max-width:76px;font-size:10px;line-height:1.12;text-align:center;color:rgba(243,244,246,.62);font-weight:850}
        .gap.rift-hit{border-color:var(--iq-pink-light);background:radial-gradient(circle,rgba(255,26,136,.34),rgba(39,45,56,.9));box-shadow:0 0 28px rgba(255,26,136,.55)}
        .gap.drop-target{color:var(--iq-white);background:radial-gradient(circle,rgba(255,92,170,.40),rgba(255,26,136,.20) 58%,rgba(23,32,43,.96));box-shadow:0 0 34px rgba(255,26,136,.62);transform:scale(1.08)}
        .candidate{width:min(100%,420px);margin:16px auto 0;border-color:rgba(255,92,170,.55);background:linear-gradient(135deg,var(--iq-blue),var(--iq-navy-dark))}
        .candidate[data-placement-card]{cursor:grab;touch-action:none;user-select:none;transition:transform .12s ease,border-color .12s ease,box-shadow .12s ease}
        .candidate[data-placement-card]:focus-visible{outline:3px solid rgba(255,92,170,.55);outline-offset:4px}
        .candidate[data-placement-card].dragging{cursor:grabbing;border-color:var(--iq-pink-light);box-shadow:0 24px 48px rgba(255,26,136,.24)}
        .event-card[data-corrupt]{cursor:grab;touch-action:none;user-select:none;transition:transform .12s ease,border-color .12s ease,box-shadow .12s ease,opacity .12s ease}
        .drag-cue{display:inline-flex;align-self:flex-start;padding:4px 7px;border-radius:999px;background:rgba(255,26,136,.14);color:var(--iq-pink-light);font-size:10px;font-weight:950;text-transform:uppercase}
        .event-card[data-corrupt] .drag-cue{margin-bottom:2px}
        .event-card[data-corrupt]:focus-visible{outline:3px solid rgba(255,92,170,.55);outline-offset:4px}
        .event-card[data-corrupt].dragging{cursor:grabbing;border-color:var(--iq-pink-light);box-shadow:0 24px 48px rgba(255,26,136,.24)}
        .rift-shake{border-color:var(--iq-pink-light);animation:shake .42s ease}
        .drop-miss{border-color:var(--iq-pink-light)!important;animation:shake .42s ease;box-shadow:0 0 26px rgba(255,26,136,.28)!important}
        .connector{position:relative;z-index:1;min-width:30px;height:2px;background:rgba(255,92,170,.45)}
        .rift-card{border-color:var(--iq-pink-light);box-shadow:0 0 26px rgba(255,26,136,.34)}
        .corrupt-play{display:grid;grid-template-columns:minmax(0,1fr) minmax(180px,240px);gap:12px;align-items:stretch;margin:18px 0}
        .corrupt-play .timeline-board{margin:0}
        .micro{color:var(--iq-muted);margin-top:8px}
        .corrupt-drop{display:grid;place-content:center;gap:6px;min-height:190px;width:auto;margin:0;padding:16px;border-radius:16px;border:1px dashed rgba(255,92,170,.45);background:rgba(255,26,136,.08);color:var(--iq-muted);text-align:center;transition:border-color .12s ease,box-shadow .12s ease,transform .12s ease}
        .corrupt-drop b{color:var(--iq-pink-light);text-transform:uppercase;font-size:12px}.corrupt-drop span{max-width:180px;line-height:1.3}
        .corrupt-drop.drop-target{border-color:var(--iq-pink-light);box-shadow:0 0 30px rgba(255,26,136,.38);transform:scale(1.03);color:var(--iq-white)}
        .feedback,.reveal-card,.result,.boss-panel{border-radius:20px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);padding:18px;margin-top:18px}
        .feedback.rift{border-color:rgba(255,92,170,.55);background:rgba(255,26,136,.10)}
        .hint-box{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.hint-copy{display:grid;gap:4px;min-width:min(100%,420px)}.hint-box p{color:var(--iq-muted)}.hint-meta{color:rgba(243,244,246,.68);font-weight:750;line-height:1.35}
        .sticky-actions{position:sticky;bottom:0;padding:14px 0;background:linear-gradient(180deg,rgba(23,32,43,0),var(--iq-navy) 32%)}
        .reveal-action{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
        .action-note{max-width:360px;color:rgba(243,244,246,.62);font-size:12px;line-height:1.35}
        .reveal-card{display:grid;gap:14px;max-width:720px;margin:12px auto;animation:rise .22s ease-out}.why{display:grid;gap:4px;padding:14px;border-radius:14px;background:rgba(255,26,136,.10)}.source-row{display:flex;gap:10px;flex-wrap:wrap}.source-row a,.reading-path a{color:var(--iq-pink-light);font-weight:850;text-decoration:none}
        .tutorial-grid{display:grid;gap:2px}.term-row{display:grid;grid-template-columns:160px 1fr;gap:14px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.10)}.term-row:last-child{border-bottom:0}.term-row b{color:var(--iq-pink-light)}.term-row span{color:rgba(243,244,246,.82);line-height:1.45}
        .boss-status{display:flex;justify-content:space-between;color:var(--iq-muted);margin-bottom:8px}.boss-tip{margin:0 0 14px;color:var(--iq-muted);font-size:13px;line-height:1.45}.boss-list{display:grid;gap:10px}.boss-row{display:grid;grid-template-columns:38px 1fr auto;gap:12px;align-items:center;padding:12px;border-radius:14px;background:var(--iq-blue);border:1px solid rgba(255,255,255,.12)}.boss-row.locked{border-color:rgba(255,92,170,.55);background:rgba(255,26,136,.10)}.boss-row:not(.locked){cursor:grab;touch-action:none;user-select:none;transition:transform .12s ease,border-color .12s ease,box-shadow .12s ease}.boss-row:not(.locked):active,.boss-row.dragging{cursor:grabbing}.boss-row.dragging{position:relative;z-index:4;border-color:var(--iq-pink-light);box-shadow:0 18px 38px rgba(255,26,136,.20)}.boss-row.drop-target{border-color:var(--iq-pink-light);box-shadow:0 0 26px rgba(255,26,136,.34)}.drag-handle{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.12);font-weight:900;font-size:13px;letter-spacing:0;cursor:grab}.drag-handle:active{cursor:grabbing}.boss-row.locked .drag-handle{cursor:default}.mobile-move{display:flex;gap:6px}.mobile-move button{display:inline-flex;align-items:center;justify-content:center;text-align:center;min-height:36px;border-radius:10px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:var(--iq-white);line-height:1.1;white-space:normal}
        .badge{display:inline-flex;padding:12px 16px;border-radius:999px;background:linear-gradient(135deg,var(--iq-pink),var(--iq-pink-light));color:var(--iq-white);font-weight:950;animation:pop .36s ease-out}.result{display:grid;gap:18px}.result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.result-grid span{display:grid;gap:4px;padding:14px;border-radius:14px;background:rgba(255,255,255,.08)}.result-grid b{font-size:28px}.result-note{margin:0}.restored-path{display:grid;gap:8px}.restored-path div{display:grid;grid-template-columns:100px 1fr;gap:14px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.10)}.restored-path b{color:var(--iq-pink-light)}.story{color:var(--iq-muted);line-height:1.55}.reading-path{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.share-text{width:100%;min-height:120px;border:1px solid rgba(255,255,255,.16);border-radius:14px;background:var(--iq-navy-dark);color:var(--iq-white);padding:12px}.feature-path{display:grid;gap:8px;padding:12px;border-radius:14px;background:rgba(255,26,136,.08);border:1px solid rgba(255,92,170,.22)}
        .feature-path p,.feature-path span{color:rgba(250,252,248,.78)}.feature-path a{color:var(--iq-pink-light)}
        h1,h2,h3,p,.event-card,.candidate,.round-task,.result,.boss-panel,.feature-path,.term-row{overflow-wrap:break-word}
        .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
        @keyframes rise{from{opacity:0;transform:translateY(16px) scale(.98)}to{opacity:1;transform:none}}
        @keyframes scan{from{transform:translateX(-1.2%)}to{transform:translateX(1.2%)}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-7px)}55%{transform:translateX(7px)}80%{transform:translateX(-3px)}}
        @keyframes crack{50%{filter:brightness(1.8);transform:scaleX(.99)}}
        @keyframes pop{from{transform:scale(.88);opacity:.2}to{transform:scale(1);opacity:1}}
        @media (prefers-reduced-motion: reduce){
          *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
          .ambient,.line-glow,.blocks b,.gap i{box-shadow:none!important;filter:none!important;transform:none!important}
          .primary:hover,.secondary:hover,.ghost:hover,.event-card:hover,.candidate:hover,.gap:hover{transform:none!important}
          .timeline-board.dragging-placement .gap.armed,.gap.drop-target,.corrupt-drop.drop-target,.boss-row.dragging,.boss-row.drop-target{transform:none!important}
        }
        @media (max-width:760px){
          .rift-shell{padding:18px;border-radius:0;min-height:100vh}.hero{grid-template-columns:minmax(0,1fr);min-height:auto;gap:20px}.hero-copy{padding:20px}.preview{min-height:320px;align-self:auto}h1{font-size:40px}.hero-actions{align-items:stretch}.select-control,.source-select{width:100%}.schematic-rift{height:72px}.stat-row{grid-template-columns:1fr}.modal{inset:0;border-radius:0}.game-slot{padding:18px}.round-task{grid-template-columns:1fr}.corrupt-play{grid-template-columns:1fr}.corrupt-drop{min-height:auto;order:-1}.timeline-board{align-items:stretch;flex-direction:column;overflow:visible}.line-glow{top:28px;bottom:28px;left:50%;right:auto;width:6px;height:auto}.event-card,.candidate,.gap{width:100%;min-width:0}.gap{height:68px;border-radius:16px}.preview-eras,.result-grid{grid-template-columns:1fr}.boss-row{grid-template-columns:32px 1fr}.mobile-move{grid-column:1 / -1}.sticky-actions{margin-left:-18px;margin-right:-18px;padding:14px 18px}.restored-path div{grid-template-columns:82px 1fr}.term-row{grid-template-columns:1fr;gap:4px}
        }
      `;
    }
  }

  customElements.define("iq-time-rift", IQTimeRift);
})();
