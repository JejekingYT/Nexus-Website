"use client";

import { useRouter } from "next/navigation";

export default function DeleteEventButton({
  slug,
}: {
  slug: string;
}) {

  const router = useRouter();


  async function deleteEvent() {

    const confirmDelete = confirm(
      "Are you sure you want to delete this event?"
    );


    if (!confirmDelete) return;


    const res = await fetch(
      `/api/admin/events/${slug}`,
      {
        method: "DELETE",
      }
    );


    if (!res.ok) {
      alert("Failed to delete event");
      return;
    }


    alert("Event deleted!");

    router.refresh();

  }


  return (
    <button
      onClick={deleteEvent}
      className="border border-red-500 text-red-400 px-5 py-3 rounded-xl hover:bg-red-500/10"
    >
      Delete
    </button>
  );
}