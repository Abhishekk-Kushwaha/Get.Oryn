import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { LandingPage } from "./components/LandingPage";
import { VALID_VIEWS } from "./hooks/useAppRouter";

const AppContent = lazy(() => import("./AppContent"));

export default function App() {
  const [showApp, setShowApp] = useState(false);
  const isExitingRef = useRef(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) {
        if (isExitingRef.current) {
          setShowApp(false);
          isExitingRef.current = false;
        } else {
          window.location.hash = "today";
        }
      } else if (VALID_VIEWS.includes(hash as any)) {
        setShowApp(true);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    // Initial check: if loaded with a valid app view, show the app immediately.
    // If not, show the landing page.
    const initialHash = window.location.hash.replace("#", "");
    if (VALID_VIEWS.includes(initialHash as any)) {
      setShowApp(true);
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleEnterApp = () => {
    setShowApp(true);
    window.location.hash = "today";
  };

  const handleExitApp = () => {
    isExitingRef.current = true;
    setShowApp(false);
    window.location.hash = "";
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

