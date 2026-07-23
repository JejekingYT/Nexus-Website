"use client";

import { useSession, signOut } from "next-auth/react";

export default function AdminTopbar() {

  const { data: session } = useSession();


  return (
    <header
      className="
      fixed
      top-0
      right-0
      left-0
      md:left-72
      h-20
      bg-[#09090B]/80
      backdrop-blur-md
      border-b
      border-white/10
      z-40
      flex
      items-center
      justify-between
      px-6
      md:px-8
      "
    >


      <div>

        <h2 className="text-xl font-bold">
          Nexus Admin
        </h2>

        <p className="text-gray-400 text-sm">
          Control panel
        </p>

      </div>



      <div className="flex items-center gap-4">


        {session?.user?.image && (

          <img
            src={session.user.image}
            alt="Profile"
            className="
            w-10
            h-10
            rounded-full
            border
            border-purple-500
            "
          />

        )}



        <div className="hidden md:block">

          <p className="text-white font-medium">
            {session?.user?.name}
          </p>


          <p className="text-purple-400 text-sm">
            Administrator
          </p>

        </div>



        <button

          onClick={() => signOut()}

          className="
          ml-2
          md:ml-4
          px-4
          py-2
          rounded-xl
          bg-red-500/10
          text-red-400
          hover:bg-red-500/20
          transition
          "

        >

          Logout

        </button>


      </div>


    </header>
  );
}