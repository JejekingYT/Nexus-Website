"use client";

import { useState } from "react";
import Navbar from "@/components/layout/NavbarWrapper";

export default function EditCommunityForm({
  community,
}: {
  community: any;
}) {

  const [name, setName] = useState(community.name ?? "");
  const [description, setDescription] = useState(community.description ?? "");
  const [discord, setDiscord] = useState(community.discord ?? "");
  const [roblox, setRoblox] = useState(community.roblox ?? "");

  const [saving, setSaving] = useState(false);


  async function saveChanges() {

    setSaving(true);

    try {

      const res = await fetch(
        `/api/admin/communities/${community.slug}`,
        {
          method: "POST",

          headers:{
            "Content-Type":"application/json",
          },

          body: JSON.stringify({
            name,
            description,
            discord,
            roblox,
          }),

        }
      );


      if(!res.ok){
        throw new Error("Failed updating community");
      }


      alert("Community updated!");

    } catch(error){

      console.error(error);
      alert("Something went wrong");

    } finally {

      setSaving(false);

    }

  }


  return (

    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 px-6 pb-24">

        <div className="max-w-3xl mx-auto">


          <h1 className="text-5xl font-extrabold">

            Edit{" "}

            <span className="text-purple-500">
              {community.name}
            </span>

          </h1>



          <div className="mt-10 space-y-6">


            <div>

              <label>
                Name
              </label>


              <input

                value={name}

                onChange={(e)=>setName(e.target.value)}

                className="
                w-full
                mt-2
                bg-white/5
                border
                border-white/10
                rounded-xl
                px-4
                py-3
                "

              />

            </div>




            <div>

              <label>
                Description
              </label>


              <textarea

                value={description}

                onChange={(e)=>setDescription(e.target.value)}

                className="
                w-full
                mt-2
                bg-white/5
                border
                border-white/10
                rounded-xl
                px-4
                py-3
                "

              />

            </div>




            <div>

              <label>
                Discord Invite
              </label>


              <input

                value={discord}

                onChange={(e)=>setDiscord(e.target.value)}

                className="
                w-full
                mt-2
                bg-white/5
                border
                border-white/10
                rounded-xl
                px-4
                py-3
                "

              />

            </div>




            <div>

              <label>
                Roblox Group
              </label>


              <input

                value={roblox}

                onChange={(e)=>setRoblox(e.target.value)}

                className="
                w-full
                mt-2
                bg-white/5
                border
                border-white/10
                rounded-xl
                px-4
                py-3
                "

              />

            </div>




            <button

              disabled={saving}

              onClick={saveChanges}

              className="
              bg-purple-600
              hover:bg-purple-700
              px-8
              py-4
              rounded-xl
              font-bold
              disabled:opacity-50
              "

            >

              {saving ? "Saving..." : "Save Changes"}

            </button>


          </div>


        </div>


      </section>


    </main>

  );

}