import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";

interface PricingPageProps {
  onEnter: () => void;
  onNavigate: (path: string) => void;
}

export function PricingPage({ onEnter, onNavigate }: PricingPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Why doesn't Oryn have a free plan?",
      answer: "Consistency requires skin in the game. We've found that a small financial commitment drastically increases the chances that you'll actually show up and do the work. It also allows us to build a premium, ad-free product that respects your privacy and doesn't rely on selling your data."
    },
    {
      question: "How is this different from my current to-do list?",
      answer: "Standard to-do lists just track what you need to do today. Oryn bridges the gap between your daily tasks and your long-term ambitions. By combining habit streaks, daily planning, and goal tracking in one place, you actually see how your daily actions compound over time."
    },
    {
      question: "Is my personal data secure?",
      answer: "100%. Because we charge a straightforward subscription, you are our customer, not the product. We use industry-standard encryption to protect your data, and we will never sell, share, or monetize your personal information."
    },
    {
      question: "Can I cancel if it's not working for me?",
      answer: "Of course. You can cancel your subscription at any time with a single click in your settings. No emails to support, no hidden fees, and no hassle. Your data will always remain yours to export whenever you want."
    }
  ];

  // Robust scroll to top on mount
  useEffect(() => {
    if (window.location.pathname !== "/pricing") {
      window.history.replaceState(null, "", "/pricing");
    }
    
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const rootEl = document.getElementById("root");
      if (rootEl) rootEl.scrollTop = 0;
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    };

    scrollToTop();
    const t1 = setTimeout(scrollToTop, 10);
    const t2 = setTimeout(scrollToTop, 50);
    const t3 = setTimeout(scrollToTop, 150);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-900 overflow-y-auto overflow-x-hidden custom-scrollbar font-sans selection:bg-orange-500/30">
      <ScrollOverflowHandler />

      {/* ═══════════ PRICING ═══════════ */}
      <div className="bg-slate-50 py-16 md:py-24 border-t border-slate-200/80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-md md:max-w-xl mx-auto px-6 w-full relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Choose Consistency</h2>
            <p className="text-slate-500 mt-2">Not another subscription.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-5 text-slate-900 flex flex-col justify-between shadow-lg shadow-slate-200/30 border border-slate-200/60"
            >
              <div>
                <div className="text-xs uppercase tracking-wider font-bold text-slate-400">Monthly</div>
                <div className="text-4xl font-black mt-3 text-slate-900">₹99</div>
                <div className="text-slate-400 text-sm mt-0.5">per month</div>
              </div>
              <div>
                <div className="mt-4 bg-slate-50 border border-slate-100 rounded-2xl p-2 text-center text-[10px] sm:text-xs font-semibold text-slate-600">
                  Less than ₹4/day
                </div>
                <button onClick={onEnter} className="mt-4 w-full h-11 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-sm transition-all active:scale-95 cursor-pointer">
                  Start Today
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-orange-500/[0.04] border border-orange-500/20 rounded-2xl p-5 text-slate-900 relative flex flex-col justify-between scale-[1.03] transition-all"
              style={{ boxShadow: '0 10px 30px -10px rgba(249,115,22,0.15)' }}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] px-3 py-1 rounded-full font-black tracking-wider shadow-sm uppercase whitespace-nowrap">
                MOST POPULAR
              </div>
              <div className="mt-2">
                <div className="text-xs uppercase tracking-wider font-bold text-orange-600">6 Months</div>
                <div className="text-4xl font-black mt-3 text-slate-900">₹249</div>
                <div className="text-slate-400 text-sm mt-0.5">Only ₹41/month</div>
              </div>
              <div>
                <div className="mt-4 bg-orange-100/40 border border-orange-200/30 rounded-2xl p-2 text-center text-[10px] sm:text-xs font-semibold text-orange-700 leading-snug">
                  Commit to consistency
                </div>
                <button onClick={onEnter} className="mt-4 w-full h-11 flex items-center justify-center bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white rounded-2xl font-bold text-sm transition-all active:scale-95 cursor-pointer shadow-md shadow-orange-400/20">
                  Stay Consistent
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 text-slate-900 overflow-hidden shadow-xl shadow-slate-200/40"
          >
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-slate-700">
                🍕 Same Price. Different Outcome.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 text-center flex flex-col items-center justify-between">
                <div>
                  <div className="text-5xl mb-3 animate-bounce" style={{ animationDuration: '3s' }}>🍕</div>
                  <div className="font-black text-lg sm:text-xl text-slate-800">Pizza</div>
                  <div className="text-2xl sm:text-3xl font-black mt-2 text-slate-900">₹249</div>
                  <div className="text-slate-400 text-xs sm:text-sm mt-1">20 Minutes</div>
                </div>
                <div className="mt-5 h-2 bg-slate-200 rounded-full overflow-hidden w-full">
                  <div className="h-full w-[10%] bg-red-500 rounded-full" />
                </div>
              </div>

              <div className="bg-orange-500/[0.04] border border-orange-500/20 rounded-2xl p-5 text-center flex flex-col items-center justify-between">
                <div>
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center p-2 mb-3 shadow-lg shadow-orange-500/10 border border-orange-100 mx-auto">
                    <img src="/logo.png" alt="Oryn" className="w-full h-full object-contain" />
                  </div>
                  <div className="font-black text-lg sm:text-xl text-orange-600">Oryn</div>
                  <div className="text-2xl sm:text-3xl font-black mt-2 text-orange-600">₹249</div>
                  <div className="text-orange-500 text-xs sm:text-sm mt-1">180 Days</div>
                </div>
                <div className="mt-5 h-2 bg-orange-100/65 rounded-full overflow-hidden w-full">
                  <div className="h-full w-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
                </div>
              </div>
            </div>

            <div className="text-center mt-7">
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
                One disappears in minutes.
              </h3>
              <h3 className="text-xl sm:text-2xl font-black text-orange-600 mt-1 leading-tight">
                One stays with you every day.
              </h3>
              <p className="text-slate-500 mt-4 text-xs sm:text-sm leading-relaxed">
                The cost is the same.<br />
                The outcome isn't.
              </p>
            </div>
          </motion.div>
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


      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-slate-50 py-10 px-8 border-t border-slate-200 pb-24 md:pb-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Oryn Logo" className="w-4 h-4 object-contain grayscale opacity-70" />
            <span className="font-medium">© {new Date().getFullYear()} Oryn. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-900 font-medium transition-colors cursor-pointer" onClick={() => window.open("https://twitter.com", "_blank")}>Twitter</span>
            <span className="hover:text-slate-900 font-medium transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-slate-900 font-medium transition-colors cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>

      {/* ═══════════ MINIMALIST BOTTOM BAR ═══════════ */}
      <header className="fixed bottom-0 left-0 right-0 z-50 w-full bg-slate-50/95 backdrop-blur-md border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-6 sm:gap-8">
            <button
              onClick={() => onNavigate("/")}
              className="text-sm font-semibold tracking-wide transition-colors cursor-pointer focus:outline-none text-slate-500 hover:text-slate-900"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("/features")}
              className="text-sm font-semibold tracking-wide transition-colors cursor-pointer focus:outline-none text-slate-500 hover:text-slate-900"
            >
              Features
            </button>
            <button
              className="text-sm font-extrabold tracking-wide transition-colors cursor-pointer focus:outline-none text-slate-900"
            >
              Pricing
            </button>
          </div>

          <button
            onClick={onEnter}
            className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-90 hover:scale-[1.02] active:scale-95 text-white text-xs font-bold rounded-full transition-all cursor-pointer focus:outline-none shadow-md shadow-orange-500/10"
          >
            Try Demo
          </button>
        </div>
      </header>
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
