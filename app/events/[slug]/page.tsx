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

    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 pb-24 px-6">

        <div className="max-w-5xl mx-auto text-center">


          {event.image && (

            <div className="w-full h-72 relative rounded-2xl overflow-hidden mb-10">

              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />

            </div>

          )}



          <h1 className="text-6xl font-extrabold">

            {event.title}

          </h1>



          <p className="text-purple-400 text-xl mt-6">

            📅 {event.date} • {event.time}

          </p>



          <p className="text-gray-400 text-lg mt-8">

            {event.description}

          </p>



          {event.discord && (

            <a
              href={event.discord}
              target="_blank"
              className="inline-block mt-10 bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold"
            >

              Join Discord Event

            </a>

          )}



        </div>

      </section>


      <Footer />

    </main>

  );
}