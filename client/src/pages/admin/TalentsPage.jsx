import { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import { fetchTalents } from '../../api/tasks';

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8.5" cy="8.5" r="5.5"/>
    <path d="M17 17l-4-4"/>
  </svg>
);

const TalentsPage = () => {
  const [talents, setTalents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTalents()
      .then(({ data }) => setTalents(data))
      .catch(() => alert('Failed to load talents'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = talents.filter((t) =>
    !search || t.name?.toLowerCase().includes(search.toLowerCase()) || t.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-bg flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pl-6 pr-8 py-8 relative z-10 min-w-0">

        {/* Header */}
        <div className="flex items-center justify-between mb-7 page-section">
          <div>
            <h1 className="font-display text-[22px] font-semibold tracking-tight"
              style={{ color: '#F0F0F0', fontFamily: 'Space Grotesk, sans-serif' }}>
              Talents
            </h1>
            <p className="mt-0.5 text-[13px]" style={{ color: '#6B7280' }}>
              View and manage registered talent profiles.
            </p>
          </div>
          <span className="text-[11px] px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: '#6B7280',
              border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: 'Inter, sans-serif',
            }}>
            {filtered.length} {filtered.length === 1 ? 'talent' : 'talents'}
          </span>
        </div>

        {/* Search + Table */}
        <div className="tasks-container page-section">
          <div className="table-header-bar">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold"
                style={{ color: '#E5E2E1', fontFamily: 'Poppins, sans-serif' }}>
                All Talents
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#6B7280',
                  border: '1px solid rgba(255,255,255,0.09)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                {filtered.length}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#4B5563' }}>
                  <IconSearch />
                </span>
                <input
                  type="text"
                  placeholder="Search talents…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input-glass"
                  style={{ minWidth: '220px' }}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
            <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'Role', 'Profile'].map((h) => (
                    <th key={h}
                      className="text-left px-5 py-3.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] sticky top-0"
                      style={{ color: '#4B5563', background: 'rgba(5,5,5,0.95)', fontFamily: 'Inter, sans-serif', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-[13px]" style={{ color: '#4B5563' }}>Loading…</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-[13px]" style={{ color: '#4B5563' }}>
                      {search ? 'No talents match your search' : 'No talents registered yet'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((t, i) => (
                    <tr key={t._id}
                      className="table-row-animate"
                      style={{ animationDelay: `${i * 0.03}s` }}>
                      <td className="px-5 py-3.5 text-[13px] font-medium" style={{ color: '#E5E2E1', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        {t.name || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-[13px]" style={{ color: '#9CA3AF', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        {t.email}
                      </td>
                      <td className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span className="inline-block px-2.5 py-[3px] rounded-full text-[11px] font-medium"
                          style={{
                            background: t.role === 'Admin' ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)',
                            color: t.role === 'Admin' ? '#F59E0B' : '#60A5FA',
                            border: `1px solid ${t.role === 'Admin' ? 'rgba(245,158,11,0.25)' : 'rgba(59,130,246,0.25)'}`,
                            fontFamily: 'Inter, sans-serif',
                          }}>
                          {t.role || 'Talent'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span className="inline-block px-2.5 py-[3px] rounded-full text-[11px] font-medium"
                          style={{
                            background: t.profileComplete ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                            color: t.profileComplete ? '#34D399' : '#F87171',
                            border: `1px solid ${t.profileComplete ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                            fontFamily: 'Inter, sans-serif',
                          }}>
                          {t.profileComplete ? 'Complete' : 'Incomplete'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TalentsPage;
