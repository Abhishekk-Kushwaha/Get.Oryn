import { useState, useEffect } from "react";
import AppContent from "./AppContent";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { LandingPage } from "./components/LandingPage";

export default function App() {
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setShowApp(window.location.hash === "#demo");
    };

    window.addEventListener("hashchange", handleHashChange);

    // If initial load has #demo hash, enter the app
    if (window.location.hash === "#demo") {
      setShowApp(true);
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleEnterApp = () => {
    window.location.hash = "demo";
  };

  const handleExitApp = () => {
    window.location.hash = "";
  };

  if (!showApp) {
    return <LandingPage onEnter={handleEnterApp} />;
  }

  return (
    <AppErrorBoundary>
      <AppContent onExit={handleExitApp} />
    </AppErrorBoundary>
  );
}
