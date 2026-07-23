import { getSiteSettings } from "@/lib/settings";

export default async function Footer() {

  const settings = await getSiteSettings();


  return (
    <footer className="border-t border-white/10 py-8 text-center text-gray-400">


      <p>
        © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
      </p>



      <div className="flex justify-center gap-6 mt-5">


        {settings.discord && (
          <a
            href={settings.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition"
          >
            Discord
          </a>
        )}



        {settings.github && (
          <a
            href={settings.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition"
          >
            GitHub
          </a>
        )}



        {settings.youtube && (
          <a
            href={settings.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 transition"
          >
            YouTube
          </a>
        )}


      </div>


    </footer>
  );
}