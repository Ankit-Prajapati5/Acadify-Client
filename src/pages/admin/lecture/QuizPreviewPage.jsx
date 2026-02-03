import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEditLectureMutation } from "@/features/api/courseApi";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  ArrowLeft,
  Shuffle,
  Trash2,
  PlusCircle,
  ChevronUp, // Scroll top के लिए
  Layers,
  CheckCircle2,
} from "lucide-react";

const QuizPreviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id: courseId, lectureId } = useParams();

  // States
  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState("Generated Quiz");
  const [quizDifficulty, setQuizDifficulty] = useState("medium"); 
  const [activeTab, setActiveTab] = useState("medium");
  const [selectedQuestions, setSelectedQuestions] = useState([]); 
  const [highlighted, setHighlighted] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const questionRefs = useRef({});
  const lastProcessedData = useRef(""); 
  const [editLecture, { isLoading }] = useEditLectureMutation();

  // 🟢 1. DATA SYNC LOGIC
  useEffect(() => {
    if (state?.questions) {
      const incomingLevel = (state?.difficulty || "medium").toLowerCase();
      const dataFingerprint = JSON.stringify(state.questions) + incomingLevel;
      
      if (lastProcessedData.current === dataFingerprint) return;
      lastProcessedData.current = dataFingerprint;

      const newIncomingQuestions = state.questions.map((q) => ({
        ...q,
        level: q.level || incomingLevel, 
      }));

      setQuestions((prevQuestions) => {
        const otherLevelQuestions = prevQuestions.filter(q => q.level !== incomingLevel);
        return [...otherLevelQuestions, ...newIncomingQuestions];
      });

      setQuizTitle(state?.quizTitle || "Generated Quiz");
      setQuizDifficulty(incomingLevel); 
      setActiveTab(incomingLevel); 
      setSelectedQuestions([]);
      
      toast.success(`${incomingLevel.toUpperCase()} questions synced!`);
    }
  }, [state]);

  // 2. SCROLL LOGIC (Monitoring for the button)
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredQuestions = questions.filter((q) => q.level === activeTab);

  const updateQuestion = (globalIdx, updatedData) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[globalIdx] = { ...copy[globalIdx], ...updatedData };
      return copy;
    });
  };

  const handleShuffleOptions = (globalIdx) => {
    const q = questions[globalIdx];
    const shuffled = [...q.options].sort(() => Math.random() - 0.5);
    updateQuestion(globalIdx, { options: shuffled });
    toast.success("Options shuffled!");
  };

  const deleteQuestion = (globalIdx) => {
    setQuestions((prev) => prev.filter((_, i) => i !== globalIdx));
    setSelectedQuestions(prev => prev.filter(idx => idx !== globalIdx));
    toast.success("Question removed");
  };

  const handleBulkDelete = () => {
    if (!selectedQuestions.length) return toast.error("Select questions first!");
    setQuestions((prev) => prev.filter((_, idx) => !selectedQuestions.includes(idx)));
    setSelectedQuestions([]);
    toast.success("Deleted selected questions");
  };

  const addNewQuestion = () => {
    const newQ = {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      level: activeTab,
    };
    setQuestions([...questions, newQ]);
    toast.success(`Added new ${activeTab} question`);
  };

  const handleSaveQuiz = async () => {
    const emptyQ = questions.find(q => !q.question.trim());
    if (emptyQ) return toast.error("Some questions are empty!");

    try {
      await editLecture({
        courseId,
        lectureId,
        data: { 
          quiz: { 
            title: quizTitle, 
            questions: questions, 
            difficulty: quizDifficulty 
          } 
        },
      }).unwrap();
      
      toast.success("All categories saved successfully!");
      navigate(-1);
    } catch {
      toast.error("Failed to save quiz");
    }
  };

  const scrollToQuestion = (filteredIdx) => {
    questionRefs.current[filteredIdx]?.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlighted(filteredIdx);
    setTimeout(() => setHighlighted(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 pb-24 md:pb-10">
      
      {/* 🟢 TOP NAV */}
      <div className="sticky top-0 z-[100] bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0 text-zinc-400">
              <ArrowLeft size={20} />
            </Button>
            <input
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="bg-transparent text-lg font-bold outline-none border-b border-transparent focus:border-purple-500 truncate w-full"
            />
          </div>
          <Button onClick={handleSaveQuiz} disabled={isLoading} className="hidden md:flex bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20 px-6">
            {isLoading ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2"/> Save Changes</>}
          </Button>
        </div>

        {/* 🟡 CATEGORY TABS */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-center md:justify-start">
          {["easy", "medium", "hard"].map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedQuestions([]); }}
              className={`px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${
                activeTab === tab 
                ? "border-purple-500 text-purple-400 bg-purple-500/5" 
                : "border-transparent text-zinc-600 hover:text-zinc-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 p-4 md:p-8">
        
        {/* 🟣 LEFT: NAVIGATOR */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 md:sticky md:top-36 shadow-xl">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <Layers size={14} /> Navigator
                </h3>
                <span className="text-xs font-mono text-purple-500 bg-purple-500/10 px-2 rounded">
                  {filteredQuestions.length}
                </span>
            </div>
            
            <div className="grid grid-cols-5 md:grid-cols-4 gap-2 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar">
              {filteredQuestions.map((q, i) => {
                const globalIndex = questions.indexOf(q);
                return (
                  <button
                    key={i}
                    onClick={() => scrollToQuestion(i)}
                    className={`aspect-square text-[11px] font-bold rounded-lg border transition-all flex items-center justify-center ${
                      selectedQuestions.includes(globalIndex) 
                      ? "bg-red-500 border-red-500 text-white" 
                      : "bg-zinc-800 border-zinc-700 hover:border-purple-500 text-zinc-400"
                    } ${highlighted === i ? "ring-2 ring-purple-500 scale-110" : ""}`}
                  >
                    {i + 1}
                  </button>
                )
              })}
              <button onClick={addNewQuestion} className="aspect-square flex items-center justify-center rounded-lg border-2 border-dashed border-zinc-700 hover:border-purple-500 text-zinc-500 transition-colors">
                <PlusCircle size={18} />
              </button>
            </div>

            {selectedQuestions.length > 0 && (
              <Button variant="destructive" className="w-full mt-5 h-9 text-[10px] font-bold" onClick={handleBulkDelete}>
                <Trash2 size={14} className="mr-2" /> DELETE SELECTED ({selectedQuestions.length})
              </Button>
            )}
          </div>
        </aside>

        {/* 🔵 RIGHT: QUESTIONS LIST */}
        <main className="flex-1 space-y-6">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q, i) => {
              const globalIndex = questions.indexOf(q);
              return (
                <div
                  key={i}
                  ref={(el) => (questionRefs.current[i] = el)}
                  className={`group p-6 rounded-2xl border transition-all duration-500 ${
                    highlighted === i
                      ? "border-purple-500 ring-4 ring-purple-500/10 bg-zinc-900 shadow-2xl scale-[1.01]"
                      : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded accent-purple-600 cursor-pointer"
                        checked={selectedQuestions.includes(globalIndex)}
                        onChange={(e) => {
                          setSelectedQuestions(prev => 
                            e.target.checked ? [...prev, globalIndex] : prev.filter(idx => idx !== globalIndex)
                          );
                        }}
                      />
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                        {activeTab} Q.{i + 1}
                      </span>
                    </div>
                    <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-purple-400" onClick={() => handleShuffleOptions(globalIndex)}>
                          <Shuffle size={14} />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-red-400" onClick={() => deleteQuestion(globalIndex)}>
                          <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>

                  <textarea
                    value={q.question}
                    onChange={(e) => updateQuestion(globalIndex, { question: e.target.value })}
                    className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-sm focus:ring-1 focus:ring-purple-500 outline-none resize-none transition-all"
                    rows={2}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${q.correctAnswer === opt && opt !== "" ? "bg-emerald-500/10 border-emerald-500/50" : "bg-zinc-950/50 border-zinc-800"}`}>
                        <input 
                          type="radio" 
                          name={`correct-${globalIndex}`}
                          checked={q.correctAnswer === opt && opt !== ""}
                          onChange={() => updateQuestion(globalIndex, { correctAnswer: opt })}
                          className="accent-emerald-500 h-4 w-4 cursor-pointer"
                        />
                        <input
                          value={opt}
                          placeholder={`Option ${optIdx + 1}`}
                          onChange={(e) => {
                            const newOpts = [...q.options];
                            newOpts[optIdx] = e.target.value;
                            updateQuestion(globalIndex, { options: newOpts });
                          }}
                          className="bg-transparent text-xs outline-none w-full"
                        />
                        {q.correctAnswer === opt && opt !== "" && <CheckCircle2 size={14} className="text-emerald-500" />}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/10">
               <Layers className="text-zinc-800 mb-4" size={48} />
               <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No {activeTab} Questions Found</p>
               <Button onClick={addNewQuestion} variant="outline" className="mt-6 border-zinc-800">
                  <PlusCircle size={16} className="mr-2" /> Add {activeTab} Question
               </Button>
            </div>
          )}
        </main>
      </div>

      {/* 🔵 FLOATING SCROLL TO TOP BUTTON (Fixed on Right) */}
      {showScrollTop && (
        <Button 
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          size="icon" 
          className="fixed bottom-24 right-6 md:bottom-8 md:right-8 rounded-full h-12 w-12 bg-zinc-800 hover:bg-zinc-700 text-white shadow-2xl border border-zinc-700 z-[120] transition-all animate-in fade-in slide-in-from-bottom-4"
        >
          <ChevronUp size={24} />
        </Button>
      )}

      {/* 🟢 MOBILE ACTION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#09090b]/95 backdrop-blur-xl border-t border-zinc-800 p-4 flex gap-3 z-[110]">
          <Button variant="outline" onClick={addNewQuestion} className="flex-1 bg-zinc-900 border-zinc-800 h-11">
             Add Q.
          </Button>
          <Button onClick={handleSaveQuiz} disabled={isLoading} className="flex-1 bg-purple-600 h-11">
             Save Changes
          </Button>
      </div>
    </div>
  );
};

export default QuizPreviewPage;