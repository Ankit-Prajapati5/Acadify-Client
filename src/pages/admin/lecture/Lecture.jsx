import { Edit, Lock, PlayCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const Lecture = ({ lecture, index }) => {
  const navigate = useNavigate();
  const { id: courseId } = useParams();

  const goToUpdateLecture = () => {
    navigate(`/admin/course/${courseId}/lecture/${lecture._id}`);
  };

  // 🔥 Fix: Check for videoId instead of videoUrl
  const hasVideo = lecture.videoId || lecture.videoUrl; 

  return (
    <div className="group flex items-center justify-between bg-white dark:bg-zinc-900/50 px-4 py-4 md:px-6 rounded-2xl my-3 border border-zinc-100 dark:border-zinc-800 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
      
      {/* LEFT: Content & Status */}
      <div className="flex items-center gap-4">
        {/* Step Number or Icon */}
        <div className="relative flex items-center justify-center shrink-0">
          {hasVideo ? (
            <div className="bg-green-100 dark:bg-green-900/20 p-2.5 rounded-xl">
              <PlayCircle className="text-green-600 dark:text-green-500" size={22} />
            </div>
          ) : (
            <div className="bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded-xl">
              <Lock className="text-zinc-400" size={22} />
            </div>
          )}
          
          <span className="absolute -top-2 -left-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
            {index + 1}
          </span>
        </div>

        {/* TITLE & META */}
        <div className="flex flex-col">
          <h1 className="font-bold text-sm md:text-base text-zinc-800 dark:text-zinc-100 leading-tight">
            {lecture.lectureTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
            {/* Status Badge */}
            <div className="flex items-center gap-1">
              {lecture.isPreviewFree ? (
                <span className="text-[9px] font-black uppercase tracking-widest text-green-600 bg-green-50 dark:bg-green-900/10 px-2 py-0.5 rounded-md border border-green-100 dark:border-green-900/30">
                  Free Preview
                </span>
              ) : (
                <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/10 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-900/30">
                  Paid Lecture
                </span>
              )}
            </div>

            {/* 🔥 Status Indicator Fixed */}
            {!hasVideo ? (
              <div className="flex items-center gap-1 text-red-500 bg-red-50 dark:bg-red-900/10 px-2 py-0.5 rounded-md border border-red-100 dark:border-red-900/30">
                <AlertCircle size={10} />
                <span className="text-[9px] font-black uppercase tracking-widest">No Video</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/30">
                <CheckCircle2 size={10} />
                <span className="text-[9px] font-black uppercase tracking-widest">Live & Ready</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Action Button */}
      <button
        onClick={goToUpdateLecture}
        className="ml-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all active:scale-90 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30"
        aria-label="Edit lecture"
      >
        <Edit size={18} />
      </button>
    </div>
  );
};

export default Lecture;