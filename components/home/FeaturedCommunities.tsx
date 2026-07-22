import Link from "next/link";
import { prisma } from "@/lib/prisma";


export default async function FeaturedCommunities() {

  const communities = await prisma.community.findMany({
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
  });


  return (
    <section className="py-24 px-6">

      <div className="max-w-6xl mx-auto">


        <h2 className="text-4xl font-bold text-white text-center">
          Featured <span className="text-purple-500">
            Communities
          </span>
        </h2>


        <p className="text-gray-400 text-center mt-4">
          Discover the communities that make Nexus.
        </p>



        <div className="grid md:grid-cols-2 gap-8 mt-12">


          {communities.map((community) => (

            <div
              key={community.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500 hover:-translate-y-2 transition duration-300"
            >


              <div className="flex items-center justify-between">


                <div className="text-5xl">
                  {community.icon}
                </div>


                <span className="text-green-400 text-sm">
                  ● Online
                </span>


              </div>



              <span className="text-purple-400 text-sm block mt-6">
                {community.type}
              </span>



              <h3 className="text-2xl font-bold text-white mt-3">
                {community.name}
              </h3>



              <p className="text-gray-400 mt-4">
                {community.description}
              </p>



              <p className="text-gray-300 mt-4">
                Members: {community.members}
              </p>



              <Link
                href={`/communities/${community.slug}`}
                className="inline-block mt-6 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-bold"
              >
                View Community
              </Link>


            </div>

          ))}


        </div>


      </div>

    </section>
  );
}