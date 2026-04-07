const toneStyles = {
  success: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  error: "border-rose-500/40 bg-rose-500/10 text-rose-200",
  info: "border-slate-500/40 bg-slate-500/10 text-slate-200",
};

const Toast = ({ message, tone = "success", onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed right-6 top-6 z-50">
      <div
        className={`rounded-xl border px-4 py-3 text-sm shadow-xl shadow-slate-950/40 ${
          toneStyles[tone] || toneStyles.info
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold">{message}</span>
          {onClose ? (
            <button
              onClick={onClose}
              className="text-xs uppercase tracking-[0.2em] opacity-70 transition hover:opacity-100"
            >
              Close
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Toast;
