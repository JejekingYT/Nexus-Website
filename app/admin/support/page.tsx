import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { updateTicketStatus } from "./actions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";


export default async function AdminSupportPage() {


  const currentUser = await requireRole([
    "OWNER",
    "ADMIN",
    "SUPPORT",
  ]);



  const canManageStatus =
    currentUser.role === "OWNER" ||
    currentUser.role === "ADMIN";




  const tickets = await prisma.supportTicket.findMany({

    include: {

      user: true,

      messages: true,

    },

    orderBy: {

      updatedAt: "desc",

    },

  });






  return (

    <main className="min-h-screen bg-[#09090B] text-white">


      <Navbar />



      <section className="pt-32 pb-24 px-6">


        <div className="max-w-6xl mx-auto">



          <h1 className="text-5xl font-extrabold">

            Admin <span className="text-purple-500">
              Support
            </span>

          </h1>



          <p className="text-gray-400 mt-4">

            Manage community support tickets.

          </p>





          <div className="grid md:grid-cols-2 gap-6 mt-12">



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



                <h2 className="text-2xl font-bold">

                  {ticket.subject}

                </h2>




                <p className="text-purple-400 mt-2">

                  {ticket.category}

                </p>




                <p className="text-gray-400 mt-4">

                  User:{" "}

                  {ticket.user?.username ?? "Unknown"}

                </p>




                <p
                  className={
                    ticket.status === "OPEN"
                    ? "text-green-400 mt-3"
                    : "text-red-400 mt-3"
                  }
                >

                  {ticket.status}

                </p>





                <p className="text-gray-500 mt-3">

                  Messages: {ticket.messages.length}

                </p>






                <div className="flex gap-3 mt-6">


                  <Link
                    href={`/support/${ticket.id}`}
                    className="
                    bg-purple-600
                    hover:bg-purple-700
                    px-5
                    py-3
                    rounded-xl
                    font-bold
                    "
                  >

                    Open

                  </Link>





                  {canManageStatus && (

                    ticket.status !== "CLOSED" ? (


                      <form
                        action={async () => {
                          "use server";

                          await updateTicketStatus(
                            ticket.id,
                            "CLOSED"
                          );

                        }}
                      >

                        <button
                          className="
                          bg-red-600
                          hover:bg-red-700
                          px-5
                          py-3
                          rounded-xl
                          font-bold
                          "
                        >

                          Close

                        </button>


                      </form>


                    ) : (


                      <form
                        action={async () => {
                          "use server";

                          await updateTicketStatus(
                            ticket.id,
                            "OPEN"
                          );

                        }}
                      >


                        <button
                          className="
                          bg-green-600
                          hover:bg-green-700
                          px-5
                          py-3
                          rounded-xl
                          font-bold
                          "
                        >

                          Reopen

                        </button>


                      </form>


                    )

                  )}



                </div>



              </div>


            ))}



          </div>





          {tickets.length === 0 && (

            <p className="text-gray-400 mt-12 text-xl">

              No support tickets yet.

            </p>

          )}




        </div>


      </section>



      <Footer />


    </main>

  );

}