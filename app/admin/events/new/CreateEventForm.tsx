"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEventForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [discord, setDiscord] = useState("");
  const [published, setPublished] = useState(false);
  const [creating, setCreating] = useState(false);

  async function createEvent() {
    setCreating(true);

    try {
      const res = await fetch("/api/admin/events", {
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
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);

        alert(data?.error || "Failed to create event");
        return;
      }

      alert("Event created!");

      router.push("/admin/events");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating the event.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6 mt-10">
      <input
        placeholder="Event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
      />

      <input
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full h-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
      />

      <input
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
      />

      <input
        placeholder="Date (example: 25/12/2026)"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
      />

      <input
        placeholder="Time (example: 18:00)"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
      />

      <input
        placeholder="Discord Event Link"
        value={discord}
        onChange={(e) => setDiscord(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-purple-500"
      />

      <label className="flex gap-3 items-center">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-5 h-5 accent-purple-600"
        />

        Published
      </label>

      <button
        onClick={createEvent}
        disabled={creating}
        className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {creating ? "Creating..." : "Create Event"}
      </button>
    </div>
  );
}