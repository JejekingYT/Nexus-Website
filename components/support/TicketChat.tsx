"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";


interface Props {
  ticketId: number;
  initialMessages: any[];
  currentUserId: number;
}


export default function TicketChat({
  ticketId,
  initialMessages,
  currentUserId,
}: Props) {


  const [messages, setMessages] =
    useState(initialMessages);


  const [typingUser, setTypingUser] =
    useState<string | null>(null);



  useEffect(() => {


    const channel =
      pusherClient.subscribe(
        `ticket-${ticketId}`
      );



    channel.bind(
      "new-message",
      (newMessage:any)=>{


        setMessages((old:any)=>[
          ...old,
          newMessage,
        ]);


      }
    );



    channel.bind(
      "typing",
      (data:any)=>{


        if(data.userId !== currentUserId){

          setTypingUser(data.name);


          setTimeout(()=>{

            setTypingUser(null);

          },3000);

        }


      }
    );



    return()=>{


      pusherClient.unsubscribe(
        `ticket-${ticketId}`
      );


    };


  },[
    ticketId,
    currentUserId
  ]);





  return (

    <div className="mt-10">


      <div className="space-y-4">


        {messages.map((msg:any)=>(

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

            <p className="text-purple-400 font-bold">

              {
                msg.sender?.role === "SUPPORT" ||
                msg.sender?.role === "ADMIN" ||
                msg.sender?.role === "OWNER"

                ? "🎫 Nexus Support"

                : msg.sender?.username ?? "Unknown"
              }

            </p>


            <p className="mt-2 text-gray-300">

              {msg.message}

            </p>


          </div>

        ))}


      </div>




      {typingUser && (

        <p className="text-gray-400 mt-4 italic">

          {typingUser} is typing...

        </p>

      )}



    </div>

  );

}