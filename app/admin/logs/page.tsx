import Navbar from "@/components/layout/NavbarWrapper";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getActionStyle(action: string) {
  const normalized = action.toUpperCase();

  if (
    normalized.includes("DELETE") ||
    normalized.includes("REMOVE") ||
    normalized.includes("REJECT")
  ) {
    return {
      icon: "🗑️",
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
    };
  }

  if (
    normalized.includes("CREATE") ||
    normalized.includes("ADD") ||
    normalized.includes("APPROVE")
  ) {
    return {
      icon: "✨",
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    };
  }

  if (
    normalized.includes("UPDATE") ||
    normalized.includes("EDIT") ||
    normalized.includes("CHANGE")
  ) {
    return {
      icon: "✏️",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    };
  }

  if (
    normalized.includes("BADGE") ||
    normalized.includes("AWARD")
  ) {
    return {
      icon: "🏅",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20",
    };
  }

  if (
    normalized.includes("FOLLOW")
  ) {
    return {
      icon: "👥",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    };
  }

  if (
    normalized.includes("LOGIN") ||
    normalized.includes("AUTH")
  ) {
    return {
      icon: "🔐",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
    };
  }

  return {
    icon: "🛡️",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  };
}

export default async function LogsPage() {
  const currentUser = await requireRole([
    "OWNER",
  ]);

  const logs = await prisma.auditLog.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      user: true,
    },
  });

  const totalLogs = logs.length;

  const uniqueUsers = new Set(
    logs
      .map((log) => log.userId)
      .filter((id): id is number => id !== null)
  ).size;

  const today = new Date();

  const logsToday = logs.filter((log) => {
    const logDate = new Date(log.createdAt);

    return (
      logDate.getDate() === today.getDate() &&
      logDate.getMonth() === today.getMonth() &&
      logDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const latestActivity = logs[0];

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}

          <div className="mb-12">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">

              <div>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold mb-5">

                  🛡️ Admin Activity

                </div>

                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">

                  Activity{" "}

                  <span className="text-purple-500">
                    Logs
                  </span>

                </h1>

                <p className="text-gray-400 mt-4 text-lg max-w-2xl">

                  Monitor important actions and activity across Nexus.

                </p>

              </div>

              <div className="text-sm text-gray-500">

                Logged in as{" "}

                <span className="text-white font-semibold">
                  {currentUser.username}
                </span>

              </div>

            </div>

          </div>


          {/* Statistics */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">

            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm">
                    Total Activities
                  </p>

                  <p className="text-3xl font-extrabold mt-2">
                    {totalLogs}
                  </p>

                </div>

                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl">
                  📋
                </div>

              </div>

            </div>


            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm">
                    Activities Today
                  </p>

                  <p className="text-3xl font-extrabold mt-2">
                    {logsToday}
                  </p>

                </div>

                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl">
                  📅
                </div>

              </div>

            </div>


            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-500 text-sm">
                    Active Staff
                  </p>

                  <p className="text-3xl font-extrabold mt-2">
                    {uniqueUsers}
                  </p>

                </div>

                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-xl">
                  👥
                </div>

              </div>

            </div>

          </div>


          {/* Latest Activity */}

          {latestActivity && (

            <div className="mb-8">

              <div className="bg-linear-to-r from-purple-500/10 via-blue-500/5 to-transparent border border-purple-500/20 rounded-2xl p-6">

                <div className="flex items-center gap-3 mb-3">

                  <span className="text-purple-400 text-sm font-bold uppercase tracking-wider">
                    Latest Activity
                  </span>

                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                </div>

                <p className="text-lg font-semibold">

                  {latestActivity.details}

                </p>

                <p className="text-sm text-gray-500 mt-2">

                  {new Date(
                    latestActivity.createdAt
                  ).toLocaleString()}

                </p>

              </div>

            </div>

          )}


          {/* Activity List */}

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-2xl font-bold">
                Recent Activity
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                All recorded Nexus activity.
              </p>

            </div>

            <div className="text-sm text-gray-500">
              {logs.length} {logs.length === 1 ? "entry" : "entries"}
            </div>

          </div>


          <div className="grid gap-4">

            {logs.length === 0 && (

              <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-10 text-center">

                <div className="text-4xl mb-4">
                  📭
                </div>

                <h3 className="text-xl font-bold">
                  No activity logs yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Important Nexus actions will appear here.
                </p>

              </div>

            )}


            {logs.map((log) => {

              const style = getActionStyle(
                log.action
              );

              return (

                <div
                  key={log.id}
                  className="
                    group
                    bg-white/[0.04]
                    border
                    border-white/10
                    rounded-2xl
                    p-5
                    transition-all
                    duration-200
                    hover:bg-white/[0.06]
                    hover:border-white/20
                  "
                >

                  <div className="flex flex-col md:flex-row md:items-center gap-5">

                    {/* Icon */}

                    <div
                      className={`
                        shrink-0
                        w-14
                        h-14
                        rounded-2xl
                        border
                        ${style.bg}
                        ${style.border}
                        flex
                        items-center
                        justify-center
                        text-2xl
                      `}
                    >

                      {style.icon}

                    </div>


                    {/* Main Content */}

                    <div className="flex-1 min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <span
                          className={`
                            inline-flex
                            items-center
                            rounded-lg
                            border
                            px-3
                            py-1
                            text-xs
                            font-bold
                            uppercase
                            tracking-wide
                            ${style.bg}
                            ${style.border}
                            ${style.color}
                          `}
                        >

                          {log.action}

                        </span>

                        <span className="text-gray-600">
                          →
                        </span>

                        <span className="text-purple-400 font-semibold truncate">
                          {log.target}
                        </span>

                      </div>


                      <p className="text-gray-300 mt-2">
                        {log.details}
                      </p>

                    </div>


                    {/* Meta */}

                    <div className="md:text-right shrink-0">

                      <p className="text-sm text-gray-300">

                        By{" "}

                        <span className="font-semibold text-white">
                          {log.user?.username || "Unknown"}
                        </span>

                      </p>

                      <p className="text-xs text-gray-500 mt-1">

                        {new Date(
                          log.createdAt
                        ).toLocaleString()}

                      </p>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        </div>
      </section>
    </main>
  );
}