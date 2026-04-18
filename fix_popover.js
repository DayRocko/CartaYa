
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Avance2135.html');
let content = fs.readFileSync(filePath, 'utf8');

// ─────────────────────────────────────────────
// FIX 1: Remove the OLD static popover block still present after the new one
// It begins at: {getGroupsForType(posProducts.find...
// and ends at the last: })}  before {/* CAMPO DESCRIBIR */}
// ─────────────────────────────────────────────
const oldPopoverStart = "                {getGroupsForType(posProducts.find(p => p.id === activeNotePlatoId)?.tipo_plato).map((groupId, idx) => {";
const oldPopoverEnd = "                 })}\r\n\r\n                 {/* CAMPO DESCRIBIR */}";

const idxOPS = content.indexOf(oldPopoverStart);
const idxOPE = content.indexOf(oldPopoverEnd, idxOPS);

if (idxOPS !== -1 && idxOPE !== -1) {
  // Remove the old static block but keep the CAMPO DESCRIBIR comment and beyond
  content = content.substring(0, idxOPS) + "\r\n                 {/* CAMPO DESCRIBIR */}" + content.substring(idxOPE + oldPopoverEnd.length);
  console.log("FIX 1: Old static popover removed.");
} else {
  console.log("FIX 1 ERROR: idxOPS=" + idxOPS + ", idxOPE=" + idxOPE);
}

// ─────────────────────────────────────────────
// FIX 2: Add missing handleToggleNoteOption definition
// Insert it right after the itemNotes state declarations
// ─────────────────────────────────────────────
const itemNotesDef = "  const [activeNotePos, setActiveNotePos] = React.useState({ top: 0, left: 0 });";
const newToggleFn = `
  const handleToggleNoteOption = (platoId, groupId, optId, tipo_seleccion) => {
    const isMulti = tipo_seleccion === 'OPCIONAL_MULTIPLE' || tipo_seleccion === 'MULTIPLE';
    setItemNotes(prev => {
      const current = prev[platoId]?.options?.[groupId] || [];
      let newSels = current.map(String).includes(String(optId))
        ? current.filter(s => String(s) !== String(optId))
        : (isMulti ? [...current, optId] : [optId]);
      return {
        ...prev,
        [platoId]: {
          ...prev[platoId],
          options: { ...(prev[platoId]?.options || {}), [groupId]: newSels }
        }
      };
    });
  };
`;

if (content.includes(itemNotesDef) && !content.includes('const handleToggleNoteOption =')) {
  content = content.replace(itemNotesDef, itemNotesDef + newToggleFn);
  console.log("FIX 2: handleToggleNoteOption added.");
} else {
  console.log("FIX 2 SKIP: already exists or anchor not found.");
}

// ─────────────────────────────────────────────
// FIX 3: Remove dangling 'getGroupsForType' reference
// if getGroupsForType is still referenced but not defined
// ─────────────────────────────────────────────
if (content.includes('getGroupsForType') && !content.includes('const getGroupsForType =')) {
  // There's a stray call. It should have been removed by FIX 1 above.
  console.log("FIX 3 WARNING: getGroupsForType still referenced without definition.");
} else {
  console.log("FIX 3 OK: getGroupsForType clean.");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("All fixes applied and saved.");
