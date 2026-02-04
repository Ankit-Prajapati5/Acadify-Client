import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText, Sparkles, ArrowLeft, Cookie } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      icon: <EyeOff size={22} />,
      title: "Data Collection",
      content: "Hum sirf wahi basic info collect karte hain jo aapke account aur courses ke liye zaroori hai."
    },
    {
      icon: <Lock size={22} />,
      title: "Data Security",
      content: "Aapka data encrypted hai. Hum aapki personal information kabhi kisi ko sell nahi karte."
    },
    {
      icon: <Cookie size={22} />,
      title: "Cookies Usage",
      content: "Cookies ka use aapke login session ko secure aur platform ko fast banane ke liye hota hai."
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Your Rights",
      content: "Aap jab chahein apna data update kar sakte hain ya account delete ki request bhej sakte hain."
    }
  ];

  return (
    <div className="bg-[#f1f5f9] dark:bg-zinc-950 text-zinc-900 dark:text-white lg:h-screen w-full pt-20 lg:pt-0 flex items-center justify-center transition-colors duration-500 relative font-sans overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-blue-200/20 dark:bg-blue-900/10 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-indigo-200/20 dark:bg-indigo-900/10 blur-[100px] rounded-full -z-10" />

      <div className="max-w-[1300px] w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: Header Section */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left animate-in fade-in slide-in-from-left duration-700">
          <div className="inline-block px-3 py-1 rounded-full bg-white dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 shadow-sm">
            <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Sparkles size={12} /> Legal & Safety
            </p>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter">
            Privacy <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-white dark:to-zinc-500">
              Matters.
            </span>
          </h1>
          
          <p className="text-sm md:text-base text-slate-600 dark:text-zinc-400 font-medium max-w-sm mx-auto lg:mx-0 leading-relaxed">
            Proxima par aapki privacy hamari priority hai. Transparency hamara mool mantra hai.
          </p>

          <div className="pt-4">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="border-zinc-200 dark:border-zinc-800 h-12 px-6 text-[11px] font-black tracking-widest rounded-2xl hover:bg-white dark:hover:bg-zinc-900 transition-all shadow-md active:scale-95"
            >
              <ArrowLeft size={16} className="mr-2" /> GO BACK
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: 2x2 Grid with Readable Text */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right duration-700">
          
          {sections.map((item, index) => (
            <div key={index} className="bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md border border-white dark:border-zinc-800 p-6 rounded-[2rem] shadow-sm hover:border-blue-500/50 transition-all group">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-base font-bold mb-2">{item.title}</h3>
              <p className="text-[13px] text-slate-500 dark:text-zinc-400 leading-snug font-medium">
                {item.content}
              </p>
            </div>
          ))}

          {/* Bottom Info Bar - Professional Dark Card */}
          <div className="sm:col-span-2 bg-zinc-950 text-white p-5 rounded-[2rem] flex items-center gap-5 relative overflow-hidden shadow-2xl border border-zinc-800">
            <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-zinc-900 items-center justify-center shrink-0 border border-zinc-800">
               <FileText size={20} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-zinc-400 leading-relaxed">
                "Proxima use karke aap hamari latest cookies aur data processing terms se agree karte hain."
              </p>
              <div className="mt-2 flex gap-6 text-[9px] font-black uppercase tracking-widest">
                <span className="text-blue-500">Last Updated: Jan 2026</span>
                <span className="text-zinc-700">Version 1.0</span>
              </div>
            </div>
          </div>

          {/* Minimal Trust Badge */}
          <div className="sm:col-span-2 py-3 px-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex justify-between items-center bg-white/20 dark:bg-transparent backdrop-blur-sm">
             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Global Standard Encryption
             </span>
             <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">Secure Access</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;