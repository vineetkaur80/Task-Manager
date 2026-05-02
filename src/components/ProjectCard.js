'use client';

import Badge, { getStatusVariant, getPriorityVariant } from './Badge';

export default function ProjectCard({ project, isAdmin, onEdit }) {
  const progressColor =
    project.progress === 100
      ? '#10b981'
      : project.progress >= 60
      ? '#6366f1'
      : project.progress >= 30
      ? '#f59e0b'
      : '#ef4444';

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Color dot */}
          <div
            className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
            style={{ backgroundColor: project.color, boxShadow: `0 0 8px ${project.color}60` }}
          />
          <div>
            <h3 className="font-semibold text-slate-100 text-sm leading-snug">{project.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getStatusVariant(project.status)} size="xs">{project.status}</Badge>
              <Badge variant={getPriorityVariant(project.priority)} size="xs">{project.priority}</Badge>
            </div>
          </div>
        </div>
        {isAdmin && onEdit && (
          <button
            onClick={() => onEdit(project)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{project.description}</p>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-slate-500 font-medium">Progress</span>
          <span className="text-[11px] font-semibold" style={{ color: progressColor }}>
            {project.progress}%
          </span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%`, backgroundColor: progressColor }}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center py-2 bg-slate-800/60 rounded-xl">
          <p className="text-sm font-bold text-slate-200">{project.tasksCompleted}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Done</p>
        </div>
        <div className="text-center py-2 bg-slate-800/60 rounded-xl">
          <p className="text-sm font-bold text-slate-200">{project.tasksTotal}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Total</p>
        </div>
        <div className="text-center py-2 bg-slate-800/60 rounded-xl">
          <p className="text-sm font-bold text-slate-200">{project.teamSize}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Members</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Due {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        {/* Team avatars placeholder */}
        <div className="flex -space-x-1.5">
          {Array.from({ length: Math.min(project.teamSize, 3) }).map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border border-slate-900 text-[8px] font-bold flex items-center justify-center text-white"
              style={{ background: `hsl(${(i * 80 + 200) % 360}, 70%, 55%)` }}
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
          {project.teamSize > 3 && (
            <div className="w-5 h-5 rounded-full border border-slate-900 bg-slate-700 text-[8px] font-bold flex items-center justify-center text-slate-300">
              +{project.teamSize - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
