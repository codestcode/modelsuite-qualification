import { useState } from 'react';
import { claimTask } from '../../api/talent';

const CATEGORY_CONFIG = {
  design:   { label: 'Design',   icon: '◆', color: '#A78BFA', gradient: 'from-violet-500/20 to-purple-600/10' },
  code:     { label: 'Dev',      icon: '⟨/⟩', color: '#60A5FA', gradient: 'from-blue-500/20 to-cyan-500/10' },
  writing:  { label: 'Writing',  icon: '✎', color: '#F472B6', gradient: 'from-pink-500/20 to-rose-500/10' },
  research: { label: 'Research', icon: '◎', color: '#34D399', gradient: 'from-emerald-500/20 to-teal-500/10' },
  default:  { label: 'General',  icon: '⬡', color: '#FBBF24', gradient: 'from-amber-500/20 to-yellow-500/10' },
};

function categorize(title = '') {
  const t = title.toLowerCase();
  if (/design|ui|ux|figma|logo|brand|visual|mockup|wireframe/.test(t)) return 'design';
  if (/code|dev|api|bug|fix|build|frontend|backend|fullstack|engineer|program/.test(t)) return 'code';
  if (/writ|copy|content|blog|article|文案|text/.test(t)) return 'writing';
  if (/research|analysis|data|survey|report|investigate/.test(t)) return 'research';
  return 'default';
}

const TaskCard = ({ task, showClaimButton = false, onClaimed }) => {
  const [claiming, setClaiming] = useState(false);
  const cat = categorize(task.title);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      await claimTask(task._id);
      if (onClaimed) onClaimed();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim task');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="task-card-marketplace glass3d group relative flex flex-col rounded-2xl overflow-hidden">

      {/* Gradient accent top bar */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, ${CATEGORY_CONFIG[cat].color}88, ${CATEGORY_CONFIG[cat].color}22)` }}
      />

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 gap-3.5">

        {/* Top row: category pill + bounty */}
        <div className="flex items-center justify-between">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold tracking-wide uppercase"
            style={{
              background: `${CATEGORY_CONFIG[cat].color}14`,
              color: CATEGORY_CONFIG[cat].color,
              border: `1px solid ${CATEGORY_CONFIG[cat].color}25`,
            }}
          >
            <span className="text-[13px] leading-none">{CATEGORY_CONFIG[cat].icon}</span>
            {CATEGORY_CONFIG[cat].label}
          </span>

          {/* Bounty badge — visual reward indicator */}
          <div className="bounty-badge flex items-center gap-1 px-2 py-1 rounded-lg">
            <span className="text-[13px]">✦</span>
            <span className="text-[11px] font-bold tracking-wide uppercase text-text-muted">
              Bounty
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-semibold text-text-primary leading-snug font-display line-clamp-2 min-h-[48px]">
          {task.title || 'Untitled Task'}
        </h3>

        {/* Description */}
        {task.description && (
          <p className="text-[14px] text-text-muted leading-relaxed line-clamp-3">
            {task.description}
          </p>
        )}

        {/* Meta footer */}
        <div className="flex items-center justify-between flex-wrap gap-2 mt-auto pt-3 border-t border-white/[0.04]">
          <div className="flex items-center gap-3">
            {task.dueDate && (
              <span className="inline-flex items-center gap-1 text-[12px] text-text-faint">
                <span className="text-[13px] opacity-60">◷</span>
                {task.dueDate}
              </span>
            )}
            {task.createdBy?.name && (
              <span className="inline-flex items-center gap-1 text-[11px] text-text-faint">
                <span className="text-[12px] opacity-60">●</span>
                {task.createdBy.name}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.04] text-text-faint border border-white/[0.06] uppercase tracking-widest">
            Open
          </span>
        </div>

        {/* Claim button */}
        {showClaimButton && (
          <button
            onClick={handleClaim}
            disabled={claiming}
            className="claim-btn relative w-full py-3 mt-1 rounded-xl text-[13px] font-bold tracking-wide text-white cursor-pointer overflow-hidden disabled:opacity-60 disabled:cursor-wait"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {claiming ? (
                <>
                  <span className="claim-spinner" />
                  Claiming…
                </>
              ) : (
                <>Claim Task →</>
              )}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
