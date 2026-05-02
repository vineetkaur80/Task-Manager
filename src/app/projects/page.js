'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import AppLayout from '@/components/AppLayout';
import ProjectCard from '@/components/ProjectCard';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { getProjects, createProject } from '@/services/api';

const STATUS_OPTIONS = ['All', 'Planning', 'In Progress', 'Completed'];
const PRIORITY_OPTIONS = ['All', 'Critical', 'High', 'Medium', 'Low'];
const PROJECT_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
const EMPTY_FORM = { name: '', description: '', priority: 'Medium', dueDate: '' };

export default function ProjectsPage() {
  const { isAuthenticated, isLoading, isAdmin } = useApp();
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login');
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    getProjects().then((data) => { setProjects(data); setDataLoading(false); });
  }, [isAuthenticated]);

  const filtered = projects.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || p.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Project name is required';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSubmitting(true);
    const res = await createProject({ ...form, color: PROJECT_COLORS[projects.length % PROJECT_COLORS.length] });
    setProjects((prev) => [res.project, ...prev]);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(false);
    setSubmitting(false);
  };

  const closeModal = () => { setModalOpen(false); setForm(EMPTY_FORM); setFormErrors({}); };

  const summaryStats = [
    { label: 'Total', value: projects.length, color: 'text-slate-200' },
    { label: 'Active', value: projects.filter((p) => p.status === 'In Progress').length, color: 'text-indigo-400' },
    { label: 'Completed', value: projects.filter((p) => p.status === 'Completed').length, color: 'text-emerald-400' },
    { label: 'Planning', value: projects.filter((p) => p.status === 'Planning').length, color: 'text-purple-400' },
  ];

  if (isLoading || !isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-3 flex-wrap">
            {summaryStats.map(({ label, value, color }) => (
              <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-2.5">
                <span className={`text-xl font-bold ${color}`}>{value}</span>
                <span className="text-xs text-slate-500">{label}</span>
              </div>
            ))}
          </div>
          {isAdmin && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setModalOpen(true)}
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              New Project
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-transparent hover:border-slate-600"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-slate-800/60 border border-slate-700 rounded-xl text-slate-300 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer hover:border-slate-600">
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="bg-slate-800/60 border border-slate-700 rounded-xl text-slate-300 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer hover:border-slate-600">
            {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p === 'All' ? 'All Priority' : p}</option>)}
          </select>
        </div>

        {!dataLoading && (
          <p className="text-xs text-slate-500">
            Showing <span className="text-slate-300 font-medium">{filtered.length}</span> of{' '}
            <span className="text-slate-300 font-medium">{projects.length}</span> projects
          </p>
        )}

        {/* Grid */}
        {dataLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded" />
                <div className="h-3 bg-slate-800 rounded w-4/5" />
                <div className="h-1.5 bg-slate-800 rounded-full" />
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((j) => <div key={j} className="h-14 bg-slate-800 rounded-xl" />)}
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">No projects found</p>
            <p className="text-slate-600 text-sm mt-1">Try adjusting your filters or search query</p>
            {isAdmin && (
              <Button variant="primary" size="md" className="mt-5" onClick={() => setModalOpen(true)}>
                Create first project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} isAdmin={isAdmin} />
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title="Create New Project">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input label="Project Name" name="name" placeholder="e.g. Website Redesign" value={form.name} onChange={handleChange} error={formErrors.name} required />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <textarea
              name="description"
              placeholder="Brief description of this project..."
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-slate-800/60 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-transparent resize-none hover:border-slate-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="bg-slate-800/60 border border-slate-700 rounded-xl text-slate-300 text-sm px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                {['Low', 'Medium', 'High', 'Critical'].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <Input label="Due Date" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} error={formErrors.dueDate} required />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="primary" fullWidth loading={submitting}>Create Project</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
