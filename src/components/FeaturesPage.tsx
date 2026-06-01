import React, { useEffect, useRef } from "react";
import { Hero195 } from "./ui/hero-195";

interface FeaturesPageProps {
  onEnter: () => void;
  onNavigate: (path: string) => void;
}

export function FeaturesPage({ onEnter, onNavigate }: FeaturesPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Set window path/hash correctly on mount
  useEffect(() => {
    if (window.location.pathname !== "/features") {
      window.history.replaceState(null, "", "/features");
    }
    // Scroll both window and container to top after a short delay
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }, 60);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-900 overflow-y-auto overflow-x-hidden custom-scrollbar font-sans selection:bg-orange-500/30">
      <ScrollOverflowHandler />

      {/* Spacer or very small elegant top bar/logo bar so the page doesn't look empty at the top */}
      <div className="bg-slate-50 border-b border-slate-200/50 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("/")}>
            <img src="/logo.png" alt="Oryn Logo" className="w-5 h-5 object-contain" />
            <span className="font-black text-sm tracking-tight text-slate-900">ORYN</span>
          </div>
          <button
            onClick={onEnter}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Go to Demo →
          </button>
        </div>
      </div>

      {/* Main Feature Component */}
      <div className="py-8 md:py-16">
        <Hero195 />
      </div>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="bg-[#040506] py-10 px-8 border-t border-white/5 pb-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Oryn Logo" className="w-4 h-4 object-contain" />
            <span>© {new Date().getFullYear()} Oryn. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer" onClick={() => window.open("https://twitter.com", "_blank")}>Twitter</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>

      {/* ═══════════ MINIMALIST BOTTOM BAR ═══════════ */}
      <header className="fixed bottom-0 left-0 right-0 z-50 w-full bg-slate-50/95 backdrop-blur-md border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
          {/* Navigation links */}
          <div className="flex items-center gap-6 sm:gap-8">
            <button
              onClick={() => onNavigate("/")}
              className="text-sm font-semibold tracking-wide transition-colors cursor-pointer focus:outline-none text-slate-500 hover:text-slate-900"
            >
              Home
            </button>
            <button
              className="text-sm font-extrabold tracking-wide transition-colors cursor-pointer focus:outline-none text-slate-900"
            >
              Features
            </button>
            <button
              onClick={() => onNavigate("/pricing")}
              className="text-sm font-semibold tracking-wide transition-colors cursor-pointer focus:outline-none text-slate-500 hover:text-slate-900"
            >
              Pricing
            </button>
          </div>

          {/* CTA Button */}
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
