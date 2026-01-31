import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
  useGenerateQuizMutation,
} from "@/features/api/courseApi";
import {
  Loader2,
  Trash2,
  Video,
  CheckCircle,
  Smartphone,
  Sparkles,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

const LectureTab = () => {
  const { id: courseId, lectureId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetLectureByIdQuery({
    courseId,
    lectureId,
  });

  const lecture = data?.lecture;

  const [lectureTitle, setLectureTitle] = useState("");
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [editLecture, { isLoading: updating }] = useEditLectureMutation();
  const [removeLecture, { isLoading: removing }] = useRemoveLectureMutation();

  const [transcript, setTranscript] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [generateQuiz, { isLoading: generating }] = useGenerateQuizMutation();

  const handleGenerateQuiz = async () => {
    if (!transcript.trim()) {
      toast.error("Transcript paste karo pehle!");
      return;
    }

    try {
      const res = await generateQuiz(transcript).unwrap();
      console.log("AI RESPONSE FRONTEND:", res);

      if (!res?.questions?.length) {
        toast.error("AI failed to generate questions");
        return;
      }

      setQuizTitle(res.title || "Generated Quiz");
      setQuestions(res.questions);

      toast.success("Quiz generated successfully!");

      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        navigate(`/admin/course/${courseId}/lecture/${lectureId}/quiz-preview`, {
          state: {
            quizTitle: res.title || "Generated Quiz",
            questions: res.questions,
          },
        });
      }, 500);
    } catch (error) {
      console.error("Quiz Error:", error);
      toast.error("Quiz generation failed!");
    }
  };

  const extractVideoId = (url) => {
    const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle || "");
      setIsPreviewFree(Boolean(lecture.isPreviewFree));

      if (lecture.videoId) {
        setYoutubeUrl(`https://www.youtube.com/watch?v=${lecture.videoId}`);
      }

      if (lecture.quiz?.questions?.length) {
        setQuizTitle(lecture.quiz.title || "");
        setQuestions(lecture.quiz.questions);
      }
    }
  }, [lecture]);

  const updateLectureHandler = async () => {
    if (!lectureTitle.trim()) return toast.error("Lecture title required!");
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) return toast.error("Valid YouTube URL daalo!");

    try {
      await editLecture({
        courseId,
        lectureId,
        data: {
          lectureTitle: lectureTitle.trim(),
          isPreviewFree,
          videoId,
          ...(questions.length > 0 && {
            quiz: {
              title: quizTitle,
              questions,
            },
          }),
        },
      }).unwrap();
      toast.success("Lecture updated successfully!");
    } catch (error) {
      toast.error("Update failed!");
    }
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="flex flex-col gap-4 pb-10 max-w-7xl mx-auto">
      {/* HEADER - Compact */}
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-xl border">
        <div>
          <h2 className="font-black uppercase text-xs tracking-widest text-zinc-500">
            Lecture Editor
          </h2>
          <p className="text-sm font-bold truncate max-w-[200px] md:max-w-md">
            {lectureTitle || "Untitled Lecture"}
          </p>
        </div>

        <div className="flex gap-2">
            {/* View Quiz Button - Only shows if questions exist */}
          {questions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-purple-600 border-purple-200 hover:bg-purple-50"
              onClick={() => navigate(`/admin/course/${courseId}/lecture/${lectureId}/quiz-preview`, {
                state: { quizTitle, questions }
              })}
            >
              <Eye size={14} /> Quiz Preview
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              if (window.confirm("Delete lecture?")) {
                await removeLecture({ courseId, lectureId });
                navigate(`/admin/course/${courseId}/lecture`);
              }
            }}
          >
            {removing ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT COLUMN - Main Inputs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border space-y-4">
            <div>
              <Label className="text-xs uppercase font-bold text-zinc-500">Lecture Title</Label>
              <Input
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
                placeholder="Enter title..."
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs uppercase font-bold text-zinc-500">YouTube Video URL</Label>
              <Input
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Paste YouTube link"
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border">
              <div className="flex items-center gap-2">
                <Smartphone size={16} className="text-blue-600" />
                <span className="text-xs font-bold uppercase">Free Preview</span>
              </div>
              <Switch
                checked={isPreviewFree}
                onCheckedChange={setIsPreviewFree}
              />
            </div>

            <Button
              disabled={updating}
              onClick={updateLectureHandler}
              className="w-full bg-blue-600 hover:bg-blue-700 h-11"
            >
              {updating ? (
                <Loader2 className="animate-spin mr-2" size={16} />
              ) : (
                <CheckCircle className="mr-2" size={16} />
              )}
              {updating ? "Saving Changes..." : "Update Lecture Details"}
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN - Video & AI */}
        <div className="lg:col-span-5 space-y-4">
          {/* Video Preview - Compact */}
          <div className="bg-black rounded-xl p-1.5 overflow-hidden shadow-xl">
            <div className="aspect-video">
              {extractVideoId(youtubeUrl) ? (
                <iframe
                  className="w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${extractVideoId(youtubeUrl)}?rel=0&modestbranding=1`}
                  title="Lecture Preview"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-xs">
                  <Video className="mb-2 opacity-20" size={32} />
                  No Video Preview
                </div>
              )}
            </div>
          </div>

          {/* AI Section - Compact Rows to avoid scroll */}
          <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-purple-600" />
              <h3 className="font-black uppercase text-xs">AI Quiz Generator</h3>
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full p-3 rounded-lg border bg-zinc-50 dark:bg-zinc-800 text-xs focus:ring-2 focus:ring-purple-500 outline-none resize-none"
              rows={4}
              placeholder="Paste YouTube transcript here..."
            />

            <Button
              disabled={generating}
              onClick={handleGenerateQuiz}
              className="bg-purple-600 hover:bg-purple-700 w-full text-white mt-3 h-10 text-xs font-bold"
            >
              {generating ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={14} />
                  AI IS PROCESSING...
                </>
              ) : (
                <>
                  <Sparkles size={14} className="mr-2" /> GENERATE QUIZ
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureTab;