"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RoleSelector({
  userId,
  role,
}: {
  userId: number;
  role: string;
}) {

  const router = useRouter();
  const [loading, setLoading] = useState(false);


  async function updateRole(newRole: string) {

    if (newRole === role) return;


    const confirmChange = confirm(
      `Change role from ${role} to ${newRole}?`
    );


    if (!confirmChange) {
      return;
    }


    setLoading(true);


    const res = await fetch("/api/admin/users/role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        userId,
        role: newRole,
      }),
    });


    setLoading(false);


    if (!res.ok) {
      alert("Failed to update role.");
      return;
    }


    router.refresh();

  }



  return (
    <select
      disabled={loading}
      value={role}
      onChange={(e) => updateRole(e.target.value)}
      className="
        bg-[#18181B]
        border
        border-white/10
        rounded-lg
        px-3
        py-2
        text-white
        disabled:opacity-50
      "
    >

      <option value="USER">
        USER
      </option>


      <option value="SUPPORT">
        SUPPORT
      </option>


      <option value="MODERATOR">
        MODERATOR
      </option>


      <option value="ADMIN">
        ADMIN
      </option>


      <option value="OWNER">
        OWNER
      </option>


    </select>
  );
}