import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";
export const revalidate = 0;



function getRoleStyle(role: string) {

  switch (role) {

    case "OWNER":
      return "bg-yellow-500/20 border-yellow-500/30 text-yellow-400";

    case "CO-OWNER":
      return "bg-orange-500/20 border-orange-500/30 text-orange-400";

    case "MANAGER":
      return "bg-blue-500/20 border-blue-500/30 text-blue-400";

    case "ADMIN":
      return "bg-red-500/20 border-red-500/30 text-red-400";

    case "MODERATOR":
      return "bg-green-500/20 border-green-500/30 text-green-400";

    case "SUPPORT":
      return "bg-cyan-500/20 border-cyan-500/30 text-cyan-400";

    default:
      return "bg-purple-500/20 border-purple-500/30 text-purple-400";

  }

}




function getRoleBadge(role: string) {

  switch (role) {

    case "OWNER":
      return "👑 Founder";

    case "CO-OWNER":
      return "👑 Co-Owner";

    case "MANAGER":
      return "⚙️ Manager";

    case "ADMIN":
      return "🛡️ Administrator";

    case "MODERATOR":
      return "🛡️ Moderator";

    case "SUPPORT":
      return "💬 Support";

    default:
      return "✅ Nexus Member";

  }

}





export default async function PublicProfilePage({

  params,

}: {

  params: Promise<{ username:string }>;

}) {


  const { username } = await params;


  const decodedUsername = decodeURIComponent(username);



  const user = await prisma.user.findFirst({

    where:{
      username: decodedUsername,
    },


    include:{

      badges:{

        include:{
          badge:true,
        },

        orderBy:{
          awardedAt:"desc",
        },

      },

    },

  });




  if(!user){

    notFound();

  }





  return (

    <main className="min-h-screen text-white">


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




          <div className="
            text-center
            mb-12
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

                Member

              </span>


            </h1>



            <p className="
              text-gray-400
              mt-5
              text-lg
            ">

              Viewing the public profile of a Nexus member.

            </p>


          </div>







          <div className="
            glass
            rounded-3xl
            overflow-hidden
          ">



            {/* Banner */}

            <div className="
              h-44
              bg-linear-to-r
              from-purple-700/50
              via-purple-500/20
              to-blue-500/20
            " />







            <div className="
              px-8
              pb-12
            ">



              {/* Avatar */}


              <div className="-mt-20 flex justify-center">


                {user.image ? (

                  <Image

                    src={user.image}

                    alt={user.username}

                    width={140}

                    height={140}

                    className="
                      w-36
                      h-36
                      rounded-full
                      object-cover
                      border-4
                      border-[#09090B]
                      ring-2
                      ring-purple-500
                    "

                  />

                ) : (


                  <div className="
                    w-36
                    h-36
                    rounded-full
                    bg-purple-600
                    flex
                    items-center
                    justify-center
                    text-5xl
                    font-bold
                    border-4
                    border-[#09090B]
                    ring-2
                    ring-purple-500
                  ">


                    {user.username.charAt(0).toUpperCase()}


                  </div>


                )}


              </div>









              {/* User Info */}


              <div className="text-center mt-6">


                <h2 className="
                  text-4xl
                  font-bold
                ">

                  {user.username}

                </h2>





                <div className="flex justify-center mt-4">


                  <span className={`
                    px-5
                    py-2
                    rounded-full
                    border
                    text-sm
                    font-bold
                    ${getRoleStyle(user.role)}
                  `}>

                    {getRoleBadge(user.role)}

                  </span>


                </div>






                <p className="
                  text-gray-400
                  text-lg
                  mt-6
                  max-w-2xl
                  mx-auto
                ">

                  {user.bio || "This user hasn't added a bio yet."}

                </p>


              </div>









              {/* Stats */}


              <div className="
                grid
                md:grid-cols-3
                gap-5
                mt-12
              ">



                {[
                  {
                    title:"Role",
                    value:user.role,
                  },
                  {
                    title:"Badges",
                    value:user.badges.length,
                  },
                  {
                    title:"Joined",
                    value:user.createdAt.toLocaleDateString(
                      "en-US",
                      {
                        year:"numeric",
                        month:"short",
                      }
                    ),
                  },
                ].map((stat)=>(


                  <div
                    key={stat.title}
                    className="
                      glass
                      p-6
                      text-center
                    "
                  >

                    <p className="text-gray-500 text-sm">

                      {stat.title}

                    </p>


                    <p className="
                      font-bold
                      text-xl
                      mt-2
                    ">

                      {stat.value}

                    </p>


                  </div>


                ))}


              </div>









              {/* Badges */}


              <div className="mt-14">


                <h3 className="
                  text-3xl
                  font-bold
                  text-center
                ">

                  🏅 Badges

                </h3>



                {user.badges.length > 0 ? (

                  <div className="
                    grid
                    md:grid-cols-2
                    gap-5
                    mt-8
                  ">


                    {user.badges.map((item)=>(


                      <div

                        key={item.id}

                        className="
                          glass
                          p-5
                          hover:border-purple-500
                          transition
                        "

                      >


                        <div className="
                          flex
                          gap-4
                          items-center
                        ">



                          <div className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-purple-500/20
                            border
                            border-purple-500/30
                            flex
                            items-center
                            justify-center
                            text-3xl
                          ">

                            {item.badge.icon}

                          </div>




                          <div>


                            <h4 className="
                              font-bold
                              text-lg
                            ">

                              {item.badge.name}

                            </h4>



                            <p className="
                              text-gray-400
                              text-sm
                            ">

                              {item.badge.description ||
                              "No description available."}

                            </p>


                          </div>


                        </div>


                      </div>


                    ))}


                  </div>


                ) : (


                  <p className="
                    text-center
                    text-gray-500
                    mt-6
                  ">

                    No badges earned yet.

                  </p>


                )}


              </div>








              {/* Back Button */}


              <div className="
                text-center
                mt-12
              ">


                <Link

                  href="/members"

                  className="
                    inline-block
                    px-8
                    py-3
                    rounded-xl
                    bg-white/10
                    hover:bg-white/20
                    font-bold
                    transition
                  "

                >

                  ← Back to Members

                </Link>


              </div>





            </div>



          </div>



        </div>



      </section>



      <Footer />


    </main>

  );

}