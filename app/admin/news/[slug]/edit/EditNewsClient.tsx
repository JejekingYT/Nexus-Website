"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditNewsClient() {
const router = useRouter();
const params = useParams();

const slug = params.slug as string;

const [title, setTitle] = useState("");
const [newsSlug, setNewsSlug] = useState("");
const [content, setContent] = useState("");
const [image, setImage] = useState("");
const [published, setPublished] = useState(false);

useEffect(() => {
async function loadNews() {
try {
const res = await fetch(`/api/admin/news/${slug}`);
const data = await res.json();

    if (!data.news) {
      alert("News not found");
      router.push("/admin/news");
      return;
    }

    setTitle(data.news.title);
    setNewsSlug(data.news.slug);
    setContent(data.news.content);
    setImage(data.news.image || "");
    setPublished(data.news.published);
  } catch (error) {
    console.error("LOAD NEWS ERROR:", error);
    alert("Failed to load news.");
    router.push("/admin/news");
  }
}

if (slug) {
  loadNews();
}

}, [slug, router]);

async function saveChanges() {
try {
const res = await fetch(`/api/admin/news/${slug}`, {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
title,
slug: newsSlug,
content,
image,
published,
}),
});

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Failed to update news.");
    return;
  }

  alert("News updated!");

  router.push("/admin/news");
  router.refresh();
} catch (error) {
  console.error("SAVE NEWS ERROR:", error);
  alert("Something went wrong while updating the news.");
}

}

return ( <section className="pt-32 pb-24 px-6"> <div className="max-w-3xl mx-auto"> <h1 className="text-5xl font-extrabold">
Edit{" "} <span className="text-purple-500">
News </span> </h1>

    <div className="space-y-6 mt-10">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="
          w-full
          bg-white/5
          border
          border-white/10
          rounded-xl
          px-4
          py-3
          outline-none
          focus:border-purple-500
        "
        placeholder="Title"
      />

      <input
        value={newsSlug}
        onChange={(e) => setNewsSlug(e.target.value)}
        className="
          w-full
          bg-white/5
          border
          border-white/10
          rounded-xl
          px-4
          py-3
          outline-none
          focus:border-purple-500
        "
        placeholder="Slug"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="
          w-full
          h-40
          bg-white/5
          border
          border-white/10
          rounded-xl
          px-4
          py-3
          outline-none
          focus:border-purple-500
          resize-none
        "
        placeholder="Content"
      />

      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="
          w-full
          bg-white/5
          border
          border-white/10
          rounded-xl
          px-4
          py-3
          outline-none
          focus:border-purple-500
        "
        placeholder="Image URL"
      />

      <label className="flex gap-3 items-center cursor-pointer">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-4 h-4"
        />

        <span>Published</span>
      </label>

      <button
        onClick={saveChanges}
        className="
          bg-purple-600
          hover:bg-purple-700
          px-8
          py-4
          rounded-xl
          font-bold
          transition
        "
      >
        Save Changes
      </button>
    </div>
  </div>
</section>

);
}
