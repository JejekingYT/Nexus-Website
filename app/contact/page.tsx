import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";


export default function ContactPage() {


  return (

    <main className="min-h-screen text-white">


      <Navbar />





      <section className="
        pt-32
        pb-24
        px-6
      ">



        <div className="
          max-w-5xl
          mx-auto
          text-center
        ">





          <h1 className="
            text-5xl
            md:text-6xl
            font-extrabold
          ">

            Contact{" "}

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
            text-gray-400
            text-lg
            mt-6
            max-w-2xl
            mx-auto
          ">

            Have questions, ideas, or want to work with us?
            Reach out to the Nexus team.

          </p>









          <div className="
            grid
            md:grid-cols-2
            gap-8
            mt-16
          ">







            {/* Discord */}


            <div className="
              glass
              card-hover
              p-8
            ">



              <div className="
                w-16
                h-16
                mx-auto
                rounded-2xl
                bg-purple-500/20
                flex
                items-center
                justify-center
                text-3xl
              ">

                💬

              </div>





              <h2 className="
                text-3xl
                font-bold
                mt-6
              ">

                Discord

              </h2>





              <p className="
                text-gray-400
                mt-4
              ">

                Join our Discord community and talk directly with the Nexus team.

              </p>






              <a

                href="https://discord.gg/M3e8gBUPws"

                target="_blank"

                rel="noopener noreferrer"

                className="
                  inline-block
                  mt-7
                  px-7
                  py-3
                  rounded-xl
                  bg-linear-to-r
                  from-purple-600
                  to-blue-600
                  font-bold
                  hover:scale-105
                  transition
                "

              >

                Join Discord

              </a>





            </div>









            {/* Email */}



            <div className="
              glass
              card-hover
              p-8
            ">



              <div className="
                w-16
                h-16
                mx-auto
                rounded-2xl
                bg-blue-500/20
                flex
                items-center
                justify-center
                text-3xl
              ">

                📧

              </div>






              <h2 className="
                text-3xl
                font-bold
                mt-6
              ">

                Email

              </h2>







              <p className="
                text-gray-400
                mt-4
              ">

                Contact us for partnerships, support, or business inquiries.

              </p>







              <a

                href="https://mail.google.com/mail/?view=cm&fs=1&to=nexuscommunityweb@gmail.com&su=Nexus%20Contact"

                target="_blank"

                rel="noopener noreferrer"

                className="
                  inline-block
                  mt-7
                  px-7
                  py-3
                  rounded-xl
                  bg-linear-to-r
                  from-purple-600
                  to-blue-600
                  font-bold
                  hover:scale-105
                  transition
                "

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