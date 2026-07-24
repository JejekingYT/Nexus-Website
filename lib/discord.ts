import { Client, GatewayIntentBits } from "discord.js";


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});


let loggedIn = false;


export async function getDiscordClient() {

  if (!loggedIn) {

    await client.login(
      process.env.DISCORD_BOT_TOKEN
    );

    loggedIn = true;

  }


  return client;

}



export async function getDiscordMemberCount(
  serverId:string
) {


  const discord = await getDiscordClient();


  const guild = await discord.guilds.fetch(
    serverId
  );


  return guild.memberCount;


}



export async function sendSupportLog(
  message:string
) {

  if(!process.env.DISCORD_SUPPORT_WEBHOOK)
    return;


  await fetch(
    process.env.DISCORD_SUPPORT_WEBHOOK,
    {

      method:"POST",

      headers:{
        "Content-Type":"application/json",
      },

      body:JSON.stringify({
        content:message,
      }),

    }
  );

}