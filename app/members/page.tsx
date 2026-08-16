import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";

import { prisma } from "@/lib/prisma";
import Link from "next/link";


export const dynamic = "force-dynamic";



type MembersPageProps = {

  searchParams: Promise<{
    q?: string;
  }>;

};





export default async function MembersPage({

  searchParams,

}: MembersPageProps) {



  const params = await searchParams;

  const query = params.q?.trim() || "";







  const users = await prisma.user.findMany({

    where: query

      ? {

          username: {

            contains: query,

            mode: "insensitive",

          },

        }

      : undefined,





    select: {

      id: true,

      username: true,

      image: true,

      bio: true,

      role: true,

      createdAt: true,


      badges: {

        include: {

          badge: true,

        },

        orderBy: {

          awardedAt: "desc",

        },

        take: 3,

      },

    },





    orderBy: {

      username: "asc",

    },





    take: 30,

  });







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




        <div className="
          max-w-6xl
          mx-auto
        ">






          <div className="
            text-center
            mb-14
          ">



            <h1 className="
              text-5xl
              md:text-6xl
              font-extrabold
            ">

              Nexus{" "}

              <span className="
                bg-linear-to-r
                from-purple-400
                to-blue-400
                bg-clip-text
                text-transparent
              ">
                Members
              </span>


            </h1>





            <p className="
              mt-6
              text-gray-400
              text-lg
            ">
              Discover Nexus members and explore their profiles.
            </p>




          </div>








          <form

            method="GET"

            className="
              max-w-3xl
              mx-auto
            "

          >


            <div className="
              glass
              p-3
              flex
              gap-3
            ">



              <input

                type="text"

                name="q"

                defaultValue={query}

                placeholder="Search members..."

                className="
                  flex-1
                  bg-transparent
                  px-5
                  py-3
                  outline-none
                  text-white
                "

              />





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

                Search

              </button>




            </div>



          </form>









          <div className="mt-14">





            {query && (

              <p className="
                text-gray-400
                mb-6
              ">

                Results for{" "}

                <span className="text-white font-bold">
                  "{query}"
                </span>

              </p>

            )}








            {users.length === 0 ? (



              <div className="
                glass
                p-12
                text-center
              ">


                <div className="text-5xl">
                  🔍
                </div>


                <h2 className="
                  text-2xl
                  font-bold
                  mt-5
                ">
                  No members found
                </h2>



                <p className="
                  text-gray-400
                  mt-2
                ">
                  Try another username.
                </p>



              </div>



            ) : (



              <div className="
                grid
                sm:grid-cols-2
                lg:grid-cols-3
                gap-8
              ">






                {users.map((user) => (



                  <div

                    key={user.id}

                    className="
                      glass
                      card-hover
                      p-7
                    "

                  >






                    <div className="
                      flex
                      items-center
                      gap-4
                    ">





                      {user.image ? (

                        <img

                          src={user.image}

                          alt={user.username}

                          className="
                            w-20
                            h-20
                            rounded-full
                            object-cover
                            border
                            border-purple-500/40
                          "

                        />

                      ) : (


                        <div className="
                          w-20
                          h-20
                          rounded-full
                          bg-purple-500/20
                          border
                          border-purple-500/40
                          flex
                          items-center
                          justify-center
                          text-3xl
                          font-bold
                        ">

                          {user.username
                            .charAt(0)
                            .toUpperCase()}

                        </div>


                      )}






                      <div className="min-w-0">

                        <h2 className="
                          text-xl
                          font-bold
                          truncate
                        ">

                          {user.username}

                        </h2>




                        <p className="
                          text-purple-400
                          text-sm
                        ">
                          {user.role}
                        </p>



                      </div>



                    </div>








                    <p className="
                      text-gray-400
                      mt-6
                      text-sm
                      line-clamp-2
                    ">

                      {user.bio || "No bio set yet."}

                    </p>









                    {user.badges.length > 0 && (

                      <div className="
                        flex
                        flex-wrap
                        gap-2
                        mt-5
                      ">



                        {user.badges.map((userBadge) => (



                          <div

                            key={userBadge.id}

                            title={userBadge.badge.description}

                            className="
                              px-3
                              py-1.5
                              rounded-lg
                              bg-purple-500/10
                              border
                              border-purple-500/20
                              text-xs
                            "

                          >

                            {userBadge.badge.icon}{" "}

                            {userBadge.badge.name}


                          </div>



                        ))}



                      </div>

                    )}









                    <Link

                      href={`/profile/${encodeURIComponent(user.username)}`}

                      className="
                        block
                        text-center
                        mt-7
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

                      View Profile →

                    </Link>






                  </div>



                ))}





              </div>



            )}






          </div>






        </div>




      </section>





      <Footer />



    </main>

  );

}