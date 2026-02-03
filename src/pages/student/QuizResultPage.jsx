import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useState, useMemo } from "react";
import { 
  Trophy, RotateCcw, Eye, ChevronLeft, 
  Medal, Zap, Award, Sparkles, Target, 
  ArrowRight, Star
} from "lucide-react";

const QuizResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { courseId, lectureId } = useParams();

  const score = state?.score || 0;
  const total = state?.total || 10;
  const questions = state?.questions || [];
  const selectedAnswers = state?.selectedAnswers || {};
  const percentage = Math.round((score / total) * 100);

  const [unwrapped, setUnwrapped] = useState(false);
  const [randomThought, setRandomThought] = useState("");

  const thoughtsDB = {
    perfect: [
     "Outstanding! You mastered this topic like a champion 🚀",
      "Flawless victory! You are a subject matter expert now.",
      "God Mode Activated! Your focus is absolutely unbreakable.",
      "Pure brilliance! You didn't leave a single point behind.",
      "Einstein level intelligence detected! Keep dominating.",
      "Is there anything you can't do? Perfect score! 🔥",
      "100% focus, 100% effort, 100% success. Phenomenal!",
      "You've reached the peak of the mountain today! 🏔️",
      "Absolutely unstoppable! You've conquered the quiz.",
      "The GOAT! Nobody is doing it like you right now. 🐐"


    ],
    excellent: [
    
"Strong work! You clearly know your stuff inside out. 💪",
      "Incredible! You're just a step away from perfection.",
      "High achiever alert! You crushed this one.",
      "Almost perfect! Great command over the concepts.",
      "Solid understanding. You're building serious expertise.",
      "Impressive results! Your hard work is clearly paying off.",
      "You're in the elite zone now. Keep that momentum!",
      "Top-shelf performance! You're outshining the rest.",
      "Great focus! You've grasped the core concepts well.",
      "You're on fire! Just a little polish and you'll be #1. ⚡"

    ],
    average: [
     
"Good effort! A little more revision and you'll be elite. 🙂",
      "Steady progress. You're halfway to complete mastery.",
      "Not bad at all! You've got the basics down firmly.",
      "Decent attempt. Focus on the tricky parts next time.",
      "You're getting there! Keep the practice alive and well.",
      "Respectable score. Your potential is much higher though.",
      "Keep learning! Every correct answer is a step forward.",
      "The foundation is set. Now build the skyscraper! 🏗️",
      "Nice try! You have the logic, just refine the details.",
      "Balanced performance. Time to push for the 100%! 🎯"

    ],
    pushing: [
      "Every expert was once a beginner. Don't stop now! 💥",
      "Mistakes are the stairs to success. Keep climbing!",
      "The comeback is always stronger than the setback.",
      "Don't be discouraged. Failure is just feedback.",
      "Keep going! Greatness takes time and consistent practice.",
      "A tough start just means a glorious finish later. 🏁",
      "Focus on your growth, not just the score today.",
      "You've got this! Re-read the material and try again.",
      "Success is 99% perspiration. Keep sweating it out!",
      "Don't quit! Your breakthrough is right around the corner."

    ]
  };

  const { performance, voiceText, category, themeColor, glowColor } = useMemo(() => {
    if (percentage === 100) return { performance: "PERFECT 🔥", voiceText: "Perfect score! Incredible.", category: "perfect", themeColor: "#22d3ee", glowColor: "rgba(34, 211, 238, 0.4)" };
    if (percentage >= 70) return { performance: "EXCELLENT 💪", voiceText: "Excellent work!", category: "excellent", themeColor: "#a855f7", glowColor: "rgba(168, 85, 247, 0.4)" };
    if (percentage >= 40) return { performance: "AVERAGE 🙂", voiceText: "Nice attempt.", category: "average", themeColor: "#eab308", glowColor: "rgba(234, 179, 8, 0.4)" };
    return { performance: "KEEP PUSHING 💥", voiceText: "Keep practicing.", category: "pushing", themeColor: "#ef4444", glowColor: "rgba(239, 68, 68, 0.4)" };
  }, [percentage]);

  useEffect(() => {
    const thoughts = thoughtsDB[category];
    setRandomThought(thoughts[Math.floor(Math.random() * thoughts.length)]);
    
    const utterance = new SpeechSynthesisUtterance(voiceText);
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
    return () => speechSynthesis.cancel();
  }, [category, voiceText]);

  return (
    <div className="min-h-screen bg-[#020203] text-white flex justify-center items-center p-4 md:p-6 relative overflow-hidden">
      
      {/* 🟢 AWESOME BACKGROUND ANIMATION */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated Blobs */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0], rotate: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, -80, 0], rotate: [360, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[600px] h-[600px] rounded-full"
          style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
        />
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      {/* Confetti for High Scores */}
      {percentage >= 70 && (
        <Confetti 
          recycle={false} 
          numberOfPieces={percentage === 100 ? 600 : 200} 
          gravity={0.15} 
          colors={[themeColor, '#ffffff', '#fbbf24']} 
        />
      )}

      {/* 🟢 MAIN RESULT CARD */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="relative z-10 w-full max-w-[500px] bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{ boxShadow: `0 0 50px -10px ${glowColor}` }}
      >
        {/* Card Shine Effect */}
        <div className="absolute -top-[150%] -left-[50%] w-[200%] h-[200%] rotate-45 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

        {/* Top Content */}
        <div className="flex justify-between items-center mb-8">
            <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1">Session Data</p>
                <h2 className="text-xl font-black italic tracking-tighter">SCORECARD</h2>
            </div>
            <div className="w-12 h-12 bg-zinc-800/50 rounded-2xl flex items-center justify-center border border-white/10">
                <Target className="text-zinc-400" size={20} />
            </div>
        </div>

        {/* Circular Progress Section */}
        <div className="relative w-44 h-44 md:w-52 md:h-52 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <circle cx="50%" cy="50%" r="42%" stroke="#111" strokeWidth="12" fill="transparent" />
            <motion.circle
              cx="50%" cy="50%" r="42%" 
              stroke={themeColor}
              strokeWidth="12" fill="transparent"
              strokeDasharray="100 100"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: percentage / 100 }}
              transition={{ duration: 2, ease: "circOut" }}
              strokeLinecap="round"
              filter="url(#glow)"
              style={{ pathLength: percentage / 100, strokeDasharray: '264 264' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-5xl md:text-6xl font-black tracking-tighter"
            >
              {percentage}%
            </motion.span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-800/80 px-2 py-0.5 rounded-md">
                {score} / {total} Correct
            </span>
          </div>
        </div>

        {/* Level Tag */}
        <motion.div 
            initial={{ y: 10, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-4 mb-8"
        >
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2 rounded-full shadow-2xl">
                <Star size={14} className="fill-current" style={{ color: themeColor }} />
                <span className="text-[11px] font-black tracking-[0.2em]">{performance}</span>
            </div>
            <p className="text-sm md:text-base text-zinc-300 font-medium italic leading-relaxed px-4">
              "{randomThought}"
            </p>
        </motion.div>

        {/* Special Unlock Section */}
        <AnimatePresence>
            {percentage === 100 && !unwrapped && (
            <motion.div
                layoutId="reward"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setUnwrapped(true)}
                className="mb-8 p-6 bg-gradient-to-br from-cyan-500/20 to-blue-600/10 rounded-[2rem] border border-cyan-500/30 cursor-pointer group relative"
            >
                <motion.div animate={{ rotate: [0, -5, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <Award size={40} className="text-cyan-400 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                </motion.div>
                <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Unwrap Achievement</p>
            </motion.div>
            )}

            {unwrapped && (
            <motion.div
                layoutId="reward"
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="mb-8 p-5 bg-cyan-500/10 border border-cyan-500/30 rounded-[2rem] flex items-center gap-5 text-left"
            >
                <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/40">
                    <Medal size={30} className="text-black" />
                </div>
                <div>
                    <h2 className="font-black text-cyan-400 text-sm tracking-tight uppercase">Mastery Badge Unlocked</h2>
                    <p className="text-zinc-500 text-[9px] font-bold uppercase mt-1">Synced to your learning profile</p>
                </div>
            </motion.div>
            )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/course/${courseId}/lecture/${lectureId}/quiz/review`, { state: { questions, selectedAnswers, score, total } })}
            className="group w-full flex items-center justify-center gap-3 py-4 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all text-xs uppercase tracking-[0.2em] shadow-xl active:scale-[0.98]"
          >
            <Eye size={18} /> Review Performance <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate(`/course/${courseId}/lecture/${lectureId}`)}
                className="flex items-center justify-center gap-2 py-4 bg-zinc-800/50 text-white font-bold rounded-2xl border border-white/5 hover:bg-zinc-800 transition-all text-[10px] uppercase tracking-widest active:scale-95"
              >
                <ChevronLeft size={16} /> Dashboard
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 py-4 bg-zinc-800/50 text-white font-bold rounded-2xl border border-white/5 hover:bg-zinc-800 transition-all text-[10px] uppercase tracking-widest active:scale-95"
              >
                <RotateCcw size={14} /> Try Again
              </button>
          </div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 opacity-20 flex items-center gap-2 pointer-events-none">
          <Zap size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Acadify Neural Engine</span>
      </div>
    </div>
  );
};

export default QuizResultPage;