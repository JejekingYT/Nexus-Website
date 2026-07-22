import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import LiveMembers from "@/components/LiveMembers";

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;


  const community = await prisma.community.findUnique({
    where: {
      slug,
    },
    include: {
      games: true,
    },
  });



  if (!community) {
    notFound();
  }



  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 pb-24 px-6">

        <div className="max-w-5xl mx-auto text-center">


          {/* Banner */}
          {community.image && (

            <div className="w-full h-64 relative rounded-2xl overflow-hidden mb-10">

              <Image
                src={community.image}
                alt={community.name}
                fill
                className="object-cover"
              />

            </div>

          )}



          {/* Icon */}
          <div className="text-7xl">
            {community.icon}
          </div>



          {/* Name */}
          <h1 className="text-6xl font-extrabold mt-6">
            {community.name}
          </h1>



          {/* Type */}
          <p className="text-purple-400 mt-4 text-xl">
            {community.type}
          </p>



          {/* Description */}
          <p className="text-gray-400 mt-6 text-lg">
            {community.description}
          </p>



          {/* Buttons */}
          <div className="mt-8">

            {community.discord && (

              <a
                href={community.discord}
                target="_blank"
                className="inline-block px-8 py-4 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-bold"
              >
                Join Discord
              </a>

            )}



            {community.roblox && (

              <a
                href={community.roblox}
                target="_blank"
                className="inline-block ml-4 px-8 py-4 rounded-xl border border-purple-500 hover:bg-purple-500/10 transition font-bold"
              >
                Roblox Group
              </a>

            )}

          </div>



          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-6 mt-16">


            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

              <h2 className="text-2xl font-bold">
                👥 Members
              </h2>

              <LiveMembers slug={slug} />

            </div>



            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">

              <h2 className="text-2xl font-bold">
                🌐 Platform
              </h2>

              <p className="text-gray-400 mt-2">
                Discord
              </p>

            </div>


          </div>


        </div>





        {/* About */}
        <div className="max-w-5xl mx-auto mt-20 text-left">

          <h2 className="text-4xl font-bold">
            About <span className="text-purple-500">{community.name}</span>
          </h2>


          <p className="text-gray-400 mt-6 text-lg">
            {community.about}
          </p>

        </div>





        {/* Community Games */}
        {community.games.length > 0 && (

          <div className="max-w-5xl mx-auto mt-20">


            <h2 className="text-4xl font-bold text-center">
              🎮 Community <span className="text-purple-500">Games</span>
            </h2>



            <div className="grid md:grid-cols-2 gap-6 mt-10">


              {community.games.map((game) => (

                <div
                  key={game.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500 transition"
                >


                  <h3 className="text-3xl font-bold">
                    {game.name}
                  </h3>


                  <p className="text-purple-400 mt-2">
                    {game.platform}
                  </p>


                  <p className="text-gray-400 mt-4">
                    {game.description}
                  </p>


                  {game.link && (

                    <a
                      href={game.link}
                      target="_blank"
                      className="inline-block mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold transition"
                    >
                      Play Game
                    </a>

                  )}


                </div>

              ))}


            </div>


          </div>

        )}






        {/* Staff Team */}
        <div className="max-w-5xl mx-auto mt-20">


          <h2 className="text-4xl font-bold text-center">
            Staff <span className="text-purple-500">Team</span>
          </h2>



          <div className="grid md:grid-cols-3 gap-6 mt-10">


            {Array.isArray(community.staff) && community.staff.map((member: any) => (

              <div
                key={member.role}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-purple-500 transition"
              >

                <div className="text-5xl">
                  {member.icon}
                </div>


                <h3 className="text-xl font-bold mt-4">
                  {member.name}
                </h3>


                <p className="text-purple-400 mt-2">
                  {member.role}
                </p>


              </div>

            ))}


          </div>


        </div>



      </section>


      <Footer />


    </main>
  );
}