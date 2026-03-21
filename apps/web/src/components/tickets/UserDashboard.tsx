import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Ticket as TicketIcon, Clock, CheckCircle, ArrowRight, List, User, ImageIcon } from 'lucide-react';
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
  priority: string;
  imageUrl: string | null;
  createdAt: string;
  assignee?: UserProfile | null;
}

export default function UserDashboard({ tickets, onTicketCreated }: { tickets: Ticket[], onTicketCreated: () => void }) {
  const [view, setView] = useState<'CREATE' | 'HISTORY'>('CREATE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCount = tickets.filter((t) => t.status !== 'CLOSED').length;
  const resolvedCount = tickets.filter((t) => t.status === 'CLOSED').length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedImageUrl = null;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedImageUrl = uploadRes.data.url;
      }

      await api.post('/tickets', { 
        title, 
        description,
        priority,
        imageUrl: uploadedImageUrl
      });

      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setFile(null);
      onTicketCreated();
      setView('HISTORY');
    } catch (error) {
      console.error('Failed to create ticket:', error);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  if (view === 'HISTORY') {
    return (
      <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl mx-auto">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex space-x-6 px-4">
                 <div className="text-center pr-6 border-r border-gray-100">
                    <p className="text-sm font-medium text-gray-500">กำลังดำเนินการ</p>
                    <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-sm font-medium text-gray-500">เสร็จสิ้นแล้ว</p>
                    <p className="text-2xl font-bold text-gray-900">{resolvedCount}</p>
                 </div>
             </div>
             <button
                onClick={() => setView('CREATE')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
             >
                แจ้งปัญหาใหม่
             </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
               <List size={20} className="mr-2 text-indigo-600" />
               ประวัติการแจ้งปัญหา
            </h3>
          </div>
          <ul className="divide-y divide-gray-100">
            {tickets.length === 0 ? (
              <li className="p-12 text-center text-gray-400">คุณยังไม่เคยเปิดแจ้งปัญหาใดๆ</li>
            ) : (
              tickets.map((ticket) => (
                <li key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <Link href={`/tickets/${ticket.id}`} className="block px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="truncate pr-4 flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <p className="text-base font-semibold text-gray-900 truncate">{ticket.title}</p>
                          {ticket.priority === 'URGENT' && <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs font-bold border border-red-100">ด่วนมาก</span>}
                          {ticket.priority === 'HIGH' && <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-xs font-bold border border-orange-100">สูง</span>}
                        </div>
                        <p className="text-sm text-gray-500 truncate">{ticket.description}</p>
                        {ticket.assignee && (
                          <div className="mt-2 flex items-center text-xs text-indigo-700 bg-indigo-50 w-max px-2.5 py-1 rounded-md mb-1 font-medium">
                             ผู้รับผิดชอบ: {ticket.assignee.username}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                            ticket.status === 'OPEN' ? 'bg-red-50 text-red-600 border border-red-200' :
                            ticket.status === 'IN_PROGRESS' ? 'bg-yellow-50 text-yellow-600 border border-yellow-200' :
                            'bg-green-50 text-green-600 border border-green-200'
                        }`}>
                          {ticket.status === 'OPEN' ? 'รอตรวจสอบ' : ticket.status === 'IN_PROGRESS' ? 'กำลังดำเนินการ' : 'เสร็จสิ้น'}
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {format(new Date(ticket.createdAt), 'dd/MM/yyyy')}
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
    <div className="max-w-3xl mx-auto py-2 animate-in fade-in duration-300">
      <div className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[24px] overflow-hidden">
        <div className="px-8 py-10 sm:p-12">
          
          {/* Header */}
          <div className="text-center mb-10">
             <div className="mx-auto w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center mb-4 shadow-sm">
               <TicketIcon size={32} />
             </div>
             <h2 className="text-2xl font-bold text-gray-900">แจ้งปัญหา IT</h2>
             <p className="text-gray-500 mt-2 text-[15px]">กรุณาระบุรายละเอียดปัญหาที่พบ</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-2">
              <label htmlFor="title" className="block text-[15px] font-bold text-gray-900">
                หัวข้อปัญหา
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="block w-full text-[15px] border-gray-200 rounded-xl py-3.5 px-4 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm outline-none"
                placeholder="เช่น คอมพิวเตอร์เปิดไม่ติด, อินเทอร์เน็ตช้า"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-[15px] font-bold text-gray-900">
                รายละเอียด
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="block w-full text-[15px] border-gray-200 rounded-xl py-3.5 px-4 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm outline-none resize-none"
                placeholder="อธิบายปัญหาโดยละเอียด เพื่อให้ทีมงานสามารถแก้ไขได้อย่างรวดเร็ว"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[15px] font-bold text-gray-900">
                แนบรูปภาพ (ถ้ามี)
              </label>
              <input 
                 type="file" 
                 accept="image/*"
                 className="hidden" 
                 ref={fileInputRef}
                 onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer flex items-center border border-gray-200 border-dashed rounded-xl p-4 hover:bg-gray-50 transition-colors justify-center"
              >
                 {file ? (
                    <div className="text-sm font-medium text-indigo-600 flex items-center">
                       <CheckCircle size={16} className="mr-2" />
                       {file.name}
                    </div>
                 ) : (
                    <div className="text-sm font-medium text-gray-500 flex items-center">
                       <ImageIcon size={18} className="mr-2 text-gray-400" />
                       คลิกเพื่ออัปโหลดรูปภาพ
                    </div>
                 )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-[15px] font-bold text-gray-900">
                ระดับความสำคัญ
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                 <button type="button" onClick={() => setPriority('LOW')} className={`py-3.5 border rounded-xl text-[15px] font-bold transition-all ${priority === 'LOW' ? 'border-gray-800 text-gray-900 bg-gray-50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                    ต่ำ
                 </button>
                 <button type="button" onClick={() => setPriority('MEDIUM')} className={`py-3.5 border rounded-xl text-[15px] font-bold transition-all ${priority === 'MEDIUM' ? 'border-blue-500 text-blue-700 bg-blue-50/50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                    ปานกลาง
                 </button>
                 <button type="button" onClick={() => setPriority('HIGH')} className={`py-3.5 border rounded-xl text-[15px] font-bold transition-all ${priority === 'HIGH' ? 'border-orange-400 text-orange-600 bg-orange-50/50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                    สูง
                 </button>
                 <button type="button" onClick={() => setPriority('URGENT')} className={`py-3.5 border rounded-xl text-[15px] font-bold transition-all ${priority === 'URGENT' ? 'border-red-400 text-red-600 bg-red-50/50' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                    เร่งด่วน
                 </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !title || !description}
              className={`w-full flex justify-center py-4 px-4 rounded-xl text-[16px] font-bold transition-all ${
                 (loading || !title || !description) 
                   ? 'bg-gray-300 text-white cursor-not-allowed shadow-none' 
                   : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_4px_14px_0_rgb(79,70,229,0.39)]'
              }`}
            >
              {loading ? 'กำลังส่งข้อมูล...' : 'ส่ง Ticket'}
            </button>
          </form>
        </div>
      </div>
      
      {/* Bottom link to view tickets */}
      <div className="mt-8 text-center flex justify-center">
            <button
              onClick={() => setView('HISTORY')}
              className="text-[15px] font-bold text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center rounded-full px-4 py-2 hover:bg-gray-100/50"
            >
              <Clock size={16} className="mr-2" strokeWidth={2.5} />
              Ticket ที่คุณเคยเปิด ({tickets.length})
            </button>
      </div>
    </div>
  );
}
