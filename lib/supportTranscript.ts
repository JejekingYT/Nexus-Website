export function getTicketTranscript(ticket:any){

  return ticket.messages
    .map((msg:any)=>{

      const name =
        msg.sender?.role === "SUPPORT" ||
        msg.sender?.role === "ADMIN" ||
        msg.sender?.role === "OWNER"
        ? "🎫 Nexus Support"
        : msg.sender?.username ?? "Unknown";


      return `${name}:
${msg.message}
`;

    })
    .join("\n----------------\n");

}