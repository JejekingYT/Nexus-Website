import Navbar from "@/components/layout/Navbar";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function CreateGamePage() {

  const currentUser = await getCurrentUser();

  if (
    currentUser.role !== "OWNER" &&
    currentUser.role !== "ADMIN"
  ) {
    redirect("/admin");
  }


  const communities = await prisma.community.findMany({
    orderBy: {
      name: "asc",
    },
  });



  async function createGame(formData: FormData) {
    "use server";


    const currentUser = await getCurrentUser();


    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const platform = formData.get("platform") as string;
    const link = formData.get("link") as string;


    const communityId = formData.get("communityId")
      ? Number(formData.get("communityId"))
      : null;


    const featured = formData.get("featured") === "on";



    const game = await prisma.game.create({

      data: {

        name,

        slug,

        description,

        image: image || null,

        platform,

        link: link || null,

        featured,

        communityId,

      },

    });



    await prisma.auditLog.create({

      data: {

        action: "CREATE_GAME",

        target: game.name,

        details: `Created game "${game.name}"`,

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

            Add <span className="text-purple-500">
              Game
            </span>

          </h1>



          <form
            action={createGame}
            className="mt-10 space-y-6"
          >


            <input
              name="name"
              placeholder="Game Name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"
              required
            />



            <input
              name="slug"
              placeholder="game-slug"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"
              required
            />



            <textarea
              name="description"
              placeholder="Description"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 h-40"
              required
            />



            <input
              name="image"
              placeholder="/games/image.png"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"
            />



            <input
              name="platform"
              placeholder="Roblox / Minecraft / PC"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"
              required
            />



            <input
              name="link"
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"
            />



            <select
              name="communityId"
              className="w-full bg-white/5 text-white border border-white/10 rounded-xl px-5 py-4"
            >

              <option value="">
                No Community
              </option>


              {communities.map((community) => (

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
                className="w-5 h-5"
              />

              <span>
                ⭐ Featured Game
              </span>

            </label>



            <button
              className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold"
            >

              Create Game

            </button>



          </form>



        </div>

      </section>


    </main>

  );

}