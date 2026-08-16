require("dotenv").config({ path: ".env.local" });

const { Client, GatewayIntentBits } = require("discord.js");
const prisma = require("./prisma");


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});



async function updateStats() {

  console.log("📊 Updating database stats...");


  // Update Communities
  const communities = await prisma.community.findMany();


  for (const community of communities) {

    if (!community.discordId)
      continue;


    try {

      const guild = await client.guilds.fetch(
        community.discordId
      );


      await prisma.community.update({

        where: {
          id: community.id,
        },

        data: {
          members: guild.memberCount,
        },

      });


      console.log(
        `✅ Community ${community.name}: ${guild.memberCount} members`
      );


    } catch(error) {

      console.log(
        `❌ Failed updating community: ${community.name}`,
        error.message
      );

    }

  }



  // Update Partners
  const partners = await prisma.partner.findMany();


  for (const partner of partners) {


    if (!partner.discordId)
      continue;


    try {


      const guild = await client.guilds.fetch(
        partner.discordId
      );


      await prisma.partner.update({

        where:{
          id: partner.id,
        },

        data:{
          members: guild.memberCount,
        },

      });


      console.log(
        `✅ Partner ${partner.name}: ${guild.memberCount} members`
      );


    } catch(error) {


      console.log(
        `❌ Failed updating partner: ${partner.name}`,
        error.message
      );


    }


  }


}



client.once("clientReady", async () => {

  console.log(
    `✅ Logged in as ${client.user.tag}`
  );


  await updateStats();


  // Update every 5 minutes
  setInterval(async () => {

    await updateStats();

  }, 5 * 60 * 1000);


});



client.login(
  process.env.NEXUS_BOT_TOKEN
);