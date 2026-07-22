"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCommunityForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("Community");
  const [icon, setIcon] = useState("🌐");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [discord, setDiscord] = useState("");
  const [roblox, setRoblox] = useState("");
  const [about, setAbout] = useState("");


  async function createCommunity() {
    const res = await fetch("/api/admin/communities/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        slug,
        type,
        icon,
        image,
        description,
        discord,
        roblox,
        about,
      }),
    });


    if (!res.ok) {
      alert("Failed to create community.");
      return;
    }


    alert("Community created!");
    router.push("/admin/communities");
    router.refresh();
  }



  return (
    <div className="space-y-6 mt-10">


      <input
        placeholder="Community Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
      />


      <input
        placeholder="Slug (example: the-sanctuary)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
      />


      <input
        placeholder="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
      />


      <input
        placeholder="Icon"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
      />


      <input
        placeholder="/communities/nexus.png"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
      />


      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
      />


      <input
        placeholder="Discord Invite"
        value={discord}
        onChange={(e) => setDiscord(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
      />


      <input
        placeholder="Roblox Group"
        value={roblox}
        onChange={(e) => setRoblox(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
      />


      <textarea
        placeholder="About"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
      />


      <button
        onClick={createCommunity}
        className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold"
      >
        Create Community
      </button>


    </div>
  );
}