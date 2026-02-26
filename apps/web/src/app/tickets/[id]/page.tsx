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

export default function TicketDetailPage() {
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        fetchTicket();
    }, [params.id]);

    const fetchTicket = async () => {
        try {
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

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading ticket details...</div>;
    }

    if (error || !ticket) {
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
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                            ticket.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                        }`}>
                        {ticket.status}
                    </span>
                </div>
                <div className="px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Title</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{ticket.title}</dd>
                        </div>
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
