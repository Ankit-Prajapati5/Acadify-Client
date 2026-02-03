import { useParams, useNavigate } from "react-router-dom";
import { useGetLectureByIdQuery } from "@/features/api/courseApi";
import { useEffect, useState, useCallback, useMemo } from "react";
import { 
  Loader2, Sparkles, BrainCircuit, ShieldAlert, Timer, FileQuestion, 
  ArrowLeft, Skull, ShieldX, Monitor, Lock, BarChart, 
  ChevronRight, ChevronLeft, AlertTriangle, CheckCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QuizPage = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  
  // States
  const [questions, setQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0])); // 🟢 Visited track
  const [isGenerating, setIsGenerating] = useState(true); 
  const [hasStarted, setHasStarted] = useState(false); 
  const [isMalpractice, setIsMalpractice] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [showConfirmModal, setShowConfirmModal] = useState(false); // 🟢 Confirm Modal

  const [selectedLevel, setSelectedLevel] = useState("medium");

  const { data, isLoading } = useGetLectureByIdQuery({ courseId, lectureId });
  const quiz = data?.lecture?.quiz;

  // --- Security Logic ---
  useEffect(() => {
    const bomb = setInterval(() => {
      if (window.outerHeight - window.innerHeight > 160 || window.outerWidth - window.innerWidth > 160) {
        if(!isSubmitting && hasStarted) triggerMalpractice();
      }
    }, 1000);
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);
    return () => {
      clearInterval(bomb);
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, [isSubmitting, hasStarted]);

  const triggerMalpractice = useCallback(() => {
    if (isSubmitting) return; 
    setIsMalpractice(true);
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
    }
    setTimeout(() => {
      navigate(`/course/${courseId}/lecture/${lectureId}`); 
    }, 3500);
  }, [courseId, navigate, lectureId, isSubmitting]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeQuiz = (level) => {
    if (quiz?.questions?.length) {
      const levelQuestions = quiz.questions.filter(q => q.level === level);
      if (levelQuestions.length > 0) {
        const shuffledQuestions = shuffleArray(levelQuestions).map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }));
        setQuestions(shuffledQuestions);
        setTimeLeft(60 * shuffledQuestions.length);
      } else {
        setQuestions([]);
      }
    }
  };

  useEffect(() => {
    if (quiz) {
      const timer = setTimeout(() => setIsGenerating(false), 3500);
      return () => clearTimeout(timer);
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft <= 0 || isGenerating || isMalpractice || !hasStarted || isSubmitting) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isGenerating, isMalpractice, hasStarted, isSubmitting]);

  useEffect(() => {
    if (timeLeft === 0 && questions.length > 0 && hasStarted && !isSubmitting) {
        processFinalSubmit();
    }
  }, [timeLeft, questions.length, hasStarted]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && hasStarted && !isMalpractice && !isSubmitting) {
        triggerMalpractice();
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [hasStarted, isMalpractice, triggerMalpractice, isSubmitting]);

  const startQuiz = () => {
    initializeQuiz(selectedLevel);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().then(() => {
        setHasStarted(true);
      }).catch(() => {
        alert("Fullscreen permission required.");
      });
    }
  };

  const handleSelect = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: option });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setVisitedQuestions(prev => new Set(prev).add(nextIdx));
    }
  };

  const processFinalSubmit = async () => {
    setIsSubmitting(true);
    let score = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) score++;
    });

    if (document.fullscreenElement) {
        try { await document.exitFullscreen(); } catch (err) {}
    }
    
    setTimeout(() => {
        navigate(`/course/${courseId}/lecture/${lectureId}/quiz/result`, {
            state: { score, total: questions.length, questions, selectedAnswers },
        });
    }, 200);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const allVisited = visitedQuestions.size === questions.length;

  // --- Render Components ---

  if (isMalpractice) return (
    <div className="h-screen bg-red-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <Skull size={80} className="text-red-500 mb-6 animate-bounce" />
        <h1 className="text-3xl font-black mb-2 uppercase">Violation Detected</h1>
        <p className="text-red-300 font-mono text-xs tracking-widest uppercase">Immediate Termination Active...</p>
    </div>
  );

// --- 1. PREMIUM LOADING STATE ---
  if (isLoading) return (
    <div className="h-screen bg-[#020203] flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative mb-8">
            {/* Outer Rotating Ring */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-t-2 border-b-2 border-blue-500/30 rounded-full"
            />
            {/* Inner Fast Spinner */}
            <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        </div>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-center space-y-2"
        >
            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-blue-400">Securing Link</h2>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Establishing Encrypted Protocol...</p>
        </motion.div>
      </motion.div>

      {/* Cyberpunk Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
    </div>
  );

  // --- 2. PREMIUM AI GENERATING STATE ---
  if (isGenerating) return (
    <div className="h-screen bg-[#020203] flex flex-col items-center justify-center text-white relative overflow-hidden">
        {/* Animated Background Blobs */}
        <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
                x: [0, 50, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[100px] rounded-full"
        />

        <div className="relative z-10 flex flex-col items-center">
            {/* Brain Circuit with Shockwave Effect */}
            <div className="relative flex items-center justify-center mb-10">
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.5, 1.8], opacity: [0.5, 0.2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute w-24 h-24 bg-blue-500 rounded-full blur-xl"
                />
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative bg-zinc-900 p-6 rounded-[2rem] border border-white/10 shadow-2xl"
                >
                    <BrainCircuit className="text-blue-400 w-16 h-16" />
                </motion.div>
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 border border-dashed border-blue-500/20 rounded-full"
                />
            </div>

            {/* Dynamic Text Animation */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center space-y-4"
            >
                <div className="flex items-center justify-center gap-3">
                    <Sparkles className="text-yellow-400 w-5 h-5 animate-pulse" />
                    <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase">
                        Neural Synthesis
                    </h2>
                    <Sparkles className="text-yellow-400 w-5 h-5 animate-pulse" />
                </div>
                
                <div className="flex flex-col items-center gap-1">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em] animate-pulse">
                        AI is crafting your assessment
                    </p>
                    {/* Fake Progress Bar */}
                    <div className="w-48 h-1 bg-zinc-900 rounded-full mt-4 overflow-hidden">
                        <motion.div 
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-full h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                        />
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Floating Data Particles */}
        {[...Array(6)].map((_, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: [0, 1, 0], y: -100, x: Math.random() * 200 - 100 }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                className="absolute text-[8px] font-mono text-blue-500/20"
                style={{ left: `${Math.random() * 100}%` }}
            >
                {Math.random() > 0.5 ? '01011' : 'SYNCING'}
            </motion.div>
        ))}
    </div>
  );

  if (!hasStarted) return (
    <div className="h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-4 relative overflow-hidden">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900/50 backdrop-blur-2xl border border-white/5 p-8 rounded-[2.5rem] text-center max-w-md w-full z-10 shadow-2xl">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20 text-blue-500"><Lock size={32} /></div>
            <h2 className="text-2xl font-black uppercase mb-2 italic">Secure Portal</h2>
            <p className="text-zinc-500 text-[10px] mb-8 uppercase tracking-widest leading-relaxed">Initialize system settings by choosing difficulty level</p>
            <div className="grid grid-cols-3 gap-2 mb-8">
              {["easy", "medium", "hard"].map((lvl) => {
                const count = quiz?.questions?.filter(q => q.level === lvl).length || 0;
                return (
                  <button key={lvl} disabled={count === 0} onClick={() => setSelectedLevel(lvl)}
                    className={`flex flex-col items-center py-4 rounded-2xl transition-all border ${selectedLevel === lvl ? "bg-blue-600 border-blue-400 text-white shadow-lg" : "bg-zinc-800/50 border-white/5 text-zinc-500"}`}
                  >
                    <span className="text-[10px] font-black uppercase">{lvl}</span>
                    <span className="text-[8px] opacity-60 font-bold">{count} Qs</span>
                  </button>
                );
              })}
            </div>
            {quiz?.questions?.filter(q => q.level === selectedLevel).length > 0 ? (
              <button onClick={startQuiz} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 shadow-lg"><Monitor size={18} /> Start Examination</button>
            ) : <p className="text-red-500 text-[10px] font-bold">Category is currently empty</p>}
            <button onClick={() => navigate(-1)} className="mt-6 text-zinc-600 text-[10px] uppercase font-bold hover:text-white transition-colors">Cancel Session</button>
        </motion.div>
    </div>
  );

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center p-4 relative overflow-x-hidden">
      
      {/* 🟢 SUBMIT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirmModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-zinc-900 border border-white/10 p-8 rounded-[2rem] max-w-sm w-full text-center shadow-2xl">
                <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-black uppercase mb-2">Finish Quiz?</h3>
                <p className="text-zinc-400 text-xs mb-6 leading-relaxed">You have answered <span className="text-white font-bold">{answeredCount} out of {questions.length}</span> questions. You cannot change answers after submission.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 bg-zinc-800 rounded-xl text-[10px] font-bold uppercase tracking-widest">Review</button>
                  <button onClick={processFinalSubmit} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20">Submit Now</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6 sticky top-0 z-[60] backdrop-blur-md bg-black/60 p-3 md:p-4 rounded-2xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20 font-black text-[9px] md:text-[10px] uppercase">
                <ShieldAlert size={14} /> <span className="hidden sm:inline">PROCTORED</span> ACTIVE
            </div>
            <div className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-blue-400 font-black text-[9px] md:text-[10px] uppercase">
                LEVEL: {selectedLevel}
            </div>
        </div>

        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border font-mono text-sm md:text-lg transition-all ${
            timeLeft <= 30 ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse" : "bg-zinc-900 border-zinc-800 text-blue-400"
        }`}>
          <Timer size={18} /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
        </div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 mb-20">
        
        {/* LEFT: QUESTION AREA */}
        <div className="lg:col-span-8 flex flex-col">
            <div className="bg-zinc-900/40 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl relative flex-1 min-h-[450px]">
                <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-6xl md:text-8xl italic select-none">Q{currentIndex + 1}</div>
                
                <div>
                    <span className="text-blue-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-4 block">Question Assessment</span>
                    <h2 className="text-lg md:text-2xl font-bold leading-snug mb-8">{currentQuestion?.question}</h2>

                    <div className="grid grid-cols-1 gap-3">
                        {currentQuestion?.options?.map((opt, i) => (
                            <div key={i} onClick={() => handleSelect(opt)}
                                className={`p-4 md:p-5 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                                    selectedAnswers[currentIndex] === opt ? "bg-blue-600 border-blue-400 shadow-lg" : "bg-zinc-800/30 border-zinc-700 hover:border-zinc-500"
                                }`}
                            >
                                <span className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black shrink-0 ${
                                    selectedAnswers[currentIndex] === opt ? "bg-white text-blue-600" : "bg-zinc-700 text-zinc-400"
                                }`}>{String.fromCharCode(65 + i)}</span>
                                <span className="text-sm md:text-base font-medium">{opt}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CONTROLS */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-white/5">
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button disabled={currentIndex === 0} onClick={() => setCurrentIndex(prev => prev - 1)}
                            className="flex-1 sm:flex-none p-4 bg-zinc-800 rounded-2xl disabled:opacity-20"><ChevronLeft /></button>
                        {/* 🟢 Next disabled on last question */}
                        <button disabled={currentIndex === questions.length - 1} onClick={handleNext}
                            className="flex-1 sm:flex-none p-4 bg-zinc-800 rounded-2xl disabled:opacity-20"><ChevronRight /></button>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        {/* 🟢 Save & Next Only logic */}
                        <button onClick={handleNext} disabled={currentIndex === questions.length - 1} className="flex-1 sm:flex-none px-6 py-4 bg-zinc-700 hover:bg-zinc-600 rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-all">
                            Save & Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT: QUESTION MAP */}
        <div className="lg:col-span-4 space-y-4">
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl lg:sticky lg:top-24">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Question Map</h3>
                   <span className="text-[9px] bg-white/5 px-2 py-1 rounded text-zinc-400 font-bold uppercase">{answeredCount} / {questions.length} Answered</span>
                </div>
                
                {/* 🟢 GRID MAP (Numbers visible on mobile) */}
                <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-8 lg:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {questions.map((_, idx) => (
                        <button key={idx} onClick={() => { setCurrentIndex(idx); setVisitedQuestions(prev => new Set(prev).add(idx)); }}
                            className={`aspect-square rounded-xl text-[10px] font-bold border transition-all flex items-center justify-center ${
                                currentIndex === idx ? "bg-blue-600 border-blue-400 text-white scale-110 shadow-lg z-10" :
                                selectedAnswers[idx] ? "bg-green-600/20 border-green-500/50 text-green-500" :
                                visitedQuestions.has(idx) ? "bg-zinc-700/50 border-zinc-600 text-zinc-300" : "bg-zinc-800 border-zinc-800 text-zinc-600"
                            }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[8px] font-bold uppercase text-zinc-500">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-600" /> Current</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /> Answered</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-700" /> Visited</div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-800" /> Unvisited</div>
                    </div>
                    
                    {/* 🟢 Final submission only after all visited */}
                    <button 
                      disabled={!allVisited}
                      onClick={() => setShowConfirmModal(true)} 
                      className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                        allVisited ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                      }`}
                    >
                        {allVisited ? (
                           <><CheckCircle size={14} /> Submit Answered ({answeredCount}/{questions.length})</>
                        ) : (
                           `View all questions to submit (${visitedQuestions.size}/${questions.length})`
                        )}
                    </button>
                </div>
            </div>
            
            <div className="bg-blue-600/5 border border-blue-500/10 rounded-2xl p-4 flex items-center gap-3">
                <ShieldX className="text-blue-500/30" size={20} />
                <p className="text-[9px] text-zinc-500 font-bold uppercase leading-tight">Proctoring active. Visit all questions to enable the submission protocol.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;