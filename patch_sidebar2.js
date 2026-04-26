const fs = require('fs');
let content = fs.readFileSync('Avance2135.html', 'utf8');

// ─── PATCH 1: <aside> tag itself ──────────────────────────────────────────────
content = content.replace(
  `<aside className={\`sidebar-dark shrink-0 flex flex-col transition-all duration-[300ms] ease-in-out \${sidebarCollapsed ? 'w-[64px]' : 'w-64'}\`}>`,
  `<aside style={{width: sidebarCollapsed ? 64 : 260, minWidth: sidebarCollapsed ? 64 : 260}} className="sidebar-dark shrink-0 flex flex-col">`
);
console.log('PATCH 1 done - aside tag');

// ─── PATCH 2: Inline style block inside aside ──────────────────────────────────
content = content.replace(
  `.sidebar-dark { box-shadow: 4px 0 24px rgba(0,0,0,0.15); border-right: 1px solid rgba(255,255,255,0.05); }
            .nav-item-dark .icon-svg { transition: transform 0.2s; }
            .nav-item-dark:hover .icon-svg { transform: scale(1.1); }`,
  `.sidebar-dark { box-shadow: 4px 0 24px rgba(0,0,0,0.15); border-right: 1px solid rgba(255,255,255,0.05); }
            .nav-item-dark .icon-svg { transition: transform 0.2s; }
            .nav-item-dark:hover .icon-svg { transform: scale(1.1); }
            .sidebar-dark { overflow: hidden; transition: width 0.25s ease, min-width 0.25s ease !important; }`
);
console.log('PATCH 2 done - transition style');

// ─── PATCH 3: Header div — replace the entire header block ────────────────────
const oldHeader = `          {/* Header */}
          <div className={\`px-4 flex items-center h-[88px] relative transition-all duration-300 \${sidebarCollapsed ? 'justify-start' : 'justify-between'}\`}>
            <div className={\`flex items-center gap-3 transition-all duration-300 \${sidebarCollapsed ? 'pl-1' : ''}\`}>
               <div className={\`w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-transform duration-300 \${sidebarCollapsed ? 'scale-110' : ''}\`}>
                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
               </div>
               {!sidebarCollapsed && (
                 <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                   <h1 className="text-xl font-black text-white tracking-tighter leading-none">CartaYa</h1>
                   <span className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase mt-1">Intelligence</span>
                 </div>
               )}
            </div>
            
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
              className={\`text-slate-400 hover:text-white transition-all duration-200 bg-slate-800/40 hover:bg-slate-700/60 rounded-lg flex items-center justify-center w-8 h-8 border border-slate-700/30 \${sidebarCollapsed ? 'absolute right-2 top-6 z-30' : ''}\`}
              title={sidebarCollapsed ? "Expandir Men\\u00fa" : "Contraer Men\\u00fa"}
            >
              <span className="text-[12px] font-black">
                {sidebarCollapsed ? '\\u203a\\u203a' : '\\u2039\\u2039'}
              </span>
            </button>
          </div>`;

const newHeader = `          {/* Header */}
          <div className="px-3 flex items-center justify-between border-b border-slate-800/50 shrink-0" style={{height:72}}>
            <div className="flex items-center gap-3 min-w-0 overflow-hidden">
               <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
               </div>
               <div style={{overflow:'hidden', maxWidth: sidebarCollapsed ? 0 : 160, opacity: sidebarCollapsed ? 0 : 1, transition:'max-width 0.25s ease, opacity 0.2s ease', whiteSpace:'nowrap'}}>
                 <h1 className="text-lg font-black text-white tracking-tighter leading-none">CartaYa</h1>
                 <span className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase mt-0.5 block">Intelligence</span>
               </div>
            </div>
            
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
              className="text-slate-400 hover:text-white transition-colors duration-200 bg-slate-800/60 hover:bg-slate-700/80 rounded-lg flex items-center justify-center border border-slate-700/50 shrink-0"
              style={{width:28, height:28}}
              title={sidebarCollapsed ? "Expandir Men\\u00fa" : "Contraer Men\\u00fa"}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                {sidebarCollapsed
                  ? <><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></>
                  : <><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></>
                }
              </svg>
            </button>
          </div>`;

if (content.includes(oldHeader)) {
  content = content.replace(oldHeader, newHeader);
  console.log('PATCH 3 done - header block');
} else {
  console.log('PATCH 3 NOT FOUND - header block');
}

// ─── PATCH 4: NavItemDark function ────────────────────────────────────────────
const oldNavItem = `function NavItemDark({ icon, label, isActive, onClick, highlight, collapsed }) {
  const activeClass = isActive ? 'nav-item-dark--active' : '';
  const collapseClass = collapsed ? 'justify-start hover:bg-[rgba(255,255,255,0.05)] !px-3 rounded-xl w-12 h-12 flex items-center shrink-0 ml-1' : 'px-4 mx-2 rounded-lg';
  
  return (
    <div className={\`nav-item-dark \${activeClass} \${collapseClass} relative group transition-all duration-300\`} onClick={onClick}>
      <div className={\`flex items-center justify-center relative transition-all duration-300 \${collapsed ? 'text-[26px] w-full h-full' : 'w-6 shrink-0'}\`}>
        <span className="flex items-center justify-center">{icon}</span>
        {collapsed && isActive && <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-1.5 h-7 bg-emerald-500 rounded-r-full shadow-[0_0_12px_rgba(16,185,129,0.6)]"></div>}
      </div>
      {!collapsed && <span className="opacity-100 transition-opacity duration-300 truncate whitespace-nowrap pl-3 flex-1">{label}</span>}
      
      {collapsed && (
        <div className="sidebar-tooltip">
          {label}
        </div>
      )}
    </div>
  );
}`;

const newNavItem = `function NavItemDark({ icon, label, isActive, onClick, highlight, collapsed }) {
  const activeClass = isActive ? 'nav-item-dark--active' : '';

  return (
    <div
      className={\`nav-item-dark \${activeClass} relative group\`}
      style={{
        display: 'flex',
        alignItems: 'center',
        margin: collapsed ? '2px auto' : '2px 8px',
        borderRadius: 10,
        padding: collapsed ? 0 : '8px 12px',
        width: collapsed ? 44 : 'auto',
        height: collapsed ? 44 : 'auto',
        justifyContent: collapsed ? 'center' : 'flex-start',
        transition: 'all 0.25s ease',
      }}
      onClick={onClick}
    >
      {/* Active indicator bar */}
      {collapsed && isActive && (
        <div style={{position:'absolute', left:-3, top:'50%', transform:'translateY(-50%)', width:3, height:24, background:'#10B981', borderRadius:'0 4px 4px 0', boxShadow:'0 0 10px rgba(16,185,129,0.7)'}} />
      )}

      {/* Icon — always visible */}
      <div className="flex items-center justify-center shrink-0" style={{width: collapsed ? '100%' : 20, height: collapsed ? '100%' : 20}}>
        <span className="flex items-center justify-center">{icon}</span>
      </div>

      {/* Label — slides out when collapsed */}
      <span
        className="truncate whitespace-nowrap pl-3"
        style={{
          overflow: 'hidden',
          maxWidth: collapsed ? 0 : 160,
          opacity: collapsed ? 0 : 1,
          transition: 'max-width 0.25s ease, opacity 0.15s ease',
          pointerEvents: collapsed ? 'none' : 'auto',
          flex: 1,
        }}
      >{label}</span>

      {/* Tooltip on hover when collapsed */}
      {collapsed && (
        <div className="sidebar-tooltip">{label}</div>
      )}
    </div>
  );
}`;

if (content.includes(oldNavItem)) {
  content = content.replace(oldNavItem, newNavItem);
  console.log('PATCH 4 done - NavItemDark');
} else {
  console.log('PATCH 4 NOT FOUND - NavItemDark');
}

fs.writeFileSync('Avance2135.html', content, 'utf8');
console.log('\nAll patches saved.');
