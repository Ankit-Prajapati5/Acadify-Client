import React, { useState } from 'react';
import { ChevronUp, Plus, Rocket, Telescope, X, LogIn, Sparkles, Loader2, Edit3, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useDeleteIdeaMutation, useEditIdeaMutation, useGetRoadmapQuery, useSuggestIdeaMutation, useToggleUpvoteMutation } from "@/features/api/roadmapApi";

const Roadmap = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { data, isLoading } = useGetRoadmapQuery();
    const [toggleUpvote] = useToggleUpvoteMutation();
    const [suggestIdea, { isLoading: isSuggesting }] = useSuggestIdeaMutation();
    const [deleteIdea] = useDeleteIdeaMutation();
    const [editIdea] = useEditIdeaMutation();
    
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
    
    // Form State
    const [ideaTitle, setIdeaTitle] = useState("");
    const [ideaTag, setIdeaTag] = useState("Course");

    const handleAction = (actionFn) => {
        if (!user) {
            setIsLoginModalOpen(true);
        } else {
            actionFn();
        }
    };

    const upvoteHandler = async (id) => {
        try {
            await toggleUpvote(id).unwrap();
        } catch (err) {
            toast.error("Upvote failed");
        }
    };
    

    const [editingId, setEditingId] = useState(null);

    const deleteHandler = async (id) => {
        if(window.confirm("Delete this idea?")) {
            try { await deleteIdea(id).unwrap(); toast.success("Deleted!"); } 
            catch { toast.error("Failed to delete"); }
        }
    };

    const handleEditOpen = (item) => {
        setEditingId(item._id);
        setIdeaTitle(item.title);
        setIdeaTag(item.tag);
        setIsSuggestModalOpen(true);
    };

    const suggestIdeaHandler = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await editIdea({ id: editingId, title: ideaTitle, tag: ideaTag }).unwrap();
                toast.success("Updated!");
            } else {
                await suggestIdea({ title: ideaTitle, tag: ideaTag }).unwrap();
                toast.success("Idea shared!");
            }
            setIsSuggestModalOpen(false);
            setEditingId(null);
            setIdeaTitle("");
        } catch (err) { toast.error("Error occurred"); }
    };

    return (
        <div className="bg-[#f8fafc] dark:bg-zinc-950 min-h-screen pt-24 pb-20 transition-all duration-500 font-sans relative">
            <div className="max-w-4xl mx-auto px-6">
                
                {/* Header Section */}
                <div className="text-center mb-16 animate-in fade-in duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                        <Telescope size={14} className="text-blue-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Proxima Roadmap</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">You Design, <br/> We <span className="text-blue-600">Build.</span></h1>
                </div>

                {/* Top Bar */}
                <div className="flex justify-between items-center mb-10">
                    <h3 className="font-black text-xs uppercase tracking-widest text-zinc-400">Community Trends</h3>
                    <Button onClick={() => handleAction(() => setIsSuggestModalOpen(true))} className="rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                        <Plus size={18} className="mr-2" /> Suggest Idea
                    </Button>
                </div>

                <div className="grid gap-6">
                    {isLoading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-zinc-300" size={40} /></div>
                    ) : data?.ideas?.map((item) => {
                        const hasUpvoted = item.upvotes.includes(user?._id);
                        return (
                            <div key={item._id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-[2.5rem] flex items-center justify-between group hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
                                <div className="flex items-center gap-8">
                                    {/* UPVOTE BUTTON (THE NEW STYLE) */}
                                    <button 
                                        onClick={() => handleAction(() => upvoteHandler(item._id))}
                                        className={`w-20 h-24 rounded-[2rem] flex flex-col items-center justify-center gap-1 border-2 transition-all duration-300 active:scale-90 ${
                                            hasUpvoted 
                                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/40" 
                                            : "bg-zinc-50 dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:border-blue-400 hover:text-blue-500"
                                        }`}
                                    >
                                        <ChevronUp size={28} className={`${hasUpvoted ? "animate-bounce" : ""}`} />
                                        <span className="text-lg font-black leading-none">{item.upvotes.length}</span>
                                        <span className="text-[8px] font-bold uppercase tracking-tighter opacity-60">Votes</span>
                                    </button>

                                    <div>
                                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 mb-2 inline-block">{item.tag}</span>
                                        <h3 className="font-bold text-xl text-zinc-800 dark:text-zinc-100 tracking-tight leading-tight mb-1">{item.title}</h3>
                                        
                                        {user && item.creator && (item.creator.toString() === user._id.toString()) && (
                                            <div className="flex gap-4 mt-3">
                                                <button onClick={() => handleEditOpen(item)} className="text-[10px] flex items-center gap-1 font-bold text-zinc-400 hover:text-blue-500 transition-colors">
                                                    <Edit3 size={12} /> Edit
                                                </button>
                                                <button onClick={() => deleteHandler(item._id)} className="text-[10px] flex items-center gap-1 font-bold text-zinc-400 hover:text-red-500 transition-colors">
                                                    <Trash2 size={12} /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Rocket className="mr-6 text-zinc-100 dark:text-zinc-800 group-hover:text-blue-600 group-hover:rotate-12 transition-all duration-500" size={40} />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- SUGGEST IDEA MODAL --- */}
            {isSuggestModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[3rem] p-10 shadow-2xl border border-zinc-200 dark:border-zinc-800 relative">
                        <button onClick={() => {setIsSuggestModalOpen(false); setEditingId(null); setIdeaTitle("");}} className="absolute top-8 right-8 text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
                            <X size={20} />
                        </button>

                        <h2 className="text-3xl font-black tracking-tighter mb-8">{editingId ? "Edit Idea" : "Suggest Idea"}</h2>

                        <form onSubmit={suggestIdeaHandler} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Idea Title</label>
                                <input 
                                    required
                                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-600/20 outline-none transition-all"
                                    placeholder="e.g. Add 3D Animation Course"
                                    value={ideaTitle}
                                    onChange={(e) => setIdeaTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Category</label>
                                <div className="flex gap-2">
                                    {["Course", "Feature", "Workshop"].map(t => (
                                        <button 
                                            key={t}
                                            type="button"
                                            onClick={() => setIdeaTag(t)}
                                            className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                                                ideaTag === t ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-100"
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button disabled={isSuggesting} type="submit" className="w-full h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[10px]">
                                {isSuggesting ? <Loader2 className="animate-spin" /> : editingId ? "Save Changes" : "Post Suggestion"}
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- LOGIN MODAL --- */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[3rem] p-10 shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
                        <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-6 right-6 text-zinc-400"><X size={20}/></button>
                        
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12">
                            <Sparkles size={40} className="text-blue-600" />
                        </div>

                        <h2 className="text-3xl font-black tracking-tighter mb-2">Wait a second!</h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                            Aapka vote bohot keemti hai. Please login karke Proxima community ka hissa banein.
                        </p>

                        <div className="space-y-3">
                            <Button onClick={() => navigate("/login")} className="w-full h-14 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-[10px]">
                                <LogIn size={16} className="mr-2" /> Login to Proxima
                            </Button>
                            <button onClick={() => setIsLoginModalOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600">Maybe Later</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Roadmap;