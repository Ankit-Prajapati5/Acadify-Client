import { Lock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const LectureList = ({ lectures = [], courseId, isPurchased }) => {
  const navigate = useNavigate();

  const playLecture = (lecture) => {
    navigate(`/course/${courseId}/lecture/${lecture._id}`);
  };

  if (!lectures.length) {
    return (
      <div className="p-10 text-center text-sm font-bold uppercase tracking-widest text-zinc-400 border-2 border-dashed rounded-2xl">
        No lectures added yet.
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
      {lectures.map((lecture, index) => {
        const isPreview = lecture.isPreviewFree;
        const isLocked = !isPurchased && !isPreview;

        return (
          <div
            key={lecture._id}
            onClick={() => {
              if (!isPurchased && isLocked) {
                toast.error("Please purchase the course to unlock lectures");
                return;
              }

              if (isPurchased) {
                toast.info('Please click on "Continue Course" to play lectures');
              }
            }}
            className={`group flex items-center justify-between p-4 border rounded-2xl transition-all duration-300
            ${
              isPurchased
                ? "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:shadow-md cursor-pointer"
                : isLocked
                ? "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-100 dark:border-zinc-800 cursor-not-allowed opacity-70"
                : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-blue-500/30 shadow-sm"
            }`}
          >
            {/* LEFT - Same Logic */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {isLocked ? (
                  <div className="p-2 bg-red-50 dark:bg-red-900/10 rounded-lg">
                    <Lock className="text-red-500" size={18} />
                  </div>
                ) : (
                  <div className="p-2 bg-green-50 dark:bg-green-900/10 rounded-lg">
                    <PlayCircle className="text-green-600" size={18} />
                  </div>
                )}
              </div>

              <div>
                <p className={`font-bold text-sm tracking-tight ${isLocked ? "text-zinc-500" : "text-zinc-800 dark:text-zinc-200"}`}>
                  <span className="text-zinc-400 font-medium mr-1">{index + 1}.</span> {lecture.lectureTitle}
                </p>

                {!isPurchased && isPreview && (
                  <span className="inline-flex items-center mt-1 text-[10px] font-black uppercase tracking-wider text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-md">
                    Free Preview
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT — Styled Play Button */}
            {!isPurchased && isPreview && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  playLecture(lecture);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-tighter px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-transform active:scale-95"
              >
                <PlayCircle size={14} className="mr-1"/> Play
              </Button>
            )}

            {/* Locked Icon for Right Side */}
            {isLocked && (
               <Lock className="text-zinc-300 dark:text-zinc-700" size={16} />
            )}
          </div>
        );
      })}

      {/* 🔥 FIX: jsx attribute hata diya gaya hai */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; }
      `}</style>
    </div>
  );
};

export default LectureList;