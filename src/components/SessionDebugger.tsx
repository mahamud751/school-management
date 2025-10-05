"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SessionDebugger() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Log session data to localStorage for debugging
    if (status === "authenticated" && session) {
      localStorage.setItem("debug-session", JSON.stringify(session));
    }
  }, [session, status]);

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 text-sm">
      <h3 className="font-bold text-gray-900 mb-2">Session Debugger</h3>
      <p>
        Status: <span className="font-mono">{status}</span>
      </p>
      {session && (
        <div className="mt-2">
          <p>User: {session.user?.name}</p>
          <p>Role: {session.user?.role}</p>
        </div>
      )}
    </div>
  );
}
