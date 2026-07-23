export async function sendSupportLog(message:string) {

  if(!process.env.DISCORD_SUPPORT_WEBHOOK) return;


  await fetch(
    process.env.DISCORD_SUPPORT_WEBHOOK,
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        content: message,
      }),
    }
  );

}