import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function PartnersPage() {

  const partners = await prisma.partner.findMany({

    where: {
      verified: true,
      status: "APPROVED",
    },

    orderBy: [
      {
        featured: "desc",
      },
      {
        name: "asc",
      },
    ],

  });


  return (

    <main className="min-h-screen bg-[#09090B] text-white">


      <Navbar />


      <section className="pt-32 pb-24 px-6">


        <div className="max-w-7xl mx-auto">


          <h1 className="text-5xl font-extrabold">

            🤝{" "}

            <span className="text-purple-500">
              Partner Communities
            </span>

          </h1>



          <p className="text-gray-400 mt-4">

            Trusted communities partnered with Nexus.

          </p>





          {partners.length === 0 ? (

            <div
              className="
              mt-14
              bg-white/5
              border
              border-white/10
              rounded-3xl
              p-10
              text-center
              text-gray-400
              "
            >

              No partner communities available yet.

            </div>

          ) : (



          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-14">


            {partners.map((partner) => (


              <div

                key={partner.id}

                className="
                bg-white/5
                border
                border-white/10
                rounded-3xl
                overflow-hidden
                transition
                hover:border-purple-500
                hover:-translate-y-1
                "

              >



                {partner.banner && (

                  <img

                    src={partner.banner}

                    className="
                    w-full
                    h-44
                    object-cover
                    "

                    alt={partner.name}

                  />

                )}






                <div className="p-6">


                  <div className="flex items-center gap-4">



                    {partner.logo && (

                      <img

                        src={partner.logo}

                        alt={partner.name}

                        className="
                        w-16
                        h-16
                        rounded-2xl
                        border
                        border-white/10
                        object-cover
                        "

                      />

                    )}




                    <div>


                      <h2 className="text-2xl font-bold">

                        {partner.name}

                      </h2>



                      <div className="flex gap-2 mt-2">


                        {partner.featured && (

                          <span
                            className="
                            bg-yellow-500/20
                            text-yellow-400
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            "
                          >

                            ⭐ Featured

                          </span>

                        )}




                        {partner.verified && (

                          <span
                            className="
                            bg-green-500/20
                            text-green-400
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            "
                          >

                            ✔ Verified

                          </span>

                        )}


                      </div>


                    </div>


                  </div>






                  <p className="text-gray-400 mt-6 line-clamp-3">

                    {partner.description}

                  </p>






                  <Link

                    href={`/partners/${partner.slug}`}

                    className="
                    mt-8
                    inline-block
                    bg-purple-600
                    hover:bg-purple-700
                    px-6
                    py-3
                    rounded-xl
                    font-bold
                    transition
                    "

                  >

                    View Community →

                  </Link>



                </div>



              </div>



            ))}



          </div>


          )}



        </div>



      </section>



      <Footer />


    </main>

  );

}