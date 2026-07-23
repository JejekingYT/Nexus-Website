import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";


export default async function Communities() {


  const communities = await prisma.community.findMany({

    orderBy: {
      createdAt: "asc",
    },

  });



  const partners = await prisma.partner.findMany({

    where: {
      status: "APPROVED",
    },

    orderBy: [
      {
        featured: "desc",
      },
      {
        createdAt: "desc",
      },
    ],

  });



  return (

    <main className="min-h-screen bg-[#09090B] text-white">


      <Navbar />



      <section className="pt-32 pb-24 px-6">


        <div className="max-w-7xl mx-auto">



          {/* Nexus Communities */}


          <h1 className="text-5xl font-extrabold text-center">

            Nexus <span className="text-purple-500">
              Communities
            </span>

          </h1>


          <p className="text-gray-400 text-center mt-4">

            Our official Nexus communities.

          </p>





          {communities.length > 0 ? (

            <div className="grid md:grid-cols-2 gap-8 mt-12">


              {communities.map((community)=>(


                <div

                  key={community.id}

                  className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-2xl
                  p-8
                  hover:border-purple-500
                  transition
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
                      h-48
                      object-cover
                      rounded-xl
                      mb-6
                      "

                    />

                  )}




                  <div className="text-5xl">

                    {community.icon}

                  </div>




                  <p className="text-purple-400 mt-6">

                    {community.type}

                  </p>




                  <h2 className="text-3xl font-bold mt-3">

                    {community.name}

                  </h2>




                  <p className="text-gray-400 mt-4">

                    {community.description}

                  </p>



                  <p className="text-sm text-gray-500 mt-3">

                    👥 {community.members.toLocaleString()} members

                  </p>





                  <Link

                    href={`/communities/${community.slug}`}

                    className="
                    inline-block
                    mt-6
                    px-6
                    py-3
                    rounded-xl
                    bg-purple-600
                    hover:bg-purple-700
                    font-bold
                    "

                  >

                    View Community

                  </Link>



                </div>


              ))}


            </div>


          ) : (


            <p className="text-gray-400 text-center mt-12">

              No Nexus communities added yet.

            </p>


          )}








          {/* Partner Communities */}



          <div className="mt-32">



            <h2 className="text-5xl font-extrabold text-center">

              Partner <span className="text-purple-500">

                Communities

              </span>

            </h2>



            <p className="text-gray-400 text-center mt-4">

              Communities officially partnered with Nexus.

            </p>





            {partners.length > 0 ? (


              <div className="grid md:grid-cols-2 gap-8 mt-12">



                {partners.map((partner)=>(


                  <div

                    key={partner.id}

                    className="
                    bg-white/5
                    border
                    border-white/10
                    rounded-2xl
                    p-8
                    hover:border-purple-500
                    transition
                    "

                  >




                    {partner.banner && (

                      <Image

                        src={partner.banner}

                        alt={partner.name}

                        width={600}

                        height={300}

                        className="
                        w-full
                        h-48
                        object-cover
                        rounded-xl
                        mb-6
                        "

                      />

                    )}






                    <div className="flex items-center gap-4">


                      {partner.logo && (

                        <Image

                          src={partner.logo}

                          alt={partner.name}

                          width={70}

                          height={70}

                          className="rounded-xl"

                        />

                      )}



                      <div>

                        <h3 className="text-3xl font-bold">

                          {partner.name}

                        </h3>


                        <p className="text-purple-400">

                          {partner.tier} Partner

                        </p>


                      </div>


                    </div>






                    <div className="flex flex-wrap gap-3 mt-6">



                      {partner.verified && (

                        <span className="
                        bg-green-500/20
                        text-green-400
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        ">

                          ✔ Verified

                        </span>

                      )}






                      {partner.featured && (

                        <span className="
                        bg-yellow-500/20
                        text-yellow-400
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        ">

                          ⭐ Featured

                        </span>

                      )}



                    </div>






                    <p className="text-gray-400 mt-5">

                      {partner.description}

                    </p>







                    <div className="flex flex-wrap gap-4 mt-6">



                      {partner.discord && (

                        <a

                          href={partner.discord}

                          target="_blank"

                          rel="noopener noreferrer"

                          className="
                          px-5
                          py-3
                          rounded-xl
                          bg-purple-600
                          hover:bg-purple-700
                          font-bold
                          "

                        >

                          Discord

                        </a>

                      )}






                      {partner.website && (

                        <a

                          href={partner.website}

                          target="_blank"

                          rel="noopener noreferrer"

                          className="
                          px-5
                          py-3
                          rounded-xl
                          bg-white/10
                          hover:bg-white/20
                          font-bold
                          "

                        >

                          Website

                        </a>

                      )}







                      {partner.roblox && (

                        <a

                          href={partner.roblox}

                          target="_blank"

                          rel="noopener noreferrer"

                          className="
                          px-5
                          py-3
                          rounded-xl
                          bg-white/10
                          hover:bg-white/20
                          font-bold
                          "

                        >

                          Roblox

                        </a>

                      )}



                    </div>




                  </div>


                ))}


              </div>


            ) : (


              <p className="text-gray-400 text-center mt-12">

                No partner communities yet.

              </p>


            )}



          </div>




        </div>


      </section>



      <Footer />


    </main>

  );

}