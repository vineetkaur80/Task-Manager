import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.replace('/dashboard');
    } else {
      router.replace('/auth/login');
    }
  }, [token, router]);

  return null;
}
          </Link>
          <Link href="/auth/login" className="btn btn-secondary btn-lg" style={{ padding: '14px 32px' }}>
            Sign in
          </Link>
        </div>

        {/* Feature cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16, marginTop: 56, textAlign: 'left',
        }}>
          {[
            { icon: 'folder_open', title: 'Projects', desc: 'Create, organise, and track projects with deadlines and member roles.' },
            { icon: 'check_circle', title: 'Tasks', desc: 'Assign tasks, set priorities, and move them across a Kanban board.' },
            { icon: 'group', title: 'Teams', desc: 'Invite members, assign roles, and manage your whole organisation.' },
            { icon: 'bar_chart', title: 'Dashboard', desc: 'Real-time overview of progress, overdue items, and upcoming deadlines.' },
          ].map(f => (
            <div key={f.title} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: 20,
              transition: 'all 0.2s ease',
            }} className="card">
              <span className="material-symbols-outlined" style={{
                fontSize: 24, color: 'var(--accent-light)', marginBottom: 10, display: 'block',
              }}>{f.icon}</span>
              <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 14 }}>{f.title}</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
