import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
  useGenerateQuizMutation,
} from "@/features/api/courseApi";
import {
  Loader2,
  Trash2,
  CheckCircle,
  Sparkles,
  Eye,
  RefreshCw,
  FileQuestion,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

const LectureTab = () => {
  const { id: courseId, lectureId } = useParams();
  const navigate = useNavigate();

  // API Hooks
  const { data, isLoading, refetch } = useGetLectureByIdQuery(
    { courseId, lectureId },
    { refetchOnMountOrArgChange: true },
  );
  const [editLecture, { isLoading: updating }] = useEditLectureMutation();
  const [removeLecture, { isLoading: removing }] = useRemoveLectureMutation();
  const [generateQuiz, { isLoading: generating }] = useGenerateQuizMutation();

  // Lecture States
  const [lectureTitle, setLectureTitle] = useState("");
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // Quiz States
  const [transcript, setTranscript] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(10);
  const [showGenerator, setShowGenerator] = useState(false);

  // Sync state with Data
  useEffect(() => {
    if (data?.lecture) {
      const lecture = data.lecture;
      setLectureTitle(lecture.lectureTitle || "");
      setIsPreviewFree(Boolean(lecture.isPreviewFree));
      
      // ✅ FIX: Correct YouTube URL loading syntax
      setYoutubeUrl(lecture.videoId ? `https://www.youtube.com/watch?v=${lecture.videoId}` : "");

      if (lecture.quiz?.questions?.length > 0) {
        setQuizTitle(lecture.quiz.title || "Generated Quiz");
        setQuestions(lecture.quiz.questions);
        
        // Dropdown status follows the DB value on load
        if (lecture.quiz.difficulty) {
          setDifficulty(lecture.quiz.difficulty.toLowerCase());
        }
        
        setShowGenerator(false);
      } else {
        setShowGenerator(true);
      }
    }
  }, [data]);

  const extractVideoId = (url) => {
    const regExp =
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
    const match = url?.match(regExp);
    return match ? match[1] : null;
  };

  // Update Main Lecture Details
  const updateLectureHandler = async () => {
    const videoId = extractVideoId(youtubeUrl);
    if (!lectureTitle.trim()) return toast.error("Title required!");
    if (!videoId) return toast.error("Valid YouTube URL required!");

    try {
      await editLecture({
        courseId,
        lectureId,
        data: {
          lectureTitle,
          isPreviewFree,
          videoId,
          quiz: { title: quizTitle, questions, difficulty },
        },
      }).unwrap();
      toast.success("Details updated!");
      refetch();
    } catch (error) {
      toast.error("Update failed!");
    }
  };

  // AI Quiz Generation & Auto-Save
  const handleGenerateQuiz = async () => {
    if (!transcript.trim()) return toast.error("Transcript required!");

    try {
      const res = await generateQuiz({
        transcript,
        difficulty, 
        questionCount: numQuestions,
      }).unwrap();

      if (res?.questions) {
        const currentQuestions = Array.isArray(questions) ? questions : [];
        const newIncomingLevel = difficulty.toLowerCase();

        const newIncomingQuestions = res.questions.map((q) => ({
          ...q,
          level: newIncomingLevel,
        }));

        const mergedQuestions = [
          ...currentQuestions.filter((q) => q.level !== newIncomingLevel),
          ...newIncomingQuestions,
        ];

        await editLecture({
          courseId,
          lectureId,
          data: {
            quiz: {
              title: res.title || "AI Generated Quiz",
              questions: mergedQuestions,
              difficulty: newIncomingLevel, 
            },
          },
        }).unwrap();

        setQuestions(mergedQuestions);
        setDifficulty(newIncomingLevel); 
        setShowGenerator(false);

        toast.success(`${newIncomingQuestions.length} ${newIncomingLevel} questions updated!`);
        refetch();
      }
    } catch (error) {
      toast.error("Generation/Save failed!");
    }
  };

  const deleteQuizHandler = async () => {
    if (!window.confirm("Delete this quiz?")) return;

    try {
      await editLecture({
        courseId,
        lectureId,
        data: { removeQuiz: true },
      }).unwrap();

      setQuestions([]);
      setQuizTitle("");
      setShowGenerator(true);

      toast.success("Quiz permanently deleted!");
      refetch();
    } catch (e) {
      toast.error("Delete failed!");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  const currentVideoId = extractVideoId(youtubeUrl);
  
  // ✅ LOGIC: Identify which difficulty is actually saved in the database
  const savedDifficulty = data?.lecture?.quiz?.difficulty || "medium";

  return (
    <div className="flex flex-col gap-4 pb-10 max-w-7xl mx-auto px-4">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h2 className="font-black uppercase text-[10px] tracking-widest text-zinc-500">
            Lecture Editor
          </h2>
          <p className="text-sm font-bold dark:text-zinc-100">
            {lectureTitle || "Untitled"}
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => removeLecture({ courseId, lectureId })}
        >
          {removing ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            <Trash2 size={14} />
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border dark:border-zinc-800 space-y-4 shadow-sm">
            <div>
              <Label className="text-xs font-bold uppercase text-zinc-500">Lecture Title</Label>
              <Input className="mt-1 dark:bg-zinc-800" value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase text-zinc-500">YouTube URL</Label>
              <Input className="mt-1 dark:bg-zinc-800" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border dark:border-zinc-700">
              <span className="text-xs font-bold uppercase dark:text-zinc-300">Free Preview</span>
              <Switch checked={isPreviewFree} onCheckedChange={setIsPreviewFree} />
            </div>
            <Button onClick={updateLectureHandler} disabled={updating} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11">
              {updating ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2" size={18} />}
              UPDATE LECTURE DETAILS
            </Button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          {/* VIDEO PREVIEW */}
          <div className="bg-zinc-900 rounded-xl overflow-hidden aspect-video shadow-lg border dark:border-zinc-800 relative">
            {currentVideoId ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${currentVideoId}`}
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-xs font-bold">NO VIDEO PREVIEW</div>
            )}
          </div>

          {/* AI QUIZ SECTION */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-purple-200 dark:border-purple-900/30 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-purple-600" />
                <h3 className="font-black text-xs uppercase dark:text-zinc-100">AI Quiz Engine</h3>
              </div>
              {questions.length > 0 && (
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full dark:border-zinc-700" onClick={() => setShowGenerator(!showGenerator)}>
                  {showGenerator ? <span className="text-xs font-bold">X</span> : <RefreshCw size={14} className="text-purple-600" />}
                </Button>
              )}
            </div>

            {/* IF QUIZ EXISTS: PREVIEW CARD */}
            {questions.length > 0 && !showGenerator ? (
              <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-600 rounded-xl text-white shadow-lg"><FileQuestion size={24} /></div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-black text-purple-900 dark:text-purple-100 uppercase truncate">{quizTitle}</p>

                      {/* 🟢 FIXED: Display LAST GENERATED category and its specific count */}
                      <p className="text-[10px] font-bold text-purple-600 tracking-wider uppercase">
                        {questions.filter((q) => q.level === savedDifficulty).length} QUESTIONS • {savedDifficulty}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="text-[10px] font-bold dark:border-zinc-700"
                    onClick={() =>
                      navigate(
                        `/admin/course/${courseId}/lecture/${lectureId}/quiz-preview`,
                        {
                          state: { quizTitle, questions, difficulty: savedDifficulty },
                        },
                      )
                    }
                  >
                    <Eye size={14} className="mr-2" /> PREVIEW
                  </Button>
                  <Button
                    variant="outline"
                    className="text-[10px] font-bold text-red-500 border-red-100 dark:border-zinc-700 hover:bg-red-50"
                    onClick={deleteQuizHandler}
                  >
                    <Trash2 size={14} className="mr-2" /> DELETE
                  </Button>
                </div>
              </div>
            ) : (
              /* GENERATOR FORM */
              <div className="space-y-4 animate-in slide-in-from-top-4">
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 h-32 outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                  placeholder="Paste video transcript here..."
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-zinc-400">Difficulty</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger className="h-9 text-xs dark:bg-zinc-800 dark:text-white dark:border-zinc-700"><SelectValue /></SelectTrigger>
                      <SelectContent className="dark:bg-zinc-900 border-zinc-700">
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] uppercase font-bold text-zinc-400">Count</Label>
                    <Input
                      type="number"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Math.max(1, Number(e.target.value)))}
                      min="1"
                      className="h-9 text-xs dark:bg-zinc-800"
                    />
                  </div>
                </div>
                <Button disabled={generating} onClick={handleGenerateQuiz} className="w-full bg-purple-600 hover:bg-purple-700 text-white h-11 text-xs font-black tracking-widest transition-all">
                  {generating ? <><Loader2 className="animate-spin mr-2" /> AI WORKING...</> : <><Sparkles size={16} className="mr-2" /> {questions.length > 0 ? "RE-GENERATE" : "GENERATE QUIZ"}</>}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureTab;