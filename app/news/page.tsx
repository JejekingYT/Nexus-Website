import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function NewsPage() {

  const news = await prisma.news.findMany({
    where: {
      published: true,
    },
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
            Nexus <span className="text-purple-500">
              News
            </span>
          </h1>


          <p className="text-gray-400 mt-4">
            Latest announcements and updates.
          </p>



          <div className="grid md:grid-cols-2 gap-6 mt-12">


            {news.map((article) => (

              <div
                key={article.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6"
              >


                <h2 className="text-2xl font-bold">
                  {article.title}
                </h2>


                <p className="text-gray-400 mt-4">
                  {article.content}
                </p>


                <p className="text-purple-400 mt-4">
                  {new Date(article.createdAt).toLocaleDateString()}
                </p>


              </div>

            ))}


          </div>


          {news.length === 0 && (

            <p className="text-gray-400 mt-10">
              No news available yet.
            </p>

          )}


        </div>

      </section>

    </main>
  );
}