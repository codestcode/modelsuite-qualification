import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProfileDropdown from '../common/ProfileDropdown';

/* ── SVG icons ── */
const IconDashboard = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="7" height="7" rx="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5"/>
  </svg>
);
const IconTasks = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10l2 2 4-4"/><rect x="3" y="3" width="14" height="14" rx="2"/>
  </svg>
);
const IconSubmissions = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2z"/><path d="M8 10h4M8 14h2M8 6h4"/>
  </svg>
);
const IconTalents = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M4 17a6 6 0 0112 0"/>
  </svg>
);

const navItems = [
  { label: 'Dashboard',   path: '/admin/dashboard',   Icon: IconDashboard   },
  { label: 'Tasks',       path: '/admin/tasks',       Icon: IconTasks       },
  { label: 'Submissions', path: '/admin/submissions', Icon: IconSubmissions },
  { label: 'Talents',     path: '/admin/talents',     Icon: IconTalents     },
];

const Sidebar = ({ onToggle }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const toggle = () => {
    const next = !open;
    setOpen(next);
    onToggle?.(next);
  };

  const W = open ? 260 : 80;

  return (
    <>
      <aside
        className="admin-sidebar fixed inset-y-0 left-0 z-50 flex flex-col"
        style={{ width: W, transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)' }}
      >
        {/* Header */}
        <div className={`flex items-center ${open ? 'justify-between' : 'justify-center'} px-4 py-5`}>
          {open && (
            <img src="/modelsuite-talents.png" alt="Logo" className="w-36 h-auto object-contain transition-opacity duration-200" />
          )}
          <button
            onClick={toggle}
            className="sidebar-toggle-btn flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ color: 'rgba(255,255,255,0.5)', transition: 'transform 0.25s', transform: open ? 'none' : 'rotate(180deg)' }}>
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
        </div>

        <div className="sidebar-divider mx-3" />

        {/* Nav */}
        <nav className="flex flex-col gap-0.5 flex-1 px-2.5 pt-4">
          <p className={`text-[9.5px] font-semibold uppercase tracking-[0.12em] px-2 mb-2 ${open ? 'opacity-100' : 'opacity-0 h-0 mb-0 overflow-hidden'}`}
            style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif', transition: 'opacity 0.15s, height 0.15s, margin 0.15s' }}>
            Menu
          </p>

          {navItems.map(({ label, path, Icon }) => {
            const isActive = location.pathname === path;
            return (
              <button key={path}
                onClick={() => navigate(path)}
                className={`nav-item ${isActive ? 'nav-active' : ''}`}
                title={!open ? label : undefined}
                style={{ justifyContent: open ? 'flex-start' : 'center', padding: open ? '9px 12px' : '9px 0' }}>
                <Icon />
                {open && <span>{label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-2.5 pb-4">
          <div className="sidebar-divider mb-3" />
          {open ? (
            <ProfileDropdown />
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Spacer — pushes content to the right */}
      <div style={{ width: W + 12, flexShrink: 0, transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)' }} />
    </>
  );
};

export default Sidebar;
