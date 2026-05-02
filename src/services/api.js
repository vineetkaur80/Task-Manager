// Mock API Service Layer
// All functions return Promise.resolve() with dummy JSON data

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function loginUser({ email, password }) {
  await delay(600);
  if (email && password) {
    return Promise.resolve({
      success: true,
      user: {
        id: 1,
        name: 'Alex Johnson',
        email,
        role: email.includes('admin') ? 'admin' : 'member',
        avatar: 'AJ',
      },
      token: 'mock-jwt-token-xyz',
    });
  }
  return Promise.reject({ message: 'Invalid credentials' });
}

export async function signupUser({ name, email, password, role }) {
  await delay(700);
  return Promise.resolve({
    success: true,
    user: { id: Date.now(), name, email, role: role || 'member', avatar: name.slice(0, 2).toUpperCase() },
  });
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function getProjects() {
  await delay(400);
  return Promise.resolve([
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Redesign the company website with modern UI and improved UX flows.',
      status: 'In Progress',
      priority: 'High',
      progress: 65,
      teamSize: 5,
      dueDate: '2026-06-15',
      color: '#6366f1',
      tasksTotal: 18,
      tasksCompleted: 11,
    },
    {
      id: 2,
      name: 'Mobile App v2',
      description: 'Build the next version of the mobile app with offline support and push notifications.',
      status: 'Planning',
      priority: 'Medium',
      progress: 20,
      teamSize: 4,
      dueDate: '2026-08-01',
      color: '#8b5cf6',
      tasksTotal: 32,
      tasksCompleted: 6,
    },
    {
      id: 3,
      name: 'API Integration',
      description: 'Integrate third-party payment and analytics APIs into the platform.',
      status: 'Completed',
      priority: 'High',
      progress: 100,
      teamSize: 3,
      dueDate: '2026-04-20',
      color: '#10b981',
      tasksTotal: 14,
      tasksCompleted: 14,
    },
    {
      id: 4,
      name: 'Security Audit',
      description: 'Perform a full security audit and address discovered vulnerabilities.',
      status: 'In Progress',
      priority: 'Critical',
      progress: 45,
      teamSize: 2,
      dueDate: '2026-05-30',
      color: '#ef4444',
      tasksTotal: 9,
      tasksCompleted: 4,
    },
    {
      id: 5,
      name: 'Data Analytics Dashboard',
      description: 'Build an internal analytics dashboard for product and sales teams.',
      status: 'Planning',
      priority: 'Low',
      progress: 10,
      teamSize: 3,
      dueDate: '2026-09-15',
      color: '#f59e0b',
      tasksTotal: 22,
      tasksCompleted: 2,
    },
    {
      id: 6,
      name: 'DevOps Pipeline',
      description: 'Set up CI/CD pipelines, Docker containers, and Kubernetes orchestration.',
      status: 'In Progress',
      priority: 'High',
      progress: 78,
      teamSize: 2,
      dueDate: '2026-05-20',
      color: '#06b6d4',
      tasksTotal: 16,
      tasksCompleted: 12,
    },
  ]);
}

export async function createProject(data) {
  await delay(500);
  return Promise.resolve({
    success: true,
    project: {
      id: Date.now(),
      ...data,
      progress: 0,
      tasksTotal: 0,
      tasksCompleted: 0,
      teamSize: 1,
      color: '#6366f1',
      status: 'Planning',
    },
  });
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export async function getTasks() {
  await delay(400);
  return Promise.resolve([
    {
      id: 1,
      title: 'Design new landing page mockups',
      description: 'Create high-fidelity Figma mockups for the new landing page including mobile views.',
      status: 'Completed',
      priority: 'High',
      project: 'Website Redesign',
      projectId: 1,
      assignee: { name: 'Sarah Chen', avatar: 'SC' },
      dueDate: '2026-04-28',
      tags: ['Design', 'Figma'],
    },
    {
      id: 2,
      title: 'Implement authentication flow',
      description: 'Build login, signup, and password reset flows using NextAuth.',
      status: 'In Progress',
      priority: 'Critical',
      project: 'Mobile App v2',
      projectId: 2,
      assignee: { name: 'Alex Johnson', avatar: 'AJ' },
      dueDate: '2026-05-10',
      tags: ['Backend', 'Auth'],
    },
    {
      id: 3,
      title: 'Write API documentation',
      description: 'Document all REST endpoints using Swagger/OpenAPI specification.',
      status: 'Pending',
      priority: 'Medium',
      project: 'API Integration',
      projectId: 3,
      assignee: { name: 'Mike Torres', avatar: 'MT' },
      dueDate: '2026-05-05',
      tags: ['Documentation'],
    },
    {
      id: 4,
      title: 'Fix checkout page bug',
      description: 'Resolve the cart total calculation error on the checkout page.',
      status: 'Overdue',
      priority: 'Critical',
      project: 'Website Redesign',
      projectId: 1,
      assignee: { name: 'Alex Johnson', avatar: 'AJ' },
      dueDate: '2026-04-15',
      tags: ['Bug', 'Frontend'],
    },
    {
      id: 5,
      title: 'Set up CI/CD pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment.',
      status: 'In Progress',
      priority: 'High',
      project: 'DevOps Pipeline',
      projectId: 6,
      assignee: { name: 'Priya Patel', avatar: 'PP' },
      dueDate: '2026-05-18',
      tags: ['DevOps', 'CI/CD'],
    },
    {
      id: 6,
      title: 'User research interviews',
      description: 'Conduct 10 user interviews to gather feedback on the current UX.',
      status: 'Completed',
      priority: 'Medium',
      project: 'Mobile App v2',
      projectId: 2,
      assignee: { name: 'Sarah Chen', avatar: 'SC' },
      dueDate: '2026-04-25',
      tags: ['Research', 'UX'],
    },
    {
      id: 7,
      title: 'Performance optimization audit',
      description: 'Analyze and improve Core Web Vitals scores across all major pages.',
      status: 'Pending',
      priority: 'High',
      project: 'Website Redesign',
      projectId: 1,
      assignee: { name: 'Mike Torres', avatar: 'MT' },
      dueDate: '2026-05-25',
      tags: ['Performance', 'SEO'],
    },
    {
      id: 8,
      title: 'Penetration testing report',
      description: 'Run automated and manual pen tests and compile findings into a report.',
      status: 'Overdue',
      priority: 'Critical',
      project: 'Security Audit',
      projectId: 4,
      assignee: { name: 'Priya Patel', avatar: 'PP' },
      dueDate: '2026-04-30',
      tags: ['Security'],
    },
    {
      id: 9,
      title: 'Build notification system',
      description: 'Implement push notifications for task assignments and due date reminders.',
      status: 'Pending',
      priority: 'Low',
      project: 'Mobile App v2',
      projectId: 2,
      assignee: { name: 'Alex Johnson', avatar: 'AJ' },
      dueDate: '2026-06-20',
      tags: ['Mobile', 'Notifications'],
    },
    {
      id: 10,
      title: 'Database schema migration',
      description: 'Migrate legacy tables to the new normalized schema without downtime.',
      status: 'In Progress',
      priority: 'High',
      project: 'API Integration',
      projectId: 3,
      assignee: { name: 'Sarah Chen', avatar: 'SC' },
      dueDate: '2026-05-12',
      tags: ['Database', 'Migration'],
    },
  ]);
}

export async function createTask(data) {
  await delay(500);
  return Promise.resolve({
    success: true,
    task: { id: Date.now(), ...data, status: 'Pending' },
  });
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export async function getDashboardStats() {
  await delay(300);
  return Promise.resolve({
    totalTasks: 10,
    completedTasks: 2,
    pendingTasks: 3,
    inProgressTasks: 3,
    overdueTasks: 2,
    totalProjects: 6,
    activeProjects: 4,
    teamMembers: 4,
    completionRate: 20,
    weeklyActivity: [12, 19, 8, 24, 17, 6, 21],
  });
}
