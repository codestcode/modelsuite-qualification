import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';

const MENU_ITEMS = [
  { label: 'Profile',     href: '/talent/profile',  icon: 'profile' },
  { label: 'Settings',    href: '/talent/settings',  icon: 'settings' },
  { label: 'Tasks',       href: '/talent/dashboard', icon: 'tasks' },
];

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path d="M4 17a6 6 0 0112 0"/>
  </svg>
);

const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="3"/>
    <path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.5 3.5l1.4 1.4M15.1 15.1l1.4 1.4M3.5 16.5l1.4-1.4M15.1 4.9l1.4-1.4"/>
  </svg>
);

const IconTasks = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10l2 2 4-4"/>
    <rect x="3" y="3" width="14" height="14" rx="2"/>
  </svg>
);

const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 10H3M13 10l-3-3M13 10l-3 3"/>
    <path d="M7 4H4a1 1 0 00-1 1v10a1 1 0 001 1h3"/>
  </svg>
);

const ICON_MAP = {
  profile: IconUser,
  settings: IconSettings,
  tasks: IconTasks,
};

const ProfileDropdown = ({ className = '' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`pd-relative ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        className="pd-trigger group"
        onClick={() => setIsOpen((o) => !o)}
        type="button"
      >
        <div className="pd-trigger-text">
          <div className="pd-trigger-name">{user?.name || 'User'}</div>
          <div className="pd-trigger-email">{user?.email || 'user@email.com'}</div>
        </div>
        <div className="pd-avatar-ring">
          <Avatar name={user?.name} variant={user?.role === 'Admin' ? 'admin' : 'talent'} size="md" />
        </div>

        {/* Bending line indicator */}
        <div className={`pd-bend ${isOpen ? 'pd-bend-open' : ''}`}>
          <svg fill="none" height="24" viewBox="0 0 12 24" width="12">
            <path
              d="M2 4C6 8 6 16 2 20"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown */}
      <div className={`pd-dropdown ${isOpen ? 'pd-dropdown-open' : ''}`}>
        {/* Menu items */}
        <div className="pd-menu-list">
          {MENU_ITEMS.map((item) => {
            const IconComp = ICON_MAP[item.icon];
            return (
              <Link
                key={item.label}
                to={item.href}
                className="pd-menu-item"
                onClick={() => setIsOpen(false)}
              >
                <span className="pd-menu-icon">
                  {IconComp && <IconComp />}
                </span>
                <span className="pd-menu-label">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Separator */}
        <div className="pd-separator" />

        {/* Sign out */}
        <button
          className="pd-logout"
          onClick={handleLogout}
          type="button"
        >
          <span className="pd-menu-icon pd-logout-icon">
            <IconLogout />
          </span>
          <span className="pd-menu-label pd-logout-label">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
