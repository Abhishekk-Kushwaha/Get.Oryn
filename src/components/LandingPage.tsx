import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { 
  ArrowRight, Target, Activity, CalendarDays, LayoutDashboard, 
  CheckCircle2, Zap, Star, Shield, 
  ChevronDown, Check, Users, TrendingUp, Clock,
  Flame, BarChart3, Brain, Lock, Sparkles, X
} from "lucide-react";

// ─── Animated counter hook ───────────────────────────────────────
function useCountUp(end: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!startOnView || !isInView) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, isInView, startOnView]);

  return { count, ref };
}

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Generate random twinkling stars for the background
  const backgroundStars = React.useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.5 + 0.5, // 0.5px to 2px
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 4 + 3}s`,
      opacity: Math.random() * 0.7 + 0.15,
    }));
  }, []);

  // Oryn Login states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      setShowLoginModal(false);
      onEnter();
    }, 1200);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      setShowLoginModal(false);
      onEnter();
    }, 800);
  };

  // Animated counters
  const stat1 = useCountUp(12847);
  const stat2 = useCountUp(94);
  const stat3 = useCountUp(42);

  // Sticky bar appears after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.getElementById("root")?.scrollTop || 0;
      setShowStickyBar(scrollY > 800);
    };
    
    window.addEventListener("scroll", handleScroll, true);
    const rootEl = document.getElementById("root");
    if (rootEl) rootEl.addEventListener("scroll", handleScroll, true);
    
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      if (rootEl) rootEl.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const faqs = [
    {
      question: "Is Forge really free to start?",
      answer: "Yes, 100% free. No credit card required. The Hobby plan gives you up to 3 active goals, 10 habits, a daily planner, and 7 days of history — enough to build real momentum before deciding to upgrade."
    },
    {
      question: "How does Forge compare to Notion, Todoist, or Habitica?",
      answer: "Those are great tools for individual jobs. But context-switching between 3-4 apps kills your focus. Forge unites goals, habits, daily planning, and analytics in one distraction-free interface — so you stop managing tools and start managing your life."
    },
    {
      question: "Can I use Forge on my phone?",
      answer: "Absolutely. Forge is a progressive web app (PWA) that installs on your home screen and works offline. It's designed mobile-first. Native iOS and Android apps are in active development."
    },
    {
      question: "Is my data secure and private?",
      answer: "Your data is encrypted at rest and in transit using industry-standard AES-256 and TLS 1.3. We never sell or monetize your personal information. You own your data — export anytime."
    },
    {
      question: "Can I cancel my Pro plan anytime?",
      answer: "Yes, cancel with one click. No contracts, no hidden fees, no questions asked. Your data stays yours and your account reverts to the free Hobby plan."
    }
  ];

  // SVG Logo component matching the F-checkmark exactly
  const ForgeLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M30 20H74L62 32H42V42H62L52 52H42V58L50 66L68 48L76 56L50 82L30 62V20Z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-y-auto custom-scrollbar font-sans selection:bg-orange-500/30">
      <ScrollOverflowHandler />
      
      {/* ═══════════ STICKY CTA BAR ═══════════ */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div 
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#07080a]/95 backdrop-blur-xl border-b border-white/5 px-4 py-2.5 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-white">
              <ForgeLogo className="w-5 h-5" />
              <span className="font-bold text-sm hidden sm:block">Forge</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 text-xs font-medium hidden sm:block">✦ Free plan available — no credit card</span>
              <button onClick={() => setShowLoginModal(true)} className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-full transition-all hover:scale-[1.03] active:scale-95">
                Start Free →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ HERO SECTION (exactly matching screenshot) ═══════════ */}
      <div className="relative w-full flex flex-col min-h-screen bg-[#000000] text-white overflow-hidden pb-16 md:pb-24">
        {/* Style block for twinkling and falling/shooting star animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes twinkle-star {
            0%, 100% { opacity: 0.15; transform: scale(0.8); }
            50% { opacity: 0.85; transform: scale(1.2); }
          }
          @keyframes falling-star-diagonal {
            0% {
              transform: translate3d(0, 0, 0) rotate(-45deg) scale(0);
              opacity: 0;
            }
            3% {
              opacity: 0.9;
              transform: translate3d(-15px, 15px, 0) rotate(-45deg) scale(1);
            }
            12% {
              opacity: 0.9;
            }
            25% {
              transform: translate3d(-250px, 250px, 0) rotate(-45deg) scale(0.15);
              opacity: 0;
            }
            100% {
              transform: translate3d(-250px, 250px, 0) rotate(-45deg) scale(0);
              opacity: 0;
            }
          }
          .twinkle-dot {
            position: absolute;
            border-radius: 50%;
            background-color: white;
            animation: twinkle-star 4s ease-in-out infinite;
            pointer-events: none;
          }
          .falling-star {
            position: absolute;
            width: 80px;
            height: 1px;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.8), transparent);
            opacity: 0;
            pointer-events: none;
            transform-origin: left center;
          }
          .falling-star::after {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 2.5px;
            height: 2.5px;
            background: white;
            border-radius: 50%;
            box-shadow: 0 0 6px 1.5px white, 0 0 12px 3px rgba(255, 255, 255, 0.4);
          }
        `}} />

        {/* Falling/twinkling stars background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Twinkling star dots */}
          {backgroundStars.map((star) => (
            <div 
              key={star.id}
              className="twinkle-dot"
              style={{
                top: star.top,
                left: star.left,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animationDelay: star.delay,
                animationDuration: star.duration,
              }}
            />
          ))}

          {/* Falling stars (meteor shooting effect) */}
          <div className="falling-star top-[15%] right-[10%]" style={{ animation: "falling-star-diagonal 7s linear infinite", animationDelay: "0.2s" }} />
          <div className="falling-star top-[30%] right-[25%]" style={{ animation: "falling-star-diagonal 10s linear infinite", animationDelay: "2.5s" }} />
          <div className="falling-star top-[10%] right-[45%]" style={{ animation: "falling-star-diagonal 8.5s linear infinite", animationDelay: "5.1s" }} />
          <div className="falling-star top-[45%] right-[15%]" style={{ animation: "falling-star-diagonal 12s linear infinite", animationDelay: "1.2s" }} />
          <div className="falling-star top-[20%] right-[65%]" style={{ animation: "falling-star-diagonal 9s linear infinite", animationDelay: "3.8s" }} />
          <div className="falling-star top-[35%] right-[50%]" style={{ animation: "falling-star-diagonal 11s linear infinite", animationDelay: "6.4s" }} />
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-between p-6 px-8 md:px-12 z-20 select-none">
          <div className="flex items-center gap-2 text-white cursor-pointer" onClick={() => setShowLoginModal(true)}>
            <img src="/logo.png" alt="Oryn Logo" className="w-8 h-8 object-contain" />
          </div>
          <button className="text-white hover:opacity-80 transition-opacity focus:outline-none" onClick={() => setShowLoginModal(true)}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </nav>

        {/* Central Display: Tilted Phones (Hero.jpeg) */}
        <main className="relative flex-1 flex flex-col items-center justify-center z-20 w-full max-w-lg mx-auto px-4 mt-2 md:mt-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full flex justify-center cursor-pointer"
            onClick={() => setShowLoginModal(true)}
          >
            <img 
              src="/Hero.jpeg" 
              alt="Oryn App Mockups" 
              className="w-full max-w-[340px] sm:max-w-[420px] md:max-w-[500px] lg:max-w-[580px] h-auto object-contain select-none transition-transform duration-500 hover:scale-[1.01]"
              draggable={false}
            />
          </motion.div>
        </main>

        {/* Bottom Logo, Branding & Tagline */}
        <div className="flex flex-col items-center z-20 pb-12 md:pb-16 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            {/* Rounded Oryn app icon directly */}
            <img 
              src="/logo.png" 
              alt="Oryn Logo" 
              onClick={() => setShowLoginModal(true)}
              className="w-20 h-20 object-contain hover:scale-[1.03] transition-transform duration-300 mb-6 cursor-pointer select-none" 
            />

            {/* App Title */}
            <h1 
              onClick={() => setShowLoginModal(true)}
              className="text-4xl md:text-[44px] font-bold tracking-tight mb-5 text-white cursor-pointer hover:opacity-90 select-none"
            >
              Oryn
            </h1>

            {/* Tagline */}
            <p 
              onClick={() => setShowLoginModal(true)}
              className="text-lg text-white/60 font-light tracking-wide max-w-md px-4 cursor-pointer select-none"
            >
              Set goals. Track progress. <strong className="text-white font-semibold">Own</strong> yourself.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ═══════════ SOCIAL PROOF BAR ═══════════ */}
      <div className="bg-white border-b border-slate-100 py-6">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-black text-slate-900"><span ref={stat1.ref}>{stat1.count.toLocaleString()}</span>+</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Active Users</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-slate-900"><span ref={stat2.ref}>{stat2.count}</span>%</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Habit Completion Rate</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-black text-slate-900"><span ref={stat3.ref}>{stat3.count}</span>-day</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Avg. Longest Streak</div>
          </div>
        </div>
      </div>

      {/* ═══════════ PROBLEM → SOLUTION ═══════════ */}
      <div className="bg-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 mb-5">
              You don't lack motivation.<br/><span className="text-orange-500">You lack a system.</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Most people juggle 3-4 apps just to manage their day. Forge replaces them all with one fluid workspace.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Before */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-red-50/60 border border-red-200/50 rounded-3xl p-8">
              <div className="text-red-500 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2"><X size={16}/> Without Forge</div>
              <ul className="space-y-3">
                {["Scattered across Notion, Todoist & spreadsheets","Forget habits after the first week","No visibility into long-term progress","Constant context-switching kills focus"].map((item,i)=>(
                  <li key={i} className="flex gap-3 text-slate-600 text-sm"><span className="text-red-400 mt-0.5 shrink-0">✗</span>{item}</li>
                ))}
              </ul>
            </motion.div>
            {/* After */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-emerald-50/60 border border-emerald-200/50 rounded-3xl p-8">
              <div className="text-emerald-600 font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2"><CheckCircle2 size={16}/> With Forge</div>
              <ul className="space-y-3">
                {["One dashboard for goals, habits & daily tasks","Visual streaks that make consistency addictive","Heatmaps & charts show your real trajectory","Built-in Focus Mode eliminates distractions"].map((item,i)=>(
                  <li key={i} className="flex gap-3 text-slate-700 text-sm"><span className="text-emerald-500 mt-0.5 shrink-0">✓</span>{item}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══════════ FEATURES BENTO ═══════════ */}
      <div id="features" className="bg-slate-50 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">Everything you need. <span className="text-slate-400">Nothing you don't.</span></h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Four pillars. Zero bloat. Built for people who ship.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
              className="md:col-span-2 relative overflow-hidden rounded-[32px] bg-white border border-slate-200 p-8 lg:p-12 hover:shadow-lg transition-shadow group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] group-hover:bg-orange-500/20 transition-colors" />
              <LayoutDashboard className="w-10 h-10 text-orange-500 mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Unified Dashboard</h3>
              <p className="text-slate-500 max-w-md text-lg leading-relaxed mb-8">Your goals, habits, and daily tasks — one glance. Stop context-switching, start executing.</p>
              <div className="pointer-events-none w-full max-w-sm rounded-2xl bg-white border border-slate-100 p-4 shadow-xl shadow-slate-200/50">
                <div className="flex items-center justify-between mb-4"><div className="w-20 h-2 rounded-full bg-slate-200" /><div className="w-8 h-8 rounded-full bg-slate-100" /></div>
                <div className="space-y-3">
                  <div className="w-full h-12 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center px-4 gap-3"><div className="w-5 h-5 rounded-full border-2 border-orange-400" /><div className="w-32 h-2 rounded bg-orange-200" /></div>
                  <div className="w-full h-12 rounded-xl bg-slate-50 flex items-center px-4 gap-3"><div className="w-5 h-5 rounded-full border-2 border-slate-300" /><div className="w-24 h-2 rounded bg-slate-200" /></div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-[32px] bg-white border border-slate-200 p-8 lg:p-12 flex flex-col hover:shadow-lg transition-shadow group">
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-colors" />
              <Activity className="w-10 h-10 text-blue-500 mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Habit Streaks</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-auto">Visual streaks that make consistency addictive. Never break the chain.</p>
              <div className="mt-8 flex gap-2">
                {[1,2,3,4,5,6,7].map(i => <div key={i} className={`flex-1 aspect-[1/2] rounded-full ${i>4?'bg-slate-100':'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]'}`} />)}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
              className="relative overflow-hidden rounded-[32px] bg-white border border-slate-200 p-8 lg:p-12 hover:shadow-lg transition-shadow group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-colors" />
              <Target className="w-10 h-10 text-emerald-500 mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Goal Mastery</h3>
              <p className="text-slate-500 text-lg leading-relaxed">Break massive ambitions into milestones. Watch your progress compound.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="md:col-span-2 relative overflow-hidden rounded-[32px] bg-white border border-slate-200 p-8 lg:p-12 hover:shadow-lg transition-shadow group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-colors" />
              <Zap className="w-10 h-10 text-purple-500 mb-6" strokeWidth={1.5} />
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Focus Mode</h3>
              <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-xl">Block distractions. Enter deep work. Forge logs every focus session automatically so you see exactly where your hours go.</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-purple-900 bg-purple-100 px-5 py-2.5 rounded-xl border border-purple-200 font-medium text-sm"><Zap size={16} className="text-purple-600" /> 25-min Deep Work</div>
                <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-5 py-2.5 rounded-xl border border-slate-200 text-sm"><BarChart3 size={16} className="text-slate-400" /> Auto-logged Sessions</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══════════ MID-PAGE CTA ═══════════ */}
      <div className="bg-[#07080a] py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-amber-500/5" />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <h3 className="text-2xl md:text-3xl font-black text-white mb-4">Stop planning to plan. Start building.</h3>
          <p className="text-white/50 mb-6">Join 12,000+ users who replaced their tool stack with one app.</p>
          <button onClick={() => setShowLoginModal(true)} className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold rounded-full shadow-lg shadow-orange-500/25 hover:scale-[1.03] active:scale-95 transition-all inline-flex items-center gap-2">
            Get Started Free <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <div className="bg-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">Loved by <span className="text-orange-500">high performers</span>.</h2>
            <p className="text-slate-500 text-lg">Real results from real users.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { quote: "Forge replaced Notion, Todoist, and my physical journal. I've completed more goals in 3 months than in the last 2 years combined.", author: "Sarah Jenkins", role: "Product Manager at Stripe", metric: "12 goals completed" },
              { quote: "The Focus Mode alone saved me 2+ hours daily. It's not a task manager — it's an operating system for ambitious people.", author: "David Martinez", role: "Senior Engineer at Google", metric: "2h+ saved daily" },
              { quote: "42-day streak and counting. The visual habit tracker makes consistency feel like a game I actually want to win.", author: "Elena Rostova", role: "Freelance Designer", metric: "42-day streak" }
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex gap-1 text-orange-400 mb-4">
                  {[...Array(5)].map((_,j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 mb-4 self-start">
                  <TrendingUp size={12} /> {t.metric}
                </div>
                <p className="text-base text-slate-700 leading-relaxed mb-8 flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center text-white font-bold text-sm">{t.author[0]}</div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{t.author}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ PRICING ═══════════ */}
      <div id="pricing" className="bg-slate-50 py-20 md:py-28 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-slate-900">Simple pricing. No surprises.</h2>
            <p className="text-slate-500 text-lg mb-6">Start free, upgrade when you're ready to go all-in.</p>
            {/* Annual/Monthly toggle */}
            <div className="inline-flex items-center bg-white border border-slate-200 rounded-full p-1">
              <button onClick={() => setIsAnnual(false)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${!isAnnual ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>Monthly</button>
              <button onClick={() => setIsAnnual(true)} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${isAnnual ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>
                Annual <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">Save 25%</span>
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white border border-slate-200 rounded-[32px] p-8 lg:p-12 flex flex-col shadow-sm">
              <h3 className="text-2xl font-bold mb-2 text-slate-900">Hobby</h3>
              <p className="text-slate-500 mb-6 text-sm">Perfect to build momentum and prove the system works.</p>
              <div className="text-5xl font-black mb-2 text-slate-900">$0</div>
              <div className="text-sm text-slate-400 mb-8">Free forever</div>
              <ul className="space-y-3 mb-auto text-sm">
                {["Up to 3 Active Goals","10 Habits maximum","Basic Daily Planner","7-day history","Community support"].map((f,i)=>(
                  <li key={i} className="flex items-center gap-3 text-slate-700"><Check size={16} className="text-emerald-500 shrink-0" />{f}</li>
                ))}
              </ul>
              <button onClick={() => setShowLoginModal(true)} className="mt-10 w-full py-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors font-bold text-sm">
                Start Free
              </button>
            </motion.div>

            {/* Pro */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-orange-50 to-amber-50/50 border-2 border-orange-300 rounded-[32px] p-8 lg:p-12 flex flex-col relative overflow-hidden shadow-lg shadow-orange-500/5">
              <div className="absolute top-6 right-6 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2 text-orange-950">Pro</h3>
              <p className="text-orange-800/70 mb-6 text-sm">For those who are serious about transformation.</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-black text-orange-950">${isAnnual ? '6' : '8'}</span>
                <span className="text-orange-600/50 font-medium">/mo</span>
                {isAnnual && <span className="text-xs line-through text-orange-400">$8/mo</span>}
              </div>
              <div className="text-sm text-orange-700/60 mb-8">{isAnnual ? 'Billed annually ($72/yr)' : 'Billed monthly'}</div>
              <ul className="space-y-3 mb-auto text-sm">
                {["Unlimited Goals & Habits","Advanced Focus Mode + stats","Unlimited History & Insights","Priority email support","Export data anytime"].map((f,i)=>(
                  <li key={i} className="flex items-center gap-3 text-orange-900"><Check size={16} className="text-orange-500 shrink-0" />{f}</li>
                ))}
              </ul>
              <button onClick={() => setShowLoginModal(true)} className="mt-10 w-full py-4 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all hover:scale-[1.02] active:scale-95 font-bold text-sm shadow-md shadow-orange-500/20">
                Go Pro — Start 7-Day Free Trial
              </button>
              <div className="text-center text-[11px] text-orange-700/50 mt-3">Cancel anytime. No questions asked.</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══════════ TRUST SIGNALS ═══════════ */}
      <div className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 text-slate-400 text-sm">
          <div className="flex items-center gap-2"><Shield size={16} className="text-emerald-500" /> <span>AES-256 Encryption</span></div>
          <div className="flex items-center gap-2"><Lock size={16} className="text-blue-500" /> <span>SOC 2 Compliant</span></div>
          <div className="flex items-center gap-2"><Users size={16} className="text-orange-500" /> <span>12,000+ Active Users</span></div>
          <div className="flex items-center gap-2"><Sparkles size={16} className="text-purple-500" /> <span>4.9★ Average Rating</span></div>
        </div>
      </div>

      {/* ═══════════ FAQ ═══════════ */}
      <div className="bg-slate-50 py-20 md:py-28 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">Got questions?</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-slate-300 shadow-sm">
                <button className="w-full text-left p-6 flex items-center justify-between font-bold text-base focus:outline-none text-slate-900" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  {faq.question}
                  <ChevronDown size={18} className={`text-slate-400 shrink-0 ml-4 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <div className="p-6 pt-0 text-slate-600 text-sm leading-relaxed">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <div className="bg-[#07080a] text-white py-24 md:py-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-orange-500/5 blur-[100px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Your future self is <br className="hidden md:block"/>waiting. <span className="text-orange-400">Start today.</span>
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
            Every day without a system is a day your goals drift further. Forge gives you the framework in under 2 minutes.
          </p>
          <button onClick={() => setShowLoginModal(true)} className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-black px-10 py-5 rounded-full font-bold text-lg hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-orange-500/20">
            Start Building Habits Free <ArrowRight size={20} />
          </button>
          <div className="mt-4 text-white/30 text-xs">Free forever on the Hobby plan. No credit card needed.</div>
        </div>
      </div>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-[#040506] py-10 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <ForgeLogo className="w-4 h-4" />
            <span>© {new Date().getFullYear()} Forge. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Twitter</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>

      {/* ═══════════ ORYN LOGIN MODAL ═══════════ */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
          >
            {/* Modal Overlay Close Trigger */}
            <div className="absolute inset-0" onClick={() => setShowLoginModal(false)} />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md bg-[#0d0e12] border border-white/10 rounded-[2rem] p-8 shadow-2xl text-white overflow-hidden z-10"
            >
              {/* Decorative radial gradient glow */}
              <div className="absolute -top-[40%] -right-[40%] w-[80%] h-[80%] bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
              
              {/* Close Button */}
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-5 right-5 text-white/40 hover:text-white hover:bg-white/5 p-2 rounded-full transition-all focus:outline-none"
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div className="flex flex-col items-center text-center mb-8 select-none">
                <div className="w-14 h-14 bg-[#16181f] border border-white/5 rounded-2xl flex items-center justify-center shadow-lg mb-4 overflow-hidden">
                  <img src="/logo.png" alt="Oryn Logo" className="w-10 h-10 object-contain" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white mb-1">Welcome to Oryn</h3>
                <p className="text-sm text-white/50">Enter your details to sign in to your workspace</p>
              </div>

              {/* Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/40 mb-1.5 select-none">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-orange-500/40 focus:bg-[#1a1d26] transition-all outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5 select-none">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/40">Password</label>
                    <span className="text-[11px] text-orange-400 hover:text-orange-355 cursor-pointer transition-colors font-medium">Forgot password?</span>
                  </div>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#16181f] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:border-orange-500/40 focus:bg-[#1a1d26] transition-all outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 text-sm mt-6 shadow-lg shadow-orange-500/10 disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In to Workspace</span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6 select-none">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0d0e12] px-3 text-white/30 font-bold tracking-wider">Or continue with</span>
                </div>
              </div>

              {/* Social Login Options */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "Google", icon: <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" /></svg> },
                  { name: "GitHub", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.527-10-10-10z" /></svg> },
                  { name: "Apple", icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.62.71-1.16 1.85-1.01 2.96 1.12.09 2.27-.58 2.96-1.41z" /></svg> }
                ].map((prov, i) => (
                  <button 
                    key={i}
                    type="button"
                    onClick={() => handleSocialLogin(prov.name)}
                    className="flex items-center justify-center py-2.5 bg-[#16181f] border border-white/5 hover:border-white/15 rounded-xl transition-all hover:bg-[#1a1d26] focus:outline-none"
                    title={`Sign in with ${prov.name}`}
                  >
                    {prov.icon}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScrollOverflowHandler() {
  useEffect(() => {
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const rootEl = document.getElementById("root");
    const origHtml = htmlEl.style.overflow;
    const origBody = bodyEl.style.overflow;
    const origRoot = rootEl?.style.overflow || "";

    htmlEl.style.overflow = "auto";
    bodyEl.style.overflow = "auto";
    if (rootEl) rootEl.style.overflow = "auto";

    return () => {
      htmlEl.style.overflow = origHtml;
      bodyEl.style.overflow = origBody;
      if (rootEl) rootEl.style.overflow = origRoot;
    };
  }, []);
  return null;
}
