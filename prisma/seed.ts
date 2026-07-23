import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  const sanctuary = await prisma.community.upsert({
    where: { slug: "the-sanctuary" },

    update: {
      icon: "🏰",
      image: "/sanctuary.png",
      description:
        "A Roblox clan community focused on teamwork, events, and growth.",
      members: 68,
      discord: "https://discord.gg/uYKKybvrR6",
      discordId: "1492240815878312148",
      roblox:
        "https://www.roblox.com/communities/390316982/The-Sanctuary#!/about",
      about:
        "The Sanctuary is a Roblox clan built around teamwork and events.",

      staff: [
        {
          name: "Jeje_cozy",
          role: "Founder",
          icon: "👑",
        },
        {
          name: "Verx",
          role: "Co-Founder",
          icon: "👑",
        },
        {
          name: "Lean",
          role: "Co-Founder 2",
          icon: "👑",
        },
      ],
    },

    create: {
      slug: "the-sanctuary",
      name: "The Sanctuary",
      type: "Clan",
      icon: "🏰",
      image: "/sanctuary.png",
      description:
        "A Roblox clan community focused on teamwork, events, and growth.",
      members: 68,
      discord: "https://discord.gg/uYKKybvrR6",
      discordId: "1492240815878312148",
      roblox:
        "https://www.roblox.com/communities/390316982/The-Sanctuary#!/about",
      about:
        "The Sanctuary is a Roblox clan built around teamwork and events.",

      staff: [
        {
          name: "Jeje_cozy",
          role: "Founder",
          icon: "👑",
        },
        {
          name: "Verx",
          role: "Co-Founder",
          icon: "👑",
        },
        {
          name: "Lean",
          role: "Co-Founder 2",
          icon: "👑",
        },
      ],
    },
  });



  await prisma.community.upsert({
    where: { slug: "nexus-community" },

    update: {
      icon: "🌐",
      image: "/nexus.png",
      description:
        "A place for everyone to chat, share, and connect.",
      members: 0,
      discord: "https://discord.gg/M3e8gBUPws",
      discordId: "1228973961094627420",
      roblox: null,
      about:
        "The official Nexus community.",
    },

    create: {
      slug: "nexus-community",
      name: "Nexus Community",
      type: "Community",
      icon: "🌐",
      image: "/nexus.png",
      description:
        "A place for everyone to chat, share, and connect.",
      members: 0,
      discord: "https://discord.gg/M3e8gBUPws",
      discordId: "1228973961094627420",
      roblox: null,
      about:
        "The official Nexus community.",
    },
  });



  await prisma.project.upsert({
    where: {
      slug: "nexus-website",
    },

    update: {
      title: "Nexus Website",
      description:
        "The official Nexus website built with Next.js. It features communities, projects, events, news, Discord integration, and a custom admin dashboard.",
      image: "/nexus.png",
      platform: "Next.js",
      status: "Live",
      url: null,
      featured: true,
    },

    create: {
      title: "Nexus Website",
      slug: "nexus-website",
      description:
        "The official Nexus website built with Next.js. It features communities, projects, events, news, Discord integration, and a custom admin dashboard.",
      image: "/nexus.png",
      platform: "Next.js",
      status: "Live",
      url: null,
      featured: true,
    },
  });



  await prisma.game.upsert({
    where: {
      slug: "saber-legends",
    },

    update: {
      name: "Saber Legends",
      description:
        "A Roblox lightsaber combat game played by The Sanctuary clan.",
      image: "/saber-legends.png",
      platform: "Roblox",
      link: "https://www.roblox.com/",
      featured: true,
      communityId: sanctuary.id,
    },

    create: {
      name: "Saber Legends",
      slug: "saber-legends",
      description:
        "A Roblox lightsaber combat game played by The Sanctuary clan.",
      image: "/saber-legends.png",
      platform: "Roblox",
      link: "https://www.roblox.com/",
      featured: true,
      communityId: sanctuary.id,
    },
  });



  await prisma.game.upsert({
    where: {
      slug: "saber-showdown",
    },

    update: {
      name: "Saber Showdown",
      description:
        "A Roblox saber combat game played by The Sanctuary clan.",
      image: "/saber-showdown.png",
      platform: "Roblox",
      link: "https://www.roblox.com/",
      featured: true,
      communityId: sanctuary.id,
    },

    create: {
      name: "Saber Showdown",
      slug: "saber-showdown",
      description:
        "A Roblox saber combat game played by The Sanctuary clan.",
      image: "/saber-showdown.png",
      platform: "Roblox",
      link: "https://www.roblox.com/",
      featured: true,
      communityId: sanctuary.id,
    },
  });

  await prisma.siteSettings.upsert({
  where: {
    id: 1,
  },
  update: {},
  create: {
    id: 1,
    siteName: "Nexus",
    description: "Nexus Community",

    logo: null,
    favicon: null,

    discord: null,
    github: null,
    youtube: null,

    maintenance: false,
  },
});

  console.log("✅ Database seeded!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });