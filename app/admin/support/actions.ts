"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateTicketStatus(
  id: number,
  status: string
) {

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