"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteUserButton({
userId,
username,
}: {
userId: number;
username: string;
}) {
const router = useRouter();

const [deleting, setDeleting] = useState(false);

async function deleteUser() {
const confirmed = window.confirm(
`Are you sure you want to permanently delete "${username}"?\n\nThis cannot be undone.`
);

if (!confirmed) {
  return;
}

setDeleting(true);

try {
  const response = await fetch(
    "/api/admin/users/delete",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    alert(
      data.error ||
        "Failed to delete the user."
    );

    setDeleting(false);
    return;
  }

  router.refresh();
} catch (error) {
  console.error(
    "DELETE USER ERROR:",
    error
  );

  alert(
    "Something went wrong while deleting the user."
  );

  setDeleting(false);
}

}

return ( <button
   type="button"
   onClick={deleteUser}
   disabled={deleting}
   className="
     mt-4
     w-full
     bg-red-600/20
     hover:bg-red-600
     border
     border-red-500/30
     hover:border-red-500
     text-red-400
     hover:text-white
     px-5
     py-3
     rounded-xl
     font-bold
     transition
     disabled:opacity-50
     disabled:cursor-not-allowed
   "
 >
{deleting
? "Deleting..."
: "🗑️ Delete User"} </button>
);
}
