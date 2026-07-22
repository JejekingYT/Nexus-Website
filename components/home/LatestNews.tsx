import Link from "next/link";
import { prisma } from "@/lib/prisma";


export default async function LatestNews() {

  const news = await prisma.news.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  });


  return (
    <section className="py-24 px-6">

      <div className="max-w-6xl mx-auto">


        <h2 className="text-4xl font-bold text-white text-center">
          Latest <span className="text-purple-500">
            News
          </span>
        </h2>


        <p className="text-gray-400 text-center mt-4">
          Stay updated with everything happening in Nexus.
        </p>



        <div className="grid md:grid-cols-3 gap-8 mt-12">


          {news.map((item) => (

            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500 hover:-translate-y-2 transition duration-300"
            >


              <div className="text-5xl">
                📰
              </div>


              <p className="text-purple-400 text-sm mt-6">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>



              <h3 className="text-2xl font-bold text-white mt-3">
                {item.title}
              </h3>



              <p className="text-gray-400 mt-4">
                {item.content}
              </p>



              <Link
                href={`/news/${item.slug}`}
                className="inline-block mt-6 text-purple-400 hover:text-purple-300 font-bold"
              >
                Read More →
              </Link>


            </div>

          ))}


        </div>



        {news.length === 0 && (

          <p className="text-center text-gray-400 mt-12">
            No news available yet.
          </p>

        )}


      </div>

    </section>
  );
}