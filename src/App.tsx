import { useState, useEffect, lazy, Suspense } from "react";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { LandingPage } from "./components/LandingPage";
import { VALID_VIEWS, type ViewType } from "./hooks/useAppRouter";

const AppContent = lazy(() => import("./AppContent"));

export default function App() {
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) {
        setShowApp(false);
      } else if (VALID_VIEWS.includes(hash as ViewType)) {
        setShowApp(true);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    // Initial check: if loaded with a valid app view, show the app immediately.
    // Seed a landing-page history entry so Back exits the demo instead of
    // closing a direct app link.
    const initialHash = window.location.hash.replace("#", "");
    if (VALID_VIEWS.includes(initialHash as ViewType)) {
      if (!window.history.state?.orynDemoEntry) {
        const landingUrl = `${window.location.pathname}${window.location.search}`;
        const appUrl = `${landingUrl}#${initialHash}`;
        window.history.replaceState({ orynLandingEntry: true }, "", landingUrl);
        window.history.pushState({ orynDemoEntry: true }, "", appUrl);
      }
      setShowApp(true);
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleEnterApp = () => {
    const landingUrl = `${window.location.pathname}${window.location.search}`;
    setShowApp(true);
    window.history.pushState({ orynDemoEntry: true }, "", `${landingUrl}#today`);
  };

  const handleExitApp = () => {
    setShowApp(false);
    window.history.replaceState(
      { orynLandingEntry: true },
      "",
      `${window.location.pathname}${window.location.search}`,
    );
  };

  if (!showApp) {
    return <LandingPage onEnter={handleEnterApp} />;
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
