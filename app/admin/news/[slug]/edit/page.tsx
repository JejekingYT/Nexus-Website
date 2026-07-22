"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";

export default function EditNewsPage() {

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

      const res = await fetch(
        `/api/admin/news/${slug}`
      );

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

    }


    if (slug) {
      loadNews();
    }

  }, [slug, router]);



  async function saveChanges() {

    await fetch(
      `/api/admin/news/${slug}`,
      {
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
      }
    );


    alert("News updated!");

    router.push("/admin/news");
    router.refresh();

  }



  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />

      <section className="pt-32 px-6">

        <div className="max-w-3xl mx-auto">


          <h1 className="text-5xl font-extrabold">
            Edit <span className="text-purple-500">
              News
            </span>
          </h1>


          <div className="space-y-6 mt-10">


            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              placeholder="Title"
            />


            <input
              value={newsSlug}
              onChange={(e) => setNewsSlug(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              placeholder="Slug"
            />


            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-40 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              placeholder="Content"
            />


            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              placeholder="Image URL"
            />


            <label className="flex gap-3 items-center">

              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
              />

              Published

            </label>



            <button
              onClick={saveChanges}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-bold transition"
            >
              Save Changes
            </button>


          </div>


        </div>

      </section>

    </main>
  );
}