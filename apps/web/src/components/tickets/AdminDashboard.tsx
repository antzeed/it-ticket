import { useState, useMemo } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { AlertCircle, Clock, CheckCircle, LayoutDashboard, Inbox, PlayCircle, CheckSquare, Filter } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  authorId: string;
  author?: { username: string; department?: string; position?: string };
  assignee?: { username: string } | null;
}

export default function AdminDashboard({ tickets }: { tickets: Ticket[] }) {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'CLOSED'>('ALL');
  const [deptFilter, setDeptFilter] = useState<string>('ALL');

  // Extract unique departments for the dropdown
  const departments = useMemo(() => {
    const depts = tickets
      .map(t => t.author?.department)
      .filter((dept): dept is string => typeof dept === 'string' && dept.trim() !== '');
    return Array.from(new Set(depts)).sort();
  }, [tickets]);

  const openCount = tickets.filter((t) => t.status === 'OPEN').length;
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS').length;
  const closedCount = tickets.filter((t) => t.status === 'CLOSED').length;

  const filteredTickets = tickets.filter((t) => {
    const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchDept = deptFilter === 'ALL' || t.author?.department === deptFilter;
    return matchStatus && matchDept;
  });

  const getFilterTitle = () => {
    switch (statusFilter) {
      case 'OPEN': return 'งานยังไม่ดำเนินการ (Open)';
      case 'IN_PROGRESS': return 'งานที่กำลังดำเนินการ (In Progress)';
      case 'CLOSED': return 'งานที่เรียบร้อยแล้ว (Closed)';
      default: return 'งานทั้งหมด (All Tickets)';
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 relative items-start">
      {/* Left Sidebar Menu */}
      <div className="w-full md:w-64 flex-shrink-0 sticky top-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">สถานะงาน</h3>
          </div>
          <div className="p-2 space-y-1">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${
                statusFilter === 'ALL' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center">
                 <LayoutDashboard size={18} className="mr-3" />
                 ภาพรวมทั้งหมด
              </div>
              <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{tickets.length}</span>
            </button>
            
            <button
              onClick={() => setStatusFilter('OPEN')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${
                statusFilter === 'OPEN' 
                  ? 'bg-red-50 text-red-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center">
                 <Inbox size={18} className="mr-3" />
                 งานยังไม่ดำเนินการ
              </div>
              {openCount > 0 && <span className="bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">{openCount}</span>}
            </button>

            <button
              onClick={() => setStatusFilter('IN_PROGRESS')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${
                statusFilter === 'IN_PROGRESS' 
                  ? 'bg-yellow-50 text-yellow-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center">
                 <PlayCircle size={18} className="mr-3" />
                 กำลังดำเนินการ
              </div>
              {inProgressCount > 0 && <span className="bg-yellow-100 text-yellow-700 py-0.5 px-2 rounded-full text-xs">{inProgressCount}</span>}
            </button>

            <button
              onClick={() => setStatusFilter('CLOSED')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors ${
                statusFilter === 'CLOSED' 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center">
                 <CheckSquare size={18} className="mr-3" />
                 เรียบร้อยแล้ว
              </div>
              {closedCount > 0 && <span className="bg-green-100 text-green-700 py-0.5 px-2 rounded-full text-xs">{closedCount}</span>}
            </button>
          </div>
        </div>

        {/* Filters Sidebar (Department) */}
        {departments.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center">
              <Filter size={16} className="text-gray-400 mr-2" />
              <h3 className="font-bold text-gray-800 text-sm">ตัวกรองเพิ่มเติม</h3>
            </div>
            <div className="p-4">
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">แผนก (Department)</label>
               <select 
                 value={deptFilter} 
                 onChange={(e) => setDeptFilter(e.target.value)}
                 className="block w-full text-sm border-gray-300 rounded-lg py-2 px-3 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 bg-gray-50 border shadow-sm"
               >
                  <option value="ALL">ทั้้งหมด (All Departments)</option>
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
               </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6 overflow-hidden">
        
        {/* Status Dashboard Summary */}
        {statusFilter === 'ALL' && deptFilter === 'ALL' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div 
               onClick={() => setStatusFilter('OPEN')} 
               className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 border-l-4 border-l-red-500 cursor-pointer hover:shadow-md transition-shadow"
             >
              <div className="p-3 rounded-full bg-red-50 text-red-600">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Requires Attention (Open)</p>
                <p className="text-2xl font-bold text-gray-900">{openCount}</p>
              </div>
            </div>
            
            <div 
               onClick={() => setStatusFilter('IN_PROGRESS')}
               className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 border-l-4 border-l-yellow-500 cursor-pointer hover:shadow-md transition-shadow"
             >
              <div className="p-3 rounded-full bg-yellow-50 text-yellow-600">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
              </div>
            </div>

            <div 
               onClick={() => setStatusFilter('CLOSED')}
               className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 border-l-4 border-l-green-500 cursor-pointer hover:shadow-md transition-shadow"
             >
              <div className="p-3 rounded-full bg-green-50 text-green-600">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Closed</p>
                <p className="text-2xl font-bold text-gray-900">{closedCount}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tickets Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-300">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
               <span>{getFilterTitle()}</span>
               {deptFilter !== 'ALL' && (
                 <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full ml-3 border border-blue-200">
                    แผนก: {deptFilter}
                 </span>
               )}
            </h3>
            <div className="text-sm text-gray-500 font-medium">
               พบทั้งหมด {filteredTickets.length} รายการ
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ticket</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Requester</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Assignee</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="relative px-6 py-4"><span className="sr-only">View</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium bg-gray-50/50">
                      ไม่พบข้อมูลตั๋วตามตัวกรองที่เลือก
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-[15px] font-bold text-gray-900 truncate max-w-sm mb-1">{ticket.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-sm">{ticket.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-full border ${
                          ticket.status === 'OPEN' ? 'bg-red-50 text-red-600 border-red-100' :
                          ticket.status === 'IN_PROGRESS' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                          'bg-green-50 text-green-600 border-green-100'
                        }`}>
                          {ticket.status === 'OPEN' ? 'รอตรวจสอบ' : ticket.status === 'IN_PROGRESS' ? 'กำลังดำเนินการ' : 'เสร็จสิ้น'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{ticket.author?.username || ticket.authorId.substring(0,8)}</div>
                        {ticket.author?.department && (
                          <div className="text-xs text-gray-500 mt-0.5">{ticket.author.position} ({ticket.author.department})</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {ticket.assignee ? (
                            <span className="text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-md text-xs font-bold border border-blue-100">
                                {ticket.assignee.username}
                            </span>
                        ) : (
                            <span className="text-gray-400 text-xs italic font-medium">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {format(new Date(ticket.createdAt), 'dd MMM yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/tickets/${ticket.id}`} className="text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-bold shadow-sm">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
