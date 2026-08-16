import { getSiteSettings } from "@/lib/settings";


export default async function Footer() {

  const settings = await getSiteSettings();


  return (

    <footer className="
      mt-20
      border-t
      border-white/10
      bg-black/20
      backdrop-blur-xl
      py-10
    ">


      <div className="
        max-w-7xl
        mx-auto
        px-6
        flex
        flex-col
        items-center
        gap-6
      ">


        <div className="
          text-center
        ">

          <h3 className="
            text-2xl
            font-bold
            bg-linear-to-r
            from-purple-400
            to-blue-400
            bg-clip-text
            text-transparent
          ">
            {settings.siteName}
          </h3>


          <p className="
            mt-2
            text-gray-400
            text-sm
          ">
            Connecting communities, gamers, and creators.
          </p>

        </div>




        <div className="
          flex
          gap-4
        ">


          {settings.discord && (

            <a
              href={settings.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-12
                h-12
                flex
                items-center
                justify-center
                rounded-xl
                bg-white/5
                border
                border-white/10
                hover:bg-purple-500/20
                hover:border-purple-500/50
                hover:-translate-y-1
                transition
              "
            >

              <img
                src="/discord.png"
                alt="Discord"
                className="w-7 h-7"
              />

            </a>

          )}






          {settings.github && (

            <a
              href={settings.github}
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-12
                h-12
                flex
                items-center
                justify-center
                rounded-xl
                bg-white/5
                border
                border-white/10
                hover:bg-purple-500/20
                hover:border-purple-500/50
                hover:-translate-y-1
                transition
              "
            >

              <img
                src="/github.png"
                alt="GitHub"
                className="w-7 h-7"
              />

            </a>

          )}






          {settings.youtube && (

            <a
              href={settings.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-12
                h-12
                flex
                items-center
                justify-center
                rounded-xl
                bg-white/5
                border
                border-white/10
                hover:bg-purple-500/20
                hover:border-purple-500/50
                hover:-translate-y-1
                transition
              "
            >

              <img
                src="/youtube.png"
                alt="YouTube"
                className="w-7 h-7"
              />

            </a>

          )}


        </div>





        <p className="
          text-gray-500
          text-sm
          text-center
        ">
          © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
        </p>


      </div>


    </footer>

  );
}