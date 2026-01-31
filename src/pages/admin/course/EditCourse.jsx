import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CourseTab from "./CourseTab";
import { BookOpen, ArrowRight } from "lucide-react";

const EditCourse = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/30 dark:bg-transparent">
      
      {/* 🚀 FIXED STICKY HEADER: Added top-16 to avoid Navbar overlap */}
<div className="sticky top-16 md:top-0 z-30 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800/50 px-4 md:px-10 py-4 mb-2">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/10 p-2 rounded-xl hidden md:block">
              <BookOpen className="text-blue-600" size={20} />
            </div>
            <div>
              <h1 className="font-black text-lg md:text-xl uppercase tracking-tight italic leading-none">
                Course <span className="text-blue-600">Setup</span>
              </h1>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                Configuration & Details
              </p>
            </div>
          </div>

          <Link to="lecture" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto rounded-xl border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all group"
            >
              Manage Lectures
              <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* 📝 COURSE CONTENT AREA */}
      <div className="flex-1 px-0 md:px-10 pt-4">
        <div className="max-w-6xl mx-auto">
          <CourseTab />
        </div>
      </div>
      
    </div>
  );
};

export default EditCourse;