import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, XCircle, ArrowLeft, Trophy, 
  AlertCircle, ArrowUp, LayoutGrid, BarChart3, HelpCircle
} from "lucide-react";

const QuizReviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const questionRefs = useRef({});
  const scrollContainerRef = useRef(null);

  const questions = state?.questions || [];
  const selectedAnswers = state?.selectedAnswers || {};
  const score = state?.score || 0;
  const total = state?.total || 0;
  const percentage = Math.round((score / total) * 100);

  // स्टेटस चेक करने के लिए हेल्पर फंक्शन
  const getStatus = (q, idx) => {
    const userAnswer = selectedAnswers[idx];
    if (!userAnswer) return { label: "Skipped", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: <HelpCircle size={14}/> };
    if (userAnswer === q.correctAnswer) return { label: "Correct", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: <CheckCircle2 size={14}/> };
    return { label: "Incorrect", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: <XCircle size={14}/> };
  };

  const scrollToQuestion = (idx) => {
    questionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="h-screen flex flex-col bg-[#050505] text-white overflow-hidden">
      
      {/* 🟢 HEADER (Fixed) */}
      <header className="shrink-0 z-[100] bg-black/60 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 bg-zinc-900/50 rounded-lg hover:bg-zinc-800 border border-white/5 text-zinc-400">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-sm md:text-lg font-black uppercase tracking-tighter">Review Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-zinc-900/80 border border-white/5 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Trophy size={14} className="text-yellow-500" />
              <span className="font-mono text-xs font-black">{score}/{total}</span>
            </div>
            <div className={`px-3 py-1.5 rounded-lg border hidden sm:block font-black font-mono text-xs ${percentage >= 50 ? 'border-emerald-500/20 text-emerald-500' : 'border-red-500/20 text-red-500'}`}>
                {percentage}% Accuracy
            </div>
          </div>
        </div>
      </header>

      {/* 🟢 MAIN CONTENT (Divided into 2 Divs) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-7xl w-full mx-auto">
        
        {/* 🟣 LEFT DIV: FIXED NAVIGATOR (Top on Mobile, Left on Desktop) */}
        <aside className="w-full lg:w-80 shrink-0 bg-zinc-950/50 border-b lg:border-b-0 lg:border-r border-white/5 p-4 md:p-6 z-[90]">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                <LayoutGrid size={12} /> Navigator
              </h3>
              <BarChart3 size={12} className="text-zinc-700" />
            </div>

            {/* Grid Table - Doesn't scroll on its own, fits the aside */}
            <div className="grid grid-cols-8 xs:grid-cols-10 lg:grid-cols-5 gap-1.5 md:gap-2">
              {questions.map((q, idx) => {
                const status = getStatus(q, idx);
                return (
                  <button
                    key={idx}
                    onClick={() => scrollToQuestion(idx)}
                    className={`aspect-square rounded-md md:rounded-xl text-[9px] font-black border transition-all flex items-center justify-center hover:scale-110 ${status.bg} ${status.border} ${status.color}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend - Visible only on Desktop */}
            <div className="mt-auto pt-6 space-y-2 hidden lg:block">
              <div className="text-[9px] font-bold uppercase text-zinc-500 mb-2">Summary Labels</div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                <CheckCircle2 size={12}/> Correct: {score}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-red-500 bg-red-500/5 p-2 rounded-lg border border-red-500/10">
                <XCircle size={12}/> Incorrect: {questions.filter((q,i)=>selectedAnswers[i] && selectedAnswers[i]!==q.correctAnswer).length}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                <HelpCircle size={12}/> Skipped: {questions.filter((_,i)=>!selectedAnswers[i]).length}
              </div>
            </div>
          </div>
        </aside>

        {/* 🔵 RIGHT DIV: SCROLLABLE QUESTIONS */}
        <main 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar pb-32"
        >
          {questions.map((q, index) => {
            const userAnswer = selectedAnswers[index];
            const status = getStatus(q, index);

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                key={index}
                ref={(el) => (questionRefs.current[index] = el)}
                className={`p-6 md:p-8 rounded-[2rem] border bg-zinc-900/30 transition-all ${status.border}`}
              >
                <div className="flex flex-col gap-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs border ${status.bg} ${status.border} ${status.color}`}>
                        {index + 1}
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${status.bg} ${status.border} ${status.color}`}>
                        {status.icon} {status.label}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-base md:text-xl font-bold leading-relaxed text-zinc-100">
                    {q.question}
                  </h3>

                  {/* Options List */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {q.options.map((option, optIdx) => {
                      const isUserChoice = userAnswer === option;
                      const isRightAnswer = q.correctAnswer === option;

                      let boxStyle = "bg-zinc-800/20 border-white/5 text-zinc-500";
                      if (isRightAnswer) boxStyle = "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 ring-1 ring-emerald-500/10";
                      else if (isUserChoice) boxStyle = "bg-red-500/10 border-red-500/40 text-red-400 ring-1 ring-red-500/10";

                      return (
                        <div key={optIdx} className={`p-4 rounded-2xl border text-sm flex items-center justify-between transition-all ${boxStyle}`}>
                          <span className="flex items-center gap-4">
                            <span className="opacity-40 font-mono font-bold">{String.fromCharCode(65 + optIdx)}</span>
                            <span className="font-medium">{option}</span>
                          </span>
                          {isRightAnswer && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
                          {isUserChoice && !isRightAnswer && <XCircle size={16} className="text-red-500 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Section */}
                  <div className="mt-2 p-4 rounded-2xl bg-black/40 border border-white/5 flex items-start gap-3">
                    <AlertCircle size={16} className="text-zinc-500 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-[10px] font-black uppercase text-zinc-500 mb-1 tracking-widest">Analysis</p>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Correct Answer: <span className="text-emerald-500 font-bold">{q.correctAnswer}</span>. 
                          {userAnswer ? (
                             userAnswer === q.correctAnswer 
                             ? " Your identification was spot on." 
                             : ` You incorrectly selected ${userAnswer}.`
                          ) : " This question was skipped during the assessment."}
                        </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </main>
      </div>

      {/* 🟢 FOOTER BAR (Fixed) */}
      <footer className="shrink-0 bg-black/80 backdrop-blur-xl border-t border-white/5 p-4 z-[100]">
        <div className="max-w-xs mx-auto">
          <button
            onClick={() => navigate(-3)}
            className="w-full py-4 bg-white text-black font-black rounded-2xl shadow-2xl active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Trophy size={16} /> Exit Review
          </button>
        </div>
      </footer>

      {/* 🔴 Scroll To Top (Within Right Div) */}
      <button 
        onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-24 right-6 h-12 w-12 bg-zinc-800 text-white rounded-full border border-white/10 shadow-2xl flex items-center justify-center z-[110] hover:bg-zinc-700 transition-all"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};

export default QuizReviewPage;