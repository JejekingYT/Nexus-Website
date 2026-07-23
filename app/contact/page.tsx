import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {

  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 pb-24 px-6">

        <div className="max-w-4xl mx-auto text-center">


          <h1 className="text-6xl font-extrabold">
            Contact <span className="text-purple-500">Nexus</span>
          </h1>


          <p className="text-gray-400 text-lg mt-6">
            Have questions, ideas, or want to work with us?
            Reach out through one of the options below.
          </p>



          <div className="grid md:grid-cols-2 gap-6 mt-16">


            {/* Discord */}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500 transition">


              <h2 className="text-3xl font-bold">
                💬 Discord
              </h2>


              <p className="text-gray-400 mt-4">
                Join our Discord community and contact our team directly.
              </p>


              <a
                href="https://discord.gg/M3e8gBUPws"
                target="_blank"
                className="inline-block mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold"
              >
                Join Discord
              </a>


            </div>




            {/* Email */}

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500 transition">


              <h2 className="text-3xl font-bold">
                📧 Email
              </h2>


              <p className="text-gray-400 mt-4">
                Send us an email for business inquiries or support.
              </p>


              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=nexuscommunityweb@gmail.com&su=Nexus%20Contact"
                target="_blank"
                className="inline-block mt-6 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-bold"
>
                Send Email
            </a>


            </div>


          </div>


        </div>


      </section>


      <Footer />

    </main>
  );
}