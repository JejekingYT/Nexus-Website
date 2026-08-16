"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({
  slug,
}: {
  slug: string;
}) {
  const router = useRouter();

  async function deleteCommunity() {
    const confirmDelete = confirm(
      "Are you sure you want to delete this community?"
    );

    if (!confirmDelete) return;

    await fetch(`/api/admin/communities/${slug}/delete`, {
      method: "DELETE",
    });

    router.refresh();
  }

  return (
    <button
      onClick={deleteCommunity}
      className="border border-red-500 text-red-400 px-5 py-3 rounded-xl"
    >
      Delete
    </button>
  );
}