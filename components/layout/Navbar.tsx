"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {

  const { data: session } = useSession();
  const router = useRouter();

  const [openProfile, setOpenProfile] = useState(false);


  const isAdmin =
  session?.user?.role === "OWNER" ||
  session?.user?.role === "ADMIN";



  return (
    <nav className="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-md border-b border-purple-500/20 z-50">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">


        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white">
          Nex<span className="text-purple-500">us</span>
        </Link>



        {/* Navigation */}
        <div className="hidden md:flex gap-8 text-gray-300 font-medium">


          <Link href="/" className="hover:text-purple-400 transition">
            Home
          </Link>


          <Link href="/communities" className="hover:text-purple-400 transition">
            Communities
          </Link>


          <Link href="/games" className="hover:text-purple-400 transition">
            Games
          </Link>


          <Link href="/projects" className="hover:text-purple-400 transition">
            Projects
          </Link>


          <Link href="/news" className="hover:text-purple-400 transition">
            News
          </Link>


          <Link href="/events" className="hover:text-purple-400 transition">
            Events
          </Link>


          <Link href="/developers" className="hover:text-purple-400 transition">
            Developers
          </Link>



          {!session ? (

            <button
              onClick={() => signIn("discord")}
              className="hover:text-purple-400 transition"
            >
              Login
            </button>

          ) : (

            <div className="flex items-center gap-4 relative">


              <div className="relative">


                <button
                  onClick={() => setOpenProfile(!openProfile)}
                  className="flex items-center gap-2 hover:opacity-80 transition"
                >

                  {session.user.image && (

                    <img
                      src={session.user.image}
                      alt="Profile"
                      className="w-9 h-9 rounded-full border border-purple-500"
                    />

                  )}


                  <span className="text-white">
                    {session.user.name}
                  </span>


                </button>



                {openProfile && (

                  <div className="absolute right-0 mt-3 w-56 bg-[#111111] border border-white/10 rounded-xl shadow-xl p-3">


                    <Link
                      href="/profile"
                      className="block px-4 py-3 rounded-lg hover:bg-white/10 transition"
                    >
                      👤 Profile
                    </Link>



                    <Link
                      href="/profile/edit"
                      className="block px-4 py-3 rounded-lg hover:bg-white/10 transition"
                    >
                      ⚙ Settings
                    </Link>



                    {isAdmin && (

                      <button
                        onClick={() => router.push("/admin")}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 transition text-purple-400"
                      >
                        🛠 Admin Panel
                      </button>

                    )}



                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-500/10 transition text-red-400"
                    >
                      🚪 Logout
                    </button>


                  </div>

                )}


              </div>


            </div>

          )}


        </div>


      </div>

    </nav>
  );
}