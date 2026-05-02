'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import AppLayout from '@/components/AppLayout';
import { getDashboardStats, getTasks, getProjects } from '@/services/api';

function StatCard({ title, value, icon, color, bgColor, change, delay = 0 }) {
  return (
    <div
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20 transition-all duration-200 fade-in-up"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${bgColor} flex items-center justify-center flex-shrink-0`}>
          <span className={`text-xl ${color}`}>{icon}</span>
        </div>
        {change !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${change >= 0 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-slate-400">{title}</p>
    </div>
  );
}

function ActivityBar({ day, value, max }) {
  const height = Math.max(8, Math.round((value / max) * 100));
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <span className="text-xs text-slate-500">{value}</span>
      <div className="w-full rounded-t-sm bg-slate-800 relative overflow-hidden" style={{ height: 80 }}>
        <div
          className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-sm transition-all duration-700"
          style={{ height: `${height}%` }}
        />
      </div>
      <span className="text-[10px] text-slate-600">{day}</span>
    </div>
  );
}

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useApp();
  const router = useRouter();

  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login');
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    (async () => {
      const [s, t, p] = await Promise.all([getDashboardStats(), getTasks(), getProjects()]);
      setStats(s);
      setRecentTasks(t.slice(0, 5));
      setProjects(p.slice(0, 4));
      setDataLoading(false);
    })();
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated) return null;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const activity = stats?.weeklyActivity || [0, 0, 0, 0, 0, 0, 0];
  const maxActivity = Math.max(...activity, 1);

  const statCards = [
    { title: 'Total Tasks', value: stats?.totalTasks ?? '—', icon: '📋', color: 'text-indigo-400', bgColor: 'bg-indigo-500/15', change: 12 },
    { title: 'Completed', value: stats?.completedTasks ?? '—', icon: '✅', color: 'text-emerald-400', bgColor: 'bg-emerald-500/15', change: 8 },
    { title: 'In Progress', value: stats?.inProgressTasks ?? '—', icon: '⚡', color: 'text-blue-400', bgColor: 'bg-blue-500/15', change: 5 },
    { title: 'Pending', value: stats?.pendingTasks ?? '—', icon: '⏳', color: 'text-amber-400', bgColor: 'bg-amber-500/15', change: -2 },
    { title: 'Overdue', value: stats?.overdueTasks ?? '—', icon: '🚨', color: 'text-red-400', bgColor: 'bg-red-500/15', change: -3 },
    { title: 'Active Projects', value: stats?.activeProjects ?? '—', icon: '🗂️', color: 'text-purple-400', bgColor: 'bg-purple-500/15', change: 0 },
  ];

  const statusColor = {
    'Completed': 'text-emerald-400',
    'In Progress': 'text-indigo-400',
    'Pending': 'text-amber-400',
    'Overdue': 'text-red-400',
  };

  const statusDot = {
    'Completed': 'bg-emerald-400',
    'In Progress': 'bg-indigo-400',
    'Pending': 'bg-amber-400',
    'Overdue': 'bg-red-400',
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        {dataLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse">
                <div className="w-11 h-11 bg-slate-800 rounded-xl mb-4" />
                <div className="h-8 w-16 bg-slate-800 rounded mb-2" />
                <div className="h-3 w-24 bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {statCards.map((card, i) => (
              <StatCard key={card.title} {...card} delay={i * 50} />
            ))}
          </div>
        )}

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Weekly Activity */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-white">Weekly Activity</h3>
                <p className="text-xs text-slate-500 mt-0.5">Tasks completed this week</p>
              </div>
              <span className="text-xs font-semibold bg-emerald-500/15 text-emerald-400 px-2.5 py-1 rounded-lg">
                +{stats?.completionRate || 0}% rate
              </span>
            </div>
            <div className="flex items-end gap-2">
              {activity.map((val, i) => (
                <ActivityBar key={i} day={days[i]} value={val} max={maxActivity} />
              ))}
            </div>
          </div>

          {/* Project Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Projects</h3>
              <span className="text-xs text-slate-500">{projects.length} total</span>
            </div>
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-slate-300 truncate">{p.name}</p>
                      <span className="text-xs text-slate-500 ml-2 flex-shrink-0">{p.progress}%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${p.progress}%`, backgroundColor: p.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h3 className="font-bold text-white">Recent Tasks</h3>
            <button
              onClick={() => router.push('/tasks')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="divide-y divide-slate-800">
            {dataLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                    <div className="w-8 h-8 bg-slate-800 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-800 rounded w-1/3" />
                      <div className="h-2 bg-slate-800 rounded w-1/4" />
                    </div>
                    <div className="w-16 h-5 bg-slate-800 rounded-full" />
                  </div>
                ))
              : recentTasks.map((task) => (
                  <div key={task.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-800/40 transition-colors">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[task.status] || 'bg-slate-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{task.title}</p>
                      <p className="text-xs text-slate-500 truncate">{task.project} · {task.assignee?.name}</p>
                    </div>
                    <span className={`text-xs font-semibold flex-shrink-0 ${statusColor[task.status] || 'text-slate-400'}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
