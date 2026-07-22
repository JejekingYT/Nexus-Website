import Navbar from "@/components/layout/Navbar";
import { prisma } from "@/lib/prisma";

export default async function DevelopersPage() {

  const developers = await prisma.developer.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });


  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 pb-24 px-6">

        <div className="max-w-6xl mx-auto">


          <h1 className="text-5xl font-extrabold">
            Nexus <span className="text-purple-500">Developers</span>
          </h1>


          <p className="text-gray-400 mt-4 text-lg">
            Meet the developers behind Nexus projects and experiences.
          </p>



          <div className="grid md:grid-cols-3 gap-6 mt-12">


            {developers.map((developer) => (

              <div
                key={developer.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-purple-500 transition"
              >


                <div className="flex items-center gap-4">


                  {developer.image ? (

                    <img
                      src={developer.image}
                      alt={developer.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />

                  ) : (

                    <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-3xl">
                      {developer.icon}
                    </div>

                  )}



                  <div>

                    <h2 className="text-2xl font-bold">
                      {developer.name}
                    </h2>


                    <p className="text-purple-400">
                      {developer.role}
                    </p>

                  </div>


                </div>



                <p className="text-gray-400 mt-6">
                  {developer.description}
                </p>



                {developer.github && (

                  <a
                    href={developer.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-6 bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-xl font-bold"
                  >
                    GitHub
                  </a>

                )}



              </div>

            ))}



          </div>




          {developers.length === 0 && (

            <p className="text-gray-400 text-center text-xl mt-12">
              No developers added yet.
            </p>

          )}



        </div>


      </section>


    </main>
  );
}