"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function SessionTestPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    // Log session data to console for testing
    console.log("Session status:", status);
    console.log("Session data:", session);
  }, [session, status]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Session Test
        </h1>

        {status === "loading" ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading session...</p>
          </div>
        ) : status === "authenticated" ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800">
                Authenticated
              </h2>
              <p className="text-green-700 mt-2">
                Welcome, {session?.user?.name}!
              </p>
              <p className="text-green-700">Email: {session?.user?.email}</p>
              <p className="text-green-700">Role: {session?.user?.role}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-blue-800">
                Session Details
              </h3>
              <pre className="text-xs text-blue-700 mt-2 overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-red-800">
              Not Authenticated
            </h2>
            <p className="text-red-700 mt-2">
              You are not currently logged in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
