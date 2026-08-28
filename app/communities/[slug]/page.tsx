import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import CommunityReviews from "@/components/community/CommunityReviews";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import Image from "next/image";



export default async function CommunityPage({

  params,

}: {

  params: Promise<{ slug: string }>;

}) {


  const { slug } = await params;



  const community = await prisma.community.findUnique({

    where: {
      slug,
    },

    include: {
      games: true,
    },

  });





  if (!community) {

    notFound();

  }





  const reviews = await prisma.communityReview.findMany({
  where: {
    communityId: community.id,
    status: "APPROVED",
  },

  include: {
    user: true,
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
          max-w-5xl
          mx-auto
        ">





          {community.image && (

            <div className="
              relative
              w-full
              h-72
              rounded-3xl
              overflow-hidden
              border
              border-white/10
              mb-12
            ">


              <Image

                src={community.image}

                alt={community.name}

                fill

                className="
                  object-cover
                "

              />


            </div>

          )}







          <div className="
            text-center
          ">



            <div className="
              w-28
              h-28
              mx-auto
              rounded-3xl
              bg-white/5
              border
              border-white/10
              flex
              items-center
              justify-center
              text-7xl
            ">

              {community.icon}

            </div>







            <h1 className="
              mt-8
              text-5xl
              md:text-6xl
              font-extrabold
            ">

              {community.name}

            </h1>







            <p className="
              mt-4
              text-purple-400
              text-xl
            ">

              {community.type}

            </p>







            <p className="
              mt-6
              text-gray-400
              text-lg
              max-w-3xl
              mx-auto
            ">

              {community.description}

            </p>









            <div className="
              mt-10
              flex
              justify-center
              gap-4
              flex-wrap
            ">



              {community.discord && (

                <a

                  href={community.discord}

                  target="_blank"

                  rel="noopener noreferrer"

                  className="
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

                  Join Discord

                </a>

              )}







              {community.roblox && (

                <a

                  href={community.roblox}

                  target="_blank"

                  rel="noopener noreferrer"

                  className="
                    px-8
                    py-4
                    rounded-xl
                    border
                    border-white/20
                    bg-white/5
                    hover:bg-white/10
                    transition
                    font-bold
                  "

                >

                  Roblox Group

                </a>

              )}



            </div>



          </div>













          <div className="
            mt-20
          ">





            <div className="
              glass
              p-8
              text-center
            ">


              <h2 className="
                text-2xl
                font-bold
              ">
                🌐 Platform
              </h2>


              <p className="
                mt-4
                text-gray-400
                text-xl
              ">
                Discord
              </p>


            </div>



          </div>









          <div className="
            mt-24
          ">


            <h2 className="
              text-4xl
              font-bold
            ">

              About{" "}

              <span className="
                bg-linear-to-r
                from-purple-400
                to-blue-400
                bg-clip-text
                text-transparent
              ">
                {community.name}
              </span>

            </h2>



            <p className="
              mt-6
              text-gray-400
              text-lg
              leading-relaxed
            ">

              {community.about}

            </p>


          </div>









          {community.games.length > 0 && (

            <div className="
              mt-24
            ">


              <h2 className="
                text-4xl
                font-bold
                text-center
              ">

                🎮 Community{" "}

                <span className="
                  text-purple-400
                ">
                  Games
                </span>

              </h2>




              <div className="
                grid
                md:grid-cols-2
                gap-6
                mt-10
              ">



                {community.games.map((game: {
                  id: number;
                  name: string;
                  description: string;
                  platform: string;
                  link: string | null;
                }) => (


                  <div

                    key={game.id}

                    className="
                      glass
                      card-hover
                      p-7
                    "

                  >


                    <h3 className="
                      text-3xl
                      font-bold
                    ">
                      {game.name}
                    </h3>


                    <p className="
                      text-purple-400
                      mt-2
                    ">
                      {game.platform}
                    </p>


                    <p className="
                      text-gray-400
                      mt-4
                    ">
                      {game.description}
                    </p>




                    {game.link && (

                      <a

                        href={game.link}

                        target="_blank"

                        rel="noopener noreferrer"

                        className="
                          inline-flex
                          mt-6
                          px-6
                          py-3
                          rounded-xl
                          bg-linear-to-r
                          from-purple-600
                          to-blue-600
                          font-bold
                        "

                      >
                        Play Game
                      </a>

                    )}


                  </div>


                ))}



              </div>



            </div>

          )}









          {/* COMMUNITY REVIEWS */}

          <div className="
            mt-24
          ">

            <CommunityReviews
              reviews={reviews}
              communityId={community.id}
            />

          </div>









          <div className="
            mt-24
          ">



            <h2 className="
              text-4xl
              font-bold
              text-center
            ">
              Staff{" "}

              <span className="
                text-purple-400
              ">
                Team
              </span>

            </h2>





            <div className="
              grid
              md:grid-cols-3
              gap-6
              mt-10
            ">


              {Array.isArray(community.staff) &&

                (community.staff as Array<{

                  name:string;
                  role:string;
                  icon:string;

                }>).map((member)=>(


                  <div

                    key={member.role}

                    className="
                      glass
                      card-hover
                      p-6
                      text-center
                    "

                  >


                    <div className="text-5xl">
                      {member.icon}
                    </div>


                    <h3 className="
                      mt-4
                      text-xl
                      font-bold
                    ">
                      {member.name}
                    </h3>


                    <p className="
                      mt-2
                      text-purple-400
                    ">
                      {member.role}
                    </p>


                  </div>


                ))

              }


            </div>


          </div>





        </div>



      </section>





      <Footer />


    </main>

  );

}