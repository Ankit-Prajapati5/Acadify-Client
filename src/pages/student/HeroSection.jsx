import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Star, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HeroSection = () => {
  const [keyword, setKeyword] = useState("");
 const [isIntroActive, setIsIntroActive] = useState(() => {
  return !sessionStorage.getItem("proximaSplashShown");
});

  const navigate = useNavigate();

 useEffect(() => {
  if (!isIntroActive) return;

  const timer = setTimeout(() => {
    setIsIntroActive(false);
    sessionStorage.setItem("proximaSplashShown", "true");
  }, 2000);

  return () => clearTimeout(timer);
}, [isIntroActive]);

  const handleSearch = (searchQuery) => {
    const term = searchQuery || keyword;
    if (!term.trim()) return;
    navigate(`/course/search?search=${encodeURIComponent(term)}`);
  };



  return (
    <div className="relative bg-[#f1f5f9] dark:bg-zinc-950 min-h-screen flex flex-col justify-center items-center py-16 sm:py-20 px-4 sm:px-6 overflow-hidden transition-colors duration-500 font-sans">

      {/* ⭐ Animated Stars Background */}
      {!isIntroActive && (
  <div className="absolute inset-0 z-10 pointer-events-none">
    {[...Array(25)].map((_, i) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const duration = Math.random() * 4 + 4;
      const delay = Math.random() * 5;
      const scale = Math.random() * 0.8 + 0.6;

      return (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${top}%`,
            left: `${left}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, scale, 0],
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut",
          }}
        >
          {/* Main Star */}
          <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_30px_12px_rgba(250,204,21,0.9)]" />

          {/* Glow Layer */}
          <div className="absolute inset-0 w-6 h-6 -translate-x-1/4 -translate-y-1/4 bg-yellow-400/40 blur-xl rounded-full" />
        </motion.div>
      );
    })}

    {/* Background Glow Circles (unchanged look) */}
    <div className="absolute top-1/3 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-yellow-500/5 blur-[120px] rounded-full" />
    <div className="absolute bottom-1/4 left-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-blue-500/5 blur-[120px] rounded-full" />
  </div>
)}


      {/* Splash Screen */}
      <AnimatePresence>
        {isIntroActive && (
          <motion.div
            key="splash"
            exit={{
              y: "100%",
              transition: { duration: 0.8, ease: [0.9, 0, 0.1, 1] },
            }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-zinc-950"
          >
            <motion.div className="flex flex-col items-center">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 sm:w-32 sm:h-32 border-t-4 border-yellow-500 rounded-full"
                />
                <Cpu
                  size={40}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-500 drop-shadow-[0_0_10px_#facc15]"
                />
              </div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-yellow-500 font-black text-3xl sm:text-4xl uppercase mt-8 tracking-widest"
              >
                Proxima
              </motion.h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Hero */}
      {!isIntroActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto relative z-10 text-center space-y-10 sm:space-y-12"
        >
          {/* Badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-white dark:bg-zinc-900 border border-yellow-500/30 shadow-[0_0_15px_rgba(250,204,21,0.1)]"
          >
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 dark:text-yellow-500/80">
              Premium Quality Learning
            </span>
          </motion.div>

          {/* Heading */}
          <div className="space-y-5">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[9rem] xl:text-[11rem] font-black text-zinc-900 dark:text-white tracking-tight leading-tight sm:leading-[0.85] lg:leading-[0.75] uppercase italic">
              Level <span className="text-yellow-500">Up</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-white dark:to-zinc-500">
                Faster.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto italic px-2">
              "The best way to predict the future is to{" "}
              <span className="text-zinc-900 dark:text-white font-black underline decoration-blue-500">
                build
              </span>{" "}
              it."
            </p>
          </div>

          {/* Search */}
          <div className="max-w-3xl mx-auto pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="group relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white dark:bg-zinc-900 rounded-[2rem] p-2 shadow-2xl border-2 border-transparent focus-within:border-yellow-500 transition-all duration-500"
            >
              <div className="hidden sm:block pl-6 text-zinc-400 group-focus-within:text-yellow-500 transition-all">
                <Search size={22} strokeWidth={3} />
              </div>

              <Input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="What do you want to learn?"
                className="flex-grow border-none focus-visible:ring-0 bg-transparent px-4 sm:px-6 py-4 sm:py-6 text-lg sm:text-xl md:text-2xl text-zinc-900 dark:text-white placeholder-zinc-500 font-black tracking-tight"
              />

              <Button
                type="submit"
                className="mt-2 sm:mt-0 px-8 sm:px-12 py-4 sm:py-6 w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-black rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-yellow-500/20"
              >
                Launch
              </Button>
            </form>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-4">
            {["React", "Python", "Web3", "AI"].map((tag) => (
              <motion.button
                key={tag}
                whileHover={{
                  y: -5,
                  color: "#facc15",
                  borderColor: "#facc15",
                }}
                onClick={() => {
                  setKeyword(tag);
                  handleSearch(tag);
                }}
                className="px-5 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all"
              >
                #{tag}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Subtle Grid Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
    </div>
  );
};

export default HeroSection;