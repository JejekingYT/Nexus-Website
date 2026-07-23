import Navbar from "@/components/layout/Navbar";
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


  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 pb-24 px-6">

        <div className="max-w-6xl mx-auto">


          <h1 className="text-5xl font-extrabold text-center">
            Nexus <span className="text-purple-500">
              Communities
            </span>
          </h1>


          <p className="text-gray-400 text-center mt-4">
            Find and join our communities.
          </p>



          {communities.length > 0 ? (

            <div className="grid md:grid-cols-2 gap-8 mt-12">


              {communities.map((community) => (

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
                    transition
                    font-bold
                    "
                  >
                    View Community
                  </Link>


                </div>

              ))}


            </div>

          ) : (

            <p className="text-gray-400 text-center text-xl mt-12">
              No communities added yet.
            </p>

          )}



        </div>


      </section>


      <Footer />


    </main>
  );
}