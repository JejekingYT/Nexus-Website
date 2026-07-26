import Navbar from "@/components/layout/NavbarWrapper";
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

    <main className="
      min-h-screen
      text-white
    ">



      <Navbar />





      <section className="
        pt-32
        pb-24
        px-6
      ">



        <div className="
          max-w-6xl
          mx-auto
        ">





          <div className="
            text-center
            mb-16
          ">


            <h1 className="
              text-5xl
              md:text-6xl
              font-extrabold
            ">

              Nexus{" "}

              <span className="
                bg-linear-to-r
                from-purple-400
                to-blue-400
                bg-clip-text
                text-transparent
              ">
                News
              </span>

            </h1>





            <p className="
              mt-6
              text-gray-400
              text-lg
              max-w-2xl
              mx-auto
            ">
              Latest announcements and updates from the Nexus community.
            </p>



          </div>







          {news.length > 0 ? (



            <div className="
              grid
              md:grid-cols-2
              gap-8
            ">



              {news.map((article) => (


                <article

                  key={article.id}

                  className="
                    glass
                    card-hover
                    p-8
                  "

                >




                  <div className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-white/5
                    border
                    border-white/10
                    flex
                    items-center
                    justify-center
                    text-4xl
                  ">
                    📰
                  </div>







                  <h2 className="
                    mt-6
                    text-3xl
                    font-bold
                  ">
                    {article.title}
                  </h2>







                  <p className="
                    mt-5
                    text-gray-400
                    leading-relaxed
                    line-clamp-4
                  ">
                    {article.content}
                  </p>







                  <div className="
                    mt-5
                    text-purple-400
                    text-sm
                  ">
                    📅 {new Date(article.createdAt).toLocaleDateString()}
                  </div>








                  <Link

                    href={`/news/${article.slug}`}

                    className="
                      inline-flex
                      mt-7
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
                    Read News

                  </Link>




                </article>


              ))}



            </div>



          ) : (



            <p className="
              text-center
              text-gray-400
              mt-16
              text-xl
            ">
              No news available yet.
            </p>



          )}





        </div>



      </section>





      <Footer />


    </main>

  );

}