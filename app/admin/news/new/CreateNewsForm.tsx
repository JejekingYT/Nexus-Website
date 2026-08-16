"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateNewsForm() {

  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  async function createNews() {

    const res = await fetch("/api/admin/news/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        slug,
        content,
        image,
      }),
    });


    if (!res.ok) {
      alert("Failed to create news");
      return;
    }


    alert("News created!");

    router.push("/admin/news");
    router.refresh();

  }


  return (
    <div className="space-y-6 mt-10">

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
      />


      <input
        placeholder="Slug (example: update-v1)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
      />


      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
      />


      <input
        placeholder="Image URL (optional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
      />


      <button
        onClick={createNews}
        className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold"
      >
        Create News
      </button>

    </div>
  );
}