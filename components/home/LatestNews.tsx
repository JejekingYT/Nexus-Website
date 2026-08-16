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

    <section className="
      py-24
      px-6
    ">


      <div className="
        max-w-6xl
        mx-auto
      ">




        <div className="
          text-center
          mb-14
        ">


          <h2 className="
            text-4xl
            md:text-5xl
            font-extrabold
            text-white
          ">

            Latest{" "}

            <span className="
              bg-linear-to-r
              from-purple-400
              to-blue-400
              bg-clip-text
              text-transparent
            ">
              News
            </span>

          </h2>




          <p className="
            mt-4
            text-gray-400
            text-lg
          ">
            Stay updated with everything happening in Nexus.
          </p>


        </div>






        <div className="
          grid
          md:grid-cols-3
          gap-8
        ">



          {news.map((item) => (


            <article

              key={item.id}

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







              <div className="
                mt-6
                inline-flex
                px-3
                py-1
                rounded-full
                bg-purple-500/10
                text-purple-400
                text-sm
              ">

                {new Date(item.createdAt).toLocaleDateString()}

              </div>







              <h3 className="
                mt-4
                text-2xl
                font-bold
                text-white
              ">
                {item.title}
              </h3>






              <p className="
                mt-4
                text-gray-400
                leading-relaxed
                line-clamp-4
              ">
                {item.content}
              </p>







              <Link

                href={`/news/${item.slug}`}

                className="
                  inline-flex
                  mt-7
                  text-purple-400
                  font-bold
                  hover:text-purple-300
                  transition
                  items-center
                  gap-2
                "

              >
                Read More
                <span>
                  →
                </span>

              </Link>





            </article>


          ))}


        </div>







        {news.length === 0 && (

          <p className="
            text-center
            text-gray-400
            mt-12
          ">
            No news available yet.
          </p>

        )}




      </div>


    </section>

  );

}