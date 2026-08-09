const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const draftFile = path.join(root, "scripts/drafts/react-new.txt");
const dataFile = path.join(root, "src/data/react.js");
let newContent = fs.readFileSync(draftFile, "utf8");
newContent = newContent.replace(/\r\n/g, "\n");
newContent = newContent.replace(/}\n,\n  \{/g, "},\n  {");
let react = fs.readFileSync(dataFile, "utf8");
const pattern = "  }\n]";
const idx = react.lastIndexOf(pattern);
if (idx === -1) { console.log("PATTERN NOT FOUND"); process.exit(1); }
const result = react.slice(0, idx) + "  },\n" + newContent + "\n]" + react.slice(idx + pattern.length);
fs.writeFileSync(dataFile, result);
console.log("done, new length:", result.length);
