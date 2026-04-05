'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, TicketIcon } from 'lucide-react';
import api from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      setToken(response.data.accessToken);
      router.push('/tickets');
    } catch (err) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F4F9] px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 sm:p-10 z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto w-[68px] h-[68px] bg-[#5340FF] text-white rounded-full flex items-center justify-center mb-6 shadow-sm">
            <TicketIcon size={32} />
          </div>
          <h2 className="text-[26px] font-bold text-[#1E1B4B] mb-2 font-display tracking-tight">IT Ticket System</h2>
          <p className="text-[#64748B] text-[16px] font-medium">เข้าสู่ระบบเพื่อเปิด ticket</p>
        </div>

        {/* Error message */}
        {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center justify-center">
                {error}
            </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2.5">
            <label className="block text-[15px] font-bold text-[#1E1B4B]">
              อีเมล
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                <Mail size={18} strokeWidth={2.5} />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-11 text-[15px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-[#5340FF]/50 focus:border-[#5340FF] transition-colors outline-none text-[#1E1B4B] placeholder:text-[#94A3B8]"
                placeholder="your.email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2.5">
             <label className="block text-[15px] font-bold text-[#1E1B4B]">
              รหัสผ่าน
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                <Lock size={18} strokeWidth={2.5} />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-11 text-[15px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-[#5340FF]/50 focus:border-[#5340FF] transition-colors outline-none text-[#1E1B4B] tracking-[0.2em] placeholder:tracking-normal placeholder:text-[#94A3B8] font-medium"
                placeholder="........"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 pb-3">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#5340FF] focus:ring-[#5340FF] border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-[14px] font-medium text-[#64748B] cursor-pointer">
                จดจำฉันไว้
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-bold text-[#5340FF] hover:text-[#4330EF] transition-colors text-[14px]">
                ลืมรหัสผ่าน?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className={`w-full flex justify-center py-4 px-4 rounded-xl text-[16px] font-bold transition-all ${
                 (loading || !email || !password) 
                   ? 'bg-[#5340FF]/60 text-white cursor-not-allowed shadow-none' 
                   : 'bg-[#5340FF] hover:bg-[#4330EF] text-white shadow-[0_4px_14px_0_rgba(83,64,255,0.39)]'
              }`}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center text-[14px] font-medium text-[#94A3B8]">
        © 2026 IT Support Team. All rights reserved.
      </div>
    </div>
  );
}
