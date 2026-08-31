const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.resolve(__dirname, "..", "js", "game.js"), "utf8");
const peacefulStart = source.indexOf("  function completePeacefulEncounter()");
const peacefulEnd = source.indexOf("  function defeatBoss()", peacefulStart);
const peacefulSource = source.slice(peacefulStart, peacefulEnd);

assert.ok(peacefulStart >= 0 && peacefulEnd > peacefulStart, "Chapter 5 peaceful encounter function is missing");
assert.doesNotMatch(peacefulSource, /game\.boss\.active\s*=\s*false/, "Peaceful encounter must keep the boss active while its farewell animation runs");
assert.match(peacefulSource, /game\.boss\.resolving\s*=\s*true/, "Peaceful encounter must guard against duplicate activation");
assert.match(source, /if \(boss\.defeated\)[\s\S]*?finishBossDefeat\(\)/, "Defeated boss lifecycle must reach portal activation");
assert.match(source, /function finishBossDefeat\([\s\S]*?game\.portalActive\s*=\s*true/, "Boss completion must activate the portal");
assert.match(source, /function solveHeroLegIK\(/, "Clark movement must use leg IK");
assert.match(source, /function heroWalkFoot\(/, "Clark movement must define planted and lifted foot targets");

console.log("PASS: Chapter 5 peaceful-boss lifecycle reaches portal activation; Clark walk cycle uses foot-target IK.");
