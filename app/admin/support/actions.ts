"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";


export async function updateTicketStatus(
  id: number,
  status: string
) {

  await requireRole([
    "OWNER",
    "ADMIN",
    "SUPPORT",
  ]);


  await prisma.supportTicket.update({

    where: {
      id,
    },

    data: {
      status,
    },

  });


  redirect("/admin/support");

}





export async function deleteTicket(
  id: number
) {

  await requireRole([
    "OWNER",
    "ADMIN",
  ]);



  // Delete messages first
  await prisma.supportMessage.deleteMany({

    where: {
      ticketId: id,
    },

  });



  // Delete ticket
  await prisma.supportTicket.delete({

    where: {
      id,
    },

  });



  redirect("/admin/support");

}