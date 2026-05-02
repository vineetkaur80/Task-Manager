'use client';

export default function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const variants = {
    default: 'bg-slate-700 text-slate-300',
    primary: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
    success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    cyan: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}

// Helper to get status badge variant
export function getStatusVariant(status) {
  switch (status?.toLowerCase()) {
    case 'completed': return 'success';
    case 'in progress': return 'primary';
    case 'pending': return 'warning';
    case 'overdue': return 'danger';
    case 'planning': return 'purple';
    default: return 'default';
  }
}

export function getPriorityVariant(priority) {
  switch (priority?.toLowerCase()) {
    case 'critical': return 'danger';
    case 'high': return 'warning';
    case 'medium': return 'primary';
    case 'low': return 'default';
    default: return 'default';
  }
}
