import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import FeaturedCommunities from "@/components/home/FeaturedCommunities";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import LatestNews from "@/components/home/LatestNews";
import Link from "next/link";
import { prisma } from "@/lib/prisma";


export default async function Home() {

  const events = await prisma.event.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });


  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />

      <Hero />

      <FeaturedCommunities />

      <FeaturedProjects />

      <LatestNews />


      {/* Latest Events */}

      <section className="py-24 px-6">

        <div className="max-w-6xl mx-auto">


          <h2 className="text-5xl font-extrabold text-center">
            Latest <span className="text-purple-500">
              Events
            </span>
          </h2>


          <p className="text-gray-400 text-center mt-4">
            Join the newest Nexus community events.
          </p>



          <div className="grid md:grid-cols-3 gap-6 mt-12">


            {events.map((event) => (

              <div
                key={event.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500 transition"
              >


                <h3 className="text-2xl font-bold">
                  {event.title}
                </h3>


                <p className="text-purple-400 mt-3">
                  📅 {event.date} • {event.time}
                </p>


                <p className="text-gray-400 mt-4">
                  {event.description}
                </p>


                <Link
                  href={`/events/${event.slug}`}
                  className="inline-block mt-6 bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl font-bold"
                >
                  View Event
                </Link>


              </div>

            ))}


          </div>



          {events.length === 0 && (

            <p className="text-gray-400 text-center mt-10">
              No upcoming events.
            </p>

          )}


        </div>

      </section>


      <Footer />

    </main>
  );
}