"use client";

import { useState } from "react";


interface Props {
  ticketId: number;
  username: string;
  userId: number;
  role: string;
}


export default function TicketInput({
  ticketId,
  username,
  userId,
  role,
}: Props) {


  const [typingTimeout, setTypingTimeout] =
    useState<NodeJS.Timeout | null>(null);



  function handleTyping() {


    fetch("/api/support/typing", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({

        ticketId,

        userId,

        username,

        role,

      }),

    });



    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }


    const timeout = setTimeout(() => {

    }, 2000);


    setTypingTimeout(timeout);

  }



  return (

    <input

      name="message"

      required

      placeholder="Write a message..."

      onChange={handleTyping}

      className="
      flex-1
      bg-white/5
      border
      border-white/10
      rounded-xl
      px-5
      py-4
      "

    />

  );

}