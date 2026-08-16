import Navbar from "@/components/layout/NavbarWrapper";
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

    <main className="
      min-h-screen
      text-white
      overflow-hidden
    ">


      <Navbar />



      <div className="fade-in">


        <Hero />


        <FeaturedCommunities />


        <FeaturedProjects />


        <LatestNews />



        {/* Latest Events */}

        <section className="
          py-24
          px-6
        ">


          <div className="
            max-w-6xl
            mx-auto
          ">



            <div className="text-center mb-14">


              <h2 className="
                text-4xl
                md:text-5xl
                font-extrabold
              ">

                Latest{" "}

                <span className="
                  bg-linear-to-r
                  from-purple-400
                  to-blue-400
                  bg-clip-text
                  text-transparent
                ">
                  Events
                </span>

              </h2>



              <p className="
                text-gray-400
                mt-4
                text-lg
              ">
                Join the newest Nexus community events.
              </p>


            </div>





            <div className="
              grid
              md:grid-cols-3
              gap-6
            ">



              {events.map((event) => (

                <div
                  key={event.id}
                  className="
                    glass
                    card-hover
                    p-6
                  "
                >



                  <h3 className="
                    text-2xl
                    font-bold
                  ">
                    {event.title}
                  </h3>




                  <p className="
                    text-purple-400
                    mt-3
                    font-medium
                  ">
                    📅 {event.date} • {event.time}
                  </p>




                  <p className="
                    text-gray-400
                    mt-4
                    leading-relaxed
                  ">
                    {event.description}
                  </p>




                  <Link
                    href={`/events/${event.slug}`}
                    className="
                      inline-flex
                      mt-6
                      px-5
                      py-3
                      rounded-xl
                      bg-linear-to-r
                      from-purple-600
                      to-blue-600
                      font-bold
                      hover:scale-105
                      transition
                    "
                  >
                    View Event
                  </Link>



                </div>

              ))}



            </div>






            {events.length === 0 && (

              <p className="
                text-gray-400
                text-center
                mt-10
              ">
                No upcoming events.
              </p>

            )}



          </div>


        </section>


      </div>



      <Footer />


    </main>

  );

}