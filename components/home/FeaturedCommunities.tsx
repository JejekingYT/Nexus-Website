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

            Featured{" "}

            <span className="
              bg-linear-to-r
              from-purple-400
              to-blue-400
              bg-clip-text
              text-transparent
            ">
              Communities
            </span>

          </h2>



          <p className="
            text-gray-400
            mt-4
            text-lg
          ">
            Discover the communities that make Nexus.
          </p>


        </div>





        <div className="
          grid
          md:grid-cols-2
          gap-8
        ">



          {communities.map((community) => (


            <div
              key={community.id}
              className="
                glass
                card-hover
                p-8
              "
            >



              <div className="
                flex
                items-center
                justify-between
              ">



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
                  {community.icon}
                </div>





                <span className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-green-400
                  bg-green-400/10
                  px-3
                  py-1
                  rounded-full
                ">

                  <span>
                    ●
                  </span>

                  Online

                </span>



              </div>





              <span className="
                block
                mt-7
                text-purple-400
                text-sm
                font-medium
              ">
                {community.type}
              </span>





              <h3 className="
                mt-3
                text-3xl
                font-bold
                text-white
              ">
                {community.name}
              </h3>





              <p className="
                mt-4
                text-gray-400
                leading-relaxed
              ">
                {community.description}
              </p>





              <div className="
                mt-5
                flex
                items-center
                gap-2
                text-gray-300
              ">

                👥

                <span>
                  {community.members} Members
                </span>

              </div>





              <Link

                href={`/communities/${community.slug}`}

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
                  text-white
                  hover:scale-105
                  transition
                "

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