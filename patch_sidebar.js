const fs = require('fs');
let content = fs.readFileSync('Avance2135.html', 'utf8');

// ─── CSS: Update sidebar-dark class to support both widths via transition ──────
const oldCss = `.sidebar-dark { width: 280px; background: var(--navy-950); display: flex; flex-direction: column; z-index: 10; height: 100vh; color: #94A3B8; position: relative; }`;
const newCss = `.sidebar-dark { background: var(--navy-950); display: flex; flex-direction: column; z-index: 10; height: 100vh; color: #94A3B8; position: relative; overflow: hidden; transition: width 0.25s ease; }`;

if (content.includes(oldCss)) {
  content = content.replace(oldCss, newCss);
  console.log('CSS patch OK');
} else {
  console.log('CSS patch: line not found, trying partial...');
  content = content.replace(
    '.sidebar-dark { width: 280px;',
    '.sidebar-dark { overflow: hidden; transition: width 0.25s ease;'
  );
}

// ─── Replace the entire <aside> block ─────────────────────────────────────────
const oldAside = `        <aside className={\`sidebar-dark shrink-0 flex flex-col transition-all duration-[300ms] ease-in-out \${sidebarCollapsed ? 'w-[64px]' : 'w-64'}\`}>
          <style dangerouslySetInnerHTML={{__html: \`
            .custom-scrollbar::-webkit-scrollbar { width: 0px; }
            .sidebar-dark { box-shadow: 4px 0 24px rgba(0,0,0,0.15); border-right: 1px solid rgba(255,255,255,0.05); }
            .nav-item-dark .icon-svg { transition: transform 0.2s; }
            .nav-item-dark:hover .icon-svg { transform: scale(1.1); }
          \`}} />
          
          {/* Header */}
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
              title={sidebarCollapsed ? "Expandir Menú" : "Contraer Menú"}
            >
              <span className="text-[12px] font-black">
                {sidebarCollapsed ? '\\u00bb\\u00bb' : '\\u00ab\\u00ab'}
              </span>
            </button>
          </div>`;

const newAside = `        <aside style={{width: sidebarCollapsed ? 64 : 260, minWidth: sidebarCollapsed ? 64 : 260}} className="sidebar-dark shrink-0 flex flex-col">
          <style dangerouslySetInnerHTML={{__html: \`
            .custom-scrollbar::-webkit-scrollbar { width: 0px; }
            .sidebar-dark { box-shadow: 4px 0 24px rgba(0,0,0,0.15); border-right: 1px solid rgba(255,255,255,0.05); }
            .nav-item-dark .icon-svg { transition: transform 0.2s; }
            .nav-item-dark:hover .icon-svg { transform: scale(1.1); }
            .sidebar-label { overflow: hidden; white-space: nowrap; transition: opacity 0.2s ease, max-width 0.25s ease; }
            .sidebar-label--hidden { opacity: 0; max-width: 0; pointer-events: none; }
            .sidebar-label--visible { opacity: 1; max-width: 200px; }
            .sidebar-section-label { overflow: hidden; transition: opacity 0.2s ease, max-height 0.25s ease; }
            .sidebar-section-label--hidden { opacity: 0; max-height: 0; }
            .sidebar-section-label--visible { opacity: 1; max-height: 40px; }
          \`}} />
          
          {/* Header */}
          <div className="px-3 flex items-center justify-between h-[72px] relative border-b border-slate-800/50">
            <div className="flex items-center gap-3 min-w-0">
               <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
               </div>
               <div className={\`flex flex-col overflow-hidden transition-all duration-[250ms] ease-in-out \${sidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}\`} style={{whiteSpace:'nowrap'}}>
                 <h1 className="text-lg font-black text-white tracking-tighter leading-none">CartaYa</h1>
                 <span className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase mt-0.5">Intelligence</span>
               </div>
            </div>
            
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)} 
              className="text-slate-400 hover:text-white transition-all duration-200 bg-slate-800/60 hover:bg-slate-700/80 rounded-lg flex items-center justify-center w-7 h-7 border border-slate-700/50 shrink-0"
              title={sidebarCollapsed ? "Expandir Menú" : "Contraer Menú"}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {sidebarCollapsed
                  ? <><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></>
                  : <><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></>
                }
              </svg>
            </button>
          </div>`;

if (content.includes(oldAside)) {
  content = content.replace(oldAside, newAside);
  console.log('Aside header patch OK');
} else {
  console.log('Aside header patch NOT FOUND');
}

// ─── NavItemDark: update to use the smoother transition approach ─────────────
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
      className={\`nav-item-dark \${activeClass} relative group transition-all duration-[250ms] ease-in-out \${collapsed ? 'mx-auto rounded-xl justify-center' : 'mx-2 rounded-lg'}\`}
      style={collapsed ? {width:44, height:44, padding:0, display:'flex', alignItems:'center', justifyContent:'center'} : {}}
      onClick={onClick}
    >
      {/* Active indicator bar on left when collapsed */}
      {collapsed && isActive && (
        <div className="absolute top-1/2 -left-[3px] -translate-y-1/2 w-[3px] h-6 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
      )}

      {/* Icon — always visible */}
      <div className={\`flex items-center justify-center shrink-0 transition-all duration-[250ms] \${collapsed ? 'w-full h-full text-[22px]' : 'w-5 h-5 text-[18px]'}\`}>
        <span className="flex items-center justify-center">{icon}</span>
      </div>

      {/* Label — fades out when collapsed */}
      <span
        className="truncate whitespace-nowrap pl-3 flex-1 transition-all duration-[200ms] ease-in-out"
        style={{
          overflow: 'hidden',
          maxWidth: collapsed ? 0 : 160,
          opacity: collapsed ? 0 : 1,
          pointerEvents: collapsed ? 'none' : 'auto',
        }}
      >{label}</span>
      
      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="sidebar-tooltip">
          {label}
        </div>
      )}
    </div>
  );
}`;

if (content.includes(oldNavItem)) {
  content = content.replace(oldNavItem, newNavItem);
  console.log('NavItemDark patch OK');
} else {
  console.log('NavItemDark patch NOT FOUND');
}

fs.writeFileSync('Avance2135.html', content, 'utf8');
console.log('All patches applied.');
