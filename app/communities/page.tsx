import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";

import { prisma } from "@/lib/prisma";

import Link from "next/link";
import Image from "next/image";


export const dynamic = "force-dynamic";
export const revalidate = 0;



export default async function Communities() {



  const communities = await prisma.community.findMany({

    select: {

      id: true,
      slug: true,
      name: true,
      type: true,
      icon: true,
      image: true,
      description: true,
      discord: true,
      roblox: true,
      about: true,
      members: true,

    },

    orderBy: {

      createdAt: "asc",

    },

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
          max-w-7xl
          mx-auto
        ">




          <div className="
            text-center
            mb-16
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
                Communities
              </span>


            </h1>





            <p className="
              mt-5
              text-gray-400
              text-lg
              max-w-2xl
              mx-auto
            ">
              Discover the communities that are part of the Nexus network.
            </p>



          </div>







          {communities.length > 0 ? (


            <div className="
              grid
              md:grid-cols-2
              gap-8
            ">



              {communities.map((community) => (


                <div

                  key={community.id}

                  className="
                    glass
                    card-hover
                    p-8
                  "

                >





                  {community.image && (

                    <Image

                      src={community.image}

                      alt={community.name}

                      width={600}

                      height={300}

                      className="
                        w-full
                        h-52
                        object-cover
                        rounded-2xl
                        border
                        border-white/10
                        mb-6
                      "

                    />

                  )}







                  <div className="
                    flex
                    items-center
                    justify-between
                  ">


                    <div className="
                      w-16
                      h-16
                      rounded-2xl
                      bg-white/5
                      border
                      border-white/10
                      flex
                      items-center
                      justify-center
                      text-4xl
                    ">

                      {community.icon}

                    </div>





                    <span className="
                      px-4
                      py-2
                      rounded-full
                      bg-purple-500/10
                      text-purple-400
                      text-sm
                    ">
                      {community.type}
                    </span>


                  </div>








                  <h2 className="
                    mt-6
                    text-3xl
                    font-bold
                  ">
                    {community.name}
                  </h2>








                  <p className="
                    mt-4
                    text-gray-400
                    leading-relaxed
                  ">
                    {community.description}
                  </p>








                  <div className="
                    mt-5
                    flex
                    items-center
                    gap-2
                    text-gray-300
                  ">

                    👥

                    <span>
                      {community.members.toLocaleString()} members
                    </span>

                  </div>








                  <Link

                    href={`/communities/${community.slug}`}

                    className="
                      inline-flex
                      mt-7
                      px-6
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
                    View Community

                  </Link>





                </div>



              ))}



            </div>



          ) : (


            <p className="
              text-gray-400
              text-center
              mt-12
            ">
              No Nexus communities added yet.
            </p>


          )}




        </div>


      </section>





      <Footer />


    </main>

  );

}