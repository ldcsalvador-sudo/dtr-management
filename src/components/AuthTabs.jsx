import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdPerson, MdLock, MdEmail, MdArrowForward, MdCheckCircle, MdErrorOutline, MdVisibility, MdVisibilityOff, MdBusiness } from 'react-icons/md';

import bgImage from '../assets/TABG.png';
import logoImage from '../assets/TALogo.png';

const BRAND_COLOR = "#073763";
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzZL1d6Duykgezfln6xybS6ZgbJe4tOsHyj-qNMqtnuSNCuiLaMcSBjkJSWTrApdtYt/exec';

const AuthTabs = ({ onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleGSheetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData(e.currentTarget);
    const payload = {
      action: activeTab,
      username: formData.get('username'),
      password: formData.get('password'),
      email: formData.get('email') || '',
      division: formData.get('division') || 'General',
    };

    try {
      if (activeTab === 'login') {
        const response = await fetch(`${SCRIPT_URL}?action=login&username=${encodeURIComponent(payload.username)}&password=${encodeURIComponent(payload.password)}`);
        const result = await response.json();

        if (result.success) {
          onAuthSuccess({ ...result.user });
        } else {
          setMessage({ type: 'error', text: result.message });
        }
      } else {
        // Registration uses POST
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          body: JSON.stringify(payload),
        });
        setMessage({ type: 'success', text: 'Registration successful! Please login.' });
        setTimeout(() => setActiveTab('login'), 2000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: "Connection error." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <div className="fixed inset-0 z-[-1] bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[450px] bg-white rounded-[3rem] shadow-2xl px-8 py-12 flex flex-col items-center">
        <img src={logoImage} alt="Logo" className="w-20 mb-6" />
        <h2 className="text-2xl font-black text-slate-800 italic uppercase">Financial <span className="text-[#073763]">Service</span></h2>
        
        <div className="w-full flex bg-slate-100 p-1 rounded-2xl my-8">
          {['login', 'register'].map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${activeTab === t ? 'bg-[#073763] text-white' : 'text-slate-400'}`}>{t}</button>
          ))}
        </div>

        <form onSubmit={handleGSheetSubmit} className="w-full space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Username</label>
            <div className="relative">
              <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input name="username" type="text" required className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none" />
            </div>
          </div>

          <AnimatePresence>
            {activeTab === 'register' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-4 overflow-hidden">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Work Email</label>
                  <div className="relative">
                    <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input name="email" type="email" required className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Division</label>
                  <div className="relative">
                    <MdBusiness className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <select name="division" className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl outline-none appearance-none font-semibold text-slate-600">
                      <option value="Alpha">Alpha</option>
                      <option value="FSOD">FSOD</option>
                      <option value="BDRP">BDRP</option>
                      <option value="ADRP">ADRP</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Password</label>
            <div className="relative">
              <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input name="password" type={showPassword ? "text" : "password"} required className="w-full pl-12 pr-12 py-4 bg-slate-50 rounded-2xl outline-none" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
          </div>

          <button disabled={loading} className="w-full py-5 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl mt-4 flex items-center justify-center gap-2" style={{ backgroundColor: BRAND_COLOR }}>
            {loading ? "Processing..." : (activeTab === 'login' ? "Access System" : "Create Account")}
            <MdArrowForward />
          </button>
        </form>

        {message.text && (
          <p className={`mt-4 text-[10px] font-bold uppercase ${message.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>{message.text}</p>
        )}
      </motion.div>
    </div>
  );
};

export default AuthTabs;