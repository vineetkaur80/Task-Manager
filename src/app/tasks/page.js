'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import AppLayout from '@/components/AppLayout';
import TaskCard from '@/components/TaskCard';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';
import { getTasks, createTask, getProjects } from '@/services/api';

const STATUS_TABS = ['All', 'Pending', 'In Progress', 'Completed', 'Overdue'];
const PRIORITY_OPTIONS = ['All', 'Critical', 'High', 'Medium', 'Low'];
const EMPTY_FORM = { title: '', description: '', priority: 'Medium', projectId: '', assignee: '', dueDate: '', tags: '' };

const MOCK_MEMBERS = [
  { name: 'Alex Johnson', avatar: 'AJ' },
  { name: 'Sarah Chen', avatar: 'SC' },
  { name: 'Mike Torres', avatar: 'MT' },
  { name: 'Priya Patel', avatar: 'PP' },
];

export default function TasksPage() {
  const { isAuthenticated, isLoading, isAdmin, user } = useApp();
  const router = useRouter();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login');
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    Promise.all([getTasks(), getProjects()]).then(([t, p]) => {
      // Members only see their own tasks
      const myTasks = isAdmin ? t : t.filter((task) => task.assignee?.name === user?.name);
      setTasks(myTasks);
      setProjects(p);
      setDataLoading(false);
    });
  }, [isAuthenticated, isAdmin, user]);

  const filtered = tasks.filter((t) => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.project?.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === 'All' || t.status === activeTab;
    const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchSearch && matchTab && matchPriority;
  });

  const tabCounts = STATUS_TABS.reduce((acc, tab) => {
    acc[tab] = tab === 'All' ? tasks.length : tasks.filter((t) => t.status === tab).length;
    return acc;
  }, {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Task title is required';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    if (!form.projectId) e.projectId = 'Please select a project';
    if (!form.assignee) e.assignee = 'Please assign a member';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setSubmitting(true);
    const project = projects.find((p) => String(p.id) === String(form.projectId));
    const assignee = MOCK_MEMBERS.find((m) => m.name === form.assignee);
    const res = await createTask({
      ...form,
      project: project?.name || '',
      assignee: assignee || { name: form.assignee, avatar: form.assignee.slice(0, 2).toUpperCase() },
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    });
    setTasks((prev) => [res.task, ...prev]);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(false);
    setSubmitting(false);
  };

  const handleDelete = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const closeModal = () => { setModalOpen(false); setForm(EMPTY_FORM); setFormErrors({}); };

  if (isLoading || !isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Role notice for members */}
          {!isAdmin && (
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Showing your assigned tasks only
            </div>
          )}
          <div className="sm:ml-auto">
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
                Add Task
              </Button>
            )}
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === tab
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {tab}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-800 text-slate-500'}`}>
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Search + priority filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-transparent hover:border-slate-600"
            />
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-800/60 border border-slate-700 rounded-xl text-slate-300 text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer hover:border-slate-600"
          >
            {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p === 'All' ? 'All Priority' : p}</option>)}
          </select>
        </div>

        {!dataLoading && (
          <p className="text-xs text-slate-500">
            Showing <span className="text-slate-300 font-medium">{filtered.length}</span> of{' '}
            <span className="text-slate-300 font-medium">{tasks.length}</span> tasks
          </p>
        )}

        {/* Task Grid */}
        {dataLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-1/4" />
                <div className="h-3 bg-slate-800 rounded" />
                <div className="h-3 bg-slate-800 rounded w-4/5" />
                <div className="flex gap-2">
                  <div className="h-5 w-14 bg-slate-800 rounded-full" />
                  <div className="h-5 w-16 bg-slate-800 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">No tasks found</p>
            <p className="text-slate-600 text-sm mt-1">
              {activeTab !== 'All' ? `No ${activeTab.toLowerCase()} tasks` : 'Try adjusting your filters'}
            </p>
            {isAdmin && (
              <Button variant="primary" size="md" className="mt-5" onClick={() => setModalOpen(true)}>
                Create first task
              </Button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((task) => (
              <TaskCard key={task.id} task={task} isAdmin={isAdmin} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title="Add New Task">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input label="Task Title" name="title" placeholder="e.g. Design landing page mockups" value={form.title} onChange={handleChange} error={formErrors.title} required />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-300">Description</label>
            <textarea
              name="description"
              placeholder="What needs to be done?"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="w-full bg-slate-800/60 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-transparent resize-none hover:border-slate-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Project <span className="text-red-400">*</span></label>
              <select name="projectId" value={form.projectId} onChange={handleChange} className="bg-slate-800/60 border border-slate-700 rounded-xl text-slate-300 text-sm px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                <option value="">Select project</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {formErrors.projectId && <p className="text-xs text-red-400">{formErrors.projectId}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Assign To <span className="text-red-400">*</span></label>
              <select name="assignee" value={form.assignee} onChange={handleChange} className="bg-slate-800/60 border border-slate-700 rounded-xl text-slate-300 text-sm px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                <option value="">Select member</option>
                {MOCK_MEMBERS.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
              </select>
              {formErrors.assignee && <p className="text-xs text-red-400">{formErrors.assignee}</p>}
            </div>
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

          <Input label="Tags" name="tags" placeholder="Design, Frontend, Bug (comma separated)" value={form.tags} onChange={handleChange} hint="Separate tags with commas" />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={closeModal}>Cancel</Button>
            <Button type="submit" variant="primary" fullWidth loading={submitting}>Add Task</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
