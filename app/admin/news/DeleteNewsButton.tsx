"use client";

import { useRouter } from "next/navigation";

export default function DeleteNewsButton({
  slug,
}: {
  slug: string;
}) {

  const router = useRouter();


  async function deleteNews() {

    const confirmDelete = confirm(
      "Delete this news post?"
    );

    if (!confirmDelete) return;


    await fetch(
      `/api/admin/news/${slug}/delete`,
      {
        method: "DELETE",
      }
    );


    router.refresh();

  }


  return (
    <button
      onClick={deleteNews}
      className="border border-red-500 text-red-400 px-5 py-3 rounded-xl"
    >
      Delete
    </button>
  );
}