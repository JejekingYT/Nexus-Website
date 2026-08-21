"use client";

import { useState } from "react";

type StaffMember = {
  name: string;
  role: string;
  image: string;
};

export default function EditCommunityForm({
  community,
}: {
  community: any;
}) {
  const [name, setName] = useState(community.name ?? "");

  const [description, setDescription] = useState(
    community.description ?? ""
  );

  const [discord, setDiscord] = useState(
    community.discord ?? ""
  );

  const [roblox, setRoblox] = useState(
    community.roblox ?? ""
  );

  const [staff, setStaff] = useState<StaffMember[]>(
    Array.isArray(community.staff)
      ? community.staff
      : []
  );

  const [saving, setSaving] = useState(false);

  function addStaffMember() {
    setStaff([
      ...staff,
      {
        name: "",
        role: "",
        image: "",
      },
    ]);
  }

  function updateStaffMember(
    index: number,
    field: keyof StaffMember,
    value: string
  ) {
    const updatedStaff = [...staff];

    updatedStaff[index] = {
      ...updatedStaff[index],
      [field]: value,
    };

    setStaff(updatedStaff);
  }

  function removeStaffMember(index: number) {
    setStaff(
      staff.filter((_, i) => i !== index)
    );
  }

  async function saveChanges() {
    setSaving(true);

    try {
      const res = await fetch(
        `/api/admin/communities/${community.slug}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            discord,
            roblox,
            staff,
          }),
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.error || "Failed updating community"
        );
      }

      alert("Community updated!");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-5xl font-extrabold">
        Edit{" "}
        <span className="text-purple-500">
          {community.name}
        </span>
      </h1>

      <p className="text-gray-400 mt-4">
        Update the information for this community.
      </p>

      <div className="mt-10 space-y-6">

        {/* NAME */}

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
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
              transition
            "
          />
        </div>


        {/* DESCRIPTION */}

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="
              w-full
              min-h-40
              bg-white/5
              border
              border-white/10
              rounded-xl
              px-4
              py-3
              outline-none
              focus:border-purple-500
              transition
              resize-y
            "
          />
        </div>


        {/* DISCORD */}

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Discord Invite
          </label>

          <input
            value={discord}
            onChange={(e) =>
              setDiscord(e.target.value)
            }
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
              transition
            "
          />
        </div>


        {/* ROBLOX */}

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Roblox Group
          </label>

          <input
            value={roblox}
            onChange={(e) =>
              setRoblox(e.target.value)
            }
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
              transition
            "
          />
        </div>


        {/* STAFF TEAM */}

        <div className="pt-6 border-t border-white/10">

          <div className="
            flex
            items-center
            justify-between
            mb-5
          ">
            <div>
              <h2 className="text-2xl font-bold">
                Staff Team
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Add and manage members of this community's staff team.
              </p>
            </div>

            <button
              type="button"
              onClick={addStaffMember}
              className="
                bg-purple-600
                hover:bg-purple-700
                px-4
                py-2
                rounded-xl
                font-medium
                transition
              "
            >
              + Add Member
            </button>
          </div>


          <div className="space-y-4">

            {staff.length === 0 && (

              <div className="
                border
                border-dashed
                border-white/10
                rounded-xl
                p-6
                text-center
                text-gray-400
              ">
                No staff members added yet.
              </div>

            )}


            {staff.map((member, index) => (

              <div
                key={index}
                className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-2xl
                  p-5
                  space-y-4
                "
              >

                <div className="
                  flex
                  items-center
                  justify-between
                ">
                  <span className="font-bold">
                    Staff Member #{index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      removeStaffMember(index)
                    }
                    className="
                      text-red-400
                      hover:text-red-300
                      transition
                    "
                  >
                    Remove
                  </button>
                </div>


                <div>
                  <label className="
                    block
                    text-sm
                    text-gray-400
                    mb-2
                  ">
                    Name
                  </label>

                  <input
                    value={member.name}
                    onChange={(e) =>
                      updateStaffMember(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Username or display name"
                    className="
                      w-full
                      bg-black/20
                      border
                      border-white/10
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:border-purple-500
                    "
                  />
                </div>


                <div>
                  <label className="
                    block
                    text-sm
                    text-gray-400
                    mb-2
                  ">
                    Role
                  </label>

                  <input
                    value={member.role}
                    onChange={(e) =>
                      updateStaffMember(
                        index,
                        "role",
                        e.target.value
                      )
                    }
                    placeholder="Founder, Admin, Moderator..."
                    className="
                      w-full
                      bg-black/20
                      border
                      border-white/10
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:border-purple-500
                    "
                  />
                </div>


                <div>
                  <label className="
                    block
                    text-sm
                    text-gray-400
                    mb-2
                  ">
                    Profile Image URL
                  </label>

                  <input
                    value={member.image}
                    onChange={(e) =>
                      updateStaffMember(
                        index,
                        "image",
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                    className="
                      w-full
                      bg-black/20
                      border
                      border-white/10
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:border-purple-500
                    "
                  />
                </div>

              </div>

            ))}

          </div>

        </div>


        {/* SAVE */}

        <button
          disabled={saving}
          onClick={saveChanges}
          className="
            bg-purple-600
            hover:bg-purple-700
            px-8
            py-4
            rounded-xl
            font-bold
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
          "
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>

      </div>
    </div>
  );
}