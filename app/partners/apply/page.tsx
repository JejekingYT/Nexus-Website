import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { createPartnerApplication } from "./actions";


export default function PartnerApplyPage() {


  return (

    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />


      <section className="pt-32 pb-24 px-6">


        <div className="max-w-3xl mx-auto">


          <h1 className="text-5xl font-extrabold text-center">

            Partner <span className="text-purple-500">
              Application
            </span>

          </h1>


          <p className="text-gray-400 text-center mt-4">

            Apply to become an official Nexus partner community.

          </p>



          <form

            action={createPartnerApplication}

            className="
            mt-12
            bg-white/5
            border
            border-white/10
            rounded-2xl
            p-8
            space-y-5
            "

          >


            <input
              name="name"
              required
              placeholder="Community Name"
              className="input"
            />


            <input
              name="slug"
              required
              placeholder="Community Slug"
              className="input"
            />


            <input
              name="ownerName"
              required
              placeholder="Owner / Representative Name"
              className="input"
            />


            <input
              name="email"
              type="email"
              required
              placeholder="Contact Email"
              className="input"
            />


            <input
              name="logo"
              required
              placeholder="Logo URL"
              className="input"
            />


            <input
              name="banner"
              placeholder="Banner URL"
              className="input"
            />


            <input
              name="members"
              type="number"
              placeholder="Community Members"
              className="input"
            />



            <textarea

              name="description"

              required

              placeholder="Tell us about your community"

              className="
              input
              h-32
              "

            />



            <textarea

              name="reason"

              required

              placeholder="Why do you want to partner with Nexus?"

              className="
              input
              h-32
              "

            />



            <input
              name="discord"
              placeholder="Discord Invite"
              className="input"
            />



            <input
              name="website"
              placeholder="Website"
              className="input"
            />



            <input
              name="roblox"
              placeholder="Roblox Group"
              className="input"
            />


            <input
              name="socials"
              placeholder="Social Links (YouTube, Twitter, TikTok...)"
              className="input"
            />



            <button

              className="
              bg-purple-600
              hover:bg-purple-700
              px-8
              py-4
              rounded-xl
              font-bold
              "

            >

              Submit Application

            </button>


          </form>


        </div>


      </section>


      <Footer />

    </main>

  );

}