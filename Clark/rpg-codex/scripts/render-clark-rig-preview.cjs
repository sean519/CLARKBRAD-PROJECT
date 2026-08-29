const fs = require("node:fs");
const path = require("node:path");
const { createCanvas, loadImage } = require("@napi-rs/canvas");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "js", "game.js"), "utf8");
const rigSource = source.slice(source.indexOf("  function heroRigPose("), source.indexOf("  function drawClark(ctx)"));
const cells = {
  head: [0,0], torso: [1,0], cape: [2,0], upperArm: [0,1], lowerArm: [1,1],
  fist: [2,1], openHand: [3,1], thigh: [0,2], shin: [1,2], bootRight: [2,2], bootLeft: [3,2]
};
const player = {
  animationTime: 0, walkCycle: 0, attackTime: 0, attackDuration: .3, hammerCharging: false,
  hammerCharge: 0, animState: "idle", previousAnimState: "idle", previousAnimStateTime: 0,
  animStateTime: 0, animBlend: 1, capeAngle: -.08, weapon: "leafblade",
  facing: { x: 1, y: 0 }, attackDirection: { x: 1, y: 0 }
};

async function main() {
  const atlas = await loadImage(path.join(root, "assets", "characters", "rig", "clark-puppet-parts-tight-v1.png"));
  const drawAtlasCell = (ctx, image, cell, columns, rows, x, y, width, height) => {
    const sourceWidth = image.width / columns;
    const sourceHeight = image.height / rows;
    ctx.drawImage(image, cell[0] * sourceWidth, cell[1] * sourceHeight, sourceWidth, sourceHeight, x, y, width, height);
  };
  const factory = new Function("player", "clamp", "lerp", "HERO_RIG_CELLS", "loadHeroRig", "loadProp", "drawAtlasCell", `${rigSource}; return { heroRigPose, blendHeroRigPose, drawClarkRig };`);
  const api = factory(player, (value, min, max) => Math.max(min, Math.min(max, value)), (a, b, t) => a + (b - a) * t, cells, () => atlas, () => null, drawAtlasCell);
  const states = ["idle", "move", "leafblade", "hammer", "dash", "hurt"];
  const canvas = createCanvas(900, 220);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#e8f1d9";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  states.forEach((state, index) => {
    player.animState = state;
    player.previousAnimState = state;
    player.animationTime = .42;
    player.walkCycle = .18;
    player.attackTime = .12;
    player.hammerCharging = state === "hammer";
    player.hammerCharge = .75;
    player.animStateTime = .14;
    ctx.save();
    ctx.translate(75 + index * 150, 145);
    api.drawClarkRig(ctx);
    ctx.restore();
    ctx.fillStyle = "#33452f";
    ctx.font = "700 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(state, 75 + index * 150, 202);
  });
  const output = process.argv[2] || path.join(root, "clark-rig-preview.png");
  fs.writeFileSync(output, canvas.toBuffer("image/png"));
  console.log(output);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
