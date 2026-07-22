"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default function CreateEventPage() {

  const router = useRouter();


  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [discord, setDiscord] = useState("");
  const [published, setPublished] = useState(false);



  async function createEvent() {

    const res = await fetch(
      "/api/admin/events",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title,
          slug,
          description,
          image,
          date,
          time,
          discord,
          published,
        }),
      }
    );


    if (!res.ok) {
      alert("Failed to create event");
      return;
    }


    alert("Event created!");

    router.push("/admin/events");
    router.refresh();

  }



  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 px-6">

        <div className="max-w-3xl mx-auto">


          <h1 className="text-5xl font-extrabold">
            Create <span className="text-purple-500">
              Event
            </span>
          </h1>



          <div className="space-y-6 mt-10">


            <input
              placeholder="Event title"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />


            <input
              placeholder="Slug"
              value={slug}
              onChange={(e)=>setSlug(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />


            <textarea
              placeholder="Description"
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              className="w-full h-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />


            <input
              placeholder="Image URL"
              value={image}
              onChange={(e)=>setImage(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />


            <input
              placeholder="Date (example: 25/12/2026)"
              value={date}
              onChange={(e)=>setDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />


            <input
              placeholder="Time (example: 18:00)"
              value={time}
              onChange={(e)=>setTime(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />


            <input
              placeholder="Discord Event Link"
              value={discord}
              onChange={(e)=>setDiscord(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />



            <label className="flex gap-3 items-center">

              <input
                type="checkbox"
                checked={published}
                onChange={(e)=>setPublished(e.target.checked)}
              />

              Published

            </label>



            <button
              onClick={createEvent}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold"
            >
              Create Event
            </button>


          </div>


        </div>

      </section>


    </main>
  );
}