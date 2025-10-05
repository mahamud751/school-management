"use client";

import { useSession } from "next-auth/react";
import { useSidebarContext } from "@/context/SidebarContext";

export default function MobileHeader() {
  const { data: session } = useSession();
  const { isCollapsed } = useSidebarContext();

  return (
    <header className="bg-white shadow-sm lg:hidden">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-indigo-600">
            School Management System
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-800 font-medium text-sm">
                {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-900">
              {session?.user?.name || "User"}
            </div>
            <div className="text-xs text-gray-500 capitalize">
              {(session?.user as any)?.role?.toLowerCase() || "user"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
