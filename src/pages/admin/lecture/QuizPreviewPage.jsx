import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEditLectureMutation } from "@/features/api/courseApi";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Save, ArrowLeft } from "lucide-react"; // ArrowLeft add kiya

const QuizPreviewPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { courseId, lectureId } = useParams();

  const [quizTitle, setQuizTitle] = useState(state?.quizTitle || "");
  const [questions, setQuestions] = useState(state?.questions || []);

  const [editLecture, { isLoading }] = useEditLectureMutation();

  useEffect(() => {
    if (questions.length > 0) {
      const fixed = questions.map((q) => {
        if (!q.options.includes(q.correctAnswer)) {
          return { ...q, correctAnswer: q.options[0] || "" };
        }
        return q;
      });
      
      if (JSON.stringify(fixed) !== JSON.stringify(questions)) {
        setQuestions(fixed);
      }
    }
  }, []);

  const handleSaveQuiz = async () => {
    try {
      await editLecture({
        courseId,
        lectureId,
        data: {
          quiz: {
            title: quizTitle,
            questions,
          },
        },
      }).unwrap();

      toast.success("Quiz saved successfully!");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to save quiz");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* 🔥 HEADER WITH BACK BUTTON */}
        <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="w-fit text-zinc-400 hover:text-white hover:bg-zinc-900 -ml-2 transition-all"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Lecture
          </Button>

          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-black text-purple-500 uppercase tracking-tighter">
              Quiz Preview
            </h1>
            <p className="text-zinc-500 text-sm font-mono bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
              LECTURE ID: {lectureId?.slice(-6)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase font-bold text-zinc-500 ml-2">Quiz Title</label>
          <input
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="w-full p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            placeholder="Enter Quiz Title..."
          />
        </div>

        {/* 🔥 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((q, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 hover:border-purple-500/50 transition-colors shadow-xl"
            >
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-xs text-zinc-400 uppercase tracking-widest">
                  Question {index + 1}
                </h2>
                <span className="text-[10px] bg-purple-900/30 text-purple-400 px-2 py-1 rounded-md border border-purple-800/50">
                  Multiple Choice
                </span>
              </div>

              <textarea
                value={q.question}
                onChange={(e) => {
                  const updated = [...questions];
                  updated[index] = { ...updated[index], question: e.target.value };
                  setQuestions(updated);
                }}
                className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-sm resize-none"
                rows={2}
              />

              <div className="space-y-2">
                <label className="text-[10px] uppercase text-zinc-500 font-bold">Options</label>
                {q.options.map((opt, i) => (
                  <div key={i} className="relative group">
                    <input
                      value={opt}
                      onChange={(e) => {
                        const updated = [...questions];
                        const newOptions = [...updated[index].options];
                        newOptions[i] = e.target.value;
                        updated[index] = { ...updated[index], options: newOptions };
                        setQuestions(updated);
                      }}
                      className="w-full p-3 pl-10 rounded-lg bg-zinc-950 border border-zinc-800 text-xs focus:border-zinc-600 transition-all"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-[10px] font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-[10px] uppercase text-green-500 font-bold mb-1 block">Correct Answer</label>
                <select
                  value={q.correctAnswer}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[index] = { ...updated[index], correctAnswer: e.target.value };
                    setQuestions(updated);
                  }}
                  className="w-full p-3 rounded-lg bg-green-900/10 border border-green-900/30 text-green-400 text-xs font-bold appearance-none cursor-pointer"
                >
                  {q.options.map((opt, i) => (
                    <option key={i} value={opt} className="bg-black text-white">
                      Option {String.fromCharCode(65 + i)}: {opt.slice(0, 40)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={handleSaveQuiz}
          disabled={isLoading}
          className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-purple-500/20 mb-10 transition-transform active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={20} />
              Saving to Lecture...
            </>
          ) : (
            <>
              <Save className="mr-2" size={20} />
              Confirm & Save Quiz
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuizPreviewPage;