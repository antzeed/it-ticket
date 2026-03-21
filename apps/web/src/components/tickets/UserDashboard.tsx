import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Ticket as TicketIcon, Clock, CheckCircle, ArrowRight, PlusCircle, List, User } from 'lucide-react';
import api from '@/lib/api';

interface UserProfile {
  id: string;
  username: string;
  email: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  assignee?: UserProfile | null;
}

export default function UserDashboard({ tickets, onTicketCreated }: { tickets: Ticket[], onTicketCreated: () => void }) {
  const [view, setView] = useState<'CREATE' | 'HISTORY'>('CREATE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const activeCount = tickets.filter((t) => t.status !== 'CLOSED').length;
  const resolvedCount = tickets.filter((t) => t.status === 'CLOSED').length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/tickets', { title, description });
      setTitle('');
      setDescription('');
      onTicketCreated(); // trigger refresh
      setView('HISTORY');
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('Failed to report issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (view === 'HISTORY') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
             <div className="flex space-x-4">
                 <div className="text-center px-4 border-r border-gray-200">
                    <p className="text-sm font-medium text-gray-500">Active</p>
                    <p className="text-xl font-bold text-gray-900">{activeCount}</p>
                 </div>
                 <div className="text-center px-4">
                    <p className="text-sm font-medium text-gray-500">Resolved</p>
                    <p className="text-xl font-bold text-gray-900">{resolvedCount}</p>
                 </div>
             </div>
             <button
                onClick={() => setView('CREATE')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
             >
                <PlusCircle size={16} className="mr-2" />
                New Request
             </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
               <List size={20} className="mr-2 text-gray-500" />
               Ticket History
            </h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {tickets.length === 0 ? (
              <li className="p-8 text-center text-gray-500">You haven't submitted any requests yet.</li>
            ) : (
              tickets.map((ticket) => (
                <li key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <Link href={`/tickets/${ticket.id}`} className="block px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="truncate pr-4 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{ticket.title}</p>
                        <p className="text-sm text-gray-500 truncate mt-1">{ticket.description}</p>
                        {ticket.assignee && (
                          <div className="mt-2 flex items-center text-xs text-blue-600 bg-blue-50 w-max px-2 py-1 rounded-md">
                             <User size={12} className="mr-1" />
                             Assigned to: {ticket.assignee.username}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                            ticket.status === 'OPEN' ? 'bg-red-50 text-red-700 border border-red-200' :
                            ticket.status === 'IN_PROGRESS' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-400">
                          {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 animate-in fade-in duration-300">
      <div className="bg-white shadow-lg sm:rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="text-center mb-10">
             <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
               <TicketIcon size={32} />
             </div>
             <h2 className="text-2xl font-bold text-gray-900">How can we help?</h2>
             <p className="text-gray-500 mt-2 text-sm">Submit your IT issue or request and we'll get it sorted.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
                Short Summary
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="block w-full text-base border-gray-300 rounded-lg py-3 px-4 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-gray-50 hover:bg-white"
                placeholder="Briefly describe the issue..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
                Detailed Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                required
                className="block w-full text-base border-gray-300 rounded-lg py-3 px-4 border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-gray-50 hover:bg-white resize-y"
                placeholder="Provide steps to reproduce, error messages, or context..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !title || !description}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
            <button
              onClick={() => setView('HISTORY')}
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center w-full"
            >
              <List size={16} className="mr-2" />
              View my past tickets ({tickets.length})
            </button>
        </div>
      </div>
    </div>
  );
}
