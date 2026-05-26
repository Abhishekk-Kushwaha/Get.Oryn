import { useEffect, useState } from "react";
import type { AppSession } from "../lib/account";

export function useSessionState() {
  const [session, setSession] = useState<AppSession | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  useEffect(() => {
    // Mock local session
    setSession({
      user: {
        id: "local-user",
        user_metadata: {
          is_pro: true, // Let's make the user pro for the "premium" feel requested! 
        }
      }
    });
    setIsSessionLoading(false);
  }, []);

  return {
    session,
    isSessionLoading,
  };
}
