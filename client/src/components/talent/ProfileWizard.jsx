import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles, User, Code2, Heart, Trophy,
  Atom, Server, TerminalSquare, Braces, Coffee,
  Hexagon, Cog, Database, Box, Cloud,
  PenTool, GitBranch, Diamond, Wind, Flame,
  Monitor, Container, BarChart3, Smartphone, Shield, Brain,
} from 'lucide-react';
import Stepper, { Step } from '../ui/Stepper';
import './ProfileWizard.css';

const SKILL_OPTIONS = [
  { id: 'react',       label: 'React',        Icon: Atom },
  { id: 'node',        label: 'Node.js',      Icon: Server },
  { id: 'python',      label: 'Python',       Icon: TerminalSquare },
  { id: 'typescript',  label: 'TypeScript',   Icon: Braces },
  { id: 'java',        label: 'Java',         Icon: Coffee },
  { id: 'go',          label: 'Go',           Icon: Hexagon },
  { id: 'rust',        label: 'Rust',         Icon: Cog },
  { id: 'sql',         label: 'SQL',          Icon: Database },
  { id: 'docker',      label: 'Docker',       Icon: Box },
  { id: 'aws',         label: 'AWS',          Icon: Cloud },
  { id: 'figma',       label: 'Figma',        Icon: PenTool },
  { id: 'git',         label: 'Git',          Icon: GitBranch },
  { id: 'graphql',     label: 'GraphQL',      Icon: Diamond },
  { id: 'tailwind',    label: 'Tailwind',     Icon: Wind },
  { id: 'vue',         label: 'Vue',          Icon: Hexagon },
  { id: 'svelte',      label: 'Svelte',       Icon: Flame },
];

const INTEREST_OPTIONS = [
  { id: 'frontend',   label: 'Frontend',    Icon: Monitor,    desc: 'UI/UX & client-side' },
  { id: 'backend',    label: 'Backend',     Icon: Server,     desc: 'APIs & server logic' },
  { id: 'devops',     label: 'DevOps',      Icon: Container,  desc: 'CI/CD & infrastructure' },
  { id: 'data',       label: 'Data Science', Icon: BarChart3,  desc: 'ML, analytics & viz' },
  { id: 'mobile',     label: 'Mobile',      Icon: Smartphone, desc: 'iOS, Android & cross' },
  { id: 'security',   label: 'Security',    Icon: Shield,     desc: 'AppSec & pentesting' },
  { id: 'cloud',      label: 'Cloud',       Icon: Cloud,      desc: 'AWS, GCP & Azure' },
  { id: 'ai',         label: 'AI / ML',     Icon: Brain,      desc: 'Models & inference' },
];

const EXPERIENCE_LEVELS = [
  { id: 'student',  label: 'Student',      desc: 'Learning the ropes' },
  { id: 'junior',   label: 'Junior',       desc: '0–2 years' },
  { id: 'mid',      label: 'Mid-Level',    desc: '2–5 years' },
  { id: 'senior',   label: 'Senior',       desc: '5+ years' },
];

const AVATAR_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#10B981',
  '#F59E0B', '#EF4444', '#06B6D4', '#6366F1',
];

const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.6px] text-text-muted';

/* ═══════════════════════════════════════
   Step 1 — Welcome
═══════════════════════════════════════ */
const WelcomeStep = ({ profile, setProfile }) => {
  const { user } = useAuth();
  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="pw-step-inner pw-welcome">
      <div className="pw-welcome-top">
        <div className="pw-welcome-greeting">
          <span className="pw-sparkle">✦</span>
          Welcome aboard!
        </div>
        <h2 className="pw-welcome-name">
          Let's set up your profile,{' '}
          <span className="pw-name-highlight">{user?.name?.split(' ')[0] || 'there'}</span>
        </h2>
        <p className="pw-welcome-sub">
          This takes less than a minute. Pick your avatar color and we'll get you started.
        </p>
      </div>

      <div className="pw-avatar-section">
        <div
          className="pw-avatar-preview"
          style={{ background: `linear-gradient(135deg, ${profile.avatarColor}, ${profile.avatarColor}88)` }}
        >
          <span className="pw-avatar-initials">{initials}</span>
        </div>

        <div className="pw-color-picker">
          <span className={labelCls}>Pick your color</span>
          <div className="pw-color-row">
            {AVATAR_COLORS.map((c) => (
              <button
                key={c}
                className={`pw-color-swatch ${profile.avatarColor === c ? 'pw-swatch-active' : ''}`}
                style={{ '--swatch-color': c }}
                onClick={() => setProfile((p) => ({ ...p, avatarColor: c }))}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pw-name-field">
        <label className={labelCls}>Display Name</label>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
          placeholder="Your name"
          className="w-full bg-bg-input border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary outline-none placeholder:text-[#4e4a6e] focus:border-primary focus:ring-[3px] focus:ring-primary/20 transition-all duration-200 font-sans hover:border-border-light"
        />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   Step 2 — About You
═══════════════════════════════════════ */
const AboutStep = ({ profile, setProfile }) => (
  <div className="pw-step-inner pw-about">
    <div className="pw-step-header">
      <h3 className="pw-step-heading">Tell us about yourself</h3>
      <p className="pw-step-desc">Share a brief bio and your experience level so we can personalize your feed.</p>
    </div>

    <div className="pw-field-group">
      <label className={labelCls}>Short Bio</label>
      <textarea
        value={profile.bio}
        onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
        placeholder="e.g. Full-stack developer passionate about building elegant UIs..."
        rows={3}
        className="w-full bg-bg-input border border-border rounded-[10px] px-4 py-3 text-[15px] text-text-primary outline-none placeholder:text-[#4e4a6e] focus:border-primary focus:ring-[3px] focus:ring-primary/20 transition-all duration-200 font-sans hover:border-border-light pw-textarea"
      />
      <span className="pw-char-count">{profile.bio.length}/200</span>
    </div>

    <div className="pw-field-group">
      <label className={labelCls}>Experience Level</label>
      <div className="pw-pill-grid pw-pill-grid-4">
        {EXPERIENCE_LEVELS.map((lvl) => (
          <button
            key={lvl.id}
            className={`pw-pill ${profile.experienceLevel === lvl.id ? 'pw-pill-active' : ''}`}
            onClick={() => setProfile((p) => ({ ...p, experienceLevel: lvl.id }))}
          >
            <span className="pw-pill-label">{lvl.label}</span>
            <span className="pw-pill-sublabel">{lvl.desc}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════
   Step 3 — Skills
═══════════════════════════════════════ */
const SkillsStep = ({ profile, toggleSkill }) => (
  <div className="pw-step-inner pw-skills">
    <div className="pw-step-header">
      <h3 className="pw-step-heading">Select your skills</h3>
      <p className="pw-step-desc">Pick the technologies you're most comfortable with.</p>
    </div>

    <div className="pw-skill-grid">
      {SKILL_OPTIONS.map((skill, i) => (
        <button
          key={skill.id}
          className={`pw-skill-pill ${profile.skills.includes(skill.id) ? 'pw-skill-active' : ''}`}
          onClick={() => toggleSkill(skill.id)}
          style={{ animationDelay: `${0.03 * i}s` }}
        >
          <skill.Icon size={18} className="pw-skill-icon" />
          <span className="pw-skill-label">{skill.label}</span>
          {profile.skills.includes(skill.id) && (
            <span className="pw-skill-check">✓</span>
          )}
        </button>
      ))}
    </div>

    <div className="pw-selected-count">
      {profile.skills.length} skill{profile.skills.length !== 1 ? 's' : ''} selected
    </div>
  </div>
);

/* ═══════════════════════════════════════
   Step 4 — Interests
═══════════════════════════════════════ */
const InterestsStep = ({ profile, toggleInterest }) => (
  <div className="pw-step-inner pw-interests">
    <div className="pw-step-header">
      <h3 className="pw-step-heading">What interests you?</h3>
      <p className="pw-step-desc">Choose the areas you'd love to work on.</p>
    </div>

    <div className="pw-interest-grid">
      {INTEREST_OPTIONS.map((interest, i) => (
        <button
          key={interest.id}
          className={`pw-interest-card ${profile.interests.includes(interest.id) ? 'pw-interest-active' : ''}`}
          onClick={() => toggleInterest(interest.id)}
          style={{ animationDelay: `${0.04 * i}s` }}
        >
          <interest.Icon size={22} className="pw-interest-icon" />
          <span className="pw-interest-label">{interest.label}</span>
          <span className="pw-interest-desc">{interest.desc}</span>
          {profile.interests.includes(interest.id) && (
            <span className="pw-interest-check">✓</span>
          )}
        </button>
      ))}
    </div>

    <div className="pw-selected-count">
      {profile.interests.length} interest{profile.interests.length !== 1 ? 's' : ''} selected
    </div>
  </div>
);

/* ═══════════════════════════════════════
   Step 5 — Complete
═══════════════════════════════════════ */
const CompleteStep = ({ profile }) => {
  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const confettiPieces = useMemo(() =>
    Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      angle: (i * 137.5) % 360,
      distance: 80 + (i * 37) % 120,
      delay: (i * 0.017) % 0.4,
      color: AVATAR_COLORS[i % AVATAR_COLORS.length],
      rotate: (i * 47) % 360,
    })),
    []);

  return (
    <div className="pw-step-inner pw-complete">
      <div className="pw-confetti-container">
        {confettiPieces.map((p) => (
          <div
            key={p.id}
            className="pw-confetti-piece"
            style={{
              '--c-angle': `${p.angle}deg`,
              '--c-distance': `${p.distance}px`,
              '--c-delay': `${p.delay}s`,
              '--c-color': p.color,
              '--c-rotate': `${p.rotate}deg`,
            }}
          />
        ))}
      </div>

      <div className="pw-complete-avatar-wrapper">
        <div
          className="pw-complete-avatar"
          style={{ background: `linear-gradient(135deg, ${profile.avatarColor}, ${profile.avatarColor}88)` }}
        >
          <span className="pw-avatar-initials">{initials}</span>
        </div>
        <div className="pw-complete-ring" style={{ borderColor: profile.avatarColor }} />
      </div>

      <h3 className="pw-complete-heading">You're all set!</h3>
      <p className="pw-complete-desc">
        Your profile is ready. You can now access your dashboard and start exploring tasks tailored to your skills.
      </p>

      <div className="pw-summary-chips">
        {profile.skills.slice(0, 4).map((s) => {
          const skill = SKILL_OPTIONS.find((sk) => sk.id === s);
          return skill ? (
            <span key={s} className="pw-summary-chip"><skill.Icon size={14} /> {skill.label}</span>
          ) : null;
        })}
        {profile.skills.length > 4 && (
          <span className="pw-summary-chip pw-summary-more">+{profile.skills.length - 4} more</span>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   Main Wizard Component
═══════════════════════════════════════ */
const ProfileWizard = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: user?.name || '',
    bio: '',
    avatarColor: AVATAR_COLORS[0],
    experienceLevel: '',
    skills: [],
    interests: [],
  });

  const toggleArrayItem = (field, itemId) => {
    setProfile((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(itemId)
          ? arr.filter((i) => i !== itemId)
          : [...arr, itemId],
      };
    });
  };

  const handleComplete = () => {
    login({ ...user, profileComplete: true });
    navigate('/talent/dashboard');
  };

  return (
    <div className="pw-wrapper">
      {/* Background orbs */}
      <div className="pw-bg-orb pw-bg-orb-1" />
      <div className="pw-bg-orb pw-bg-orb-2" />
      <div className="pw-bg-orb pw-bg-orb-3" />

      <Stepper
        initialStep={1}
        onStepChange={() => {}}
        onFinalStepCompleted={handleComplete}
        nextButtonText="Continue"
        backButtonText="Back"
        stepIcons={[<Sparkles size={16} />, <User size={16} />, <Code2 size={16} />, <Heart size={16} />, <Trophy size={16} />]}
      >
        <Step>
          <WelcomeStep profile={profile} setProfile={setProfile} />
        </Step>
        <Step>
          <AboutStep profile={profile} setProfile={setProfile} />
        </Step>
        <Step>
          <SkillsStep profile={profile} toggleSkill={(id) => toggleArrayItem('skills', id)} />
        </Step>
        <Step>
          <InterestsStep profile={profile} toggleInterest={(id) => toggleArrayItem('interests', id)} />
        </Step>
        <Step>
          <CompleteStep profile={profile} />
        </Step>
      </Stepper>
    </div>
  );
};

export default ProfileWizard;
