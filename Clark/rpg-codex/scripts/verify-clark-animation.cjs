const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const gameSource = fs.readFileSync(path.join(root, "js", "game.js"), "utf8");
const rigPath = path.join(root, "assets", "characters", "rig", "clark-puppet-parts-tight-v1.png");
const fallbackPath = path.join(root, "assets", "characters", "animations", "clark-action-atlas-v4.webp");

async function verifyClearCellBorders(file, columns, rows, label) {
  const image = sharp(file).ensureAlpha();
  const metadata = await image.metadata();
  assert.equal(metadata.width % columns, 0, `${label}: width must divide into ${columns} cells`);
  assert.equal(metadata.height % rows, 0, `${label}: height must divide into ${rows} cells`);
  assert.equal(metadata.hasAlpha, true, `${label}: transparency is required`);

  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  const alphaAt = (x, y) => data[(y * info.width + x) * info.channels + 3];
  const cellWidth = info.width / columns;
  const cellHeight = info.height / rows;

  for (let column = 1; column < columns; column += 1) {
    const x = column * cellWidth;
    for (let y = 0; y < info.height; y += 1) {
      assert.equal(alphaAt(x - 1, y), 0, `${label}: artwork touches left side of vertical cell border ${column}`);
      assert.equal(alphaAt(x, y), 0, `${label}: artwork touches right side of vertical cell border ${column}`);
    }
  }
  for (let row = 1; row < rows; row += 1) {
    const y = row * cellHeight;
    for (let x = 0; x < info.width; x += 1) {
      assert.equal(alphaAt(x, y - 1), 0, `${label}: artwork touches top side of horizontal cell border ${row}`);
      assert.equal(alphaAt(x, y), 0, `${label}: artwork touches bottom side of horizontal cell border ${row}`);
    }
  }
  return `${label} ${info.width}x${info.height}`;
}

async function main() {
  assert.match(gameSource, /HERO_RIG_SOURCE\s*=\s*"assets\/characters\/rig\/clark-puppet-parts-tight-v1\.png"/);
  assert.match(gameSource, /function heroRigPose\(/);
  assert.match(gameSource, /function blendHeroRigPose\(/);
  assert.match(gameSource, /function drawClarkRig\(/);
  assert.match(gameSource, /HERO_RIG_RENDER_SCALE\s*=\s*\.88/);
  assert.match(gameSource, /animBlend \+ delta \/ \.13/);
  assert.match(gameSource, /capeVelocity \+= \(capeTarget - player\.capeAngle\) \* 48 \* delta/);
  assert.match(gameSource, /drawClarkRig\(ctx\)/);

  const results = await Promise.all([
    verifyClearCellBorders(rigPath, 4, 3, "Clark skeletal rig"),
    verifyClearCellBorders(fallbackPath, 6, 6, "Clark fallback atlas")
  ]);
  console.log(`PASS: ${results.join("; ")}; continuous pose blending and cape spring are wired.`);
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
