"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function PaymentsPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Payment Management
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Manage fee payments and transactions.
        </p>
      </div>
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:px-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Payment Management
            </h3>
            <p className="text-gray-500">This module is under development.</p>
            <p className="text-gray-500 mt-2">
              Coming soon: Payment processing, transaction history, and receipt
              generation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
