"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedCard from "@/components/AnimatedCard";
import StatCard from "@/components/StatCard";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  // Stats data
  const stats = [
    {
      name: "Total Students",
      value: "1,248",
      change: "+12%",
      changeType: "positive",
    },
    {
      name: "Total Teachers",
      value: "48",
      change: "+3%",
      changeType: "positive",
    },
    { name: "Classes", value: "24", change: "0%", changeType: "neutral" },
    {
      name: "Attendance Rate",
      value: "94.2%",
      change: "+2.1%",
      changeType: "positive",
    },
  ];

  // Recent activity data
  const recentActivity = [
    {
      id: 1,
      name: "John Doe",
      role: "Student",
      action: "Submitted assignment",
      time: "2 min ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Teacher",
      action: "Posted new announcement",
      time: "15 min ago",
    },
    {
      id: 3,
      name: "Robert Johnson",
      role: "Student",
      action: "Joined class",
      time: "1 hour ago",
    },
    {
      id: 4,
      name: "Emily Davis",
      role: "Parent",
      action: "Viewed report card",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {session?.user?.role?.toLowerCase() || "user"}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-800 font-medium">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Overview
            </h2>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {stats.map((stat, index) => (
                <StatCard
                  key={stat.name}
                  title={stat.name}
                  value={stat.value}
                  change={stat.change}
                  changeType={stat.changeType as any}
                  delay={index * 0.1}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <AnimatedCard className="lg:col-span-2" delay={0.3}>
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Quick Actions
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        name: "Add Student",
                        icon: "👥",
                        color: "bg-blue-100 text-blue-600",
                      },
                      {
                        name: "Take Attendance",
                        icon: "✅",
                        color: "bg-green-100 text-green-600",
                      },
                      {
                        name: "Schedule Exam",
                        icon: "📝",
                        color: "bg-yellow-100 text-yellow-600",
                      },
                      {
                        name: "View Reports",
                        icon: "📊",
                        color: "bg-purple-100 text-purple-600",
                      },
                    ].map((action, index) => (
                      <motion.button
                        key={action.name}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div
                          className={`flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center ${action.color}`}
                        >
                          <span className="text-xl">{action.icon}</span>
                        </div>
                        <div className="ml-4 text-left">
                          <h4 className="text-lg font-medium text-gray-900">
                            {action.name}
                          </h4>
                          <p className="text-sm text-gray-500">Quick access</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </AnimatedCard>

              {/* Recent Activity */}
              <AnimatedCard delay={0.5}>
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Recent Activity
                  </h3>
                </div>
                <div className="p-6">
                  <ul className="divide-y divide-gray-200">
                    {recentActivity.map((activity, index) => (
                      <motion.li
                        key={activity.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="py-4"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-indigo-800 text-sm font-medium">
                                {activity.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {activity.action}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {activity.time}
                          </div>
                        </div>
                        <div className="ml-11 text-xs text-gray-400">
                          {activity.role}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </AnimatedCard>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
