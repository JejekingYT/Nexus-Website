import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import Link from "next/link";


export default function PartnerApplySuccessPage() {


  return (

    <main className="min-h-screen bg-[#09090B] text-white">


      <Navbar />



      <section className="pt-40 pb-24 px-6">


        <div className="max-w-3xl mx-auto text-center">



          <div
            className="
            bg-white/5
            border
            border-white/10
            rounded-2xl
            p-10
            "
          >



            <div className="text-6xl mb-6">
              ✅
            </div>



            <h1 className="text-5xl font-extrabold">

              Application <span className="text-purple-500">
                Submitted
              </span>

            </h1>




            <p className="text-gray-400 text-lg mt-6">

              Thank you for applying to become a Nexus partner community.

              <br />

              Our team will review your application and notify you once a decision has been made.

            </p>




            <div className="flex justify-center gap-4 mt-8">


              <Link

                href="/communities"

                className="
                px-6
                py-3
                rounded-xl
                bg-purple-600
                hover:bg-purple-700
                font-bold
                "

              >

                View Communities

              </Link>




              <Link

                href="/"

                className="
                px-6
                py-3
                rounded-xl
                bg-white/10
                hover:bg-white/20
                font-bold
                "

              >

                Home

              </Link>


            </div>



          </div>


        </div>


      </section>



      <Footer />


    </main>

  );

}