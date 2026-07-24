import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

let loggedIn = false;

export async function getDiscordClient() {
  if (!loggedIn) {
    await client.login(process.env.DISCORD_BOT_TOKEN!);
    loggedIn = true;
  }

  return client;
}

export async function sendSupportLog(message: string) {
  if (!process.env.DISCORD_SUPPORT_WEBHOOK) return;

  await fetch(process.env.DISCORD_SUPPORT_WEBHOOK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: message,
    }),
  });
}

export async function getDiscordServerWidget(guildId: string) {
  try {
    const response = await fetch(
      `https://discord.com/api/guilds/${guildId}/widget.json`,
      {
        next: {
          revalidate: 300, // Refresh every 5 minutes
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch Discord widget:", error);
    return null;
  }
}