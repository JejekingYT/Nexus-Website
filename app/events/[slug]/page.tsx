import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";

import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await getServerSession(authOptions);

  const event = await prisma.event.findUnique({
    where: {
      slug,
    },
    include: {
      participants: {
        orderBy: {
          joinedAt: "asc",
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              image: true,
              role: true,
            },
          },
        },
      },
    },
  });

  if (!event || !event.published) {
    notFound();
  }

  const currentUser = session?.user?.id
    ? await prisma.user.findUnique({
        where: {
          discordId: session.user.id,
        },
        select: {
          id: true,
        },
      })
    : null;

  const hasJoined = currentUser
    ? event.participants.some(
        (participant) =>
          participant.userId === currentUser.id
      )
    : false;

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <article className="max-w-5xl mx-auto">

          {/* Event Image */}
          {event.image && (
            <div className="
              relative
              w-full
              h-80
              md:h-[420px]
              rounded-3xl
              overflow-hidden
              border
              border-white/10
              mb-10
            ">
              <Image
                src={event.image}
                alt={event.title}
                fill
                priority
                className="object-cover"
              />

              <div className="
                absolute
                inset-0
                bg-linear-to-t
                from-black/70
                via-black/10
                to-transparent
              " />
            </div>
          )}

          {/* Main Event Card */}
          <div className="
            glass
            rounded-3xl
            border
            border-white/10
            p-8
            md:p-12
          ">

            {/* Icon */}
            <div className="
              w-20
              h-20
              rounded-3xl
              bg-purple-500/10
              border
              border-purple-500/20
              flex
              items-center
              justify-center
              text-5xl
            ">
              🎉
            </div>

            {/* Title */}
            <h1 className="
              mt-8
              text-4xl
              md:text-6xl
              font-extrabold
              tracking-tight
            ">
              {event.title}
            </h1>

            {/* Date */}
            <div className="
              inline-flex
              mt-6
              px-5
              py-3
              rounded-full
              bg-purple-500/10
              border
              border-purple-500/20
              text-purple-400
              font-semibold
            ">
              📅 {event.date} • {event.time}
            </div>

            {/* Description */}
            <p className="
              mt-8
              text-gray-400
              text-lg
              leading-relaxed
              max-w-3xl
            ">
              {event.description}
            </p>

            {/* Join Section */}
            <div className="
              mt-10
              p-6
              rounded-2xl
              bg-white/[0.03]
              border
              border-white/10
            ">

              <div className="
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-5
              ">

                <div>
                  <p className="text-xl font-bold">
                    {event.participants.length}{" "}
                    {event.participants.length === 1
                      ? "Participant"
                      : "Participants"}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Join this event and show that you're participating.
                  </p>
                </div>

                {session?.user?.id ? (
                  hasJoined ? (
                    <form
                      action={`/api/events/${event.id}/leave`}
                      method="POST"
                    >
                      <button
                        type="submit"
                        className="
                          px-6
                          py-3
                          rounded-xl
                          border
                          border-red-500/20
                          bg-red-500/10
                          text-red-400
                          font-bold
                          hover:bg-red-500/20
                          transition
                        "
                      >
                        Leave Event
                      </button>
                    </form>
                  ) : (
                    <form
                      action={`/api/events/${event.id}/join`}
                      method="POST"
                    >
                      <button
                        type="submit"
                        className="
                          px-7
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
                        🎉 Join Event
                      </button>
                    </form>
                  )
                ) : (
                  <Link
                    href="/api/auth/signin"
                    className="
                      inline-flex
                      px-7
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
                    Login to Join
                  </Link>
                )}

              </div>
            </div>

            {/* Discord */}
            {event.discord && (
              <a
                href={event.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  mt-6
                  px-8
                  py-4
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  font-bold
                  hover:bg-white/[0.08]
                  hover:border-purple-500/30
                  transition
                "
              >
                💬 Join Discord Event
              </a>
            )}
          </div>

          {/* Participants */}
          <div className="
            mt-10
            glass
            rounded-3xl
            border
            border-white/10
            p-8
            md:p-10
          ">

            <div className="mb-7">
              <p className="
                text-purple-400
                text-sm
                font-semibold
                uppercase
                tracking-wider
              ">
                Event Participants
              </p>

              <h2 className="
                text-3xl
                font-bold
                mt-2
              ">
                Who's Joining?
              </h2>
            </div>

            {event.participants.length > 0 ? (
              <div className="
                grid
                sm:grid-cols-2
                gap-4
              ">
                {event.participants.map((participant) => (
                  <Link
                    key={participant.id}
                    href={`/profile/${participant.user.username}`}
                    className="
                      group
                      flex
                      items-center
                      gap-4
                      p-4
                      rounded-2xl
                      bg-white/[0.03]
                      border
                      border-white/10
                      hover:bg-white/[0.05]
                      hover:border-purple-500/30
                      transition
                    "
                  >

                    {/* Avatar */}
                    {participant.user.image ? (
                      <img
                        src={participant.user.image}
                        alt={participant.user.username}
                        className="
                          w-12
                          h-12
                          rounded-full
                          object-cover
                          border-2
                          border-white/10
                          group-hover:border-purple-500/50
                          transition
                        "
                      />
                    ) : (
                      <div className="
                        w-12
                        h-12
                        rounded-full
                        bg-purple-600/80
                        border-2
                        border-white/10
                        flex
                        items-center
                        justify-center
                        font-bold
                        text-lg
                      ">
                        {participant.user.username
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    {/* User */}
                    <div className="min-w-0 flex-1">
                      <div className="
                        flex
                        items-center
                        gap-2
                      ">
                        <p className="
                          font-bold
                          truncate
                          group-hover:text-purple-400
                          transition
                        ">
                          {participant.user.username}
                        </p>

                        {participant.user.role !== "USER" && (
                          <span className="
                            text-[10px]
                            px-2
                            py-0.5
                            rounded-full
                            bg-purple-500/10
                            text-purple-400
                            border
                            border-purple-500/20
                          ">
                            {participant.user.role}
                          </span>
                        )}
                      </div>

                      <p className="
                        text-xs
                        text-gray-500
                        mt-1
                      ">
                        Joined{" "}
                        {participant.joinedAt.toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <span className="
                      text-gray-600
                      group-hover:text-purple-400
                      group-hover:translate-x-1
                      transition
                    ">
                      →
                    </span>

                  </Link>
                ))}
              </div>
            ) : (
              <div className="
                text-center
                py-12
                rounded-2xl
                bg-white/[0.02]
                border
                border-dashed
                border-white/10
              ">
                <div className="text-5xl">
                  🎟️
                </div>

                <h3 className="
                  text-xl
                  font-bold
                  mt-4
                ">
                  No participants yet
                </h3>

                <p className="
                  text-gray-500
                  mt-2
                ">
                  Be the first person to join this event.
                </p>
              </div>
            )}

          </div>

        </article>
      </section>

      <Footer />
    </main>
  );
}