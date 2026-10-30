import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import type { Toast as ToastType } from '../../types';

const colorMap: Record<ToastType['type'], string> = {
  success: 'bg-[#20232B] border-emerald-500/40 border-l-emerald-500 text-emerald-300',
  error: 'bg-red-900/20 border-red-500/40 border-l-red-400 text-red-400',
  warning: 'bg-amber-900/20 border-amber-500/40 border-l-amber-400 text-amber-400',
  info: 'bg-[#20232B] border-amber-500/30 border-l-amber-400 text-amber-400',
};

const iconMap: Record<ToastType['type'], React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 shrink-0" />,
  error: <AlertTriangle className="w-4 h-4 shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 shrink-0" />,
  info: <Info className="w-4 h-4 shrink-0" />,
};

function ToastItem({ toast }: { toast: ToastType }) {
  const { removeToast } = useToast();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 border border-l-4 rounded-xl shadow-lg max-w-sm transition-all duration-300 ${colorMap[toast.type]} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <span className="mt-0.5">{iconMap[toast.type]}</span>
      <span className="flex-1 text-sm text-[#F8FAFC]">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-[#9CA3AF] hover:text-[#F8FAFC] transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function Toast() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
