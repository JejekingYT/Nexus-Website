"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export async function deleteProject(id:number){

  const currentUser = await getCurrentUser();


  if(
    currentUser.role !== "OWNER" &&
    currentUser.role !== "ADMIN"
  ){
    redirect("/admin/projects");
  }


  const project = await prisma.project.findUnique({
    where:{
      id,
    },
  });


  if(!project){
    redirect("/admin/projects");
  }


  await prisma.project.delete({
    where:{
      id,
    },
  });



  await prisma.auditLog.create({

    data:{
      action:"DELETE_PROJECT",
      target:project.title,
      details:`Deleted project "${project.title}"`,
      userId:currentUser.id,
    },

  });



  redirect("/admin/projects");

}