import { useState, useMemo } from 'react';
import TaskCard from './TaskCard';

const FILTERS = [
  { key: 'all',   label: 'All Tasks',    icon: '⬡' },
  { key: 'design', label: 'Design',      icon: '◆' },
  { key: 'code',   label: 'Development', icon: '⟨/⟩' },
  { key: 'writing', label: 'Writing',    icon: '✎' },
  { key: 'research', label: 'Research',  icon: '◎' },
];

function categorize(title = '') {
  const t = title.toLowerCase();
  if (/design|ui|ux|figma|logo|brand|visual|mockup|wireframe/.test(t)) return 'design';
  if (/code|dev|api|bug|fix|build|frontend|backend|fullstack|engineer|program/.test(t)) return 'code';
  if (/writ|copy|content|blog|article|text/.test(t)) return 'writing';
  if (/research|analysis|data|survey|report|investigate/.test(t)) return 'research';
  return 'default';
}

const AvailableTasksList = ({ tasks, onClaimed }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let result = tasks || [];
    if (activeFilter !== 'all') {
      result = result.filter((t) => categorize(t.title) === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [tasks, activeFilter, searchQuery]);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state-marketplace flex flex-col items-center justify-center py-16 px-6">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-2xl mb-4">
          ✦
        </div>
        <p className="text-[15px] font-semibold text-text-primary mb-1 font-display">No open tasks</p>
        <p className="text-[13px] text-text-muted">Check back later — new tasks are posted regularly.</p>
      </div>
    );
  }

  return (
    <div className="available-tasks-marketplace">

      {/* ── Filter bar ── */}
      <div className="filter-bar flex items-center gap-3 mb-6 overflow-x-auto pb-1">
        {/* Search */}
        <div className="relative shrink-0">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[16px] text-text-faint pointer-events-none">⌕</span>
          <input
            type="text"
            placeholder="Search tasks…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar-marketplace pl-10 pr-5 py-3 rounded-xl text-[14px] w-72"
          />
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`filter-pill shrink-0 inline-flex items-center gap-2 ${
                activeFilter === f.key
                  ? 'filter-pill-active'
                  : 'filter-pill-inactive'
              }`}
            >
              <span className="text-[15px]">{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results count ── */}
      <div className="flex items-center gap-2 mb-4 px-0.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-faint">
          Showing {filtered.length} {filtered.length === 1 ? 'task' : 'tasks'}
        </span>
        {(activeFilter !== 'all' || searchQuery) && (
          <button
            onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
            className="text-[11px] text-primary hover:text-primary-dark font-medium transition-colors cursor-pointer bg-transparent border-none"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Empty filter state ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <p className="text-[14px] text-text-muted mb-1">No tasks match your search</p>
          <p className="text-[12px] text-text-faint">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        /* ── Masonry-style grid ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((task, i) => (
            <div
              key={task._id}
              className="card-stagger"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <TaskCard task={task} showClaimButton onClaimed={onClaimed} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableTasksList;
