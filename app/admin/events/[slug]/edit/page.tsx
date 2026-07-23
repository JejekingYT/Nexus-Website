"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/layout/NavbarWrapper";

export default function EditEventPage() {

  const router = useRouter();
  const params = useParams();

  const slug = params.slug as string;


  const [title, setTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [discord, setDiscord] = useState("");
  const [published, setPublished] = useState(false);


  useEffect(() => {

    async function loadEvent() {

      const res = await fetch(
        `/api/admin/events/${slug}`
      );

      const data = await res.json();


      if (!data.event) {
        alert("Event not found");
        return;
      }


      setTitle(data.event.title);
      setNewSlug(data.event.slug);
      setDescription(data.event.description);
      setImage(data.event.image || "");
      setDate(data.event.date);
      setTime(data.event.time);
      setDiscord(data.event.discord || "");
      setPublished(data.event.published);

    }


    loadEvent();

  }, [slug]);



  async function saveChanges() {

    await fetch(
      `/api/admin/events/${slug}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title,
          slug: newSlug,
          description,
          image,
          date,
          time,
          discord,
          published,
        }),
      }
    );


    alert("Event updated!");

    router.push("/admin/events");
    router.refresh();

  }



  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 px-6">

        <div className="max-w-3xl mx-auto">


          <h1 className="text-5xl font-extrabold">
            Edit <span className="text-purple-500">
              Event
            </span>
          </h1>


          <div className="space-y-6 mt-10">


            <input
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />


            <input
              value={newSlug}
              onChange={(e)=>setNewSlug(e.target.value)}
              placeholder="Slug"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />


            <textarea
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              placeholder="Description"
              className="w-full h-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />


            <input
              value={image}
              onChange={(e)=>setImage(e.target.value)}
              placeholder="Image URL"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />


            <input
              value={date}
              onChange={(e)=>setDate(e.target.value)}
              placeholder="Date"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />


            <input
              value={time}
              onChange={(e)=>setTime(e.target.value)}
              placeholder="Time"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
            />


            <input
              value={discord}
              onChange={(e)=>setDiscord(e.target.value)}
              placeholder="Discord Link"
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
              onClick={saveChanges}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold"
            >
              Save Changes
            </button>


          </div>


        </div>

      </section>

    </main>
  );
}