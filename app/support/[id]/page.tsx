import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { pusher } from "@/lib/pusher";
import TicketChat from "@/components/support/TicketChat";


export default async function SupportTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {


  const user = await getCurrentUser();


  if (!user) {
    redirect("/api/auth/signin");
  }


  const currentUser = user;


  const { id } = await params;



  const ticket = await prisma.supportTicket.findUnique({

    where: {
      id: Number(id),
    },

    include: {

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



  if (
    currentTicket.userId !== currentUser.id &&
    currentUser.role !== "ADMIN" &&
    currentUser.role !== "OWNER" &&
    currentUser.role !== "SUPPORT"
  ) {

    redirect("/support");

  }





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



    redirect(`/support/${currentTicket.id}`);

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







          <TicketChat

            ticketId={currentTicket.id}

            initialMessages={currentTicket.messages}

            currentUserId={currentUser.id}

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

                placeholder="Write a message..."

                onChange={() => {

                  fetch("/api/support/typing", {

                    method: "POST",

                    headers: {

                      "Content-Type": "application/json",

                    },

                    body: JSON.stringify({

                      ticketId: currentTicket.id,

                      userId: currentUser.id,

                      username: currentUser.username,

                      role: currentUser.role,

                    }),

                  });

                }}


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