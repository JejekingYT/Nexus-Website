import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SupportPage() {

  const user = await getCurrentUser();


  if (!user) {
    redirect("/api/auth/signin");
  }



  const tickets = await prisma.supportTicket.findMany({

    where: {
      userId: user.id,
    },

    orderBy: {
      updatedAt: "desc",
    },

  });



  async function createTicket(formData: FormData) {
    "use server";


    const subject = formData.get("subject") as string;
    const category = formData.get("category") as string;
    const message = formData.get("message") as string;



    const ticket = await prisma.supportTicket.create({

      data: {

        subject,

        category,

        userId: user.id,

        messages: {

          create: {

            message,

            senderId: user.id,

          },

        },

      },

    });



    redirect(`/support/${ticket.id}`);

  }



  return (

    <main className="min-h-screen bg-[#09090B] text-white">


      <Navbar />


      <section className="pt-32 pb-24 px-6">


        <div className="max-w-4xl mx-auto">



          <h1 className="text-5xl font-extrabold">

            Nexus <span className="text-purple-500">
              Support
            </span>

          </h1>



          <p className="text-gray-400 mt-4">
            Need help? Create a ticket and our staff will assist you.
          </p>




          {/* Create Ticket */}

          <form
            action={createTicket}
            className="
            mt-12
            space-y-6
            bg-white/5
            border
            border-white/10
            rounded-2xl
            p-8
            "
          >



            <input
              name="subject"
              required
              placeholder="Subject"
              className="
              w-full
              bg-black/30
              border
              border-white/10
              rounded-xl
              px-5
              py-4
              "
            />



            <select
              name="category"
              className="
              w-full
              bg-black/30
              border
              border-white/10
              rounded-xl
              px-5
              py-4
              "
            >

              <option>
                Technical Issue
              </option>

              <option>
                Account Help
              </option>

              <option>
                Community Question
              </option>

              <option>
                Report
              </option>


            </select>




            <textarea
              name="message"
              required
              placeholder="Describe your problem..."
              className="
              w-full
              h-40
              bg-black/30
              border
              border-white/10
              rounded-xl
              px-5
              py-4
              "
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

              Create Ticket

            </button>


          </form>





          {/* Existing Tickets */}

          <h2 className="text-3xl font-bold mt-16">
            Your Tickets
          </h2>



          <div className="mt-8 space-y-5">


            {tickets.length === 0 && (

              <p className="text-gray-400">
                You have no support tickets yet.
              </p>

            )}




            {tickets.map((ticket) => (

              <div
                key={ticket.id}
                className="
                bg-white/5
                border
                border-white/10
                rounded-2xl
                p-6
                "
              >


                <h3 className="text-xl font-bold">
                  {ticket.subject}
                </h3>


                <p className="text-purple-400 mt-2">
                  {ticket.category}
                </p>


                <p
                  className={
                    ticket.status === "OPEN"
                    ? "text-green-400 mt-2"
                    : "text-red-400 mt-2"
                  }
                >

                  {ticket.status}

                </p>



                <Link
                  href={`/support/${ticket.id}`}
                  className="
                  inline-block
                  mt-5
                  bg-purple-600
                  hover:bg-purple-700
                  px-5
                  py-3
                  rounded-xl
                  font-bold
                  "
                >

                  Open Ticket

                </Link>


              </div>


            ))}


          </div>



        </div>


      </section>


      <Footer />


    </main>

  );

}