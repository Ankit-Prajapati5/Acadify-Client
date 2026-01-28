import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  useDeleteCourseMutation,
  useEditCourseMutation,
  useGetCreatorCourseByIdQuery,
  useTogglePublishCourseMutation,
  useUploadCourseThumbnailMutation,
} from "@/features/api/courseApi";
import { CheckCircle, XCircle, Loader2, Trash2, Save, ImagePlus, AlertCircle, ArrowLeft } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";

const CourseTab = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  
  // API Queries & Mutations
  const { data, isLoading, refetch } = useGetCreatorCourseByIdQuery(courseId);
  const [uploadThumbnail] = useUploadCourseThumbnailMutation();
  const [editCourse, { isLoading: saving }] = useEditCourseMutation();
  const [publishCourse, { isLoading: publishing }] = useTogglePublishCourseMutation();
  const [deleteCourse] = useDeleteCourseMutation();

  const course = data?.course;

  // Local States
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewThumbnail, setPreviewThumbnail] = useState("");

  // 🔥 Fix 1: Sync Category & Inputs on Load or Refetch
  useEffect(() => {
    if (course) {
      setInput({
        courseTitle: course.courseTitle || "",
        subTitle: course.subTitle || "",
        description: course.description || "",
        category: course.category || "", // Category from DB
        courseLevel: course.courseLevel?.toLowerCase() || "beginner",
        coursePrice: course.coursePrice !== undefined ? String(course.coursePrice) : "",
      });
      setPreviewThumbnail(course.courseThumbnail || "");
    }
  }, [course]);

  // 🔥 Fix 2: Lecture Validation Logic (Checks if at least one lecture has a videoId)
  const isLectureReady = useMemo(() => {
    if (!course?.lectures || course.lectures.length === 0) return false;
    // Returns true only if at least one lecture has a videoId
    return course.lectures.some((lecture) => lecture.videoId && lecture.videoId.trim() !== "");
  }, [course?.lectures]);

  const saveCourseHandler = async () => {
    try {
      const formData = new FormData();
      Object.entries(input).forEach(([k, v]) => {
        if (v !== "") formData.append(k, v);
      });

      await editCourse({ courseId, formData }).unwrap();

      if (thumbnailFile) {
        const thumbForm = new FormData();
        thumbForm.append("courseThumbnail", thumbnailFile);
        await uploadThumbnail({ courseId, formData: thumbForm }).unwrap();
      }

      toast.success("Changes saved successfully!");
      refetch(); // Reload data to sync all status cards
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save changes");
    }
  };

  const publishHandler = async () => {
    try {
      const res = await publishCourse({ courseId }).unwrap();
      toast.success(res.isPublished ? "Course is now LIVE! 🚀" : "Course moved to Draft");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Action failed");
    }
  };

  const canPublish = Number(input.coursePrice) > 0 && 
                     Boolean(previewThumbnail || course?.courseThumbnail) && 
                     isLectureReady && // Check for videoId
                     input.courseTitle.trim() !== "";

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto pb-32 px-4 md:px-0 space-y-6">
      
      {/* HEADER NAV */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/course")}
          className="w-fit rounded-full pl-2 pr-4 hover:bg-white dark:hover:bg-zinc-900 border border-zinc-100 dark:border-zinc-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="font-bold uppercase text-[9px] tracking-widest">Back to List</span>
        </Button>
        <BadgeStatus isPublished={course?.isPublished} />
      </div>

      <Card className="border-none shadow-2xl bg-white dark:bg-zinc-900/50 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">
        <CardHeader className="p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-50 dark:border-zinc-800">
          <div className="space-y-1">
            <CardTitle className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter">
              Edit <span className="text-blue-600">Course</span>
            </CardTitle>
            <CardDescription className="text-xs md:text-sm font-medium italic">
              Platform status: {course?.isPublished ? "Publicly Visible" : "Private Draft"}
            </CardDescription>
          </div>

          <div className="flex w-full md:w-auto gap-3">
            <Button
              variant={course?.isPublished ? "outline" : "default"}
              disabled={(!course?.isPublished && !canPublish) || publishing}
              onClick={publishHandler}
              className={`flex-1 md:flex-none rounded-xl h-12 px-6 font-black uppercase text-[10px] tracking-widest transition-all ${!course?.isPublished && canPublish ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20' : ''}`}
            >
              {publishing ? <Loader2 className="animate-spin" size={16} /> : (course?.isPublished ? "Unpublish" : "Go Live 🚀")}
            </Button>

            <Button
              variant="destructive"
              className="rounded-xl h-12 w-12 flex items-center justify-center p-0"
              onClick={async () => {
                if (confirm("Permanently delete this course?")) {
                  await deleteCourse(courseId);
                  navigate("/admin/course");
                }
              }}
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-5 md:p-10 space-y-10">
          {/* STATUS CHECKLIST */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <StatusCard label="Pricing" ok={Number(input.coursePrice) > 0} icon="💰" />
            <StatusCard label="Poster" ok={Boolean(previewThumbnail || course?.courseThumbnail)} icon="🖼️" />
            <StatusCard label="Video Ready" ok={isLectureReady} icon="📚" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
            {/* INPUTS AREA */}
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Master Title</Label>
                <Input
                  className="rounded-xl h-12 md:h-14 bg-zinc-50 dark:bg-zinc-950 border-none font-bold text-base"
                  value={input.courseTitle}
                  onChange={(e) => setInput({ ...input, courseTitle: e.target.value })}
                  placeholder="e.g. Complete React Mastery"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Subtitle</Label>
                <Input
                  className="rounded-xl h-12 md:h-14 bg-zinc-50 dark:bg-zinc-950 border-none font-medium"
                  value={input.subTitle}
                  onChange={(e) => setInput({ ...input, subTitle: e.target.value })}
                  placeholder="Catchy tagline for your course"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Detailed Description</Label>
                <div className="rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
                  <RichTextEditor input={input} setInput={setInput} />
                </div>
              </div>
            </div>

            {/* META AREA */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-zinc-400">Category</Label>
                  <Select value={input.category} onValueChange={(v) => setInput({ ...input, category: v })}>
                    <SelectTrigger className="rounded-xl h-12 bg-zinc-50 dark:bg-zinc-950 border-none font-bold">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                       {["frontend", "backend", "fullstack", "mern", "javascript", "python"].map(o => (
                        <SelectItem key={o} value={o} className="capitalize">{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-zinc-400">Difficulty</Label>
                  <Select value={input.courseLevel} onValueChange={(v) => setInput({ ...input, courseLevel: v })}>
                    <SelectTrigger className="rounded-xl h-12 bg-zinc-50 dark:bg-zinc-950 border-none font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {["beginner", "intermediate", "advanced"].map(o => (
                        <SelectItem key={o} value={o} className="capitalize">{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-400">Course Price (INR)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-blue-600">₹</span>
                  <Input
                    type="number"
                    className="rounded-xl h-12 bg-zinc-50 dark:bg-zinc-950 border-none font-black text-xl pl-10 text-blue-600"
                    value={input.coursePrice}
                    onChange={(e) => setInput({ ...input, coursePrice: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-zinc-400">Thumbnail Poster</Label>
                <div className="relative group overflow-hidden rounded-2xl border-2 border-dashed border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 transition-all hover:border-blue-400">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setThumbnailFile(file);
                        setPreviewThumbnail(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <div className="aspect-video flex items-center justify-center">
                    {previewThumbnail ? (
                      <img src={previewThumbnail} className="h-full w-full object-cover" alt="Preview" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-zinc-400">
                        <ImagePlus size={24} />
                        <span className="text-[9px] font-bold uppercase">Click to Upload</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {!canPublish && !course?.isPublished && (
                <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 flex gap-3 animate-pulse">
                  <AlertCircle className="text-blue-600 shrink-0" size={16} />
                  <p className="text-[9px] font-bold text-blue-700 dark:text-blue-400 uppercase leading-tight">
                    Checklist: Add Price, Poster & at least 1 Video lecture to Go Live.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* BOTTOM ACTION BAR */}
        <div className="sticky bottom-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-100 dark:border-zinc-800 p-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 z-50">
           <div className="hidden md:block">
             <p className="text-[10px] font-black uppercase text-zinc-400">Visibility Status</p>
             <p className="font-bold text-sm">{course?.isPublished ? "🟢 Active on Store" : "⚪ Draft Mode"}</p>
           </div>

           <Button 
            onClick={saveCourseHandler} 
            disabled={saving}
            className="w-full md:w-auto rounded-xl h-12 md:h-14 px-10 bg-zinc-900 dark:bg-white dark:text-black font-black uppercase text-[10px] tracking-widest shadow-2xl transition-transform active:scale-95"
          >
            {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
            Push Changes
          </Button>
        </div>
      </Card>
    </div>
  );
};

/* --- MINI COMPONENTS --- */
const StatusCard = ({ label, ok, icon }) => (
  <div className={`flex items-center gap-3 p-3 md:p-4 rounded-2xl border transition-all duration-500 ${
    ok ? "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30" : "bg-zinc-50 border-zinc-100 dark:bg-zinc-950 dark:border-zinc-800"
  }`}>
    <span className="text-lg">{icon}</span>
    <div>
      <p className="text-[8px] font-black uppercase text-zinc-400 mb-0.5">{label}</p>
      <div className="flex items-center gap-1">
        {ok ? <CheckCircle className="text-emerald-600" size={10} /> : <XCircle className="text-zinc-300" size={10} />}
        <span className={`text-[9px] font-black uppercase ${ok ? "text-emerald-700 dark:text-emerald-500" : "text-zinc-400"}`}>
          {ok ? "Ready" : "Pending"}
        </span>
      </div>
    </div>
  </div>
);

const BadgeStatus = ({ isPublished }) => (
  <div className={`w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${
    isPublished ? "bg-emerald-100 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-zinc-100 border-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
  }`}>
    {isPublished ? "Live" : "Draft"}
  </div>
);

export default CourseTab;