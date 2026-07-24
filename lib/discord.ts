import "server-only";


export async function getDiscordMemberCount(
  serverId: string
) {

  try {

    const response = await fetch(
      `https://discord.com/api/guilds/${serverId}/widget.json`,
      {
        cache: "no-store",
      }
    );


    if (!response.ok) {
      return 0;
    }


    const data = await response.json();


    return data.presence_count ?? 0;


  } catch (error) {

    console.error(
      "Discord member count error:",
      error
    );

    return 0;

  }

}



export async function sendSupportLog(
  message: string
) {

  if (!process.env.DISCORD_SUPPORT_WEBHOOK)
    return;


  await fetch(
    process.env.DISCORD_SUPPORT_WEBHOOK,
    {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        content: message,
      }),

    }
  );

}