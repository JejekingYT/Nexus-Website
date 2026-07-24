export async function getDiscordServerWidget(discordId: string) {

  try {

    const res = await fetch(
      `https://discord.com/api/guilds/${discordId}/widget.json`,
      {
        cache: "no-store",
      }
    );


    if (!res.ok) {
      return null;
    }


    return await res.json();

  } catch (error) {

    console.error(
      "Discord widget error:",
      error
    );

    return null;

  }

}



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