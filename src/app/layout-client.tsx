"use client";

import SidebarNavigation from "@/components/SidebarNavigation";
import MobileSidebarToggle from "@/components/MobileSidebarToggle";
import MobileHeader from "@/components/MobileHeader";
import { useSidebarContext } from "@/context/SidebarContext";

export default function AppLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isCollapsed } = useSidebarContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileSidebarToggle />
      <SidebarNavigation />
      <MobileHeader />

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        } pt-16 lg:pt-0`}
      >
        <div className="flex flex-col min-h-screen">
          {/* Page content */}
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
