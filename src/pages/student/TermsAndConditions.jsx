import React from 'react';
import { Gavel, Scale, UserCheck, Sparkles, ArrowLeft, ShieldAlert, FileCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  const rules = [
  {
    icon: <UserCheck size={22} />,
    title: "User Account",
    content: "Aapka account sirf aapke liye hai. Credentials share karna ya multiple login prohibited hai."
  },
  {
    icon: <Scale size={22} />,
    title: "Fair Usage",
    content: "Platform ka use sirf learning ke liye karein. Kisi bhi tarah ki spamming allowed nahi hai."
  },
  {
    icon: <FileCode size={22} />, // Import FileCode from lucide-react
    title: "Intellectual Property",
    content: "Proxima ka saara content (videos, notes) copyrighted hai. Isse copy karna illegal hai."
  },
  {
    icon: <ShieldAlert size={22} />,
    title: "Termination",
    content: "Rules break karne par Proxima aapka access bina kisi prior notice ke cancel kar sakta hai."
  }
];
  return (
    <div className="bg-[#f1f5f9] dark:bg-zinc-950 text-zinc-900 dark:text-white lg:h-screen w-full pt-20 lg:pt-0 flex items-center justify-center transition-colors duration-500 relative font-sans overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-indigo-200/20 dark:bg-indigo-900/10 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-blue-200/20 dark:bg-blue-900/10 blur-[100px] rounded-full -z-10" />

      <div className="max-w-[1300px] w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: Header */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left animate-in fade-in slide-in-from-left duration-700">
          <div className="inline-block px-3 py-1 rounded-full bg-white dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 shadow-sm">
            <p className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Gavel size={12} /> Legal Agreement
            </p>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter">
            Terms & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-600 dark:from-white dark:to-zinc-500">
              Conditions.
            </span>
          </h1>
          
          <p className="text-sm md:text-base text-slate-600 dark:text-zinc-400 font-medium max-w-sm mx-auto lg:mx-0 leading-relaxed">
            Proxima use karne se pehle hamare rules ko dhyan se padhein. Ye humare aur aapke beech ka ek legal contract hai.
          </p>

          <div className="pt-4">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-zinc-200 dark:border-zinc-800 h-12 px-6 text-[11px] font-black tracking-widest rounded-2xl hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-md"
            >
              <ArrowLeft size={16} className="mr-2" /> I AGREE, GO BACK
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: 2x2 Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right duration-700">
          
          {rules.map((item, index) => (
            <div key={index} className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-white dark:border-zinc-800 p-6 rounded-[2rem] shadow-sm hover:border-indigo-500/50 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/30 group-hover:-rotate-6 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-base font-bold mb-2">{item.title}</h3>
              <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-snug font-medium">
                {item.content}
              </p>
            </div>
          ))}

          {/* Bottom Dark Card */}
          <div className="sm:col-span-2 bg-zinc-950 text-white p-5 rounded-[2rem] flex items-center gap-5 relative overflow-hidden shadow-2xl border border-zinc-800">
            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-zinc-900 items-center justify-center shrink-0 border border-zinc-800">
               <Sparkles size={20} className="text-indigo-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-zinc-400 leading-relaxed">
                "Hamara goal aapko best learning experience dena hai, lekin platform ka galat use hone par hum action lene ka adhikaar rakhte hain."
              </p>
              <div className="mt-2 flex gap-6 text-[9px] font-black uppercase tracking-widest">
                <span className="text-indigo-500">Effective Date: Jan 2026</span>
                <span className="text-zinc-700">Ref: AC-2026-TC</span>
              </div>
            </div>
          </div>

          {/* Minimal Status Bar */}
          <div className="sm:col-span-2 py-3 px-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex justify-between items-center bg-white/20 dark:bg-transparent backdrop-blur-sm">
             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Legally Binding Agreement
             </span>
             <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">v1.0</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TermsAndConditions;