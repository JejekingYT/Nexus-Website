"use client";

import Navbar from "@/components/layout/NavbarWrapper";
import Link from "next/link";
import { useEffect, useState } from "react";

type Notification = {
  id: number;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/notifications",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Failed to load notifications."
        );
        return;
      }

      setNotifications(
        data.notifications || []
      );
    } catch (error) {
      console.error(
        "LOAD NOTIFICATIONS ERROR:",
        error
      );

      setError(
        "Something went wrong while loading notifications."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function markAsRead(
    notificationId: number
  ) {
    try {
      await fetch(
        "/api/notifications/read",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notificationId,
          }),
        }
      );

      setNotifications((current) =>
        current.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );
    } catch (error) {
      console.error(
        "MARK NOTIFICATION READ ERROR:",
        error
      );
    }
  }

  async function markAllAsRead() {
    try {
      const response = await fetch(
        "/api/notifications/read-all",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        return;
      }

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (error) {
      console.error(
        "MARK ALL NOTIFICATIONS READ ERROR:",
        error
      );
    }
  }

  function getNotificationIcon(
    type: string
  ) {
    switch (type) {
      case "FOLLOW":
        return "👤";

      case "REPLY":
        return "💬";

      case "BADGE":
        return "🏆";

      case "REVIEW":
        return "⭐";

      case "SUPPORT":
        return "🎫";

      case "MENTION":
        return "📢";

      case "SYSTEM":
        return "⚙️";

      default:
        return "🔔";
    }
  }

  function formatDate(
    date: string
  ) {
    const notificationDate =
      new Date(date);

    const now = new Date();

    const difference =
      now.getTime() -
      notificationDate.getTime();

    const seconds =
      Math.floor(difference / 1000);

    if (seconds < 60) {
      return "Just now";
    }

    const minutes =
      Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours =
      Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days =
      Math.floor(hours / 24);

    if (days < 7) {
      return `${days}d ago`;
    }

    return notificationDate.toLocaleDateString();
  }

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  return (
    <main className="min-h-screen bg-[#09090B] text-white">

      <Navbar />

      <section className="pt-32 pb-24 px-6">

        <div className="max-w-4xl mx-auto">

          {/* HEADER */}

          <div className="flex items-center justify-between gap-6">

            <div>

              <h1 className="text-5xl font-extrabold">

                Your{" "}

                <span className="text-purple-500">
                  Notifications
                </span>

              </h1>

              <p className="text-gray-400 mt-4">

                Stay up to date with everything
                happening on Nexus.

              </p>

            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="
                  hidden
                  sm:block
                  px-5
                  py-3
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  hover:border-purple-500
                  hover:bg-purple-500/10
                  transition
                  text-sm
                  font-semibold
                "
              >
                Mark all as read
              </button>
            )}

          </div>


          {/* MOBILE MARK ALL */}

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="
                sm:hidden
                mt-6
                w-full
                px-5
                py-3
                rounded-xl
                bg-white/5
                border
                border-white/10
                hover:border-purple-500
                hover:bg-purple-500/10
                transition
                text-sm
                font-semibold
              "
            >
              Mark all as read
            </button>
          )}


          {/* CONTENT */}

          <div className="mt-10">

            {loading && (
              <div
                className="
                  bg-white/5
                  border
                  border-white/10
                  rounded-2xl
                  p-10
                  text-center
                  text-gray-400
                "
              >
                Loading notifications...
              </div>
            )}


            {!loading && error && (
              <div
                className="
                  bg-red-500/10
                  border
                  border-red-500/20
                  rounded-2xl
                  p-6
                  text-center
                  text-red-400
                "
              >
                {error}
              </div>
            )}


            {!loading &&
              !error &&
              notifications.length === 0 && (
                <div
                  className="
                    bg-white/5
                    border
                    border-white/10
                    rounded-2xl
                    p-12
                    text-center
                  "
                >

                  <div className="text-6xl">
                    🔔
                  </div>

                  <h2 className="text-2xl font-bold mt-5">
                    No notifications yet
                  </h2>

                  <p className="text-gray-400 mt-3">
                    You're all caught up!
                  </p>

                </div>
              )}


            {!loading &&
              !error &&
              notifications.length > 0 && (
                <div className="space-y-3">

                  {notifications.map(
                    (notification) => {

                      const content = (
                        <div
                          className={`
                            relative
                            rounded-2xl
                            border
                            p-5
                            transition
                            ${
                              notification.read
                                ? `
                                  bg-white/5
                                  border-white/10
                                `
                                : `
                                  bg-purple-500/10
                                  border-purple-500/30
                                `
                            }
                            hover:border-purple-500
                          `}
                        >

                          {/* UNREAD DOT */}

                          {!notification.read && (
                            <span
                              className="
                                absolute
                                top-5
                                right-5
                                w-2.5
                                h-2.5
                                rounded-full
                                bg-purple-500
                              "
                            />
                          )}


                          <div className="flex gap-4">

                            {/* ICON */}

                            <div
                              className="
                                flex
                                items-center
                                justify-center
                                w-12
                                h-12
                                shrink-0
                                rounded-xl
                                bg-white/5
                                text-2xl
                              "
                            >
                              {getNotificationIcon(
                                notification.type
                              )}
                            </div>


                            {/* CONTENT */}

                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-4">

                                <h2 className="font-bold text-lg">

                                  {notification.title}

                                </h2>

                                <span className="text-xs text-gray-500 whitespace-nowrap">

                                  {formatDate(
                                    notification.createdAt
                                  )}

                                </span>

                              </div>


                              <p className="text-gray-400 mt-1">

                                {notification.message}

                              </p>


                              {!notification.read && (
                                <button
                                  onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();

                                    markAsRead(
                                      notification.id
                                    );
                                  }}
                                  className="
                                    mt-3
                                    text-sm
                                    text-purple-400
                                    hover:text-purple-300
                                    transition
                                  "
                                >
                                  Mark as read
                                </button>
                              )}

                            </div>

                          </div>

                        </div>
                      );

                      if (
                        notification.link
                      ) {
                        return (
                          <Link
                            key={
                              notification.id
                            }
                            href={
                              notification.link
                            }
                            onClick={() =>
                              markAsRead(
                                notification.id
                              )
                            }
                            className="block"
                          >
                            {content}
                          </Link>
                        );
                      }

                      return (
                        <div
                          key={
                            notification.id
                          }
                        >
                          {content}
                        </div>
                      );
                    }
                  )}

                </div>
              )}

          </div>

        </div>

      </section>

    </main>
  );
}