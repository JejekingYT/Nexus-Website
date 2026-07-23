import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

import PageHeader from "@/components/admin/PageHeader";
import AdminCard from "@/components/admin/AdminCard";


export default async function SettingsPage() {


  const currentUser = await getCurrentUser();


  if (
    !currentUser ||
    (
      currentUser.role !== "OWNER" &&
      currentUser.role !== "ADMIN"
    )
  ) {
    redirect("/admin");
  }



  let settings = await prisma.siteSettings.findUnique({
    where: {
      id: 1,
    },
  });



  if (!settings) {

    settings = await prisma.siteSettings.create({
      data: {
        id: 1,
      },
    });

  }



  async function updateSettings(formData: FormData) {

    "use server";


    await prisma.siteSettings.update({

      where: {
        id: 1,
      },

      data: {

        siteName:
          String(formData.get("siteName")),

        description:
          String(formData.get("description")),

        logo:
          String(formData.get("logo")) || null,

        favicon:
          String(formData.get("favicon")) || null,

        discord:
          String(formData.get("discord")) || null,

        github:
          String(formData.get("github")) || null,

        youtube:
          String(formData.get("youtube")) || null,


        maintenance:
          formData.get("maintenance") === "on",

      },

    });


    redirect("/admin/settings");

  }





  return (

    <section className="p-6 md:p-10">


      <PageHeader

        title="Settings"

        description="Manage Nexus website settings."

      />



      <AdminCard title="Website Settings">


        <form
          action={updateSettings}
          className="space-y-6"
        >


          <input
            name="siteName"
            defaultValue={settings.siteName}
            placeholder="Site Name"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"
          />



          <textarea
            name="description"
            defaultValue={settings.description ?? ""}
            placeholder="Website Description"
            className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-5 py-4"
          />



          <input
            name="logo"
            defaultValue={settings.logo ?? ""}
            placeholder="Logo URL"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"
          />



          <input
            name="favicon"
            defaultValue={settings.favicon ?? ""}
            placeholder="Favicon URL"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"
          />



          <input
            name="discord"
            defaultValue={settings.discord ?? ""}
            placeholder="Discord Invite"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"
          />



          <input
            name="github"
            defaultValue={settings.github ?? ""}
            placeholder="GitHub URL"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"
          />



          <input
            name="youtube"
            defaultValue={settings.youtube ?? ""}
            placeholder="YouTube URL"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4"
          />



          <label className="flex gap-3 items-center">

            <input
              type="checkbox"
              name="maintenance"
              defaultChecked={settings.maintenance}
              className="w-5 h-5"
            />

            Enable Maintenance Mode

          </label>




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
            Save Settings
          </button>


        </form>


      </AdminCard>


    </section>

  );
}