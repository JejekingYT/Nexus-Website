"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar({
  siteName = "Nexus",
}: {
  siteName?: string;
}) {

  const { data: session } = useSession();
  const router = useRouter();

  const [openProfile, setOpenProfile] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);


  const isAdmin =
    session?.user?.role === "OWNER" ||
    session?.user?.role === "ADMIN";


  const closeMobile = () => {
    setOpenMobile(false);
  };


  return (

    <nav className="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-md border-b border-purple-500/20 z-50">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">


        {/* Logo */}

        <Link
          href="/"
          className="text-2xl font-bold text-white"
        >
          {siteName}
        </Link>




        {/* Desktop */}

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


          <Link href="/contact" className="hover:text-purple-400 transition">
            Contact
          </Link>



          {!session ? (

            <button
              onClick={() => signIn("discord")}
              className="hover:text-purple-400 transition"
            >
              Login
            </button>

          ) : (


            <div className="relative">


              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="flex items-center gap-2"
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

                <div className="absolute right-0 mt-3 w-56 bg-[#111] border border-white/10 rounded-xl shadow-xl p-3">


                  <Link
                    href="/profile"
                    className="block px-4 py-3 rounded-lg hover:bg-white/10"
                  >
                    👤 Profile
                  </Link>



                  <Link
                    href="/profile/edit"
                    className="block px-4 py-3 rounded-lg hover:bg-white/10"
                  >
                    ⚙ Settings
                  </Link>



                  {isAdmin && (

                    <button
                      onClick={() => router.push("/admin")}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/10 text-purple-400"
                    >
                      🛠 Admin Panel
                    </button>

                  )}



                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-400"
                  >
                    🚪 Logout
                  </button>


                </div>

              )}


            </div>

          )}


        </div>





        {/* Mobile Button */}

        <button
          onClick={() => setOpenMobile(!openMobile)}
          className="md:hidden text-white text-3xl"
        >
          ☰
        </button>


      </div>





      {/* Mobile Menu */}

      {openMobile && (

        <div className="md:hidden bg-[#09090B] border-t border-purple-500/20 px-6 py-6">

          <div className="flex flex-col gap-5 text-gray-300">


            <Link href="/" onClick={closeMobile}>
              Home
            </Link>


            <Link href="/communities" onClick={closeMobile}>
              Communities
            </Link>


            <Link href="/games" onClick={closeMobile}>
              Games
            </Link>


            <Link href="/projects" onClick={closeMobile}>
              Projects
            </Link>


            <Link href="/news" onClick={closeMobile}>
              News
            </Link>


            <Link href="/events" onClick={closeMobile}>
              Events
            </Link>


            <Link href="/developers" onClick={closeMobile}>
              Developers
            </Link>


            <Link href="/contact" onClick={closeMobile}>
              Contact
            </Link>



            {!session ? (

              <button
                onClick={() => {
                  closeMobile();
                  signIn("discord");
                }}
              >
                Login
              </button>


            ) : (

              <>


                <Link href="/profile" onClick={closeMobile}>
                  👤 Profile
                </Link>


                <Link href="/profile/edit" onClick={closeMobile}>
                  ⚙ Settings
                </Link>



                {isAdmin && (

                  <button
                    onClick={() => router.push("/admin")}
                    className="text-left text-purple-400"
                  >
                    🛠 Admin Panel
                  </button>

                )}



                <button
                  onClick={() => signOut()}
                  className="text-left text-red-400"
                >
                  🚪 Logout
                </button>


              </>

            )}


          </div>

        </div>

      )}


    </nav>

  );
}