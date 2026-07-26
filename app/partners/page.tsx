import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import Link from "next/link";


export const dynamic = "force-dynamic";
export const revalidate = 0;



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

    <main className="min-h-screen text-white">


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





          {/* Header */}

          <div className="text-center">


            <h1 className="
              text-5xl
              md:text-6xl
              font-extrabold
            ">


              🤝{" "}


              <span className="
                bg-linear-to-r
                from-purple-400
                to-blue-400
                bg-clip-text
                text-transparent
              ">

                Partner Communities

              </span>


            </h1>





            <p className="
              text-gray-400
              mt-5
              text-lg
            ">

              Trusted communities partnered with Nexus.

            </p>



          </div>









          {partners.length === 0 ? (


            <div className="
              glass
              mt-14
              rounded-3xl
              p-12
              text-center
            ">


              <div className="text-5xl">
                🤝
              </div>


              <h2 className="
                text-2xl
                font-bold
                mt-5
              ">

                No Partners Yet

              </h2>



              <p className="
                text-gray-400
                mt-3
              ">

                Nexus currently has no approved partner communities.

              </p>


            </div>



          ) : (



            <div className="
              grid
              md:grid-cols-2
              xl:grid-cols-3
              gap-8
              mt-14
            ">





              {partners.map((partner)=>(



                <div

                  key={partner.id}

                  className="
                    glass
                    rounded-3xl
                    overflow-hidden
                    card-hover
                  "

                >





                  {/* Banner */}

                  {partner.banner && (

                    <img

                      src={partner.banner}

                      alt={partner.name}

                      className="
                        w-full
                        h-44
                        object-cover
                      "

                    />

                  )}







                  <div className="p-7">





                    {/* Logo + Name */}

                    <div className="
                      flex
                      items-center
                      gap-4
                    ">



                      {partner.logo ? (


                        <img

                          src={partner.logo}

                          alt={partner.name}

                          className="
                            w-16
                            h-16
                            rounded-2xl
                            object-cover
                            border
                            border-white/10
                          "

                        />


                      ) : (


                        <div

                          className="
                            w-16
                            h-16
                            rounded-2xl
                            bg-purple-600
                            flex
                            items-center
                            justify-center
                            text-2xl
                            font-bold
                          "

                        >

                          {partner.name
                            .charAt(0)
                            .toUpperCase()}

                        </div>


                      )}






                      <div>


                        <h2 className="
                          text-2xl
                          font-bold
                        ">

                          {partner.name}

                        </h2>






                        <div className="
                          flex
                          flex-wrap
                          gap-2
                          mt-3
                        ">



                          {partner.featured && (

                            <span className="
                              px-3
                              py-1
                              rounded-full
                              bg-yellow-500/20
                              border
                              border-yellow-500/20
                              text-yellow-400
                              text-xs
                              font-bold
                            ">

                              ⭐ Featured

                            </span>

                          )}






                          {partner.verified && (

                            <span className="
                              px-3
                              py-1
                              rounded-full
                              bg-green-500/20
                              border
                              border-green-500/20
                              text-green-400
                              text-xs
                              font-bold
                            ">

                              ✔ Verified

                            </span>

                          )}



                        </div>



                      </div>



                    </div>









                    <p className="
                      text-gray-400
                      mt-6
                      line-clamp-3
                    ">

                      {partner.description}

                    </p>







                    <div className="
                      flex
                      justify-between
                      items-center
                      mt-6
                    ">


                      <p className="
                        text-gray-500
                        text-sm
                      ">

                        👥 {partner.members.toLocaleString()} members

                      </p>



                    </div>








                    <Link

                      href={`/partners/${partner.slug}`}

                      className="
                        block
                        text-center
                        mt-8
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