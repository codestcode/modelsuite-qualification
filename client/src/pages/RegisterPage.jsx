import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { RetroGrid } from '@/components/ui/retro-grid';

const inputCls = 'w-full px-4 py-3 rounded-[10px] text-[15px] font-sans outline-none transition-all duration-200';
const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.6px] transition-colors duration-200';

const RegisterPage = () => {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]       = useState('Talent');
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/register', { name, email, password, role });
      login(data);
      data.role === 'Admin' ? navigate('/admin/dashboard') : navigate('/profile-setup');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-split-page">
      {/* Full-page Retro Grid background */}
      <RetroGrid className="opacity-30 auth-retro-bg" />

      {/* ── Left: Form panel ── */}
      <div className="auth-split-left">
        <div className="auth-card">
          <div className="auth-card-inner">

            {/* Logo */}
            <div className="mb-5 animate-fade-up" style={{ animationDelay: '0.05s', animationFillMode: 'both' }}>
              <img src="/modelsuite-talents.png" alt="Logo" className="w-44 h-auto object-contain mx-auto block" />
            </div>

            {/* Header */}
            <div className="text-center mb-5 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
              <h1 className="text-[24px] font-bold tracking-tight mb-1" style={{ color: '#F0F0F0' }}>Assessment Portal</h1>
              <p className="text-[13px]" style={{ color: '#6B7280' }}>Create your intern account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 animate-fade-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
              <div className="flex flex-col gap-1.5 group">
                <label className={labelCls} htmlFor="name" style={{ color: '#6B7280' }}>Full Name</label>
                <input id="name" type="text" placeholder="Jane Doe"
                  value={name} onChange={(e) => setName(e.target.value)} required
                  className={inputCls}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#F0F0F0' }} />
              </div>

              <div className="flex flex-col gap-1.5 group">
                <label className={labelCls} htmlFor="reg-email" style={{ color: '#6B7280' }}>Email address</label>
                <input id="reg-email" type="email" placeholder="you@company.com"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                  className={inputCls}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#F0F0F0' }} />
              </div>

              <div className="flex flex-col gap-1.5 group">
                <label className={labelCls} htmlFor="reg-password" style={{ color: '#6B7280' }}>Password</label>
                <input id="reg-password" type="password" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                  className={inputCls}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#F0F0F0' }} />
              </div>

              <div className="flex flex-col gap-1.5 group">
                <label className={labelCls} htmlFor="role" style={{ color: '#6B7280' }}>Role</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}
                  className={`${inputCls} cursor-pointer`}
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#F0F0F0' }}>
                  <option value="Talent">Talent</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <button type="submit"
                className="mt-2 w-full py-3 rounded-[10px] text-[15px] font-semibold text-white cursor-pointer btn-gradient border-none hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
                Setup Profile
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-[13px] text-center animate-fade-up" style={{ color: '#6B7280', animationDelay: '0.2s', animationFillMode: 'both' }}>
              Profile already configured?{' '}
              <Link to="/login" className="font-medium hover:underline transition-all duration-200" style={{ color: '#3B82F6' }}>
                Access portal
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: Visual panel ── */}
      <div className="auth-split-right">

        {/* Top Right Info Icon */}
        <div className="absolute top-12 right-12 group z-50">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-help"
            style={{ color: '#6B7280' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          <div className="absolute right-0 top-14 w-[340px] p-6 rounded-2xl bg-[#0D0D0D]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] opacity-0 translate-y-3 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300">
            <h3 className="text-white font-bold text-[15px] mb-4 font-display">Intern Selection Flow</h3>
            <ol className="flex flex-col gap-4 relative">
              <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-white/10 rounded-full"/>
              <li className="flex items-start gap-4 relative opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-100">
                <div className="w-[20px] h-[20px] rounded-full bg-[#10B981] flex-shrink-0 mt-0.5 border-[3px] border-[#0D0D0D] relative z-10 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse"/>
                <div>
                  <p className="text-[13px] font-semibold text-white">1. Start Working</p>
                  <p className="text-[12px] mt-1 leading-relaxed" style={{ color: '#6B7280' }}>Review your pre-assigned issues and begin development.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 relative opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-200">
                <div className="w-[20px] h-[20px] rounded-full bg-[#3B82F6] flex-shrink-0 mt-0.5 border-[3px] border-[#0D0D0D] relative z-10 shadow-[0_0_12px_rgba(59,130,246,0.5)] animate-pulse" style={{ animationDelay: '0.2s' }}/>
                <div>
                  <p className="text-[13px] font-semibold text-white">2. Resolve & Push</p>
                  <p className="text-[12px] mt-1 leading-relaxed" style={{ color: '#6B7280' }}>Fix the issue in code and submit a Pull Request.</p>
                </div>
              </li>
              <li className="flex items-start gap-4 relative opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 delay-300">
                <div className="w-[20px] h-[20px] rounded-full bg-[#8B5CF6] flex-shrink-0 mt-0.5 border-[3px] border-[#0D0D0D] relative z-10 shadow-[0_0_12px_rgba(139,92,246,0.5)] animate-pulse" style={{ animationDelay: '0.4s' }}/>
                <div>
                  <p className="text-[13px] font-semibold text-white">3. Core Review</p>
                  <p className="text-[12px] mt-1 leading-relaxed" style={{ color: '#6B7280' }}>The core team reviews your PR to make a hiring decision.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div className="relative z-10 max-w-[480px] w-full">
          <div className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md animate-fade-up" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>Open Registration</span>
          </div>
          <h2 className="text-[48px] font-extrabold leading-[1.1] tracking-tight mb-5 animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <span style={{ color: '#F0F0F0' }}>Begin Your</span><br/>
            <span className="gradient-text">Assessment.</span>
          </h2>
          <p className="text-[15px] leading-[1.7] mb-14 animate-fade-up" style={{ color: '#9CA3AF', animationDelay: '0.35s', animationFillMode: 'both' }}>
            Register to access your assigned tasks. Solve issues, submit your PRs, and prove your skills.
          </p>
          <div className="grid grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
            {[
              { num: 'Code', label: 'Resolve Issues', icon: '⟨/⟩', color: '#10B981' },
              { num: 'Push', label: 'Submit PRs', icon: '⬆', color: '#3B82F6' },
              { num: 'Win', label: 'Get Selected', icon: '★', color: '#F59E0B' },
            ].map(({ num, label, icon, color }) => (
              <div key={label} className="group relative rounded-2xl p-5 border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300 cursor-default overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at 50% 0%, ${color}10, transparent 70%)` }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>{label}</span>
                    <span className="text-sm" style={{ color }}>{icon}</span>
                  </div>
                  <span className="text-[26px] font-bold tracking-tight" style={{ color: '#F0F0F0' }}>{num}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee */}
        <div className="absolute bottom-16 left-0 w-full overflow-hidden animate-fade-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <div className="animate-marquee flex gap-16">
            {['Production Grade System', 'Scalable Apps', 'Streamline Development', 'Enterprise Security', 'Cloud Native', 'High Performance', 'Production Grade System', 'Scalable Apps', 'Streamline Development', 'Enterprise Security', 'Cloud Native', 'High Performance'].map((word, i) => (
              <span key={i} className="text-[13px] md:text-[15px] font-bold uppercase tracking-[0.25em] whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.2)' }}>
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
