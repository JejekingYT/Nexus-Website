import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const settings = [
    {
      title: "Notifications",
      description:
        "Manage notifications, alerts and activity updates.",
      icon: "🔔",
      href: "/profile/settings/notifications",
    },
    {
      title: "Appearance",
      description:
        "Customize the way Nexus looks and feels.",
      icon: "🎨",
      href: "/profile/settings/appearance",
    },
    {
      title: "Account",
      description:
        "Manage your account, security and connected accounts.",
      icon: "🔐",
      href: "/profile/settings/account",
    },
    {
      title: "Edit Profile",
      description:
        "Change your public profile information.",
      icon: "👤",
      href: "/profile/edit",
    },
  ];

  return (
    <main className="min-h-screen text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}

          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold">
              User{" "}
              <span
                className="
                  bg-linear-to-r
                  from-purple-400
                  to-blue-400
                  bg-clip-text
                  text-transparent
                "
              >
                Settings
              </span>
            </h1>

            <p className="text-gray-400 text-lg mt-5">
              Manage your Nexus account and preferences.
            </p>
          </div>

          {/* Settings */}

          <div className="grid gap-5 mt-12">

            {settings.map((setting) => (
              <Link
                key={setting.href}
                href={setting.href}
                className="
                  group
                  glass
                  rounded-3xl
                  p-6
                  md:p-7
                  border
                  border-white/10
                  hover:border-purple-500/40
                  hover:bg-white/10
                  transition
                  duration-300
                "
              >
                <div className="flex items-center gap-5">

                  {/* Icon */}

                  <div
                    className="
                      w-14
                      h-14
                      shrink-0
                      rounded-2xl
                      bg-purple-500/20
                      border
                      border-purple-500/30
                      flex
                      items-center
                      justify-center
                      text-2xl
                      group-hover:scale-105
                      transition
                    "
                  >
                    {setting.icon}
                  </div>

                  {/* Text */}

                  <div className="flex-1 min-w-0">

                    <h2 className="text-xl md:text-2xl font-bold">
                      {setting.title}
                    </h2>

                    <p className="text-gray-400 mt-1">
                      {setting.description}
                    </p>

                  </div>

                  {/* Arrow */}

                  <div
                    className="
                      text-gray-500
                      text-2xl
                      group-hover:text-purple-400
                      group-hover:translate-x-1
                      transition
                    "
                  >
                    →
                  </div>

                </div>
              </Link>
            ))}

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}