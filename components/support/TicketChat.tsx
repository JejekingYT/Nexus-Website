"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher-client";


interface Props {
  ticketId: number;
  initialMessages: any[];
}


export default function TicketChat({
  ticketId,
  initialMessages,
}: Props) {


  const [messages, setMessages] = useState(
    initialMessages
  );



  useEffect(() => {


    const channel = pusherClient.subscribe(
      `ticket-${ticketId}`
    );



    channel.bind(
      "new-message",
      (newMessage: any) => {


        setMessages((current) => [

          ...current,

          newMessage,

        ]);


      }
    );



    return () => {


      pusherClient.unsubscribe(
        `ticket-${ticketId}`
      );


    };


  }, [ticketId]);





  return (

    <div className="mt-10 space-y-4">


      {messages.map((msg) => (


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





          <p className="text-gray-300 mt-2">

            {msg.message}

          </p>





          <p className="text-xs text-gray-500 mt-3">

            {
              new Date(
                msg.createdAt
              ).toLocaleString()
            }

          </p>



        </div>


      ))}


    </div>

  );

}