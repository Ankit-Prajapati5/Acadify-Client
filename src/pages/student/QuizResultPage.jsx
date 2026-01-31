import { useLocation, useNavigate, useParams } from "react-router-dom"; // useParams add kiya
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useState, useMemo } from "react";

const QuizResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { courseId, lectureId } = useParams(); // Params liye navigation ke liye

  const score = state?.score || 0;
  const total = state?.total || 10;
  const questions = state?.questions || []; // Review ke liye questions
  const selectedAnswers = state?.selectedAnswers || {}; // Review ke liye answers
  const percentage = Math.round((score / total) * 100);

  const [showGift, setShowGift] = useState(false);
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

  const { performance, voiceText, category } = useMemo(() => {
    if (percentage === 100) return { performance: "PERFECT 🔥", voiceText: "Perfect score! Incredible performance.", category: "perfect" };
    if (percentage >= 70) return { performance: "EXCELLENT 💪", voiceText: "Excellent work! You are performing really well.", category: "excellent" };
    if (percentage >= 40) return { performance: "AVERAGE 🙂", voiceText: "Nice attempt. Review the concepts again.", category: "average" };
    return { performance: "KEEP PUSHING 💥", voiceText: "Don't give up. Practice makes progress.", category: "pushing" };
  }, [percentage]);

  useEffect(() => {
    const thoughts = thoughtsDB[category];
    const randomIndex = Math.floor(Math.random() * thoughts.length);
    setRandomThought(thoughts[randomIndex]);

    const utterance = new SpeechSynthesisUtterance(voiceText);
    utterance.rate = 1;
    speechSynthesis.speak(utterance);

    return () => speechSynthesis.cancel();
  }, [category, voiceText]);

  return (
    <div className="min-h-screen pt-14 bg-gradient-to-br from-black via-zinc-900 to-black flex justify-center items-center p-6 relative overflow-hidden">
      {percentage === 100 && <Confetti recycle={false} numberOfPieces={300} />}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 text-center w-full max-w-md text-white relative"
      >
        <h1 className="text-xl font-bold mb-6 text-zinc-400 uppercase tracking-widest">Quiz Result</h1>

        <div className="relative w-40 h-40 mx-auto mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="80" cy="80" r="70" stroke="#27272a" strokeWidth="12" fill="transparent" />
            <motion.circle
              cx="80" cy="80" r="70" stroke={percentage >= 70 ? "#22d3ee" : percentage >= 40 ? "#facc15" : "#ef4444"}
              strokeWidth="12" fill="transparent"
              strokeDasharray={440}
              initial={{ strokeDashoffset: 440 }}
              animate={{ strokeDashoffset: 440 - (440 * percentage) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black">{percentage}%</span>
            <span className="text-[10px] text-zinc-500 uppercase">{score}/{total} Correct</span>
          </div>
        </div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mb-4">
          <span className={`px-5 py-2 rounded-full text-xs font-black shadow-lg uppercase tracking-tighter ${
            category === 'perfect' ? 'bg-cyan-500 text-black' : 
            category === 'excellent' ? 'bg-purple-600 text-white' : 
            category === 'average' ? 'bg-yellow-500 text-black' : 'bg-zinc-700 text-white'
          }`}>
            {performance}
          </span>
        </motion.div>

        <motion.p
          key={randomThought}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-zinc-300 mb-8 italic px-4"
        >
          "{randomThought}"
        </motion.p>

        {percentage === 100 && !unwrapped && (
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            onClick={() => {
              setUnwrapped(true);
              setShowGift(true);
            }}
            className="cursor-pointer text-6xl mb-6 hover:scale-110 transition-transform"
          >
            🎁
          </motion.div>
        )}

        {unwrapped && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl"
          >
            <h2 className="font-bold text-cyan-400">Master Badge Unlocked! 🏆</h2>
            <p className="text-[10px] text-zinc-400 mt-1 uppercase">Added to your profile</p>
          </motion.div>
        )}

        {/* 🔥 NEW BUTTON SECTION */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(`/course/${courseId}/lecture/${lectureId}/quiz/review`, { state: { questions, selectedAnswers, score, total } })}
            className="w-full py-3 bg-cyan-500 text-black font-black rounded-xl hover:bg-cyan-400 transition-colors uppercase text-sm tracking-tighter shadow-lg shadow-cyan-500/20"
          >
            Review Performance
          </button>

          <button
            onClick={() => navigate(-2)}
            className="w-full py-3 bg-white/5 border border-white/10 text-white font-black rounded-xl hover:bg-white/10 transition-colors uppercase text-sm tracking-tighter"
          >
            Back to Course
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizResultPage;