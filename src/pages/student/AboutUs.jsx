import { CheckCircle, Award, Code, BookOpen, Globe, ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    
    // h-screen and overflow-hidden removes scrolling on laptop
    <div className="bg-[#f1f5f9] dark:bg-zinc-950 text-zinc-900 dark:text-white lg:h-screen w-full pt-20 lg:pt-0 flex items-center justify-center transition-colors duration-500 overflow-hidden relative font-sans">

      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-200/20 dark:bg-blue-900/10 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-200/20 dark:bg-indigo-900/10 blur-[100px] rounded-full -z-10" />

      <div className="max-w-[1400px] w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* LEFT COLUMN: Hero & Branding (Takes 5/12 space) */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left animate-in fade-in slide-in-from-left duration-700">
          <div className="inline-block px-3 py-1 rounded-full bg-white dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 shadow-sm">
            <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">Our Journey</p>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tighter">
            Modern <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-white dark:to-zinc-500">
              Learning Era.
            </span>
          </h1>
          
          <p className="text-sm md:text-base text-slate-600 dark:text-zinc-400 font-medium max-w-md mx-auto lg:mx-0">
            Proxima isn't just a platform; it's an ecosystem designed to bridge the gap between academic theory and industry reality.
          </p>

          <div className="pt-4">
            <Link to="/explore-courses"><Button 
              onClick={() => navigate("/courses")}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-white dark:text-black px-8 py-6 rounded-2xl text-sm font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto lg:mx-0"
            >
              EXPLORE COURSES <ArrowRight size={18} />
            </Button></Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Mission & Values (Takes 7/12 space) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-right duration-700">
          
          {/* Mission Card */}
          <div className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-white dark:border-zinc-800 p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 flex flex-col justify-between group hover:border-blue-500 transition-all">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/30">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2">Our Mission</h2>
              <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">Providing high-quality, industry-relevant education that empowers global careers.</p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md border border-white dark:border-zinc-800 p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 flex flex-col justify-between hover:border-orange-500 transition-all">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-orange-500/30">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold mb-2">Our Vision</h2>
              <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed">Leading the global platform for skill development through innovative teaching.</p>
            </div>
          </div>

          {/* Excellence & Innovation (Horizontal spanning card) */}
          <div className="sm:col-span-2 bg-zinc-900 text-white p-6 rounded-[2.5rem] flex flex-col sm:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
            <div className="flex -space-x-3">
              <div className="w-12 h-12 rounded-full bg-blue-500 border-4 border-zinc-900 flex items-center justify-center"><Award size={20}/></div>
              <div className="w-12 h-12 rounded-full bg-emerald-500 border-4 border-zinc-900 flex items-center justify-center"><CheckCircle size={20}/></div>
              <div className="w-12 h-12 rounded-full bg-purple-500 border-4 border-zinc-900 flex items-center justify-center"><Code size={20}/></div>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-sm font-bold tracking-tight text-blue-400">CORE PRINCIPLES</h3>
              <p className="text-xs text-zinc-400 mt-1">Excellence, Integrity, and Innovation are woven into everything we do.</p>
            </div>
            {/* Subtle Pattern overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          </div>
          
          {/* Trust Badge / Info Card */}
          <div className="sm:col-span-2 py-4 px-6 border border-zinc-200 dark:border-zinc-800 rounded-3xl flex justify-between items-center bg-white/30 dark:bg-transparent">
             <div className="flex flex-col">
                <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">Global Status</span>
                <span className="text-sm font-bold">10,000+ Active Students</span>
             </div>
             <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">Since</span>
                <span className="text-sm font-bold">2026 Learning era</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutUs;