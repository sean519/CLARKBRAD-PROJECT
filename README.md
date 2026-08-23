# Clark & Bradley's Universe

A small static site holding two kids' creative universes — games, a comic, and videos.
No build step, no dependencies, no framework. Every page is plain HTML, CSS, and
vanilla JavaScript, so you can open a file and edit it directly.

## Layout

```
index.html                  Landing page — links into both universes
assets/
  css/cosmos.css            Shared starfield + nebula backdrop (all hub pages)
  favicon.svg               Site icon (+ PNG fallbacks)
Clark/
  index.html                Clark's hub
  game/                     "Space Lab" — canvas game (index.html + css/ + js/)
  comic/                    68-page comic, 7 chapters, sketch-vs-final comparison
  video/                    YouTube feed for the Clark's Universe channel
Bradley/
  index.html                Bradley's hub
  game/                     "Brad's Universe" — canvas game (single self-contained file)
```

## Running it locally

Any static file server works. The comic and video pages use `fetch`/relative paths,
so opening the HTML straight off disk (`file://`) will not behave correctly — use a
server:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## How navigation is wired

The landing page links directly to each piece of content (game / comic / video).
Every leaf page links back to its owner's hub, and each hub links back to the landing
page. If you add a page, keep that chain intact — a page with no way back is a dead
end for a kid on a tablet.

## Adding a comic chapter

1. Drop the finished pages in `Clark/comic/assets/comic/` as `page-NN.png`, and the
   originals in `Clark/comic/assets/sketch/` as `page-NN.jpg`.
2. Generate the web-sized copies into `comic-web/`, `comic-web-640/`, `sketch-web/`,
   and `sketch-web-640/` (1024px and 640px wide WebP). The page ships both and lets
   the browser pick.
3. Add an entry to the `chapters` array at the top of `Clark/comic/comic.js`.
4. Copy an existing `chapter-NN.html` and update its `data-chapter` attribute and
   `<title>`.

## Notes for whoever edits this next

- **The YouTube key in `Clark/video/index.html` is a browser key and is visible to
  anyone.** That is normal for client-side use, but it *must* be restricted to this
  site's domain in the Google Cloud console, or strangers can spend your quota.
- Third-party scripts are pinned to exact versions on purpose. Don't change them
  back to `@latest` — that lets someone else's release change the games overnight.
- The comic art originals are large and tracked directly in git. Before adding
  another full set, consider whether the repo should move to Git LFS.
