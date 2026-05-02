import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'TaskFlow — Team Task Manager',
  description: 'A modern SaaS-style team task management dashboard for managing projects, tasks, and teams efficiently.',
  keywords: 'task manager, project management, team collaboration, dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
