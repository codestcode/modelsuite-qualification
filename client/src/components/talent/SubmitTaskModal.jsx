import { useState } from 'react';
import { createPortal } from 'react-dom';
import { submitTask } from '../../api/submissions';

const SubmitTaskModal = ({ task, onClose, onSubmitted }) => {
  if (!task) return null;

  const [file, setFile]   = useState(null);
  const [notes, setNotes] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('notes', notes);
    try {
      await submitTask(task._id, formData);
      onSubmitted();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    }
  };

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-[200] p-6"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="modal-glass w-full max-w-lg" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <h2 className="text-[17px] font-semibold" style={{ color: '#F0F0F0', fontFamily: 'Outfit, sans-serif' }}>Submit Task</h2>
          <button onClick={onClose}
            className="bg-transparent border-none text-[#6B7280] text-base cursor-pointer px-2 py-1 rounded-md hover:bg-white/[0.06] hover:text-white transition-all">✕</button>
        </div>

        {/* Task info */}
        <div className="px-6 py-3.5 border-b border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-[14px] font-semibold" style={{ color: '#E5E2E1', fontFamily: 'Outfit, sans-serif' }}>{task.title || 'Untitled Task'}</p>
          {task.dueDate && (
            <p className="text-[12px] mt-0.5" style={{ color: '#6B7280' }}>Due: {task.dueDate}</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

          {/* File upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.5px]" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>
              Upload File
            </label>
            <input id="sub-file" type="file" onChange={handleFileChange} className="file-input-hidden" />
            <label htmlFor="sub-file"
              className="flex flex-col items-center justify-center gap-2 py-7 px-4 border-2 border-dashed rounded-xl cursor-pointer transition-all text-center"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)'; e.currentTarget.style.background = 'rgba(59,130,246,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
              {file ? (
                <span className="text-[13px] font-medium break-all" style={{ color: '#60A5FA' }}>📎 {file.name}</span>
              ) : (
                <>
                  <span className="text-xl" style={{ color: '#4B5563' }}>⬆</span>
                  <span className="text-[13px]" style={{ color: '#6B7280' }}>Click to choose a file</span>
                </>
              )}
            </label>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.5px]" style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4}
              placeholder="Describe what you've done, include any relevant links..."
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#E5E2E1' }}
              className="w-full rounded-xl px-3.5 py-2.5 text-[13px] outline-none transition-all font-sans resize-y"
              onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
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
              Submit Task
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default SubmitTaskModal;
