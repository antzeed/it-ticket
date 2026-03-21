'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  authorId: string;
}

interface UserProfile {
  id: string;
  role: string;
}

export default function TicketDetailPage() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingParams, setUpdatingParams] = useState(false);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const userRes = await api.get('/auth/me');
      setUser(userRes.data);

      const response = await api.get(`/tickets/${params.id}`);
      setTicket(response.data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError('You do not have permission to view this ticket.');
      } else if (err.response?.status === 404) {
        setError('Ticket not found.');
      } else {
        setError('Failed to load ticket details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket || user?.role !== 'ADMIN') return;
    setUpdatingParams(true);
    try {
      await api.patch(`/tickets/${ticket.id}`, { status: newStatus });
      setTicket({ ...ticket, status: newStatus });
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update ticket status');
    } finally {
      setUpdatingParams(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading ticket details...</div>;
  }

  if (error || !ticket || !user) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error || 'Something went wrong.'}</p>
            </div>
          </div>
        </div>
        <Link href="/tickets" className="text-blue-600 hover:text-blue-500 font-medium">
          &larr; Back to tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/tickets" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
          &larr; Back to tickets
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Ticket Information
          </h3>
          
          {user.role === 'ADMIN' ? (
            <select
              disabled={updatingParams}
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`block pl-3 pr-10 py-1 text-xs border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md font-semibold ${
                ticket.status === 'OPEN' ? 'bg-red-50 text-red-800 border-red-200' : 
                ticket.status === 'IN_PROGRESS' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 
                'bg-green-50 text-green-800 border-green-200'
              }`}
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          ) : (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              ticket.status === 'OPEN' ? 'bg-red-100 text-red-800' : 
              ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-green-100 text-green-800'
            }`}>
              {ticket.status.replace('_', ' ')}
            </span>
          )}
        </div>
        <div className="px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">{ticket.title}</dd>
            </div>
            {user.role === 'ADMIN' && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                <dt className="text-sm font-medium text-gray-500">Requester ID</dt>
                <dd className="mt-1 text-sm text-gray-500 font-mono sm:mt-0 sm:col-span-2">{ticket.authorId}</dd>
              </div>
            )}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                {ticket.description}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(ticket.createdAt).toLocaleString()}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Ticket ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono text-xs">
                {ticket.id}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
