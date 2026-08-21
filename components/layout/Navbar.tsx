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
  const [openCommunities, setOpenCommunities] = useState(false);


  const isAdmin =
    session?.user?.role === "OWNER" ||
    session?.user?.role === "ADMIN";


  const isSupport =
    session?.user?.role === "SUPPORT";


  const openAdmin = () => {
    if (isSupport) {
      router.push("/admin/support");
      return;
    }

    router.push("/admin");
  };


  const closeMobile = () => {
    setOpenMobile(false);
  };


  const navLink =
    "transition hover:text-purple-400 duration-200";


  return (

    <nav className="
      fixed
      top-0
      left-0
      w-full
      z-50
      bg-black/30
      backdrop-blur-xl
      border-b
      border-white/10
    ">

      <div className="
        max-w-7xl
        mx-auto
        flex
        items-center
        px-6
        py-4
      ">


        <Link
          href="/"
          className="
            text-2xl
            font-bold
            bg-linear-to-r
            from-purple-400
            to-blue-400
            bg-clip-text
            text-transparent
          "
        >
          {siteName}
        </Link>



        <div className="
          hidden
          md:flex
          items-center
          gap-7
          ml-7
          text-gray-300
          font-medium
        ">


          <Link
            href="/"
            className="
              text-2xl
              font-bold
              text-gray-300
              transition
              duration-200
              hover:text-purple-400
            "
          >
            Home
          </Link>



          <div className="relative">

            <button
              onClick={() => setOpenCommunities(!openCommunities)}
              className={navLink}
            >
              Communities ▾
            </button>


            {openCommunities && (

              <div className="
                absolute
                top-10
                left-0
                w-64
                rounded-2xl
                bg-[#111827]/95
                backdrop-blur-xl
                border
                border-white/10
                shadow-2xl
                overflow-hidden
              ">


                <Link
                  href="/communities"
                  className="
                    block
                    px-5
                    py-4
                    hover:bg-white/10
                    transition
                  "
                >
                  🏛 Nexus Communities
                </Link>


                <Link
                  href="/partners"
                  className="
                    block
                    px-5
                    py-4
                    hover:bg-white/10
                    transition
                  "
                >
                  🤝 Partner Communities
                </Link>


                <Link
                  href="/partners/apply"
                  className="
                    block
                    px-5
                    py-4
                    text-purple-400
                    hover:bg-purple-500/10
                  "
                >
                  ✨ Become a Partner
                </Link>


              </div>

            )}

          </div>



          {[
            ["Games","/games"],
            ["Projects","/projects"],
            ["News","/news"],
            ["Events","/events"],
            ["Badges","/badges"],
            ["Developers","/developers"],
            ["Members","/members"],
            ["Hall of Fame","/hall-of-fame"],
            ["Contact","/contact"],
            ["Support","/support"],
          ].map(([name,path]) => (

            <Link
              key={path}
              href={path}
              className={navLink}
            >
              {name}
            </Link>

          ))}




          {!session ? (

            <button
              onClick={() => signIn("discord")}
              className="
                px-5
                py-2
                rounded-xl
                bg-purple-600
                hover:bg-purple-500
                transition
                text-white
              "
            >
              Login
            </button>


          ) : (

            <div className="relative">


              <button
                onClick={() => setOpenProfile(!openProfile)}
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                {session.user.image && (

                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="
                      w-10
                      h-10
                      rounded-full
                      border
                      border-purple-500/50
                    "
                  />

                )}

                <span className="text-white">
                  {session.user.name}
                </span>

              </button>



              {openProfile && (

                <div className="
                  absolute
                  right-0
                  mt-4
                  w-60
                  rounded-2xl
                  bg-[#111827]
                  border
                  border-white/10
                  shadow-xl
                  p-3
                ">


                  <Link
                    href="/profile"
                    className="
                      block
                      px-4
                      py-3
                      rounded-xl
                      hover:bg-white/10
                    "
                  >
                    👤 Profile
                  </Link>


                  <Link
                    href="/profile/edit"
                    className="
                      block
                      px-4
                      py-3
                      rounded-xl
                      hover:bg-white/10
                    "
                  >
                    ⚙ Settings
                  </Link>


                  {(isAdmin || isSupport) && (

                    <button
                      onClick={openAdmin}
                      className="
                        w-full
                        text-left
                        px-4
                        py-3
                        rounded-xl
                        text-purple-400
                        hover:bg-purple-500/10
                      "
                    >
                      🛠 Admin Panel
                    </button>

                  )}


                  <button
                    onClick={() => signOut()}
                    className="
                      w-full
                      text-left
                      px-4
                      py-3
                      rounded-xl
                      text-red-400
                      hover:bg-red-500/10
                    "
                  >
                    🚪 Logout
                  </button>


                </div>

              )}


            </div>

          )}

        </div>



        <button
          onClick={() => setOpenMobile(!openMobile)}
          className="
            md:hidden
            text-3xl
            text-white
          "
        >
          ☰
        </button>


      </div>



      {openMobile && (

        <div className="
          md:hidden
          bg-black/70
          backdrop-blur-xl
          border-t
          border-white/10
          px-6
          py-6
        ">


          <div className="
            flex
            flex-col
            gap-5
            text-gray-300
          ">

            <Link href="/" onClick={closeMobile}>
              Home
            </Link>


            {[
              ["Communities","/communities"],
              ["Games","/games"],
              ["Projects","/projects"],
              ["News","/news"],
              ["Events","/events"],
              ["Badges","/badges"],
              ["Developers","/developers"],
              ["Members","/members"],
              ["🏆 Hall of Fame","/hall-of-fame"],
              ["Contact","/contact"],
              ["Support","/support"],
            ].map(([name,path]) => (

              <Link
                key={path}
                href={path}
                onClick={closeMobile}
              >
                {name}
              </Link>

            ))}



            {!session ? (

              <button
                onClick={() => {
                  closeMobile();
                  signIn("discord");
                }}
                className="text-left"
              >
                Login
              </button>

            ) : (

              <>

                <Link href="/profile">
                  👤 Profile
                </Link>


                <Link href="/profile/edit">
                  ⚙ Settings
                </Link>


                {(isAdmin || isSupport) && (

                  <button
                    onClick={openAdmin}
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