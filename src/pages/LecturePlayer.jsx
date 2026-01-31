import { useParams, useNavigate } from "react-router-dom";
import { useGetCourseDetailWithLessonsQuery } from "@/features/api/courseApi";
import {
  useMarkLectureCompletedMutation,
  useGetCourseProgressQuery,
} from "@/features/api/progressApi";
import { useMemo, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import {
  ChevronRight,
  ChevronLeft,
  Lock,
  ArrowLeft,
  Play,
  Pause,
  Maximize,
  CheckCircle,
  Settings2,
  BrainCircuit,
  RotateCw,
  Loader2,
  ScreenShare,
  RectangleHorizontal,
} from "lucide-react";
import confetti from "canvas-confetti";
import BuyCourseButton from "@/components/BuyCourseButton";
import { userLoggedOut } from "@/features/authSlice";

const LecturePlayer = () => {
  const { courseId, lectureId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const progressInterval = useRef(null);
  const controlsTimeout = useRef(null);
  const securityLoop = useRef(null);

  const watchTimeRef = useRef(0);
  const lastPlaybackRateRef = useRef(1);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isEligibleForComplete, setIsEligibleForComplete] = useState(false);
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [watermarkPos, setWatermarkPos] = useState({ top: "20%", left: "20%" });

  const [showBottomShield, setShowBottomShield] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Security States
  const [isSecurityBreached, setIsSecurityBreached] = useState(false);
  const [vaultKey, setVaultKey] = useState("");
  const playerElementId = useMemo(
    () => `v-node-${Math.floor(Math.random() * 10000)}`,
    [lectureId],
  );

  const { data: courseData, isLoading } =
    useGetCourseDetailWithLessonsQuery(courseId);
  const { data: progressData, refetch: refetchProgress } =
    useGetCourseProgressQuery(courseId);
  const [markCompleted, { isLoading: isMarking }] =
    useMarkLectureCompletedMutation();

  const lectures = useMemo(
    () => courseData?.course?.lectures || [],
    [courseData],
  );
  const currentLecture = useMemo(
    () => lectures.find((l) => l._id === lectureId),
    [lectures, lectureId],
  );
  const currentIndex = useMemo(
    () => lectures.findIndex((l) => l._id === lectureId),
    [lectures, lectureId],
  );
  const handleInteraction = () => {
    setControlsVisible(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) setControlsVisible(false);
    }, 3000);
  };

  // Security useEffect ke andar...
  const initTimeout = setTimeout(() => {
    isSecurityActive = true;
    monitor();

    // --- CONSOLE BOMB START ---
    const bomb = new Image();
    Object.defineProperty(bomb, "id", {
      get: function () {
        // Jab DevTools is element ko render karne ki koshish karega,
        // toh ye heavy loop browser tab ko "Lag" kar dega.
        for (let i = 0; i < 100; i++) {
          console.table({
            ALERT: "SECURITY BREACH DETECTED",
            ACTION: "TERMINATING_SESSION",
            TIMESTAMP: new Date().toISOString(),
          });
        }
        triggerSecurityLogout();
      },
    });

    securityTimers.push(
      setInterval(() => {
        // Bina DevTools khule ye harmless hai, khulte hi ye 'bomb.id' access hoga
        console.log(bomb);
        console.clear();
      }, 1000),
    );
    // --- CONSOLE BOMB END ---

    securityTimers.push(setInterval(enforceIntegrity, 800));
  }, 3000);

  const handleBack = () => {
    setIsNavigating(true);

    // Pehle Fullscreen exit karein warna navigation ke baad bhi screen black ya ajeeb dikh sakti hai
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        /* Safari */
        document.webkitExitFullscreen();
      }
    }

    const isPurchased = courseData?.course?.isPurchased;
    // Thoda delay taaki exit logic smooth ho
    setTimeout(() => {
      navigate(
        isPurchased
          ? `/course/${courseId}/progress`
          : `/course-detail/${courseId}`,
      );
    }, 100);
  };

  const startTracking = () => {
    progressInterval.current = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        const current = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();
        setCurrentTime(current);
        watchTimeRef.current += 0.5;
        if (current >= total - 1.5) playerRef.current.pauseVideo();
        const requiredWatchTime = (total / lastPlaybackRateRef.current) * 0.9;
        if (current > total * 0.9 && watchTimeRef.current > requiredWatchTime) {
          setIsEligibleForComplete(true);
        }
      }
    }, 500);
  };

  const stopTracking = () => clearInterval(progressInterval.current);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const nextLecture = lectures[currentIndex + 1];
  const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;
  const isLocked =
    !currentLecture?.isPreviewFree && !courseData?.course?.isPurchased;

  useEffect(() => {
    if (currentLecture?.videoId) {
      setVaultKey(window.btoa(currentLecture.videoId));
    }
  }, [currentLecture]);
  useEffect(() => {
    let isSecurityActive = true;
    let securityTimers = [];

    const triggerSecurityLogout = () => {
      if (devToolsOpen || isSecurityBreached) return;
      setDevToolsOpen(true);
      setIsSecurityBreached(true);

      // 💣 THE NUCLEAR BOMB - High Render Pressure
      const radioactive = new Array(10000)
        .fill("🚨_SYSTEM_CRITICAL_ERROR_🚨")
        .join("");

      for (let i = 0; i < 500; i++) {
        console.error(radioactive); // RAM Pressure
        const heavyObj = {};
        for (let j = 0; j < 200; j++)
          heavyObj[j] = { data: radioactive, nested: heavyObj };
        console.dir(heavyObj); // Recursive Tree Crash
        // SVG Graphics Overload
        console.log(
          "%c ",
          `padding:400px; background:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="2000"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">RENDER_BLOCK_ACTIVE</div></foreignObject></svg>');`,
        );
      }

      if (playerRef.current) playerRef.current.destroy();
      localStorage.clear();
      dispatch(userLoggedOut());
      toast.error("SECURITY ALERT: System Compromised.");

      setTimeout(() => {
        window.location.href = "/login";
      }, 200);
    };

    const enforceIntegrity = () => {
      // 1. Mobile Check skip
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (!isMobile) {
        const heightGap = window.outerHeight - window.innerHeight;
        const widthGap = window.outerWidth - window.innerWidth;
        if (heightGap > 160 || widthGap > 160) triggerSecurityLogout();
      }

      // 2. Debugger/Timing Attack Trap
      const startTime = performance.now();
      debugger;
      if (performance.now() - startTime > 100) triggerSecurityLogout();
    };

    // 🛡️ THE TRAP: Recursive Proxy (DevTools khulte hi phatega)
    const trap = new Proxy(
      {},
      {
        get: function (target, prop) {
          if (["id", "nodeType", "outerHTML", "toString"].includes(prop)) {
            triggerSecurityLogout();
            return Array.from({ length: 100000 }, () => Math.random()).sort();
          }
          return target[prop];
        },
      },
    );

    // Start Immediate Monitoring
    enforceIntegrity();

    // Continuous check loop
    const intervalId = setInterval(() => {
      console.log(trap);
      console.clear();
      enforceIntegrity();
    }, 800);
    securityTimers.push(intervalId);

    // Mutation Observer for DOM tampering
    const observer = new MutationObserver(() => triggerSecurityLogout());
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    // Blocking Key Combos
    const keyBlock = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey &&
          e.shiftKey &&
          (e.key === "I" || e.key === "J" || e.key === "C")) ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
        triggerSecurityLogout();
      }
    };

    window.addEventListener("keydown", keyBlock);
    window.addEventListener("resize", enforceIntegrity);

    return () => {
      securityTimers.forEach(clearInterval);
      observer.disconnect();
      window.removeEventListener("keydown", keyBlock);
      window.removeEventListener("resize", enforceIntegrity);
    };
  }, [dispatch, devToolsOpen, isSecurityBreached]);
  useEffect(() => {
    if (!vaultKey || isLocked || devToolsOpen || isSecurityBreached) return;
    const initPlayer = () => {
      const realId = window.atob(vaultKey);
      playerRef.current = new window.YT.Player(playerElementId, {
        videoId: realId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event) => setDuration(event.target.getDuration()),
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              handleInteraction();
              startTracking();
            } else {
              setIsPlaying(false);
              setControlsVisible(true);
              stopTracking();
            }
          },
        },
      });
    };
    if (window.YT && window.YT.Player) initPlayer();
    else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = initPlayer;
      document.body.appendChild(tag);
    }
    return () => {
      stopTracking();
      if (playerRef.current) playerRef.current.destroy();
    };
  }, [vaultKey, isLocked, devToolsOpen, isSecurityBreached, playerElementId]);

  useEffect(() => {
    if (isPlaying) {
      setShowBottomShield(true);
      const timer = setTimeout(() => setShowBottomShield(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowBottomShield(false);
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  useEffect(() => {
    setIsNavigating(false);
    setIsPlaying(false);
    setCurrentTime(0);
    watchTimeRef.current = 0;
    const isAlreadyCompleted = progressData?.completedLectures?.some(
      (l) => l.lectureId === lectureId,
    );
    if (isAlreadyCompleted) setIsEligibleForComplete(true);
    else setIsEligibleForComplete(false);
  }, [lectureId, progressData]);

  const handleSafeNavigate = (targetId) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(`/course/${courseId}/lecture/${targetId}`);
    }, 50);
  };

  const togglePlay = () => {
    if (!playerRef.current || devToolsOpen || isSecurityBreached) return;
    const state = playerRef.current.getPlayerState();
    state === 1
      ? playerRef.current.pauseVideo()
      : playerRef.current.playVideo();
    handleInteraction();
  };
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    playerRef.current.seekTo(time, true);
    handleInteraction();
  };

  const changeSpeed = (speed) => {
    playerRef.current.setPlaybackRate(speed);
    setPlaybackRate(speed);
    lastPlaybackRateRef.current = speed;
    setShowSettings(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) containerRef.current.requestFullscreen();
    else document.exitFullscreen();
  };

  const handleLandscape = async () => {
    try {
      if (!document.fullscreenElement)
        await containerRef.current.requestFullscreen();
      if (window.screen.orientation && window.screen.orientation.lock)
        await window.screen.orientation.lock("landscape");
    } catch (error) {
      toast.error("Landscape rotation not supported.");
    }
  };
  const handleManualComplete = async () => {
    if (!isEligibleForComplete)
      return toast.error("Bina skip kare 90% dekhein!");
    try {
      await markCompleted({ courseId, lectureId }).unwrap();
      const totalLectures = lectures.length;
      const completedList = progressData?.completedLectures || [];
      const isAlreadyMarked = completedList.some(
        (l) => l.lectureId === lectureId,
      );
      const newCount = isAlreadyMarked
        ? completedList.length
        : completedList.length + 1;
      if (newCount === totalLectures) {
        toast.success("All lectures finished! Course Completed 🎉", {
          duration: 5000,
        });
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.7 } });
      } else {
        toast.success("Lecture Completed! Moving to next... ✅");
      }
      refetchProgress();
      if (nextLecture) handleSafeNavigate(nextLecture._id);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setWatermarkPos({
        top: Math.floor(Math.random() * 70 + 10) + "%",
        left: Math.floor(Math.random() * 70 + 10) + "%",
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !currentLecture) return <Loader />;

  if (isSecurityBreached) {
    return (
      <div className="fixed inset-0 bg-black z-[99999] flex flex-col items-center justify-center text-red-600 font-black p-10 text-center select-none">
        <h1 className="text-5xl mb-6 tracking-tighter italic">
          ⚠️ SYSTEM_LOCKED
        </h1>
        <p className="text-xl max-w-lg opacity-80">
          Security Breach: Content Protection active. Please reload in a secure
          environment.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-10 px-10 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white hover:bg-zinc-800 transition-all"
        >
          TERMINATE & RELOAD
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-black text-white w-full h-[100dvh] pt-16 overflow-hidden select-none">
      {devToolsOpen && (
        <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center text-red-600 font-black text-3xl animate-pulse italic tracking-tighter">
          SECURITY BREACH DETECTED
        </div>
      )}

      {/* HEADER */}
      <div className="h-[75px] px-6 py-3 flex items-center justify-between border-b border-zinc-800 bg-black z-50 shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="text-center hidden md:block">
          <h2 className="text-base font-bold text-white truncate max-w-md uppercase tracking-tight">
            {currentLecture.lectureTitle}
          </h2>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] mt-0.5">
            Lecture {currentIndex + 1} of {lectures.length}
          </p>
        </div>

        <div className="px-4 py-1.5 bg-zinc-900 rounded-sm border border-zinc-700 text-[11px] font-black text-red-500 uppercase tracking-widest italic shadow-lg">
          INTEGRITY_MAX
        </div>
      </div>

      {/* PLAYER AREA */}
      <div
        ref={containerRef}
        onMouseMove={handleInteraction}
        onTouchStart={handleInteraction}
        className="relative flex-1 bg-black group flex items-center justify-center overflow-hidden"
        style={{ cursor: controlsVisible || isNavigating ? "default" : "none" }}
      >
        {isLocked ? (
          <div className="flex flex-col items-center p-6">
            <Lock size={40} className="text-orange-500 mb-4" />
            <BuyCourseButton courseId={courseId} />
          </div>
        ) : (
          <div
            className={`w-full h-full relative flex items-center justify-center overflow-hidden z-0 transition-all duration-300 ${!isFullscreen ? "-mt-5" : "mt-0"}`}
          >
            <div
              className={`absolute w-full h-[108%] -top-[7%] transition-all duration-1000 ${isPlaying ? "opacity-100 scale-100" : "opacity-10 blur-xl scale-110"}`}
            >
              {!devToolsOpen && !isSecurityBreached && (
                <div
                  id={playerElementId}
                  className="w-full h-full pointer-events-none"
                ></div>
              )}
            </div>

            <div
              className="absolute inset-0 z-[22] bg-transparent cursor-default"
              onContextMenu={(e) => e.preventDefault()}
            />
            <div className="absolute inset-0 z-[23] bg-transparent pointer-events-none border-[30px] border-transparent" />

            {isNavigating && (
              <div className="absolute inset-0 bg-black z-[60] flex items-center justify-center">
                <Loader2 className="animate-spin text-orange-600" size={40} />
              </div>
            )}

            {!isFullscreen && !isNavigating && (
              <div className="absolute top-0 left-0 w-full h-[9%] bg-black z-[25] pointer-events-none flex items-center justify-center border-b border-white/5 transition-opacity duration-300">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700 opacity-50">
                  🔒 SECURE ENCRYPTED STREAM
                </p>
              </div>
            )}

            {showBottomShield && !isNavigating && (
              <div
                className={`absolute bottom-0 left-0 w-full h-20 pointer-events-none flex items-center justify-center border-t border-white/5 transition-all duration-700 animate-in fade-in slide-in-from-bottom-2 
  ${isInitialLoading ? "bg-zinc-950" : "bg-black"}`}
              >
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600">
                  🛡️ SYSTEM INTEGRITY VERIFIED • ANTI-RECORD ACTIVE
                </p>
              </div>
            )}

            <div
              className="absolute pointer-events-none z-40 transition-all duration-[8000ms] select-none opacity-30 group-hover:opacity-50"
              style={{ top: watermarkPos.top, left: watermarkPos.left }}
            >
              <div className="flex flex-col items-center bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-2xl">
                <p className="text-[9px] md:text-[11px] font-bold text-white uppercase tracking-tighter mb-0.5">
                  {user?.name || "AUTHENTICATED USER"}
                </p>
                <div className="h-[1px] w-full bg-white/10 my-1" />
                <p className="text-[7px] md:text-[9px] font-black text-orange-500 uppercase tracking-[0.3em]">
                  acadifynew.vercel.app
                </p>
              </div>
            </div>

            {!isPlaying &&
              !devToolsOpen &&
              !isSecurityBreached &&
              !isNavigating && (
                <div className="absolute inset-0 z-[26] flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                  <button
                    onClick={togglePlay}
                    className="bg-orange-600 hover:bg-orange-500 p-8 rounded-full shadow-[0_0_50px_rgba(234,88,12,0.4)] transform hover:scale-110 active:scale-95 transition-all"
                  >
                    <Play size={44} fill="white" />
                  </button>
                </div>
              )}

            <div
              className="absolute inset-0 z-[21]"
              onClick={togglePlay}
              onDoubleClick={toggleFullscreen}
              onContextMenu={(e) => e.preventDefault()}
            />

            <div
              className={`absolute inset-0 z-30 flex flex-col justify-end bg-gradient-to-t from-black via-transparent transition-opacity duration-700 p-6 ${controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <div className="max-w-6xl mx-auto w-full space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-zinc-400">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-zinc-700/50 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                  <span className="text-[10px] font-mono text-zinc-400">
                    {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-6 md:gap-10">
                    <div className="relative flex items-center">
                      <div
                        className={`absolute right-[120%] transition-all duration-500 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border backdrop-blur-md shadow-lg ${isPlaying ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 animate-bounce"}`}
                      >
                        <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                          {isPlaying ? "Click to Pause 👉" : "Click to Play 👉"}
                        </span>
                      </div>
                      <button
                        onClick={togglePlay}
                        className="hover:text-orange-500 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause size={28} />
                        ) : (
                          <Play size={28} fill="currentColor" />
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSettings(!showSettings);
                        }}
                        className="text-[11px] font-bold bg-zinc-800/80 px-4 py-2 rounded-lg border border-zinc-700 hover:border-orange-500"
                      >
                        <Settings2 size={16} className="inline mr-1" />{" "}
                        {playbackRate}x
                      </button>
                      {showSettings && (
                        <div className="absolute bottom-12 left-0 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden w-36 shadow-2xl z-50">
                          {[1, 1.25, 1.5, 2].map((speed) => (
                            <button
                              key={speed}
                              onClick={() => changeSpeed(speed)}
                              className={`w-full text-left px-5 py-3 text-[11px] hover:bg-zinc-800 ${playbackRate === speed ? "text-orange-500 bg-orange-500/5 font-bold" : ""}`}
                            >
                              {speed}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLandscape}
                      className="md:hidden p-2 bg-zinc-800 rounded-lg border border-zinc-700 text-orange-500"
                    >
                      <RectangleHorizontal size={24} />
                    </button>
                    <button
                      onClick={toggleFullscreen}
                      className="hover:text-orange-500 transition-all"
                    >
                      <Maximize size={24} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 px-10 shrink-0">
        <div className="flex items-center gap-4">
          <button
            disabled={!prevLecture}
            onClick={() => handleSafeNavigate(prevLecture?._id)}
            className="p-3 bg-zinc-800 rounded-xl disabled:opacity-20 hover:bg-zinc-700 border border-zinc-700"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            disabled={!nextLecture}
            onClick={() => handleSafeNavigate(nextLecture?._id)}
            className="p-3 bg-zinc-800 rounded-xl disabled:opacity-20 hover:bg-zinc-700 border border-zinc-700"
          >
            <ChevronRight size={22} />
          </button>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
            {/* Quiz Button */}
            <button
              onClick={() =>
                isEligibleForComplete &&
                navigate(`/course/${courseId}/lecture/${lectureId}/quiz`)
              }
              disabled={!isEligibleForComplete}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold active:scale-95 transition-all shadow-lg text-sm md:text-base ${
                isEligibleForComplete
                  ? "bg-zinc-900 hover:bg-zinc-800 text-purple-400 border border-purple-500/30"
                  : "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed"
              }`}
            >
              <BrainCircuit size={18} className="shrink-0" />
              <span className="whitespace-nowrap">
                {isEligibleForComplete ? "Take Quiz" : "90% Min for Quiz"}
              </span>
            </button>

            {/* Mark Complete Button */}
            <button
              onClick={handleManualComplete}
              disabled={isMarking || !isEligibleForComplete}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold active:scale-95 transition-all shadow-lg text-sm md:text-base ${
                isEligibleForComplete
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                  : "bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed"
              }`}
            >
              {isMarking ? (
                <Loader2 className="animate-spin shrink-0" size={18} />
              ) : (
                <CheckCircle size={18} className="shrink-0" />
              )}
              <span className="whitespace-nowrap">
                {isEligibleForComplete ? "Mark Complete" : "90% Min"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturePlayer;
