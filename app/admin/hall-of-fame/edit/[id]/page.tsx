import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateHallOfFame } from "../../actions";


export default async function EditHallOfFamePage({

  params,

}: {

  params: Promise<{
    id: string
  }>;

}) {


  const { id } = await params;


  const member = await prisma.hallOfFame.findUnique({

    where: {

      id: Number(id),

    },

  });



  if (!member) {

    notFound();

  }





  return (

    <main className="min-h-screen bg-[#09090B] text-white">


      <Navbar />



      <section className="pt-32 pb-24 px-6">


        <div className="max-w-3xl mx-auto">


          <h1 className="text-5xl font-extrabold">

            ✏️ Edit{" "}

            <span className="text-purple-500">
              Hall of Fame
            </span>

          </h1>





          <form

            action={async(formData)=>{

              "use server";

              await updateHallOfFame(
                member.id,
                formData
              );

            }}


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

              defaultValue={member.name}

              className="input"

              required

            />



            <input

              name="title"

              defaultValue={member.title}

              className="input"

              required

            />



            <input

              name="category"

              defaultValue={member.category}

              className="input"

              required

            />



            <input

              name="image"

              defaultValue={member.image ?? ""}

              className="input"

              placeholder="Image URL"

            />



            <input

              name="year"

              defaultValue={member.year ?? ""}

              className="input"

              placeholder="Year"

            />




            <textarea

              name="description"

              defaultValue={member.description}

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

              required

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

              Save Changes

            </button>



          </form>


        </div>


      </section>



      <Footer />


    </main>

  );

}