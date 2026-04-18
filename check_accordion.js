
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Avance2135.html');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// The banner structure (as it currently stands after my fix):
// L5172: <div style={{background:'#0F1117'...}}>   (banner outer)
// L5173:   <div className="absolute ...">☁</div>    (self-contained)
// L5174:   <div style={{display:'flex'...}}>         (flex row)
// L5175:     <div style={{display:'flex'...}}>       (left info)
// L5176-5181:   content...
// L5181:     </div>                                   (closes left info)
// L5182:     <div style={{display:'flex', flexWrap...}}>  (buttons)
// L5183-5215:   buttons...
// L5215:     </div>  <- MY INSERTED CLOSE (closes buttons flexWrap div L5182)
// L5216:   </div>   <- MY INSERTED CLOSE (closes flex row L5174)  
// L5217: </div>   <- MY INSERTED CLOSE (closes banner outer L5172)
// L5218: <div className="w-full space-y-4">  <- accordion wrapper

// But wait—the diagnostic says L5496 correctly closes the configuracion block.
// The issue must be that the `<div className="w-full space-y-4">` on L5219 is NOT closed!
// Let's check: this div should close just before L5495 or L5496.

// Find where the 4 accordion sections end and where the space-y-4 closes
// The 4 accordion buttons are siblings. Last accordion (recetas) closes before )}

// Let's look at lines 5490-5500
console.log("Lines 5490-5500:");
for (let i = 5489; i <= 5499; i++) {
  console.log(`L${i+1}: ${lines[i]}`);
}
console.log('\nLines 5718-5725:');
for (let i = 5717; i <= 5724; i++) {
  console.log(`L${i+1}: ${lines[i]}`);
}
