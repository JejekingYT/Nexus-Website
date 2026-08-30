import Navbar from "@/components/layout/NavbarWrapper";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { requireRole } from "@/lib/auth";

import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import AdminCard from "@/components/admin/AdminCard";

export default async function AdminPage() {
  const currentUser = await requireRole([
    "OWNER",
    "CO-OWNER",
    "MANAGER",
    "ADMIN",
    "SUPPORT",
  ]);

  // Support users only access support panel
  if (currentUser.role === "SUPPORT") {
    redirect("/admin/support");
  }

  const [
    communityCount,
    newsCount,
    eventCount,
    gameCount,
    developerCount,
    userCount,
    projectCount,
    supportCount,
    pendingReviewCount,
  ] = await Promise.all([
    prisma.community.count(),
    prisma.news.count(),
    prisma.event.count(),
    prisma.game.count(),
    prisma.developer.count(),
    prisma.user.count(),
    prisma.project.count(),
    prisma.supportTicket.count(),
    prisma.communityReview.count({
      where: {
        status: "PENDING",
      },
    }),
  ]);

  const cards = [
    {
      title: "🌐 Communities",
      desc: "Add and manage communities.",
      link: "/admin/communities",
      button: "Manage Communities",
    },

    {
      title: "🎮 Games",
      desc: "Manage games connected to Nexus.",
      link: "/admin/games",
      button: "Manage Games",
    },

    {
      title: "📦 Projects",
      desc: "Manage Nexus projects.",
      link: "/admin/projects",
      button: "Manage Projects",
    },

    {
      title: "📰 News",
      desc: "Create and publish announcements.",
      link: "/admin/news",
      button: "Manage News",
    },

    {
      title: "🎉 Events",
      desc: "Create and manage events.",
      link: "/admin/events",
      button: "Manage Events",
    },

    {
      title: "👨‍💻 Developers",
      desc: "Manage Nexus developers.",
      link: "/admin/developers",
      button: "Manage Developers",
    },

    {
      title: "👥 Users",
      desc: "Manage users and permissions.",
      link: "/admin/users",
      button: "Manage Users",
    },

    {
      title: "🎫 Support",
      desc: "Manage user support tickets.",
      link: "/admin/support",
      button: "Manage Support",
    },

    {
      title: "💬 Reviews",
      desc: `${pendingReviewCount} review${
        pendingReviewCount === 1 ? "" : "s"
      } waiting for approval.`,
      link: "/admin/reviews",
      button: "Manage Reviews",
    },
  ];

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="Nexus Admin"
            description={
            <>
              Welcome back, {currentUser.username}. Role:{" "}
              <span className="text-purple-400">
                {currentUser.role}
              </span>
            </>
          }
          />

          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <StatCard
              title="Users"
              value={userCount}
              icon="👥"
            />

            <StatCard
              title="Communities"
              value={communityCount}
              icon="🌐"
            />

            <StatCard
              title="Games"
              value={gameCount}
              icon="🎮"
            />

            <StatCard
              title="Projects"
              value={projectCount}
              icon="📦"
            />

            <StatCard
              title="News"
              value={newsCount}
              icon="📰"
            />

            <StatCard
              title="Events"
              value={eventCount}
              icon="🎉"
            />

            <StatCard
              title="Developers"
              value={developerCount}
              icon="👨‍💻"
            />

            <StatCard
              title="Support Tickets"
              value={supportCount}
              icon="🎫"
            />

            <StatCard
              title="Pending Reviews"
              value={pendingReviewCount}
              icon="💬"
            />
          </div>

          <h2 className="text-3xl font-bold mt-16">
            Management
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {cards.map((item) => (
              <div
                key={item.title}
                className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-2xl
                  p-6
                  hover:border-purple-500
                  transition
                "
              >
                <h2 className="text-2xl font-bold">
                  {item.title}
                </h2>

                <p className="text-gray-400 mt-3">
                  {item.desc}
                </p>

                <Link
                  href={item.link}
                  className="
                    inline-block
                    mt-6
                    bg-purple-600
                    hover:bg-purple-700
                    px-6
                    py-3
                    rounded-xl
                    font-bold
                  "
                >
                  {item.button}
                </Link>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            <AdminCard title="Quick Actions">
              <p className="text-gray-400">
                Create projects, communities, games, news, events and manage
                support tickets.
              </p>
            </AdminCard>

            <AdminCard title="System Status">
              <p className="text-green-400">
                ● Database Connected
              </p>
            </AdminCard>
          </div>
        </div>
      </section>
    </main>
  );
}