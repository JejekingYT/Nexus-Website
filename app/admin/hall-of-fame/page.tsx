import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import {
  createHallOfFame,
  deleteHallOfFame,
} from "./actions";
import Image from "next/image";


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

            🏆 Hall of Fame{" "}

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
              className="input"
            />



            <input
              name="title"
              required
              placeholder="Title (Founder, Legend, Retired Admin...)"
              className="input"
            />



            <input
              name="category"
              required
              placeholder="Category (Nexus Legends, Retired Staff, Partners...)"
              className="input"
            />



            <input
              name="image"
              placeholder="Image URL"
              className="input"
            />



            <input
              name="year"
              placeholder="Year (Example: 2026)"
              className="input"
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







          <h2 className="text-3xl font-bold mt-20">

            Current Members

          </h2>







          {members.length === 0 ? (

            <div className="
            mt-8
            bg-white/5
            border
            border-white/10
            rounded-2xl
            p-10
            text-center
            text-gray-400
            ">

              No Hall of Fame members yet.

            </div>


          ) : (


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
                  hover:border-purple-500
                  transition
                  "

                >



                  {member.image && (

                    <Image

                      src={member.image}

                      alt={member.name}

                      width={100}

                      height={100}

                      className="
                      rounded-full
                      object-cover
                      border
                      border-purple-500/40
                      mb-5
                      "

                    />

                  )}






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


                    <span

                      className="
                      bg-purple-500/20
                      text-purple-300
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      "

                    >

                      {member.category}

                    </span>





                    {member.year && (

                      <span

                        className="
                        bg-white/10
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        "

                      >

                        ⭐ {member.year}

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


          )}



        </div>


      </section>



      <Footer />


    </main>

  );

}