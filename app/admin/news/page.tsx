import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import DeleteNewsButton from "./DeleteNewsButton";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export default async function NewsManager() {


  await requireRole([
    "OWNER",
    "ADMIN",
  ]);



  const news = await prisma.news.findMany({

    orderBy: {
      createdAt: "desc",
    },

    include: {
      author: true,
    },

  });




  return (

    <main className="min-h-screen bg-[#09090B] text-white">


      <Navbar />


      <section className="pt-32 px-6">


        <div className="max-w-6xl mx-auto">



          <h1 className="text-5xl font-extrabold">

            Manage 
            <span className="text-purple-500">
              {" "}News
            </span>

          </h1>



          <p className="text-gray-400 mt-4">

            Create and manage Nexus announcements.

          </p>




          <div className="mt-6">


            <Link

              href="/admin/news/new"

              className="
              bg-purple-600
              hover:bg-purple-700
              px-6
              py-3
              rounded-xl
              font-bold
              transition
              "

            >

              + Create News

            </Link>


          </div>






          <div className="grid md:grid-cols-2 gap-6 mt-12">



            {news.map((article) => (


              <div

                key={article.id}

                className="
                bg-white/5
                border
                border-white/10
                rounded-2xl
                p-6
                "

              >



                <h2 className="text-2xl font-bold">

                  {article.title}

                </h2>




                <p className="text-purple-400 mt-2">

                  {article.slug}

                </p>




                <p className="text-gray-400 mt-4">

                  {article.content}

                </p>




                <p className="text-gray-500 mt-4">

                  By:{" "}

                  <span className="text-purple-400">

                    {article.author?.username ?? "Unknown"}

                  </span>

                </p>





                <div className="mt-6 flex items-center justify-between">



                  <span

                    className={

                      article.published

                      ? "text-green-400"

                      : "text-yellow-400"

                    }

                  >

                    {article.published
                      ? "Published"
                      : "Draft"}

                  </span>






                  <div className="flex gap-3">



                    <Link

                      href={`/admin/news/${article.slug}/edit`}

                      className="
                      bg-purple-600
                      hover:bg-purple-700
                      px-5
                      py-3
                      rounded-xl
                      font-bold
                      "

                    >

                      Edit

                    </Link>




                    <DeleteNewsButton slug={article.slug} />



                  </div>



                </div>



              </div>



            ))}



          </div>



        </div>


      </section>


    </main>

  );

}