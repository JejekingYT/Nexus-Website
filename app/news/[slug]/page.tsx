import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import Image from "next/image";


export const dynamic = "force-dynamic";



export default async function NewsPage({

  params,

}: {

  params: Promise<{ slug: string }>;

}) {



  const { slug } = await params;





  const article = await prisma.news.findUnique({

    where: {
      slug,
    },

  });





  if (!article || !article.published) {

    notFound();

  }





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



        <article className="
          max-w-4xl
          mx-auto
        ">






          {article.image && (

            <div className="
              relative
              w-full
              h-80
              rounded-3xl
              overflow-hidden
              border
              border-white/10
              mb-12
            ">


              <Image

                src={article.image}

                alt={article.title}

                fill

                className="
                  object-cover
                "

              />


            </div>

          )}









          <div className="
            glass
            p-8
            md:p-12
          ">





            <div className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-purple-500/10
              text-purple-400
              text-sm
            ">

              📰 News

            </div>








            <h1 className="
              mt-8
              text-4xl
              md:text-6xl
              font-extrabold
              leading-tight
            ">

              {article.title}

            </h1>








            <p className="
              mt-6
              text-purple-400
            ">

              📅 {new Date(article.createdAt).toLocaleDateString()}

            </p>








            <div className="
              mt-10
              text-gray-300
              text-lg
              leading-relaxed
              whitespace-pre-line
            ">

              {article.content}

            </div>





          </div>





        </article>



      </section>





      <Footer />


    </main>

  );

}