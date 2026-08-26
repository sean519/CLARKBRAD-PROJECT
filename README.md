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
  rpg-codex/                "Clark: Portalbound" — 7-chapter story RPG from the comic
  comic/                    68-page comic, 7 chapters, sketch-vs-final comparison
  video/                    YouTube feed for the Clark's Universe channel
Bradley/
  index.html                Bradley's hub
  game/                     "Brad's Universe" — canvas game (single self-contained file)
arcade/
  chain-reaction.html       Original game: the five classics fused into one loop
  arcade.css                Shared game-page chrome (topbar, score strip, overlay, d-pad)
  arcade.js                 Shared helpers (best-score store, swipe, d-pad, key binding)
  snake.html 2048.html flappy.html memory.html breakout.html
```

## Chain Reaction

The one game in here that is not a clone. Every mechanic pulls on the same rope —
**chain length** — which is why it holds together instead of being five minigames
in a trench coat:

| Borrowed from | Becomes | Pulls on length by |
|---|---|---|
| Snake | you steer a chain of atoms | eating grows it; crossing yourself costs a life |
| 2048 | the two atoms at the front fuse when they match | fusing is the *only* way to shorten it |
| Breakout | every fusion fires a cross-shaped beam; bricks are the wave objective | you must fuse to progress, so you must keep eating |
| Memory | atoms flip face-down after a moment | makes the *next* fusion hard to line up |
| Flappy | a wall with a gap sweeps the reactor | a long chain cannot thread the gap in time |

Twelve atoms melts the reactor down. That single number is what makes all five
mechanics interact.

Tuning notes, so they are not re-litigated later:

- **Three lives, instant retry.** Any failure — wall, brick, your own chain, the
  sweep wall, a meltdown — costs one life, resets the chain to a single atom at
  the centre, and hands back 1.4s of grace. Wave and score survive. One rule for
  every hazard is easier for a kid than one rule per hazard, and it is why the
  run no longer ends on the first mistake.
- The beam clears **every** brick on its lines, as a cross. An earlier build
  broke a fixed number along the current heading, and the last brick of a wave
  turned into a minutes-long hunt. Playtest it before shortening it again.
- Scans recharge slowly (one per 30 ticks, capped at 4). Without that, a player
  who forgets the board and has spent every scan stalls out instead of losing.
- Waves teach one rule at a time: 1–2 fusing, 3 face-down atoms, 4 the sweep
  wall, 5 the odd 8. Every hazard was moved a wave later in the second pass.
- Difficulty knobs live at the top of the script: `MAX_ATOMS`, `ATOM_TARGET`,
  `START_LIVES`, `FACE_UP_MS`, `MAX_SCANS`, and the `tickMs` formula in
  `startWave` (230ms base, −6ms a wave, floor 150ms).

### Feel and presentation

A 128 BPM clock (`BEAT`) drives the floor stripes, the grid flash, the atom
squares and the core, and the built-in synth plays that same beat — so a fusion
landing on the downbeat feels like it snapped into the music. **No rule is
rhythm-locked.** The beat is feel, not a timing test; do not "improve" it into
one.

- Audio is a few oscillators (kick, bass, hats, event blips) — no files. It only
  starts after a gesture, because browsers refuse audio before one, and every
  call is best-effort: no audio device must never take the game down. The mute
  toggle persists in `localStorage` under `arcade:cr-sound`.
- The rules run on their own `setTimeout` tick; `requestAnimationFrame` only
  draws. Particles and screen shake therefore cannot change how fast the game
  actually plays.

### Screen sizes

- Portrait phone: the column layout, board sized off the width.
- Landscape ≥760px wide and ≤1000px tall (iPad on its side, most desktop
  windows): the shell becomes a grid — board on the left, the whole control
  column on the right — so a run fits on one screen without scrolling.
- iPad upright: the board leaves room for the touch pad (`100vh - 600px`); a
  phone keeps the bigger board and scrolls instead, since it cannot win either
  way.
- The d-pad and the pills grow on `pointer: coarse`.

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

## Adding an arcade game

1. Copy the closest existing game page in `arcade/` — they all share the same
   skeleton: `cosmos.css` + `arcade.css`, a `.shell` with `.topbar` / `.hud` /
   `.stage`, and one `<script>` at the bottom holding the whole game.
2. Reuse `Arcade.readBest` / `writeBest` for the high score (it is namespaced
   `arcade:<key>` in `localStorage` and fails quietly when storage is blocked),
   and `Arcade.bindKeys` / `bindPad` / `onSwipe` so keyboard, d-pad, and swipe
   all work without writing the same three listeners again.
3. Add a satellite and a card to the reactor on the landing page (see below).
   There is no arcade hub page — `arcade/` holds only the games, and every game
   links straight back to `../index.html`.

### The arcade section on the landing page

One `.arcade-strip` section of `index.html`, split in half — one original per
brother, each drawn as the same circular diagram (`.orb`):

| Half | Centre | Nodes | Energy |
|---|---|---|---|
| Clark, `.half-clark` | the portal gate → `Clark/rpg-codex/` | 7 chapters | runs **outward** — that game is about travelling out through portals |
| Bradley, `.half-bradley` | the reactor core → `arcade/chain-reaction.html` | 5 arcade classics | runs **inward** — that game is what the five fused into |

The opposite flow direction is the whole point of the pairing; it is one
animation name (`emit` vs `feed`) swapped by `.portal .beam::after`.

- A node and its beam share one palette class — `.g-snake`, `.g-2048`, … for the
  classics, `.c-1` … `.c-7` for the chapters (each chapter's own portal colour
  from `rpg-codex/js/data.js`). That is the only place a colour is written down.
- Nodes and beams are placed by a single `--a` angle, so adding one means
  re-spacing that half (360 / n) on both the node and its beam.
- Hovering, focusing or tapping a node lights its beam and swaps the caption for
  that node's `data-note`; hovering the centre lights every beam. One `wire()`
  call per half does this — see the script at the bottom of `index.html`.
- Everything is sized off `--size` on `.orb`, so there is no separate mobile
  layout to keep in sync — but note the rings inside `.field` are square boxes
  drawn as circles, and `.field` must keep its `overflow: hidden`, or their
  rotated bounding boxes widen the page on a phone.
- The classics are not listed anywhere else on the page: the five satellites are
  their only entry point, which is why their labels have to stay legible.

Games driven by `requestAnimationFrame` pause when the tab is hidden — that is
the browser, not a bug, but it does mean an automated test in a background tab
sees a frozen game.

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
