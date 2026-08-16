import Navbar from "@/components/layout/NavbarWrapper";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {


  const currentUser = await getCurrentUser();


  if (
    currentUser.role !== "OWNER" &&
    currentUser.role !== "ADMIN"
  ) {
    redirect("/admin");
  }



  const { id } = await params;



  const game = await prisma.game.findUnique({

    where: {
      id: Number(id),
    },

  });



  const communities = await prisma.community.findMany({

    orderBy: {
      name: "asc",
    },

  });



  if (!game) {
    redirect("/admin/games");
  }




  async function updateGame(formData: FormData) {
    "use server";


    const currentUser = await getCurrentUser();



    const oldGame = await prisma.game.findUnique({

      where: {
        id: Number(id),
      },

    });



    const communityId = formData.get("communityId")
      ? Number(formData.get("communityId"))
      : null;




    const updatedGame = await prisma.game.update({

      where: {
        id: Number(id),
      },


      data: {

        name:
          formData.get("name") as string,


        description:
          formData.get("description") as string,


        image:
          (formData.get("image") as string) || null,


        platform:
          formData.get("platform") as string,


        link:
          (formData.get("link") as string) || null,


        featured:
          formData.get("featured") === "on",


        communityId,

      },

    });





    await prisma.auditLog.create({

      data: {

        action: "EDIT_GAME",

        target: updatedGame.name,

        details: `Edited game "${oldGame?.name || updatedGame.name}"`,

        userId: currentUser.id,

      },

    });




    redirect("/admin/games");

  }





  return (

    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 pb-24 px-6">

        <div className="max-w-3xl mx-auto">



          <h1 className="text-5xl font-extrabold">

            Edit <span className="text-purple-500">
              Game
            </span>

          </h1>




          <form
            action={updateGame}
            className="mt-10 space-y-6"
          >



            <input

              name="name"

              defaultValue={game.name}

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"

            />





            <textarea

              name="description"

              defaultValue={game.description}

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 h-40"

            />





            <input

              name="image"

              defaultValue={game.image ?? ""}

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"

            />





            <input

              name="platform"

              defaultValue={game.platform}

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"

            />





            <input

              name="link"

              defaultValue={game.link ?? ""}

              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"

            />





            <select

              name="communityId"

              defaultValue={game.communityId ?? ""}

              className="w-full bg-gray-900 text-white border border-white/10 rounded-xl px-5 py-4"

            >


              <option value="">
                No Community
              </option>



              {communities.map((community)=>(

                <option

                  key={community.id}

                  value={community.id}

                >

                  {community.name}

                </option>

              ))}



            </select>





            <label className="flex items-center gap-3">


              <input

                type="checkbox"

                name="featured"

                defaultChecked={game.featured}

              />

              ⭐ Featured Game


            </label>





            <button

              className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold"

            >

              Save Changes

            </button>




          </form>



        </div>


      </section>


    </main>

  );

}