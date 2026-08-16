import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import Image from "next/image";



export default async function ProjectPage({

  params,

}: {

  params: Promise<{ slug: string }>;

}) {



  const { slug } = await params;





  const project = await prisma.project.findUnique({

    where: {
      slug,
    },

  });





  if (!project) {

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
          max-w-5xl
          mx-auto
        ">







          {project.image && (

            <div className="
              relative
              w-full
              h-96
              rounded-3xl
              overflow-hidden
              border
              border-white/10
              mb-12
            ">


              <Image

                src={project.image}

                alt={project.title}

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
              flex
              flex-wrap
              gap-3
            ">



              <span className="
                px-4
                py-2
                rounded-full
                bg-purple-500/20
                text-purple-400
              ">

                {project.platform}

              </span>








              <span className="
                px-4
                py-2
                rounded-full
                bg-green-500/20
                text-green-400
              ">

                {project.status}

              </span>








              {project.featured && (

                <span className="
                  px-4
                  py-2
                  rounded-full
                  bg-yellow-500/20
                  text-yellow-400
                  font-bold
                ">

                  ⭐ Featured

                </span>

              )}



            </div>








            <h1 className="
              mt-8
              text-5xl
              md:text-6xl
              font-extrabold
            ">

              {project.title}

            </h1>








            <p className="
              mt-8
              text-gray-300
              text-lg
              leading-relaxed
            ">

              {project.description}

            </p>








            {project.url && (

              <a

                href={project.url}

                target="_blank"

                rel="noopener noreferrer"

                className="
                  inline-flex
                  mt-10
                  px-8
                  py-4
                  rounded-xl
                  bg-linear-to-r
                  from-purple-600
                  to-blue-600
                  font-bold
                  hover:scale-105
                  transition
                "

              >

                Visit Project

              </a>

            )}






          </div>






        </article>





      </section>





      <Footer />



    </main>

  );

}