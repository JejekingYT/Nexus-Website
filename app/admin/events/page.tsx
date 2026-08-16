import Navbar from "@/components/layout/NavbarWrapper";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteEventButton from "./DeleteEventButton";

export default async function EventsManager() {

  const events = await prisma.event.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });


  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />

      <section className="pt-32 px-6">

        <div className="max-w-6xl mx-auto">

          <h1 className="text-5xl font-extrabold">
            Manage <span className="text-purple-500">
              Events
            </span>
          </h1>


          <p className="text-gray-400 mt-4">
            Create and manage Nexus events.
          </p>


          <div className="mt-6">

            <Link
              href="/admin/events/new"
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold"
            >
              + Create Event
            </Link>

          </div>



          <div className="grid md:grid-cols-2 gap-6 mt-12">


            {events.map((event) => (

              <div
                key={event.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >

                <h2 className="text-2xl font-bold">
                  {event.title}
                </h2>


                <p className="text-purple-400 mt-2">
                  {event.date} - {event.time}
                </p>


                <p className="text-gray-400 mt-4">
                  {event.description}
                </p>


                <p className="mt-4">
                  {event.published
                    ? "🟢 Published"
                    : "🟡 Draft"}
                </p>


                <div className="mt-6 flex gap-3">

                  <Link
                    href={`/admin/events/${event.slug}/edit`}
                    className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl font-bold"
                  >
                    Edit
                  </Link>


                  <DeleteEventButton slug={event.slug} />

                </div>


              </div>

            ))}


          </div>


        </div>

      </section>

    </main>
  );
}