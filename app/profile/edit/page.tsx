import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditProfileForm from "./EditProfileForm";


export default async function EditProfilePage() {


  const session = await getServerSession(authOptions);



  if (!session?.user?.id) {
    redirect("/login");
  }





  const user = await prisma.user.findUnique({

    where: {

      discordId: session.user.id,

    },

  });





  if (!user) {
    redirect("/login");
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
          max-w-4xl
          mx-auto
        ">






          {/* Header */}

          <div className="text-center">


            <h1 className="
              text-5xl
              md:text-6xl
              font-extrabold
            ">

              Edit{" "}

              <span className="
                bg-linear-to-r
                from-purple-400
                to-blue-400
                bg-clip-text
                text-transparent
              ">

                Profile

              </span>


            </h1>




            <p className="
              text-gray-400
              text-lg
              mt-5
            ">

              Customize your Nexus profile information and make your profile unique.

            </p>


          </div>








          {/* Edit Card */}


          <div className="
            glass
            rounded-3xl
            mt-12
            p-8
            md:p-10
          ">



            <div className="
              flex
              items-center
              gap-4
              mb-8
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

                ⚙️

              </div>





              <div>

                <h2 className="
                  text-2xl
                  font-bold
                ">

                  Profile Settings

                </h2>



                <p className="
                  text-gray-400
                  text-sm
                  mt-1
                ">

                  Update your public Nexus profile details.

                </p>


              </div>


            </div>






            <EditProfileForm user={user} />





          </div>





        </div>



      </section>






      <Footer />



    </main>

  );

}