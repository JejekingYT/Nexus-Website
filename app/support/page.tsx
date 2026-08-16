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

      AND: [
        {
          deleted: false,
        },
        {
          status: {
            not: "DELETED",
          },
        },
      ],

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






    const webhook =
      process.env.DISCORD_SUPPORT_LOG_WEBHOOK;



    if (webhook) {


      await fetch(webhook, {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          embeds: [

            {

              title: "🎫 New Support Ticket",

              description: `

**Ticket:** #${ticket.id}

**User:** ${user.username}

**Category:** ${category}

**Subject:** ${subject}


**Message:**

${message}


**Open Ticket:**

${process.env.NEXTAUTH_URL}/admin/support/${ticket.id}

              `,

              color: 10181046,

              timestamp: new Date().toISOString(),

              footer: {

                text: "Nexus Support System",

              },

            },

          ],

        }),

      });

    }




    redirect(`/support/${ticket.id}`);

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






          <div className="text-center">



            <h1 className="
              text-5xl
              md:text-6xl
              font-extrabold
            ">

              Nexus{" "}

              <span className="
                bg-linear-to-r
                from-purple-400
                to-blue-400
                bg-clip-text
                text-transparent
              ">

                Support

              </span>


            </h1>





            <p className="
              text-gray-400
              mt-5
              text-lg
            ">

              Need help? Create a ticket and our team will assist you.

            </p>




          </div>







          <form

            action={createTicket}

            className="
              glass
              mt-14
              p-8
              space-y-6
            "

          >



            <input

              name="subject"

              required

              placeholder="Ticket subject"

              className="input"

            />





            <select

              name="category"

              className="input"

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
                input
                h-40
                resize-none
              "

            />







            <button

              className="
                px-8
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

              Create Ticket

            </button>





          </form>









          <div className="mt-16">



            <h2 className="
              text-3xl
              font-bold
              mb-8
            ">

              Your Tickets

            </h2>







            {tickets.length === 0 && (

              <div className="
                glass
                p-8
                text-center
              ">


                <p className="text-gray-400">

                  You have no support tickets yet.

                </p>


              </div>

            )}








            <div className="
              space-y-5
            ">




              {tickets.map((ticket)=>(



                <div

                  key={ticket.id}

                  className="
                    glass
                    card-hover
                    p-6
                  "

                >





                  <div className="
                    flex
                    justify-between
                    items-start
                    gap-4
                    flex-wrap
                  ">



                    <div>


                      <h3 className="
                        text-xl
                        font-bold
                      ">

                        {ticket.subject}

                      </h3>



                      <p className="
                        text-purple-400
                        mt-2
                      ">

                        {ticket.category}

                      </p>


                    </div>





                    <span

                      className={`

                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-bold

                        ${
                          ticket.status === "OPEN"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                        }

                      `}

                    >

                      {ticket.status}

                    </span>





                  </div>







                  <Link

                    href={`/support/${ticket.id}`}

                    className="
                      inline-block
                      mt-6
                      px-6
                      py-3
                      rounded-xl
                      bg-purple-600
                      hover:bg-purple-700
                      font-bold
                      transition
                    "

                  >

                    Open Ticket →

                  </Link>





                </div>



              ))}



            </div>






          </div>






        </div>





      </section>






      <Footer />



    </main>

  );

}