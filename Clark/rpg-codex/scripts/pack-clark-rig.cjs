const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const input = process.argv[2];
const output = process.argv[3];
if (!input || !output) throw new Error("Usage: node scripts/pack-clark-rig.cjs <input.png> <output.png>");

const columns = 4;
const rows = 3;
const targetCell = 192;
const targetContent = 164;

async function alphaBounds(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = -1, bottom = -1;
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (data[(y * info.width + x) * info.channels + 3] <= 2) continue;
      left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
    }
  }
  return right < left ? null : { left, top, width: right - left + 1, height: bottom - top + 1 };
}

async function retainLargestComponent(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const visited = new Uint8Array(info.width * info.height);
  let largest = [];
  for (let start = 0; start < visited.length; start += 1) {
    if (visited[start] || data[start * info.channels + 3] <= 8) continue;
    const queue = [start];
    const component = [];
    visited[start] = 1;
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const index = queue[cursor];
      component.push(index);
      const x = index % info.width;
      const y = Math.floor(index / info.width);
      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          if ((!offsetX && !offsetY) || x + offsetX < 0 || x + offsetX >= info.width || y + offsetY < 0 || y + offsetY >= info.height) continue;
          const next = (y + offsetY) * info.width + x + offsetX;
          if (!visited[next] && data[next * info.channels + 3] > 8) { visited[next] = 1; queue.push(next); }
        }
      }
    }
    if (component.length > largest.length) largest = component;
  }
  const keep = new Uint8Array(visited.length);
  largest.forEach(index => { keep[index] = 1; });
  for (let index = 0; index < keep.length; index += 1) if (!keep[index]) data[index * info.channels + 3] = 0;
  return sharp(data, { raw: info }).png().toBuffer();
}

async function main() {
  const metadata = await sharp(input).metadata();
  const composites = [];
  for (let row = 0; row < rows; row += 1) {
    const top = Math.round(row * metadata.height / rows);
    const bottom = Math.round((row + 1) * metadata.height / rows);
    for (let column = 0; column < columns; column += 1) {
      const left = Math.round(column * metadata.width / columns);
      const right = Math.round((column + 1) * metadata.width / columns);
      const cellWidth = right - left;
      const cellHeight = bottom - top;
      // Generated atlases can leave a faint glow a few pixels across a grid
      // boundary. The prompt guarantees generous padding, so discard that
      // boundary band before trimming each independently rigged part.
      const inset = Math.max(12, Math.round(Math.min(cellWidth, cellHeight) * .05));
      let cell = await sharp(input).extract({ left: left + inset, top: top + inset, width: cellWidth - inset * 2, height: cellHeight - inset * 2 }).png().toBuffer();
      if (row > 0) cell = await retainLargestComponent(cell);
      const bounds = await alphaBounds(cell);
      if (!bounds) continue;
      const trimmed = await sharp(cell).extract(bounds).resize(targetContent, targetContent, { fit: "inside", withoutEnlargement: false }).png().toBuffer();
      const size = await sharp(trimmed).metadata();
      composites.push({
        input: trimmed,
        left: column * targetCell + Math.round((targetCell - size.width) / 2),
        top: row * targetCell + Math.round((targetCell - size.height) / 2)
      });
    }
  }
  await sharp({ create: { width: columns * targetCell, height: rows * targetCell, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(composites).png().toFile(output);
  console.log(`${path.resolve(output)} (${composites.length} occupied cells)`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
