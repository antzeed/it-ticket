import Link from 'next/link';
import { format } from 'date-fns';
import { Ticket as TicketIcon, Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

export default function UserDashboard({ tickets }: { tickets: Ticket[] }) {
  const activeCount = tickets.filter((t) => t.status !== 'CLOSED').length;
  const resolvedCount = tickets.filter((t) => t.status === 'CLOSED').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-blue-50 text-blue-600">
            <TicketIcon size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Requests</p>
            <p className="text-2xl font-bold text-gray-900">{tickets.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Active / In Progress</p>
            <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-green-50 text-green-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Resolved</p>
            <p className="text-2xl font-bold text-gray-900">{resolvedCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Your Recent Tickets</h3>
        </div>
        <ul className="divide-y divide-gray-100">
          {tickets.length === 0 ? (
            <li className="p-8 text-center text-gray-500">You haven't created any tickets yet.</li>
          ) : (
            tickets.map((ticket) => (
              <li key={ticket.id} className="hover:bg-gray-50 transition-colors">
                <Link href={`/tickets/${ticket.id}`} className="block px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="truncate pr-4">
                      <p className="text-sm font-medium text-gray-900 truncate">{ticket.title}</p>
                      <p className="text-sm text-gray-500 truncate mt-1">{ticket.description}</p>
                    </div>
                    <div className="flex items-center space-x-4 flex-shrink-0">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          ticket.status === 'OPEN' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          ticket.status === 'IN_PROGRESS' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                          'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-400 w-24 text-right">
                        {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                      </span>
                      <ArrowRight size={16} className="text-gray-400" />
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
