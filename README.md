# IQ Time Rift

Static IQ.wiki timeline game widget.

## Run locally

Open `index.html` in a browser, or serve the directory with any static file server.

## Checks

```sh
npm ci
npm run check
npm run smoke
```

`npm run smoke` starts a local static server, opens the widget in Chromium, checks the tutorial modal, and verifies desktop/mobile pages do not create horizontal overflow.
It uses the system Chrome channel by default; set `PLAYWRIGHT_CHROME_CHANNEL` to use another installed Playwright browser channel.

## Embed

```html
<script type="module" src="./iq-time-rift.js"></script>
<iq-time-rift></iq-time-rift>
```

## Storage

Progress is stored in `localStorage` when available. The widget still renders when browser storage is blocked or unavailable.
