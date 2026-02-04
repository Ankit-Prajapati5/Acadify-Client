import React, { useState } from 'react';
import { Mail, Send, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSendMessageMutation } from '@/features/api/contactApi';
import { toast } from 'sonner';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage(formData).unwrap(); // .unwrap() used for direct error handling
      toast.success("Message sent! Hum jald hi aapse baat karenge.");
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send message");
    }
  };

  return (
    <div className="bg-[#f1f5f9] dark:bg-zinc-950 text-zinc-900 dark:text-white min-h-screen w-full pt-24 pb-12 flex items-center justify-center transition-colors duration-500 relative font-sans overflow-x-hidden">
      
      {/* Background Decorative Blobs - Consistency with AboutUs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/20 dark:bg-blue-900/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-200/20 dark:bg-indigo-900/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-[1200px] w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT COLUMN: Text & Branding */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left animate-in fade-in slide-in-from-left duration-700">
          <div className="inline-block px-3 py-1 rounded-full bg-white dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 shadow-sm">
            <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Sparkles size={12} /> Contact Support
            </p>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight tracking-tighter">
            Let's <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-white dark:to-zinc-500">
              Connect.
            </span>
          </h1>
          
          <p className="text-sm md:text-base text-slate-600 dark:text-zinc-400 font-medium max-w-md mx-auto lg:mx-0">
            Koi query ho ya feedback, humari team aapki help ke liye hamesha ready hai. Bas ek message door!
          </p>

          <div className="flex flex-col gap-4 pt-4">
             <div className="flex items-center gap-4 justify-center lg:justify-start group">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 shadow-lg flex items-center justify-center text-blue-600 border border-transparent group-hover:border-blue-500 transition-all">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">Email Us</p>
                  <p className="font-bold text-sm">officialproxima@gmail.com</p>
                </div>
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Contact Form Card */}
        <div className="lg:col-span-7 animate-in fade-in slide-in-from-right duration-700">
          <div className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-xl border border-white dark:border-zinc-800 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/5 relative overflow-hidden">
            
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-zinc-500">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    placeholder="Enter name"
                    className="w-full bg-white dark:bg-zinc-950 px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-zinc-500">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    placeholder="mail@example.com"
                    className="w-full bg-white dark:bg-zinc-950 px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-zinc-500">Your Message</label>
                <textarea
                  rows="4"
                  placeholder="Write your message here..."
                  value={formData.message}
                  className="w-full bg-white dark:bg-zinc-950 px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm resize-none"
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                ></textarea>
              </div>

              <Button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-white dark:text-black py-7 rounded-2xl text-xs font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest"
              >
               {isLoading ? "Sending..." : "Send Message"} <Send size={16} />
              </Button>
            </form>

            {/* Decorative background pattern for the card */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          </div>
          
          {/* Trust Badge at bottom of form */}
          <div className="mt-6 py-4 px-8 border border-zinc-200 dark:border-zinc-800 rounded-3xl flex justify-between items-center bg-white/30 dark:bg-transparent backdrop-blur-sm">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Response time: &lt; 2 hours</span>
             </div>
             <MessageSquare size={16} className="text-zinc-400" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactUs;