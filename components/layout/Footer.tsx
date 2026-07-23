import { getSiteSettings } from "@/lib/settings";

export default async function Footer() {

  const settings = await getSiteSettings();


  return (
    <footer className="border-t border-white/10 py-8 text-center text-gray-400">


      <p>
        © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
      </p>



      <div className="flex justify-center gap-5 mt-6">


        {settings.discord && (
          <a
            href={settings.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition"
          >

            <img
              src="/discord.png"
              alt="Discord"
              className="w-8 h-8"
            />

          </a>
        )}



        {settings.github && (
          <a
            href={settings.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition"
          >

            <img
              src="/github.png"
              alt="GitHub"
              className="w-8 h-8"
            />

          </a>
        )}




        {settings.youtube && (
          <a
            href={settings.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition"
          >

            <img
              src="/youtube.png"
              alt="YouTube"
              className="w-8 h-8"
            />

          </a>
        )}


      </div>


    </footer>
  );
}