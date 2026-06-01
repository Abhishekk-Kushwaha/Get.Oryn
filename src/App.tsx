import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { LandingPage } from "./components/LandingPage";
import { FeaturesPage } from "./components/FeaturesPage";
import { PricingPage } from "./components/PricingPage";
import { VALID_VIEWS, type ViewType } from "./hooks/useAppRouter";

const AppContent = lazy(() => import("./AppContent"));

export default function App() {
  const [showApp, setShowApp] = useState(() => {
    const path = window.location.pathname.replace(/\/$/, "");
    const hash = window.location.hash.replace("#", "");
    return path === "/demo" || VALID_VIEWS.includes(hash as ViewType);
  });
  const [landingPath, setLandingPath] = useState(() => {
    return window.location.pathname.replace(/\/$/, "") || "/";
  });
  const savedScrollPositionRef = useRef(0);

  // Restore scroll position when leaving the app back to the landing page
  useEffect(() => {
    if (!showApp && savedScrollPositionRef.current > 0) {
      const timer = setTimeout(() => {
        window.scrollTo(0, savedScrollPositionRef.current);
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [showApp]);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const isDemoUrl = (path: string, hash: string) => {
      const cleanPath = path.replace(/\/$/, "");
      const cleanHash = hash.replace("#", "");
      return cleanPath === "/demo" || VALID_VIEWS.includes(cleanHash as ViewType);
    };

    const handleNavigation = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (isDemoUrl(path, hash)) {
        setShowApp(true);
      } else {
        setShowApp(false);
        setLandingPath(path.replace(/\/$/, "") || "/");
      }
    };

    window.addEventListener("popstate", handleNavigation);
    window.addEventListener("hashchange", handleNavigation);

    // Initial check: if loaded with a valid app view or demo path, show the app immediately.
    const initialPath = window.location.pathname;
    const initialHash = window.location.hash.replace("#", "");
    if (isDemoUrl(initialPath, window.location.hash)) {
      if (!window.history.state?.orynDemoEntry) {
        const landingUrl = "/";
        const appUrl = `/demo#${VALID_VIEWS.includes(initialHash as ViewType) ? initialHash : "today"}`;
        window.history.replaceState({ orynLandingEntry: true }, "", landingUrl);
        window.history.pushState({ orynDemoEntry: true }, "", appUrl);
      }
      setShowApp(true);
    }

    return () => {
      window.removeEventListener("popstate", handleNavigation);
      window.removeEventListener("hashchange", handleNavigation);
    };
  }, []);

  const handleEnterApp = () => {
    savedScrollPositionRef.current = window.scrollY || document.documentElement.scrollTop || 0;
    setShowApp(true);
    window.history.pushState({ orynDemoEntry: true }, "", "/demo#today");
  };

  const handleLandingNavigate = (path: string) => {
    console.log("[App] handleLandingNavigate called with path:", path);
    window.history.pushState({ orynLandingEntry: true }, "", path);
    setLandingPath(path.replace(/\/$/, "") || "/");
    window.scrollTo(0, 0);
  };

  const handleExitApp = () => {
    setShowApp(false);
    setLandingPath("/");
    window.history.pushState(
      { orynLandingEntry: true },
      "",
      "/",
    );
  };

  console.log("[App] rendering state: showApp =", showApp, "landingPath =", landingPath);

  if (!showApp) {
    if (landingPath === "/features") {
      console.log("[App] Rendering FeaturesPage component");
      return <FeaturesPage key="features-page" onEnter={handleEnterApp} onNavigate={handleLandingNavigate} />;
    }
    if (landingPath === "/pricing") {
      console.log("[App] Rendering PricingPage component");
      return <PricingPage key="pricing-page" onEnter={handleEnterApp} onNavigate={handleLandingNavigate} />;
    }
    console.log("[App] Rendering LandingPage component");
    return <LandingPage key="landing-page" onEnter={handleEnterApp} onNavigate={handleLandingNavigate} />;
  }

  return (
    <AppErrorBoundary>
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              background: "#09090b",
              color: "#a1a1aa",
              fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "3px solid #27272a",
                  borderTopColor: "#fb923c",
                  borderRadius: "50%",
                  animation: "oryn-spin 1s linear infinite",
                  margin: "0 auto 16px",
                }}
              />
              <p style={{ fontSize: "14px", fontWeight: 500 }}>Loading Oryn...</p>
              <style>{`
                @keyframes oryn-spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </div>
        }
      >
        <AppContent onExit={handleExitApp} />
      </Suspense>
    </AppErrorBoundary>
  );
}
