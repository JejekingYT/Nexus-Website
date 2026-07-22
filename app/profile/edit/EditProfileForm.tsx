"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function EditProfileForm({ user }: any) {

  const router = useRouter();


  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");



  async function saveProfile() {

    const res = await fetch("/api/profile/update", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        username,
        bio,
      }),

    });


    if (res.ok) {
      router.push("/profile");
      router.refresh();
    }

  }



  return (

    <div className="mt-10 space-y-6">


      <input
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
        placeholder="Username"
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
      />


      <textarea
        value={bio}
        onChange={(e)=>setBio(e.target.value)}
        placeholder="Bio"
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 h-32"
      />


      <button
        onClick={saveProfile}
        className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl font-bold"
      >
        Save Changes
      </button>


    </div>

  );
}