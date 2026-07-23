import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { updatePartner } from "../actions";
import { notFound } from "next/navigation";


export default async function EditPartnerPage({
  params,
}: {
  params: {
    id: string;
  };
}) {

  await requireRole(["OWNER"]);


  const partner = await prisma.partner.findUnique({

    where: {
      id: Number(params.id),
    },

  });


  if (!partner) {
    notFound();
  }



  return (

    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 pb-24 px-6">

        <div className="max-w-4xl mx-auto">


          <h1 className="text-5xl font-bold">

            Edit <span className="text-purple-500">
              Partner
            </span>

          </h1>


          <p className="text-gray-400 mt-3">
            OWNER Partner Management
          </p>




          <form
            action={updatePartner}
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
              type="hidden"
              name="id"
              value={partner.id}
            />



            <input
              name="name"
              defaultValue={partner.name}
              className="input"
              placeholder="Name"
            />


            <input
              name="slug"
              defaultValue={partner.slug}
              className="input"
              placeholder="Slug"
            />


            <input
              name="logo"
              defaultValue={partner.logo}
              className="input"
              placeholder="Logo URL"
            />


            <input
              name="banner"
              defaultValue={partner.banner ?? ""}
              className="input"
              placeholder="Banner URL"
            />



            <textarea
              name="description"
              defaultValue={partner.description}
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



            <input
              name="discord"
              defaultValue={partner.discord ?? ""}
              className="input"
              placeholder="Discord"
            />



            <input
              name="website"
              defaultValue={partner.website ?? ""}
              className="input"
              placeholder="Website"
            />



            <input
              name="roblox"
              defaultValue={partner.roblox ?? ""}
              className="input"
              placeholder="Roblox"
            />



            <select
              name="tier"
              defaultValue={partner.tier}
              className="
              w-full
              bg-black/30
              border
              border-white/10
              rounded-xl
              px-5
              py-4
              "
            >

              <option value="Official">
                Official
              </option>

              <option value="Community">
                Community
              </option>

              <option value="Alliance">
                Alliance
              </option>

            </select>




            <label className="flex gap-3 items-center">

              <input
                type="checkbox"
                name="featured"
                defaultChecked={partner.featured}
              />

              Featured Partner

            </label>



            <label className="flex gap-3 items-center">

              <input
                type="checkbox"
                name="verified"
                defaultChecked={partner.verified}
              />

              Verified Partner

            </label>



            <select
              name="status"
              defaultValue={partner.status}
              className="
              w-full
              bg-black/30
              border
              border-white/10
              rounded-xl
              px-5
              py-4
              "
            >

              <option value="PENDING">
                Pending
              </option>

              <option value="APPROVED">
                Approved
              </option>

              <option value="REJECTED">
                Rejected
              </option>

            </select>




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