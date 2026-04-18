const fs = require('fs');
const content = fs.readFileSync('Avance2135.html', 'utf8');

const oldText = /0% \{ opacity: 0; transform: translate\(-50%, -50%\) scale\(0\.85\); \}\r?\n\s+<div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-\[1200px\] mx-auto pb-10">/;

const newText = "              0% { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }\n" +
"              100% { opacity: 1; transform: translate(-50%, -50%) scale(1.0); }\n" +
"            }\n" +
"          `}} />\n" +
"        </React.Fragment>\n" +
"      )}\n" +
"    </div>\n" +
"  );\n" +
"}\n\n" +
"// --- 9. VIEW: BRAIN AI ---\n" +
"function ViewBrain() {\n" +
"  return (\n" +
"    <div className=\"space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1200px] mx-auto pb-10\">";

const fixedContent = content.replace(oldText, newText);
fs.writeFileSync('Avance2135.html', fixedContent);
console.log('Fixed junction.');
