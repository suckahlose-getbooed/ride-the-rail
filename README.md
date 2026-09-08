# Ride the Rail — installable app

A packaged web app. Once installed it runs from an icon, in its own window,
with no browser chrome and no network.

## Run it

```
python3 serve.py
```

Then open **http://localhost:8000**.

A service worker will not register from a `file://` URL, so opening
`index.html` by double-clicking gives you the game but *not* the installable
app. It has to be served.

## Install it

- **Chrome / Edge, desktop** — an install button appears at the right of the
  address bar. Or ⋮ → Cast, save and share → Install page as app.
- **Chrome, Android** — ⋮ → Add to home screen.
- **Safari, iOS** — Share → Add to Home Screen. iOS ignores most of the
  manifest but honours the icon and the fullscreen flag.

Installed, it opens fullscreen in landscape and works with the network off.

## Putting it somewhere real

The folder is static, so anything that serves files will host it: GitHub
Pages, Netlify, Cloudflare Pages, a directory on a web server. One
requirement — **HTTPS**, or service workers refuse to register and you get
the game without the app. `localhost` is exempt, which is why `serve.py`
works.

## When you change the game

Edit `index.html`, then **bump `CACHE` in `sw.js`** — `rtr-v1` to `rtr-v2`.

That version string is the entire upgrade mechanism. The worker deletes any
cache that isn't the current one when it activates, so bumping it is what
replaces the old files. Forget it and you will keep being served the build
you cached, and spend an hour looking for a bug that isn't in your code.

After a bump, reload twice: the first load installs the new worker, the
second one uses it.

## What's here

| | |
|---|---|
| `index.html` | the whole game — one file, 300 KB |
| `three.min.js` | three.js r128, vendored so it works offline |
| `manifest.webmanifest` | name, icons, colours, fullscreen landscape |
| `sw.js` | the offline cache |
| `icons/` | 192, 512, maskable 512, and an Apple touch icon |
| `serve.py` | local server for testing |

## Not in this build

No player names, no saved records, no leaderboards. This is the container —
the app shell that will hold them. Records will live in the browser's own
storage, which the installed app keeps separately from the browser tab, so
it's worth deciding where you want to play before you start building a
career.
