"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


async function sendDiscordLog(
  title: string,
  description: string,
  color: number
) {

  const webhook =
    process.env.DISCORD_SUPPORT_LOG_WEBHOOK;


  if (!webhook) return;



  await fetch(webhook, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({

      embeds: [

        {
          title,

          description,

          color,

          timestamp: new Date().toISOString(),

          footer: {
            text: "Nexus Support System",
          },

        },

      ],

    }),

  });

}






export async function updateTicketStatus(
  id: number,
  status: string
) {


  const ticket =
    await prisma.supportTicket.findUnique({

      where: {
        id,
      },

      include: {
        user: true,
      },

    });



  if (!ticket) return;



  const website =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://nexus-community-web.vercel.app";




  if (status === "CLOSED") {


    await sendDiscordLog(

      "🎫 Ticket Closed",

      `
**Ticket:** #${ticket.id}

**Subject:** ${ticket.subject}

**User:** ${ticket.user?.username ?? "Unknown"}

**Closed By:** Nexus Support


**Transcript:**
${website}/admin/support/transcript/${ticket.id}
      `,

      15158332

    );

  }




  await prisma.supportTicket.update({

    where: {
      id,
    },

    data: {
      status,
    },

  });



  revalidatePath("/admin/support");


  redirect("/admin/support");

}









export async function deleteTicket(
  id: number
) {



  const ticket =
    await prisma.supportTicket.findUnique({

      where: {
        id,
      },

      include: {

        user: true,

        messages: true,

      },

    });



  if (!ticket) return;



  const website =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://nexus-community-web.vercel.app";





  await sendDiscordLog(

    "🗑️ Ticket Deleted",

    `
**Ticket:** #${ticket.id}

**Subject:** ${ticket.subject}

**User:** ${ticket.user?.username ?? "Unknown"}

**Messages:** ${ticket.messages.length}

**Deleted By:** Nexus Support


**Transcript:**
${website}/admin/support/transcript/${ticket.id}
    `,

    16711680

  );






  await prisma.supportTicket.update({

    where: {
      id,
    },

    data: {

      deleted: true,

      deletedAt: new Date(),

      deletedBy: "Nexus Support",

      status: "DELETED",

    },

  });




  revalidatePath("/admin/support");


  redirect("/admin/support");

}