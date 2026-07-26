import Link from "next/link";


export default function Hero() {

  return (

    <section className="
      min-h-screen
      flex
      items-center
      justify-center
      px-6
      relative
      overflow-hidden
    ">


      {/* Background Effects */}

      <div className="
        absolute
        top-32
        left-1/2
        -translate-x-1/2
        w-125
        h-125
        bg-purple-600/20
        blur-[120px]
        rounded-full
      " />


      <div className="
        absolute
        bottom-20
        right-20
        w-72
        h-72
        bg-blue-500/10
        blur-[100px]
        rounded-full
      " />




      <div className="
        relative
        z-10
        text-center
        max-w-5xl
      ">



        <div className="
          inline-flex
          items-center
          gap-2
          px-5
          py-2
          rounded-full
          bg-white/5
          border
          border-white/10
          text-sm
          text-gray-300
          mb-8
        ">
          ✨ The future of communities
        </div>





        <h1 className="
          text-6xl
          md:text-8xl
          font-extrabold
          tracking-tight
          text-white
        ">

          Welcome to{" "}


          <span className="
            bg-linear-to-r
            from-purple-400
            to-blue-400
            bg-clip-text
            text-transparent
          ">
            Nexus
          </span>


        </h1>





        <p className="
          mt-8
          text-lg
          md:text-xl
          text-gray-400
          max-w-3xl
          mx-auto
          leading-relaxed
        ">
          One platform for communities, projects, events,
          and everything we create. Connect, discover,
          and build together.
        </p>





        <div className="
          mt-10
          flex
          justify-center
          gap-5
          flex-wrap
        ">



          <Link
            href="/communities"
            className="
              px-8
              py-4
              rounded-xl
              bg-linear-to-r
              from-purple-600
              to-blue-600
              font-bold
              text-white
              hover:scale-105
              transition
              shadow-lg
              shadow-purple-500/20
            "
          >
            Explore Communities
          </Link>





          <a
            href="https://discord.gg/M3e8gBUPws"
            target="_blank"
            rel="noopener noreferrer"
            className="
              px-8
              py-4
              rounded-xl
              border
              border-white/20
              bg-white/5
              backdrop-blur
              hover:bg-white/10
              hover:border-purple-500/50
              transition
              font-bold
              text-white
            "
          >
            Join Discord
          </a>



        </div>





        <div className="
          mt-16
          grid
          grid-cols-1
          md:grid-cols-3
          gap-5
          max-w-3xl
          mx-auto
        ">


          {[
            ["🌎", "Communities"],
            ["🚀", "Projects"],
            ["🎉", "Events"],
          ].map(([icon, text]) => (

            <div
              key={text}
              className="
                glass
                p-5
                rounded-2xl
                card-hover
              "
            >

              <div className="text-3xl">
                {icon}
              </div>


              <p className="
                mt-2
                text-gray-300
                font-medium
              ">
                {text}
              </p>

            </div>

          ))}


        </div>



      </div>


    </section>

  );

}