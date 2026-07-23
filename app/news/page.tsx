import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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


      <section className="pt-32 pb-24 px-6">

        <div className="max-w-6xl mx-auto">


          <h1 className="text-6xl font-extrabold text-center">
            Nexus <span className="text-purple-500">
              News
            </span>
          </h1>


          <p className="text-gray-400 text-center mt-6 text-lg">
            Latest announcements and updates from the Nexus community.
          </p>



          {news.length > 0 ? (

            <div className="grid md:grid-cols-2 gap-6 mt-16">

              {news.map((article) => (

                <div
                  key={article.id}
                  className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-2xl
                  p-6
                  hover:border-purple-500
                  transition
                  "
                >


                  <h2 className="text-3xl font-bold">
                    {article.title}
                  </h2>



                  <p className="text-gray-400 mt-5">
                    {article.content}
                  </p>



                  <p className="text-purple-400 mt-4">
                    📅 {new Date(article.createdAt).toLocaleDateString()}
                  </p>



                  <Link
                    href={`/news/${article.slug}`}
                    className="
                    inline-block
                    mt-6
                    bg-purple-600
                    hover:bg-purple-700
                    px-6
                    py-3
                    rounded-xl
                    font-bold
                    "
                  >
                    Read News
                  </Link>


                </div>

              ))}

            </div>

          ) : (

            <p className="text-center text-gray-400 mt-16 text-xl">
              No news available yet.
            </p>

          )}


        </div>

      </section>


      <Footer />

    </main>
  );
}