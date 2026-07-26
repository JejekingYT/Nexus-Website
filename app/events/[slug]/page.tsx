import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import Image from "next/image";



export default async function EventPage({

  params,

}: {

  params: Promise<{ slug: string }>;

}) {



  const { slug } = await params;





  const event = await prisma.event.findUnique({

    where: {
      slug,
    },

  });





  if (!event || !event.published) {

    notFound();

  }





  return (

    <main className="
      min-h-screen
      text-white
    ">



      <Navbar />






      <section className="
        pt-32
        pb-24
        px-6
      ">




        <article className="
          max-w-5xl
          mx-auto
        ">






          {event.image && (

            <div className="
              relative
              w-full
              h-80
              rounded-3xl
              overflow-hidden
              border
              border-white/10
              mb-12
            ">


              <Image

                src={event.image}

                alt={event.title}

                fill

                className="
                  object-cover
                "

              />


            </div>

          )}








          <div className="
            glass
            p-8
            md:p-12
            text-center
          ">






            <div className="
              w-20
              h-20
              mx-auto
              rounded-3xl
              bg-white/5
              border
              border-white/10
              flex
              items-center
              justify-center
              text-5xl
            ">
              🎉
            </div>








            <h1 className="
              mt-8
              text-4xl
              md:text-6xl
              font-extrabold
            ">

              {event.title}

            </h1>








            <div className="
              inline-flex
              mt-6
              px-5
              py-3
              rounded-full
              bg-purple-500/10
              text-purple-400
            ">

              📅 {event.date} • {event.time}

            </div>








            <p className="
              mt-8
              text-gray-400
              text-lg
              leading-relaxed
              max-w-3xl
              mx-auto
            ">

              {event.description}

            </p>








            {event.discord && (

              <a

                href={event.discord}

                target="_blank"

                rel="noopener noreferrer"

                className="
                  inline-flex
                  mt-10
                  px-8
                  py-4
                  rounded-xl
                  bg-linear-to-r
                  from-purple-600
                  to-blue-600
                  font-bold
                  hover:scale-105
                  transition
                "

              >

                Join Discord Event

              </a>

            )}




          </div>





        </article>





      </section>





      <Footer />



    </main>

  );

}