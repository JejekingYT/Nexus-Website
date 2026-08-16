import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { notFound } from "next/navigation";


export default async function SupportTranscriptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {


  await requireRole([
    "OWNER",
    "ADMIN",
  ]);


  const { id } = await params;



  const ticket = await prisma.supportTicket.findUnique({

    where:{
      id:Number(id),
    },

    include:{

      user:true,

      messages:{
        include:{
          sender:true,
        },

        orderBy:{
          createdAt:"asc",
        },
      },

    },

  });



  if(!ticket){
    notFound();
  }



  return (

    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar/>


      <section className="pt-32 pb-24 px-6">

        <div className="max-w-5xl mx-auto">


          <h1 className="text-5xl font-bold">
            🎫 Ticket Transcript #{ticket.id}
          </h1>


          <p className="text-gray-400 mt-4">
            Subject: {ticket.subject}
          </p>


          <p className="text-purple-400">
            Category: {ticket.category}
          </p>



          <div className="mt-8">

            <p>
              Created by:
              <span className="text-purple-400 ml-2">
                {ticket.user?.username ?? "Unknown"}
              </span>
            </p>

          </div>




          <div className="mt-10 space-y-5">


            {ticket.messages.map((msg)=>(


              <div

                key={msg.id}

                className="
                bg-white/5
                border
                border-white/10
                rounded-xl
                p-5
                "

              >


                <p className="font-bold text-purple-400">

                  {msg.sender?.username ?? "Unknown"}

                </p>


                <p className="text-gray-300 mt-2">

                  {msg.message}

                </p>


                <p className="text-xs text-gray-500 mt-3">

                  {new Date(
                    msg.createdAt
                  ).toLocaleString()}

                </p>


              </div>


            ))}


          </div>


        </div>

      </section>


      <Footer/>

    </main>

  );

}