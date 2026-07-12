import { useEffect, useState } from 'react';
import TalentSidebar from '../../components/talent/TalentSidebar';
import AvailableTasksList from '../../components/talent/AvailableTasksList';
import MyTasksList from '../../components/talent/MyTasksList';
import { fetchAvailableTasks, fetchMyTasks } from '../../api/talent';

const TalentTasks = () => {
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myTasks, setMyTasks]               = useState([]);
  const [error, setError] = useState(null);

  const loadAvailable = async () => {
    try { const { data } = await fetchAvailableTasks(); setAvailableTasks(data); }
    catch { setError('Failed to load available tasks'); }
  };

  const loadMyTasks = async () => {
    try { const { data } = await fetchMyTasks(); setMyTasks(data); }
    catch { setError('Failed to load your tasks'); }
  };

  // eslint-disable-next-line
  useEffect(() => { loadAvailable(); loadMyTasks(); }, []);
  const handleRefresh = () => { loadAvailable(); loadMyTasks(); };

  return (
    <div className="page-bg flex min-h-screen">
      {/* Background orbs */}
      <div className="absolute z-0 pointer-events-none" style={{ width: 500, height: 500, borderRadius: '50%', background: '#3B82F6', filter: 'blur(120px)', opacity: 0.12, top: '-10%', right: '-5%', animation: 'pwOrbFloat 12s ease-in-out infinite' }} />
      <div className="absolute z-0 pointer-events-none" style={{ width: 400, height: 400, borderRadius: '50%', background: '#8B5CF6', filter: 'blur(120px)', opacity: 0.12, bottom: '-8%', left: '-5%', animation: 'pwOrbFloat 12s ease-in-out infinite', animationDelay: '-4s' }} />
      <div className="absolute z-0 pointer-events-none" style={{ width: 300, height: 300, borderRadius: '50%', background: '#EC4899', filter: 'blur(120px)', opacity: 0.06, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: 'pwOrbFloat 12s ease-in-out infinite', animationDelay: '-8s' }} />
      <TalentSidebar />

      <main className="ml-[244px] flex-1 pl-6 pr-8 py-8 relative z-10" style={{ maxWidth: 'calc(100vw - 244px)' }}>

        {/* Header */}
        <div className="mb-7 page-section">
          <h1 className="text-[22px] font-semibold tracking-tight"
            style={{ color: '#F0F0F0', fontFamily: 'Space Grotesk, sans-serif' }}>
            My Tasks
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: '#6B7280' }}>
            Track your claimed tasks and submit work for review.
          </p>
        </div>

        {error && (
          <p className="text-[13px] mb-4 px-4 py-3 rounded-lg"
            style={{ color: '#F87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </p>
        )}

        {/* My Tasks */}
        <section className="mb-7 page-section">
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>
              Claimed Tasks
            </h2>
            <span className="text-[10.5px] px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#6B7280',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
              {myTasks.length}
            </span>
          </div>
          <MyTasksList tasks={myTasks} onRefresh={handleRefresh} />
        </section>

        {/* Available Tasks */}
        <section className="mb-7 page-section">
          <div className="flex items-center gap-2.5 mb-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.1em]"
              style={{ color: '#4B5563', fontFamily: 'Inter, sans-serif' }}>
              Available Tasks
            </h2>
            <span className="text-[10.5px] px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: '#6B7280',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
              {availableTasks.length}
            </span>
          </div>
          <AvailableTasksList tasks={availableTasks} onClaimed={handleRefresh} />
        </section>
      </main>
    </div>
  );
};

export default TalentTasks;
