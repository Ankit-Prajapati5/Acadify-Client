import { useParams, useNavigate } from "react-router-dom";
import { useGetLectureByIdQuery } from "@/features/api/courseApi";
import { useEffect, useState, useCallback } from "react";
import { Loader2, Sparkles, BrainCircuit, ShieldAlert, Timer, FileQuestion, ArrowLeft, Skull, ShieldX, Monitor, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QuizPage = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isGenerating, setIsGenerating] = useState(true); 
  const [hasStarted, setHasStarted] = useState(false); 
  const [isMalpractice, setIsMalpractice] = useState(false); 

  const { data, isLoading } = useGetLectureByIdQuery({ courseId, lectureId });
  const quiz = data?.lecture?.quiz;

  // 🔥 Console Bomb Logic
  useEffect(() => {
    const bomb = setInterval(() => {
      if (window.outerHeight - window.innerHeight > 160 || window.outerWidth - window.innerWidth > 160) {
        triggerMalpractice();
      }
    }, 1000);

    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      clearInterval(bomb);
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  const triggerMalpractice = useCallback(() => {
    setIsMalpractice(true);
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
    }
    setTimeout(() => {
      navigate(`/course/${courseId}/lecture/${lectureId}`); 
    }, 3500);
  }, [courseId, navigate, lectureId]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (quiz?.questions?.length) {
      const shuffledQuestions = shuffleArray(quiz.questions).map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));
      setQuestions(shuffledQuestions);
      setTimeLeft(60 * shuffledQuestions.length);
      const timer = setTimeout(() => setIsGenerating(false), 3500);
      return () => clearTimeout(timer);
    } else if (quiz && !quiz?.questions?.length) {
      setIsGenerating(false);
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft <= 0 || isGenerating || isMalpractice || !hasStarted) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isGenerating, isMalpractice, hasStarted]);

  useEffect(() => {
    if (timeLeft === 0 && questions.length > 0 && hasStarted) handleSubmit();
  }, [timeLeft, questions.length, hasStarted]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && hasStarted && !isMalpractice) {
        triggerMalpractice();
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [hasStarted, isMalpractice, triggerMalpractice]);

  const startQuiz = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(() => {
        setHasStarted(true);
      }).catch(() => {
        alert("Fullscreen permission is required to take the quiz.");
      });
    }
  };

  const handleSelect = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: option });
  };

  const handleSubmit = () => {
    if (isMalpractice) return;
    let score = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) score++;
    });
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    
    navigate(`/course/${courseId}/lecture/${lectureId}/quiz/result`, {
      state: { score, total: questions.length, questions, selectedAnswers },
    });
  };

  // --- GUARDS & MULTI-SCREEN RENDER ---

  if (isMalpractice) return (
    <div className="h-screen bg-red-950 flex flex-col items-center justify-center text-white p-6 relative">
        <div className="absolute inset-0 bg-red-600/10 animate-pulse" />
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="z-10 text-center">
            <Skull size={60} className="text-red-500 mx-auto mb-6 animate-bounce md:w-20 md:h-20" />
            <h1 className="text-2xl md:text-4xl font-black mb-2 uppercase tracking-tighter">Violation Detected</h1>
            <p className="text-red-300 font-mono text-[10px] md:text-xs tracking-widest uppercase">Immediate Termination Initiated...</p>
        </motion.div>
    </div>
  );

  if (isLoading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white p-4">
      <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
      <p className="text-zinc-500 animate-pulse font-mono text-[10px] uppercase tracking-[0.2em] text-center italic">Establishing Secure Protocol...</p>
    </div>
  );

  if (isGenerating) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white p-4 overflow-hidden">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-[60px] md:blur-[100px] rounded-full animate-pulse" />
            <BrainCircuit className="text-blue-500 relative z-10 animate-pulse w-16 h-16 md:w-20 md:h-20" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-8 space-y-2">
            <h2 className="text-xl md:text-2xl font-black italic tracking-tighter flex items-center justify-center gap-3">
                <Sparkles className="text-yellow-400 w-5 h-5 md:w-6 md:h-6" /> AI IS GENERATING QUIZ
            </h2>
            <p className="text-zinc-500 text-[9px] md:text-[10px] uppercase tracking-[0.3em] mt-4">Analyzing content data...</p>
        </motion.div>
    </div>
  );

  if (!hasStarted && questions.length > 0) return (
    <div className="h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-4">
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[300px] bg-blue-600/5 blur-[80px] md:blur-[120px]" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900/50 backdrop-blur-2xl border border-white/5 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] text-center max-w-md w-full shadow-2xl z-10">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <Lock size={28} className="md:w-8 md:h-8" />
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-2 italic">Secure Environment Ready</h2>
            <p className="text-zinc-500 text-xs md:text-sm mb-8 leading-relaxed italic">
                Environment validated. Timer starts once you enter. Screen monitoring active.
            </p>
            <button onClick={startQuiz} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95">
                <Monitor size={16} /> Start Secure Quiz
            </button>
        </motion.div>
    </div>
  );

  if (!questions || questions.length === 0) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <FileQuestion size={40} className="text-zinc-700 mb-4" />
        <h2 className="text-lg md:text-xl font-black uppercase italic tracking-widest">No Quiz Found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-500 text-sm flex items-center gap-2 font-bold"><ArrowLeft size={16}/> Go Back</button>
    </div>
  );

  // --- FINAL SCOPED VARIABLE (Safely defined here) ---
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center py-6 md:py-10 px-4 relative overflow-hidden">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] md:h-[500px] bg-blue-600/10 blur-[80px] md:blur-[120px] pointer-events-none" />

      {/* HEADER */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6 md:mb-8 sticky top-4 z-50 backdrop-blur-md bg-black/40 p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5">
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-2 md:px-3 py-1.5 rounded-lg border border-yellow-500/20 font-black text-[8px] md:text-[10px] uppercase tracking-tighter">
                <ShieldAlert size={12} className="md:w-4 md:h-4" /> <span className="hidden xs:inline">MONITORING</span> ACTIVE
            </div>
        </div>

        <div className={`flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-lg border font-mono text-xs md:text-sm shadow-lg transition-all duration-500 ${
            timeLeft <= 10 ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse" : "bg-zinc-900 border-zinc-800 text-blue-400"
        }`}>
          <Timer size={14} className="md:w-4 md:h-4" /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
        </div>
      </div>

      {/* PROGRESS */}
      <div className="w-full max-w-3xl h-1 bg-zinc-900 rounded-full mb-6 md:mb-8 overflow-hidden">
         <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-blue-600 to-cyan-400" />
      </div>

      {/* QUIZ CONTENT */}
      <motion.div key={currentIndex} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full max-w-3xl relative z-10 mb-20">
        <div className="bg-zinc-900/50 backdrop-blur-xl p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 shadow-2xl relative">
            <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5 font-black text-4xl md:text-6xl italic select-none uppercase tracking-tighter">Q{currentIndex + 1}</div>
            
            <div className="relative z-10">
                <span className="text-blue-500 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-2 block italic">Concept Check</span>
                <h2 className="text-lg md:text-2xl font-bold leading-tight mb-6 md:mb-8 leading-snug">
                    {currentQuestion?.question}
                </h2>

                <div className="grid grid-cols-1 gap-3">
                    {currentQuestion?.options?.map((opt, i) => (
                        <motion.div key={i} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => handleSelect(opt)}
                            className={`p-3 md:p-4 rounded-xl md:rounded-2xl border cursor-pointer transition-all duration-300 ${
                                selectedAnswers[currentIndex] === opt ? "bg-blue-600 border-blue-400 shadow-xl" : "bg-zinc-800/40 border-zinc-700 hover:border-zinc-500"
                            }`}
                        >
                            <div className="flex items-center gap-3 md:gap-4">
                                <span className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg text-[10px] md:text-xs font-black shrink-0 ${
                                    selectedAnswers[currentIndex] === opt ? "bg-white text-blue-600" : "bg-zinc-700 text-zinc-400"
                                }`}>
                                    {String.fromCharCode(65 + i)}
                                </span>
                                <span className={`text-xs md:text-sm font-medium leading-relaxed ${selectedAnswers[currentIndex] === opt ? "text-white" : "text-zinc-300"}`}>
                                    {opt}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-between items-center mt-8 md:mt-10 gap-3">
                    <button disabled={currentIndex === 0} onClick={() => setCurrentIndex((prev) => prev - 1)} className="flex-1 md:flex-none px-4 md:px-6 py-3 bg-zinc-800 rounded-xl text-[10px] md:text-xs font-bold uppercase transition-all tracking-widest">
                        Previous
                    </button>

                    {currentIndex === questions.length - 1 ? (
                        <button onClick={handleSubmit} className="flex-[2] md:flex-none px-6 md:px-8 py-3 bg-green-600 hover:bg-green-500 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all">
                            Finish
                        </button>
                    ) : (
                        <button onClick={() => setCurrentIndex((prev) => prev + 1)} className="flex-[2] md:flex-none px-6 md:px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all">
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
      </motion.div>

      <div className="fixed bottom-4 left-0 right-0 text-center px-4 pointer-events-none">
        <p className="text-zinc-600 text-[8px] md:text-[10px] uppercase tracking-[0.3em] font-medium italic animate-pulse">
            <ShieldX className="inline mr-2" size={10} /> Acadify Strict Enforcement
        </p>
      </div>
    </div>
  );
};

export default QuizPage;