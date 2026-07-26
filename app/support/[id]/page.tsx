import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { pusher } from "@/lib/pusher";
import TicketChat from "@/components/support/TicketChat";
import TicketInput from "@/components/support/TicketInput";


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



  const isStaff =
    currentUser.role === "ADMIN" ||
    currentUser.role === "OWNER" ||
    currentUser.role === "SUPPORT";





  // Normal users cannot access closed/deleted tickets
  if (
    !isStaff &&
    (
      ticket.status === "CLOSED" ||
      ticket.status === "DELETED" ||
      ticket.deleted
    )
  ) {
    redirect("/support");
  }





  const currentTicket = ticket;



  if (
    currentTicket.userId !== currentUser.id &&
    !isStaff
  ) {

    redirect("/support");

  }







  async function sendMessage(formData: FormData) {

  "use server";


  if (
    currentTicket.status === "CLOSED" ||
    currentTicket.status === "DELETED" ||
    currentTicket.deleted
  ) {
    return;
  }


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
        ">





          {/* Header */}


          <div className="
            text-center
            mb-10
          ">



            <h1 className="
              text-4xl
              md:text-5xl
              font-extrabold
            ">


              Support{" "}

              <span className="
                bg-linear-to-r
                from-purple-400
                to-blue-400
                bg-clip-text
                text-transparent
              ">

                Ticket

              </span>


            </h1>



            <p className="
              text-gray-400
              mt-4
              text-lg
            ">

              Get help from the Nexus support team.

            </p>



          </div>







          {/* Ticket Info */}


          <div className="
            glass
            rounded-3xl
            p-8
            mb-8
          ">



            <div className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-5
            ">



              <div>


                <h2 className="
                  text-2xl
                  font-bold
                ">

                  {currentTicket.subject}

                </h2>



                <p className="
                  text-gray-400
                  mt-2
                ">

                  Ticket #{currentTicket.id}

                </p>


              </div>






              <div className="
                flex
                flex-wrap
                gap-3
              ">



                <span className="
                  px-4
                  py-2
                  rounded-full
                  bg-purple-500/20
                  border
                  border-purple-500/30
                  text-purple-400
                  font-semibold
                  text-sm
                ">

                  {currentTicket.category}

                </span>





                <span className="
                  px-4
                  py-2
                  rounded-full
                  bg-blue-500/20
                  border
                  border-blue-500/30
                  text-blue-400
                  font-semibold
                  text-sm
                ">

                  {currentTicket.status}

                </span>


              </div>


            </div>



          </div>









          {/* Chat */}


          <div className="
            glass
            rounded-3xl
            p-6
            md:p-8
          ">



            <TicketChat

              ticketId={currentTicket.id}

              initialMessages={currentTicket.messages}

              currentUserId={currentUser.id}

            />






            {currentTicket.status !== "CLOSED" &&
              currentTicket.status !== "DELETED" &&
              !currentTicket.deleted && (


              <form

                action={sendMessage}

                className="
                  mt-8
                  flex
                  gap-4
                  items-center
                "

              >



                <div className="flex-1">


                  <TicketInput

                    ticketId={currentTicket.id}

                    userId={currentUser.id}

                    username={currentUser.username}

                    role={currentUser.role}

                  />


                </div>





                <button

                  className="
                    h-full
                    px-7
                    py-4
                    rounded-xl
                    bg-linear-to-r
                    from-purple-600
                    to-blue-600
                    font-bold
                    hover:scale-105
                    transition
                  "

                >

                  Send

                </button>



              </form>


            )}



          </div>





        </div>


      </section>




      <Footer />


    </main>

  );

}