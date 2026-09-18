import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(onClose, 4200);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const tone = type === 'error'
    ? 'border-[#e38d6f]/70 bg-[#7d403c] text-[#fff0cf]'
    : 'border-[#76d7b3]/70 bg-[#176b5d] text-[#efffe9]';

  return (
    <div className={`fixed right-4 top-4 z-[60] flex max-w-sm items-start gap-4 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl ${tone}`} role="status" aria-live="polite">
      <span>{message}</span>
      <button type="button" onClick={onClose} className="text-lg leading-none opacity-80 transition hover:opacity-100" aria-label="Dismiss notification">
        ×
      </button>
    </div>
  );
}
