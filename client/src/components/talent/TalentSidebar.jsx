import { useNavigate, useLocation } from 'react-router-dom';
import ProfileDropdown from '../common/ProfileDropdown';

/* ── Clean SVG line-art icons ── */
const IconDashboard = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="7" height="7" rx="1.5"/>
    <rect x="11" y="2" width="7" height="7" rx="1.5"/>
    <rect x="2" y="11" width="7" height="7" rx="1.5"/>
    <rect x="11" y="11" width="7" height="7" rx="1.5"/>
  </svg>
);

const IconTasks = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10l2 2 4-4"/>
    <rect x="3" y="3" width="14" height="14" rx="2"/>
  </svg>
);

const navItems = [
  { label: 'My Dashboard', path: '/talent/dashboard', Icon: IconDashboard },
  { label: 'My Tasks',     path: '/talent/tasks',     Icon: IconTasks     },
];

const TalentSidebar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 w-[220px] flex flex-col z-50"
      style={{ background: '#0D0D0D' }}>

      {/* Brand */}
      <div className="flex items-center justify-center px-5 py-6">
        <img src="/modelsuite-talents.png" alt="ModelSuite Talents" className="w-36 h-auto object-contain" />
      </div>

      <div className="sidebar-divider mx-4" />

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1 px-3 pt-5">
        <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] px-2 mb-2"
          style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'Inter, sans-serif' }}>
          Menu
        </p>

        {navItems.map(({ label, path, Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button key={path}
              onClick={() => navigate(path)}
              className={`nav-item ${isActive ? 'nav-active' : ''}`}>
              <Icon />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5">
        <div className="sidebar-divider mb-4" />
        <ProfileDropdown />
      </div>
    </aside>
  );
};

export default TalentSidebar;
