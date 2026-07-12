import { useNavigate, useLocation } from 'react-router-dom';
import ProfileDropdown from '../common/ProfileDropdown';

/* ── Clean SVG line-art icons (no emojis, no AI icons) ── */
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

const IconSubmissions = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2z"/>
    <path d="M8 10h4M8 14h2M8 6h4"/>
  </svg>
);

const IconTalents = () => (
  <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path d="M4 17a6 6 0 0112 0"/>
  </svg>
);

const navItems = [
  { label: 'Dashboard',   path: '/admin/dashboard',   Icon: IconDashboard   },
  { label: 'Tasks',       path: '/admin/tasks',       Icon: IconTasks       },
  { label: 'Submissions', path: '/admin/submissions', Icon: IconSubmissions },
  { label: 'Talents',     path: '/admin/talents',     Icon: IconTalents     },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 w-[240px] flex flex-col z-50"
      style={{ background: '#0D0D0D' }}>

      {/* Brand */}
      <div className="flex items-center justify-center px-5 py-6">
        <img src="/modelsuite-talents.png" alt="ModelSuite Talents" className="w-40 h-auto object-contain" />
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
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors">
          <Avatar name={user?.name} variant="admin" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate"
              style={{ color: '#E5E2E1', fontFamily: 'Space Grotesk, sans-serif' }}>
              {user?.name}
            </p>
            <p className="text-[11px] font-medium" style={{ color: '#4B5563' }}>Admin</p>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            title="Sign out"
            className="logout-btn-modern">
            <IconLogout />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
