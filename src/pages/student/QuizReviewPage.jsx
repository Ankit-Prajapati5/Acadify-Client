import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ArrowLeft, Trophy, HelpCircle } from "lucide-react";

const QuizReviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Data coming from QuizResultPage state
  const questions = state?.questions || [];
  const selectedAnswers = state?.selectedAnswers || {};
  const score = state?.score || 0;
  const total = state?.total || 0;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-3xl pt-14 mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors border border-zinc-800"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-black uppercase tracking-tighter text-cyan-400">Review Performance</h1>
            <p className="text-[10px] text-zinc-500 font-mono italic">Final Score: {score}/{total}</p>
          </div>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>

        {/* Questions List */}
        <div className="space-y-6 pb-20">
          {questions.map((q, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={index}
                className={`p-6 rounded-3xl border transition-all ${
                  isCorrect 
                  ? "bg-zinc-900/40 border-emerald-500/20" 
                  : "bg-zinc-900/40 border-red-500/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Number Badge */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                    isCorrect ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
                  }`}>
                    {index + 1}
                  </div>

                  <div className="space-y-4 w-full">
                    {/* Question Text */}
                    <h3 className="text-sm md:text-md font-medium leading-relaxed text-zinc-200">
                      {q.question}
                    </h3>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map((option, optIdx) => {
                        const isUserChoice = userAnswer === option;
                        const isRightAnswer = q.correctAnswer === option;

                        let statusClasses = "bg-zinc-900/50 border-zinc-800 text-zinc-500";
                        
                        if (isRightAnswer) {
                          statusClasses = "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                        } else if (isUserChoice && !isCorrect) {
                          statusClasses = "bg-red-500/10 border-red-500/40 text-red-400";
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${statusClasses}`}
                          >
                            <span className="flex items-center gap-3">
                              <span className="opacity-40">{String.fromCharCode(65 + optIdx)}.</span>
                              {option}
                            </span>
                            
                            {isRightAnswer && <CheckCircle2 size={14} className="shrink-0" />}
                            {isUserChoice && !isCorrect && <XCircle size={14} className="shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation/Summary Badge */}
                    {!isCorrect && (
                      <div className="mt-4 p-3 rounded-2xl bg-zinc-950 border border-zinc-800/50 flex items-start gap-3">
                        <HelpCircle size={14} className="text-cyan-500 mt-0.5" />
                        <p className="text-[11px] text-zinc-400 leading-normal">
                          Quick Tip: Your answer was <span className="text-red-400">{userAnswer || "Skipped"}</span>. 
                          The correct logic points to <span className="text-emerald-400">{q.correctAnswer}</span>.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs px-4">
          <button
            onClick={() => navigate(-3)}
            className="w-full py-4 bg-white text-black font-black rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
          >
            <Trophy size={16} /> Back to Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizReviewPage;