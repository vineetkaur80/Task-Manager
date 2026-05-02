'use client';

import Badge, { getStatusVariant, getPriorityVariant } from './Badge';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date() && true;
}

export default function TaskCard({ task, onEdit, onDelete, isAdmin }) {
  const overdue = task.status === 'Overdue' || (isOverdue(task.dueDate) && task.status !== 'Completed');

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-100 text-sm leading-snug truncate pr-2">
            {task.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 truncate">{task.project}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Badge variant={getPriorityVariant(task.priority)} size="xs">
            {task.priority}
          </Badge>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{task.description}</p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800 mt-auto">
        {/* Assignee */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[9px] font-bold">
            {task.assignee?.avatar || '?'}
          </div>
          <span className="text-xs text-slate-500">{task.assignee?.name}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Due date */}
          <div className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-400' : 'text-slate-500'}`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(task.dueDate)}
          </div>

          {/* Status badge */}
          <Badge variant={getStatusVariant(task.status)} size="xs">
            {task.status}
          </Badge>
        </div>
      </div>

      {/* Admin actions */}
      {isAdmin && (
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="flex-1 py-1.5 text-xs font-medium text-slate-400 hover:text-indigo-400 bg-slate-800 hover:bg-indigo-500/10 rounded-lg border border-slate-700 hover:border-indigo-500/30 transition-all"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="flex-1 py-1.5 text-xs font-medium text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-red-500/10 rounded-lg border border-slate-700 hover:border-red-500/30 transition-all"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
