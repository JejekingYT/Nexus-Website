"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface Props {
  role: string;
}

export default function AdminSidebar({ role }: Props) {

  const pathname = usePathname();

  const [open, setOpen] = useState(false);



  const links = [

    {
      name: "📊 Dashboard",
      href: "/admin",
      roles: ["OWNER", "ADMIN", "MODERATOR"],
    },

    {
      name: "👥 Users",
      href: "/admin/users",
      roles: ["OWNER"],
    },

    {
      name: "📜 Activity Logs",
      href: "/admin/logs",
      roles: ["OWNER"],
    },

    {
      name: "🌐 Communities",
      href: "/admin/communities",
      roles: ["OWNER", "ADMIN"],
    },

    {
      name: "📰 News",
      href: "/admin/news",
      roles: ["OWNER", "ADMIN", "MODERATOR"],
    },

    {
      name: "🎉 Events",
      href: "/admin/events",
      roles: ["OWNER", "ADMIN", "MODERATOR"],
    },

    {
      name: "🎮 Games",
      href: "/admin/games",
      roles: ["OWNER", "ADMIN"],
    },

    {
      name: "📦 Projects",
      href: "/admin/projects",
      roles: ["OWNER", "ADMIN"],
    },

    {
      name: "👨‍💻 Developers",
      href: "/admin/developers",
      roles: ["OWNER"],
    },

    {
      name: "⚙️ Settings",
      href: "/admin/settings",
      roles: ["OWNER"],
    },

  ];



  const allowedLinks = links.filter((link) =>
    link.roles.includes(role)
  );



  return (

    <>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
        md:hidden
        fixed
        top-5
        left-5
        z-50
        bg-purple-600
        px-4
        py-2
        rounded-xl
        text-white
        font-bold
        "
      >
        ☰
      </button>



      {/* Overlay */}
      {open && (

        <div
          onClick={() => setOpen(false)}
          className="
          md:hidden
          fixed
          inset-0
          bg-black/60
          z-30
          "
        />

      )}



      <aside
        className={`
        fixed
        left-0
        top-0
        h-screen
        w-72
        bg-[#111111]
        border-r
        border-white/10
        pt-24
        px-6
        z-40
        transition-transform
        duration-300

        ${
          open
          ? "translate-x-0"
          : "-translate-x-full md:translate-x-0"
        }

        `}
      >


        <h2 className="text-2xl font-extrabold mb-8">

          Nexus
          <span className="text-purple-500">
            Admin
          </span>

        </h2>



        <nav className="space-y-2">


          {allowedLinks.map((link) => (

            <Link

              key={link.href}

              href={link.href}

              onClick={() => setOpen(false)}

              className={`

              flex
              items-center
              px-4
              py-3
              rounded-xl
              font-medium
              transition-all


              ${
                pathname === link.href
                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
              }

              `}

            >

              {link.name}

            </Link>

          ))}


        </nav>




        <div className="absolute bottom-8 left-6">


          <p className="text-gray-500 text-sm">
            Current Role
          </p>


          <p className="text-purple-400 font-bold">
            {role}
          </p>


        </div>



      </aside>


    </>

  );

}