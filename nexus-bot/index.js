require("dotenv").config({ path: ".env.local" });

const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits } = require("discord.js");


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});


// Replace these with your actual Discord Server IDs
const SERVERS = {
  "1492240815878312148": "the-sanctuary",
  "1228973961094627420": "nexus-community",
};



function updateStats() {

  const stats = {};


  client.guilds.cache.forEach((guild) => {


    console.log(
      `${guild.name}: ${guild.memberCount} members`
    );


    const slug = SERVERS[guild.id];


    if (slug) {

      stats[slug] = {
        members: guild.memberCount,
      };

    }


  });



  const dataFolder = path.join(
    __dirname,
    "data"
  );


  if (!fs.existsSync(dataFolder)) {

    fs.mkdirSync(dataFolder);

  }



  const filePath = path.join(
    dataFolder,
    "stats.json"
  );


  fs.writeFileSync(
    filePath,
    JSON.stringify(stats, null, 2)
  );


  console.log("📊 Stats updated");

}



client.once("clientReady", () => {

  console.log(
    `✅ Logged in as ${client.user.tag}`
  );


  updateStats();


  // Update every 5 minutes
  setInterval(() => {

    updateStats();

  }, 5 * 60 * 1000);


});



client.login(
  process.env.NEXUS_BOT_TOKEN
);