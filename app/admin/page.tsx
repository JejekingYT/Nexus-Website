import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }


  const currentUser = await prisma.user.findUnique({
    where: {
      discordId: session.user.id,
    },
  });


  const [
    communityCount,
    newsCount,
    eventCount,
    gameCount,
    developerCount,
    userCount,
  ] = await Promise.all([
    prisma.community.count(),
    prisma.news.count(),
    prisma.event.count(),
    prisma.game.count(),
    prisma.developer.count(),
    prisma.user.count(),
  ]);


  const cards = [
    {
      title: "🌐 Communities",
      desc: "Add and manage Discord communities.",
      link: "/admin/communities",
      button: "Manage Communities",
    },
    {
      title: "📰 News",
      desc: "Create and publish announcements.",
      link: "/admin/news",
      button: "Manage News",
    },
    {
      title: "🎉 Events",
      desc: "Create and manage community events.",
      link: "/admin/events",
      button: "Manage Events",
    },
    {
      title: "🎮 Games",
      desc: "Manage community games.",
      link: "/admin/games",
      button: "Manage Games",
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
  ];


  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 pb-24 px-6">

        <div className="max-w-7xl mx-auto">


          <h1 className="text-5xl font-extrabold">
            Nexus <span className="text-purple-500">Admin</span>
          </h1>


          <p className="text-gray-400 mt-4">
            Welcome back, {session.user.name}.
            {" "}
            Role:
            {" "}
            <span className="text-purple-400">
              {currentUser?.role}
            </span>
          </p>



          {/* Statistics */}

          <div className="grid md:grid-cols-6 gap-6 mt-12">


            {[
              ["👥 Users", userCount],
              ["🌐 Communities", communityCount],
              ["📰 News", newsCount],
              ["🎉 Events", eventCount],
              ["🎮 Games", gameCount],
              ["👨‍💻 Developers", developerCount],
            ].map(([title, count]) => (

              <div
                key={String(title)}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >

                <p className="text-gray-400">
                  {title}
                </p>


                <h2 className="text-5xl font-extrabold mt-4">
                  {count}
                </h2>

              </div>

            ))}


          </div>




          {/* Management */}

          <h2 className="text-3xl font-bold mt-16">
            Management
          </h2>


          <div className="grid md:grid-cols-3 gap-6 mt-8">


            {cards.map((item) => (

              <div
                key={item.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500 transition"
              >

                <h2 className="text-2xl font-bold">
                  {item.title}
                </h2>


                <p className="text-gray-400 mt-3">
                  {item.desc}
                </p>


                <Link
                  href={item.link}
                  className="mt-6 inline-block bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold transition"
                >
                  {item.button}
                </Link>


              </div>

            ))}


          </div>


        </div>

      </section>


    </main>
  );
}