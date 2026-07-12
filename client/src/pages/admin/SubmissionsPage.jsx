import { useEffect, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import Avatar from '../../components/common/Avatar';
import { fetchAllSubmissions, reviewSubmission } from '../../api/submissions';

const COLUMNS = [
  { key: 'Pending',  label: 'To Review', color: '#FBBF24', bg: 'rgba(251,191,36,0.06)',  border: 'rgba(251,191,36,0.15)' },
  { key: 'Approved', label: 'Approved',   color: '#34D399', bg: 'rgba(52,211,153,0.06)',  border: 'rgba(52,211,153,0.15)' },
  { key: 'Rejected', label: 'Rejected',   color: '#F87171', bg: 'rgba(248,113,113,0.06)', border: 'rgba(248,113,113,0.15)' },
];

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatRelative = (iso) => {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(iso);
};

const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reviewing, setReviewing] = useState(false);
  const [search, setSearch] = useState('');

  const loadSubmissions = async () => {
    try {
      const { data } = await fetchAllSubmissions();
      setSubmissions(data);
      if (selected) {
        const updated = data.find((s) => s._id === selected._id);
        if (updated) setSelected(updated);
        else setSelected(null);
      }
    } catch {
      alert('Failed to load submissions');
    }
  };

  // eslint-disable-next-line
  useEffect(() => { loadSubmissions(); }, []);

  const filtered = submissions.filter((s) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.taskId?.title?.toLowerCase().includes(q) ||
      s.talentId?.name?.toLowerCase().includes(q)
    );
  });

  const grouped = COLUMNS.map((col) => ({
    ...col,
    items: filtered.filter((s) => (s.reviewStatus || 'Pending') === col.key),
  }));

  const handleReview = async (status) => {
    if (!selected) return;
    setReviewing(true);
    try {
      await reviewSubmission(selected._id, status);
      await loadSubmissions();
    } catch (err) {
      alert(err.response?.data?.message || 'Review failed');
    } finally {
      setReviewing(false);
    }
  };

  const task   = selected?.taskId   || {};
  const talent = selected?.talentId || {};
  const selectedStatus = selected?.reviewStatus || 'Pending';
  const selectedCol = COLUMNS.find((c) => c.key === selectedStatus) || COLUMNS[0];

  return (
    <div className="page-bg flex min-h-screen">
      {/* Background orbs */}
      <div className="absolute z-0 pointer-events-none" style={{ width: 500, height: 500, borderRadius: '50%', background: '#3B82F6', filter: 'blur(120px)', opacity: 0.12, top: '-10%', right: '-5%', animation: 'pwOrbFloat 12s ease-in-out infinite' }} />
      <div className="absolute z-0 pointer-events-none" style={{ width: 400, height: 400, borderRadius: '50%', background: '#8B5CF6', filter: 'blur(120px)', opacity: 0.12, bottom: '-8%', left: '-5%', animation: 'pwOrbFloat 12s ease-in-out infinite', animationDelay: '-4s' }} />

      <Sidebar />

      <main className="flex-1 relative z-10 flex flex-col min-w-0">

        {/* Header + Search */}
        <div className="pl-6 pr-8 pt-8 pb-5 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-[26px] font-bold tracking-tight" style={{ color: '#E5E2E1' }}>Submissions</h1>
            <p className="mt-1 text-[13px]" style={{ color: '#6B7280' }}>Review talent submissions in kanban view.</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search submissions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none text-[13px] w-48"
                style={{ color: '#D1D5DB' }}
              />
            </div>
            {/* Total count */}
            <span className="text-[12px] px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#6B7280', border: '1px solid rgba(255,255,255,0.06)' }}>
              {submissions.length} total
            </span>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 flex gap-5 pl-6 pr-8 pb-8 overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>

          {grouped.map((col) => (
            <div key={col.key} className="flex flex-col rounded-2xl flex-1 min-w-[320px]"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}>

              {/* Column header - sticky */}
              <div className="flex items-center justify-between px-5 py-4 border-b shrink-0"
                style={{ borderColor: 'rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 5, background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(12px)', borderRadius: '16px 16px 0 0' }}>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: col.color }} />
                  <h3 className="text-[14px] font-semibold" style={{ color: '#E5E2E1' }}>{col.label}</h3>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-[3px] rounded-full"
                  style={{ background: col.bg, color: col.color, border: `1px solid ${col.border}` }}>
                  {col.items.length}
                </span>
              </div>

              {/* Scrollable cards */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.06) transparent', minHeight: '200px' }}>
                {col.items.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-[13px]" style={{ color: '#4B5563' }}>
                    No submissions
                  </div>
                ) : (
                  col.items.map((sub) => {
                    const t  = sub.taskId || {};
                    const ta = sub.talentId || {};
                    const isActive = selected?._id === sub._id;

                    return (
                      <button key={sub._id}
                        onClick={() => setSelected(sub)}
                        className="w-full text-left p-4 rounded-xl cursor-pointer transition-all duration-200 flex flex-col gap-3 border-none"
                        style={{
                          background: isActive ? 'rgba(59,130,246,0.1)' : 'rgba(255,255,255,0.03)',
                          border: isActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.05)',
                          boxShadow: isActive ? '0 4px 24px rgba(59,130,246,0.1)' : 'none',
                        }}>

                        {/* Task title */}
                        <p className="text-[14px] font-semibold leading-snug" style={{ color: isActive ? '#F0F0F0' : '#D1D5DB' }}>
                          {t.title || 'Untitled Task'}
                        </p>

                        {/* Description hint */}
                        {sub.notes && (
                          <p className="text-[12px] leading-relaxed line-clamp-2" style={{ color: '#6B7280' }}>
                            {sub.notes}
                          </p>
                        )}

                        {/* Tags row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {t.status && (
                            <span className="text-[10px] font-semibold px-2 py-[2px] rounded-full"
                              style={{ background: 'rgba(255,255,255,0.05)', color: '#9CA3AF' }}>
                              {t.status}
                            </span>
                          )}
                          {sub.fileUrl && (
                            <span className="text-[10px] font-semibold px-2 py-[2px] rounded-full flex items-center gap-1"
                              style={{ background: 'rgba(59,130,246,0.08)', color: '#60A5FA' }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                              </svg>
                              File
                            </span>
                          )}
                        </div>

                        {/* Footer: talent + date */}
                        <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                          <div className="flex items-center gap-2">
                            <Avatar name={ta.name} size="sm" variant="talent" />
                            <span className="text-[12px] font-medium" style={{ color: '#9CA3AF' }}>{ta.name || 'Unknown'}</span>
                          </div>
                          <span className="text-[11px]" style={{ color: '#4B5563' }}>{formatRelative(sub.createdAt)}</span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Detail Slide-Over Panel ── */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex justify-end" onClick={() => setSelected(null)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Panel */}
          <div className="relative w-full max-w-lg flex flex-col animate-slide-in-right"
            style={{
              background: 'rgba(13,13,13,0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderLeft: '1px solid rgba(255,255,255,0.06)',
            }}
            onClick={(e) => e.stopPropagation()}>

            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5 border-b shrink-0"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3">
                <h2 className="text-[17px] font-semibold" style={{ color: '#E5E2E1' }}>
                  {task.title || 'Untitled Task'}
                </h2>
                <span className="text-[11px] font-semibold px-2.5 py-[3px] rounded-full"
                  style={{ background: selectedCol.bg, color: selectedCol.color, border: `1px solid ${selectedCol.border}` }}>
                  {selectedStatus}
                </span>
              </div>
              <button onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-all border-none"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#6B7280' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>

              {/* Talent card */}
              <div className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Avatar name={talent.name} size="lg" variant="talent" />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold" style={{ color: '#E5E2E1' }}>{talent.name || 'Unknown Talent'}</p>
                  <p className="text-[12px] mt-0.5" style={{ color: '#6B7280' }}>{talent.email || '—'}</p>
                </div>
              </div>

              {/* Task details */}
              <div className="p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.8px] mb-3" style={{ color: '#4B5563' }}>Task Details</p>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px]" style={{ color: '#6B7280' }}>Status</span>
                    <span className="text-[12px] font-medium px-2 py-[2px] rounded-full"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#D1D5DB' }}>
                      {task.status || '—'}
                    </span>
                  </div>
                  {task.dueDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-[12px]" style={{ color: '#6B7280' }}>Due Date</span>
                      <span className="text-[12px] font-medium" style={{ color: '#D1D5DB' }}>{task.dueDate}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px]" style={{ color: '#6B7280' }}>Submitted</span>
                    <span className="text-[12px] font-medium" style={{ color: '#D1D5DB' }}>{formatDate(selected.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.8px] mb-2" style={{ color: '#4B5563' }}>Submission Notes</p>
                {selected.notes ? (
                  <p className="text-[14px] leading-relaxed" style={{ color: '#D1D5DB' }}>{selected.notes}</p>
                ) : (
                  <p className="text-[13px] italic" style={{ color: '#4B5563' }}>No notes provided.</p>
                )}
              </div>

              {/* File */}
              <div className="p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.8px] mb-3" style={{ color: '#4B5563' }}>Submitted File</p>
                {selected.fileUrl ? (
                  <a href={selected.fileUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
                    style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span className="text-[13px] font-medium truncate flex-1" style={{ color: '#60A5FA' }}>
                      {selected.fileUrl.split('/').pop()}
                    </span>
                    <span className="text-[11px] shrink-0" style={{ color: '#4B5563' }}>Open ↗</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    <span className="text-[13px] italic" style={{ color: '#4B5563' }}>No file attached.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons - sticky bottom */}
            <div className="flex gap-3 px-6 py-5 border-t shrink-0"
              style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(10,10,10,0.95)' }}>
              <button onClick={() => handleReview('Rejected')}
                disabled={reviewing || selectedStatus === 'Rejected'}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-200 border-none"
                style={{
                  background: selectedStatus === 'Rejected' ? 'rgba(248,113,113,0.2)' : 'rgba(248,113,113,0.1)',
                  color: '#F87171',
                  opacity: reviewing ? 0.5 : 1,
                }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Reject
              </button>
              <button onClick={() => handleReview('Approved')}
                disabled={reviewing || selectedStatus === 'Approved'}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold cursor-pointer transition-all duration-200 border-none"
                style={{
                  background: selectedStatus === 'Approved' ? 'rgba(52,211,153,0.2)' : 'rgba(52,211,153,0.1)',
                  color: '#34D399',
                  opacity: reviewing ? 0.5 : 1,
                }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsPage;
