import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { pusher } from "@/lib/pusher";
import TicketChat from "@/components/support/TicketChat";


export default async function AdminSupportTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {


  const currentUser = await requireRole([
    "OWNER",
    "ADMIN",
    "SUPPORT",
  ]);



  const { id } = await params;



  const ticket = await prisma.supportTicket.findUnique({

    where: {
      id: Number(id),
    },

    include: {

      user: true,

      messages: {

        include: {
          sender: true,
        },

        orderBy: {
          createdAt: "asc",
        },

      },

    },

  });



  if (!ticket) {
    notFound();
  }



  const currentTicket = ticket;







  async function sendMessage(formData: FormData) {

    "use server";



    const message =
      formData.get("message") as string;



    if (!message.trim()) {
      return;
    }



    const newMessage =
      await prisma.supportMessage.create({

        data: {

          ticketId: currentTicket.id,

          senderId: currentUser.id,

          message,

        },

        include: {

          sender: true,

        },

      });





    // Send message instantly with Pusher
    await pusher.trigger(

      `ticket-${currentTicket.id}`,

      "new-message",

      {

        id: newMessage.id,

        message: newMessage.message,

        createdAt: newMessage.createdAt,

        sender: {

          id: newMessage.sender?.id,

          username: newMessage.sender?.username,

          role: newMessage.sender?.role,

        },

      }

    );



    redirect(`/admin/support/${currentTicket.id}`);

  }







  return (

    <main className="min-h-screen bg-[#09090B] text-white">


      <Navbar />



      <section className="pt-32 pb-24 px-6">


        <div className="max-w-4xl mx-auto">



          <h1 className="text-4xl font-bold">

            {currentTicket.subject}

          </h1>




          <p className="text-purple-400 mt-2">

            {currentTicket.category} • {currentTicket.status}

          </p>





          <div className="mt-4 text-gray-400">

            User:{" "}
            {currentTicket.user?.username ?? "Unknown"}

          </div>







          <TicketChat

            ticketId={currentTicket.id}

            initialMessages={currentTicket.messages}

          />







          {currentTicket.status !== "CLOSED" && (


            <form

              action={sendMessage}

              className="
              mt-8
              flex
              gap-4
              "

            >


              <input

                name="message"

                required

                placeholder="Reply as Nexus Support..."

                className="
                flex-1
                bg-white/5
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
                px-6
                rounded-xl
                font-bold
                "

              >

                Send

              </button>



            </form>


          )}



        </div>


      </section>



      <Footer />


    </main>

  );

}