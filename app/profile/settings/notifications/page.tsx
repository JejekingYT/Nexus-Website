import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function NotificationsSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const notificationSettings = [
    {
      title: "Chat Notifications",
      description:
        "Get notified when someone replies to your messages.",
      defaultEnabled: true,
    },
    {
      title: "Follower Notifications",
      description:
        "Get notified when someone follows your profile.",
      defaultEnabled: true,
    },
    {
      title: "Event Notifications",
      description:
        "Receive updates about events you joined.",
      defaultEnabled: true,
    },
    {
      title: "News & Announcements",
      description:
        "Stay updated with important Nexus news and announcements.",
      defaultEnabled: true,
    },
    {
      title: "Badge Notifications",
      description:
        "Get notified when you earn or receive a badge.",
      defaultEnabled: true,
    },
    {
      title: "Support Notifications",
      description:
        "Receive updates about your support tickets.",
      defaultEnabled: true,
    },
    {
      title: "Email Notifications",
      description:
        "Receive important Nexus updates by email.",
      defaultEnabled: false,
    },
  ];

  return (
    <main className="min-h-screen text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Header */}

          <div className="mb-10">
            <Link
              href="/profile/settings"
              className="
                inline-flex
                items-center
                gap-2
                text-gray-400
                hover:text-white
                transition
                mb-6
              "
            >
              ← Back to Settings
            </Link>

            <div className="text-center">

              <div
                className="
                  mx-auto
                  w-16
                  h-16
                  rounded-2xl
                  bg-purple-500/20
                  border
                  border-purple-500/30
                  flex
                  items-center
                  justify-center
                  text-3xl
                "
              >
                🔔
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold mt-6">
                Notifications
              </h1>

              <p className="text-gray-400 text-lg mt-4">
                Choose which notifications you want to receive.
              </p>

            </div>
          </div>

          {/* Settings Card */}

          <div className="glass rounded-3xl border border-white/10 overflow-hidden">

            {notificationSettings.map((setting, index) => (
              <div
                key={setting.title}
                className={`
                  p-6
                  md:p-7
                  flex
                  items-center
                  justify-between
                  gap-6
                  ${
                    index !== notificationSettings.length - 1
                      ? "border-b border-white/10"
                      : ""
                  }
                `}
              >

                {/* Text */}

                <div className="min-w-0">

                  <h2 className="text-lg md:text-xl font-bold">
                    {setting.title}
                  </h2>

                  <p className="text-gray-400 text-sm md:text-base mt-1">
                    {setting.description}
                  </p>

                </div>

                {/* Toggle */}

                <div className="shrink-0">

                  <div
                    className={`
                      relative
                      w-14
                      h-8
                      rounded-full
                      cursor-pointer
                      transition
                      ${
                        setting.defaultEnabled
                          ? "bg-purple-600"
                          : "bg-white/10"
                      }
                    `}
                  >

                    <div
                      className={`
                        absolute
                        top-1
                        w-6
                        h-6
                        rounded-full
                        bg-white
                        shadow
                        transition
                        ${
                          setting.defaultEnabled
                            ? "left-7"
                            : "left-1"
                        }
                      `}
                    />

                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* Save */}

          <div className="flex justify-end mt-6">

            <button
              className="
                px-7
                py-3
                rounded-xl
                bg-purple-600
                hover:bg-purple-500
                font-bold
                transition
              "
            >
              Save Changes
            </button>

          </div>

          {/* Info */}

          <div
            className="
              mt-8
              rounded-2xl
              border
              border-blue-500/20
              bg-blue-500/5
              p-5
            "
          >
            <div className="flex gap-3">

              <span className="text-xl">
                ℹ️
              </span>

              <p className="text-sm text-gray-400">
                Notification preferences will be saved to your Nexus
                account. Important security and account notifications may
                still be sent even when other notifications are disabled.
              </p>

            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}