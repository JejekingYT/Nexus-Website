"use client";

import { deleteProject } from "@/app/admin/projects/actions";


export default function DeleteProjectButton({
  id,
}:{
  id:number;
}){


  return(

    <button

      onClick={()=>{
        if(confirm("Delete this project?")){
          deleteProject(id);
        }
      }}

      className="
      bg-red-500/10
      text-red-400
      hover:bg-red-500/20
      px-4
      py-2
      rounded-lg
      text-sm
      "

    >

      Delete

    </button>

  );

}