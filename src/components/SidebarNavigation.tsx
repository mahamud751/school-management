"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebarContext } from "@/context/SidebarContext";

export default function SidebarNavigation() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebarContext();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "🏠" },
    { name: "Students", href: "/students", icon: "👥" },
    { name: "Teachers", href: "/teachers", icon: "👨‍🏫" },
    { name: "Classes", href: "/classes", icon: "📚" },
    { name: "Attendance", href: "/attendance", icon: "✅" },
    { name: "Exams", href: "/exams", icon: "📝" },
    { name: "Fees", href: "/fees", icon: "💰" },
    { name: "Subjects", href: "/subjects", icon: "📖" },
    { name: "Results", href: "/results", icon: "📊" },
    { name: "Payments", href: "/payments", icon: "💳" },
    { name: "Library", href: "/library", icon: "📚" },
    { name: "Transport", href: "/transport", icon: "🚌" },
  ];

  return (
    <AnimatePresence>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        transition={{ type: "spring", damping: 20 }}
        className={`fixed inset-y-0 left-0 z-50 bg-indigo-700 shadow-lg transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-4 bg-indigo-800 shadow justify-between">
            {!isCollapsed && (
              <h1 className="text-xl font-bold text-white">SMS</h1>
            )}
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-indigo-200 focus:outline-none"
            >
              {isCollapsed ? "»" : "«"}
            </button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-indigo-600">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
              </div>
              {!isCollapsed && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs text-indigo-200 capitalize truncate">
                    {(session?.user as any)?.role?.toLowerCase() || "user"}
                  </p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-indigo-100 bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
