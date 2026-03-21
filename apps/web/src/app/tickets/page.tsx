'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { clearToken } from '@/lib/auth';
import { LogOut, Plus } from 'lucide-react';

import UserDashboard from '@/components/tickets/UserDashboard';
import AdminDashboard from '@/components/tickets/AdminDashboard';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch User Profile to get Role
      const userRes = await api.get('/auth/me');
      setUser(userRes.data);

      // 2. Fetch Tickets (Backend automatically handles RBAC filtering)
      const ticketsRes = await api.get('/tickets');
      setTickets(ticketsRes.data);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    router.push('/login');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">
                  IT
                </div>
                <span className="ml-3 text-lg font-bold text-gray-900 tracking-tight">Helpdesk Portal</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col items-end mr-4">
                <span className="text-sm font-medium text-gray-900">{user.username}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{user.role}</span>
              </div>
              
              {user.role === 'USER' && (
                <Link
                  href="/tickets/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  New Request
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {user.role === 'ADMIN' ? 'Admin Workspace' : 'My Portal'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {user.role === 'ADMIN' 
              ? 'Manage IT support tickets across the organization.'
              : 'Track and manage your IT service requests.'}
          </p>
        </div>

        {user.role === 'ADMIN' ? (
          <AdminDashboard tickets={tickets} />
        ) : (
          <UserDashboard tickets={tickets} />
        )}
      </div>
    </div>
  );
}
