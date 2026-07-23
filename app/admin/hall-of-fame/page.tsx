import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import {
  createHallOfFame,
  deleteHallOfFame,
} from "./actions";


export default async function AdminHallOfFamePage() {


  await requireRole(["OWNER"]);



  const members = await prisma.hallOfFame.findMany({

    orderBy: {
      createdAt: "desc",
    },

  });




  return (

    <main className="min-h-screen bg-[#09090B] text-white">


      <Navbar />



      <section className="pt-32 pb-24 px-6">


        <div className="max-w-7xl mx-auto">



          <h1 className="text-5xl font-extrabold">

            🏆 Hall of Fame

            <span className="text-purple-500">
              Admin
            </span>

          </h1>


          <p className="text-gray-400 mt-3">

            Manage Nexus legends and important community members.

          </p>






          {/* Create Form */}


          <form

            action={createHallOfFame}

            className="
            mt-12
            bg-white/5
            border
            border-white/10
            rounded-2xl
            p-8
            space-y-5
            "

          >



            <input
              name="name"
              required
              placeholder="Name"
              className="
              w-full
              bg-black/30
              border
              border-white/10
              rounded-xl
              px-5
              py-4
              "
            />



            <input
              name="title"
              required
              placeholder="Title (Founder, Legend, Retired Admin...)"
              className="
              w-full
              bg-black/30
              border
              border-white/10
              rounded-xl
              px-5
              py-4
              "
            />



            <input
              name="category"
              required
              placeholder="Category (Nexus Legends, Retired Staff, Partners...)"
              className="
              w-full
              bg-black/30
              border
              border-white/10
              rounded-xl
              px-5
              py-4
              "
            />



            <input
              name="image"
              placeholder="Image URL"
              className="
              w-full
              bg-black/30
              border
              border-white/10
              rounded-xl
              px-5
              py-4
              "
            />



            <input
              name="year"
              placeholder="Year (Example: 2026)"
              className="
              w-full
              bg-black/30
              border
              border-white/10
              rounded-xl
              px-5
              py-4
              "
            />



            <textarea

              name="description"

              required

              placeholder="Contribution / Description"

              className="
              w-full
              h-32
              bg-black/30
              border
              border-white/10
              rounded-xl
              px-5
              py-4
              "

            />





            <button

              className="
              bg-purple-600
              hover:bg-purple-700
              px-8
              py-4
              rounded-xl
              font-bold
              "

            >

              Add Hall of Fame Member

            </button>




          </form>







          {/* Existing Members */}



          <h2 className="text-3xl font-bold mt-20">

            Current Members

          </h2>





          <div className="grid md:grid-cols-2 gap-6 mt-8">



            {members.map((member)=>(


              <div

                key={member.id}

                className="
                bg-white/5
                border
                border-white/10
                rounded-2xl
                p-6
                "

              >



                <h3 className="text-2xl font-bold">

                  {member.name}

                </h3>



                <p className="text-purple-400 mt-1">

                  {member.title}

                </p>



                <p className="text-gray-400 mt-4">

                  {member.description}

                </p>




                <div className="flex gap-3 mt-6">


                  <span className="
                  bg-purple-500/20
                  text-purple-300
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  ">

                    {member.category}

                  </span>



                  {member.year && (

                    <span className="
                    bg-white/10
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    ">

                      {member.year}

                    </span>

                  )}



                </div>





                <form

                  action={async()=>{

                    "use server";

                    await deleteHallOfFame(member.id);

                  }}

                >


                  <button

                    className="
                    mt-6
                    bg-red-600
                    hover:bg-red-700
                    px-5
                    py-3
                    rounded-xl
                    font-bold
                    "

                  >

                    Delete

                  </button>


                </form>




              </div>


            ))}



          </div>





        </div>


      </section>



      <Footer />


    </main>

  );

}