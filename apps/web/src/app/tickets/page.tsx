'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { clearToken } from '@/lib/auth';

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
}

export default function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await api.get('/tickets');
            setTickets(response.data);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearToken();
        router.push('/login');
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading tickets...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900">IT Helpdesk Tickets</h1>
                <div className="space-x-4">
                    <Link
                        href="/tickets/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Create Ticket
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {tickets.length === 0 ? (
                        <li className="p-8 text-center text-gray-500">No tickets found.</li>
                    ) : (
                        tickets.map((ticket) => (
                            <li key={ticket.id}>
                                <Link href={`/tickets/${ticket.id}`} className="block hover:bg-gray-50">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-blue-600 truncate">{ticket.title}</p>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                                                        ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {ticket.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500 line-clamp-1">
                                                    {ticket.description}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                <p>
                                                    Created on <time dateTime={ticket.createdAt}>{new Date(ticket.createdAt).toLocaleDateString()}</time>
                                                </p>
                                            </div>
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
