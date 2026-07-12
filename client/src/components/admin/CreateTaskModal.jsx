import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createTask, fetchTalents } from '../../api/tasks';

const STATUS_OPTIONS = ['Open', 'Claimed', 'Submitted', 'Approved', 'Rejected'];

const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.5px]';
const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#E5E2E1',
};
const inputFocus = (e) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; };
const inputBlur  = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; };

const CreateTaskModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({ title: '', description: '', status: 'Open', assignedTo: '', dueDate: '' });
  const [talents, setTalents] = useState([]);
  const [loadingTalents, setLoadingTalents] = useState(true);

  useEffect(() => {
    fetchTalents()
      .then(({ data }) => setTalents(data))
      .catch(() => alert('Failed to load talents'))
      .finally(() => setLoadingTalents(false));
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await createTask({ ...form, assignedTo: form.assignedTo || undefined });
      onCreated(data);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task');
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-[200] p-6"
      onClick={onClose}>
      <div className="modal-glass w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <h2 className="text-[17px] font-semibold" style={{ color: '#F0F0F0', fontFamily: 'Outfit, sans-serif' }}>Create New Task</h2>
          <button onClick={onClose}
            className="bg-transparent border-none text-[#6B7280] text-base cursor-pointer px-2 py-1 rounded-md hover:bg-white/[0.06] hover:text-white transition-all">✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-[18px]">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls} style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>Title</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Design landing page mockup"
              className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none transition-all font-sans"
              style={inputStyle}
              onFocus={inputFocus} onBlur={inputBlur} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls} style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} placeholder="Describe the task deliverables..."
              className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none transition-all font-sans resize-y"
              style={inputStyle}
              onFocus={inputFocus} onBlur={inputBlur} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls} style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none cursor-pointer font-sans custom-select"
                style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls} style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>Due Date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange}
                className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none transition-all font-sans"
                style={inputStyle}
                onFocus={inputFocus} onBlur={inputBlur} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls} style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>Assign To</label>
            <select name="assignedTo" value={form.assignedTo} onChange={handleChange}
              className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none cursor-pointer font-sans custom-select"
              style={inputStyle} onFocus={inputFocus} onBlur={inputBlur}>
              <option value="">— Unassigned —</option>
              {loadingTalents
                ? <option disabled>Loading...</option>
                : talents.map((t) => <option key={t._id} value={t._id}>{t.name} ({t.email})</option>)}
            </select>
          </div>

          <div className="flex justify-end gap-2.5 pt-1 border-t border-white/[0.06] mt-1">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all font-sans"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#6B7280', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#E5E2E1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#6B7280'; }}>
              Cancel
            </button>
            <button type="submit"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer btn-gradient border-none font-sans">
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreateTaskModal;
