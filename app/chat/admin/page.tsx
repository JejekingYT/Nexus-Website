"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher-client";

interface ChatUser {
  id: number;
  username: string;
  image: string | null;
  role: string;
  lastSeen: string;
}

interface ChatMessage {
  id: number;
  message: string;
  createdAt: string;
  updatedAt: string;
  user: ChatUser;
}

type AdminSection =
  | "chat"
  | "users"
  | "delete"
  | "warnings"
  | "mutes"
  | "bans"
  | "logs";

interface ModerationRecord {
  id: number;
  username: string;
  userId: number;
  reason: string;
  createdAt: string;
  moderator: string;
}

interface AdminLog {
  id: number;
  action: string;
  target: string;
  details: string;
  createdAt: string;
}

function getRoleStyle(role: string) {
  switch (role) {
    case "OWNER":
      return "text-yellow-400";
    case "CO-OWNER":
      return "text-orange-400";
    case "MANAGER":
      return "text-blue-400";
    case "ADMIN":
      return "text-red-400";
    case "MODERATOR":
      return "text-green-400";
    case "SUPPORT":
      return "text-cyan-400";
    default:
      return "text-purple-400";
  }
}

function getRoleBadge(role: string) {
  switch (role) {
    case "OWNER":
      return "👑 Owner";
    case "CO-OWNER":
      return "👑 Co-Owner";
    case "MANAGER":
      return "⚙️ Manager";
    case "ADMIN":
      return "🛡️ Admin";
    case "MODERATOR":
      return "🛡️ Mod";
    case "SUPPORT":
      return "💬 Support";
    default:
      return "Member";
  }
}

function getUserStatus(lastSeen: string) {
  const lastSeenTime = new Date(lastSeen).getTime();

  const minutesSinceLastSeen =
    (Date.now() - lastSeenTime) / (1000 * 60);

  if (minutesSinceLastSeen <= 5) {
    return {
      label: "Online",
      dot: "bg-green-500",
      text: "text-green-400",
    };
  }

  if (minutesSinceLastSeen <= 30) {
    return {
      label: "Idle",
      dot: "bg-yellow-500",
      text: "text-yellow-400",
    };
  }

  return {
    label: "Offline",
    dot: "bg-gray-500",
    text: "text-gray-500",
  };
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function OwnerChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");

  const [currentUserId, setCurrentUserId] =
    useState<number | null>(null);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editingMessage, setEditingMessage] =
    useState("");

  const [savingEdit, setSavingEdit] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState<AdminSection>("chat");

  const [selectedUser, setSelectedUser] =
    useState<ChatUser | null>(null);

  const [warningReason, setWarningReason] =
    useState("");

  const [muteReason, setMuteReason] =
    useState("");

  const [banReason, setBanReason] =
    useState("");

  const [moderationUserId, setModerationUserId] =
    useState<number | null>(null);

  const [warnings, setWarnings] =
    useState<ModerationRecord[]>([]);

  const [mutes, setMutes] =
    useState<ModerationRecord[]>([]);

  const [bans, setBans] =
    useState<ModerationRecord[]>([]);

  const [logs, setLogs] =
    useState<AdminLog[]>([]);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/chat");
      return;
    }

    if (session.user.role !== "OWNER") {
      router.replace("/chat");
    }
  }, [session, status, router]);

  function addLog(
    action: string,
    target: string,
    details: string
  ) {
    setLogs((current) => [
      {
        id: Date.now(),
        action,
        target,
        details,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
  }

  async function loadMessages() {
    try {
      const response = await fetch("/api/chat", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.error || "Failed to load chat."
        );
        return;
      }

      setMessages(data.messages);
      setCurrentUserId(
        data.currentUserId ?? null
      );
    } catch (error) {
      console.error(
        "Failed to load chat:",
        error
      );

      setError("Failed to load chat.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status !== "authenticated") return;
    if (session.user.role !== "OWNER") return;

    loadMessages();

    const channel =
      pusherClient.subscribe("global-chat");

    channel.bind(
      "new-message",
      (newMessage: ChatMessage) => {
        setMessages((current) => {
          if (
            current.some(
              (item) =>
                item.id === newMessage.id
            )
          ) {
            return current;
          }

          return [
            ...current,
            newMessage,
          ].slice(-50);
        });
      }
    );

    channel.bind(
      "message-updated",
      (updatedMessage: ChatMessage) => {
        setMessages((current) =>
          current.map((item) =>
            item.id === updatedMessage.id
              ? updatedMessage
              : item
          )
        );
      }
    );

    channel.bind(
      "message-deleted",
      (data: { id: number }) => {
        setMessages((current) =>
          current.filter(
            (item) => item.id !== data.id
          )
        );
      }
    );

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(
        "global-chat"
      );
    };
  }, [status, session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function sendMessage(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const trimmedMessage =
      message.trim();

    if (!trimmedMessage || sending) {
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch(
        "/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: trimmedMessage,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.error ||
            "Failed to send message."
        );
        return;
      }

      setMessage("");

      setMessages((current) => {
        if (
          current.some(
            (item) =>
              item.id ===
              data.message.id
          )
        ) {
          return current;
        }

        return [
          ...current,
          data.message,
        ].slice(-50);
      });

      addLog(
        "Message Sent",
        "Global Chat",
        "Owner sent a message."
      );
    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );

      setError(
        "Something went wrong."
      );
    } finally {
      setSending(false);
    }
  }

  function startEditing(
    item: ChatMessage
  ) {
    setEditingId(item.id);
    setEditingMessage(item.message);
    setError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingMessage("");
  }

  async function saveEdit(id: number) {
    const trimmedMessage =
      editingMessage.trim();

    if (!trimmedMessage) {
      setError(
        "Message cannot be empty."
      );
      return;
    }

    if (trimmedMessage.length > 500) {
      setError(
        "Message cannot be longer than 500 characters."
      );
      return;
    }

    if (savingEdit) return;

    setSavingEdit(true);
    setError("");

    try {
      const response = await fetch(
        "/api/chat",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id,
            message: trimmedMessage,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.error ||
            "Failed to edit message."
        );
        return;
      }

      setMessages((current) =>
        current.map((item) =>
          item.id === id
            ? data.message
            : item
        )
      );

      addLog(
        "Message Edited",
        `Message #${id}`,
        "Message content was edited."
      );

      cancelEditing();
    } catch (error) {
      console.error(
        "Failed to edit message:",
        error
      );

      setError(
        "Something went wrong."
      );
    } finally {
      setSavingEdit(false);
    }
  }

  async function deleteMessage(
    id: number
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this message?"
      );

    if (!confirmed) return;

    setError("");

    try {
      const response = await fetch(
        "/api/chat",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.error ||
            "Failed to delete message."
        );
        return;
      }

      const deletedMessage =
        messages.find(
          (item) => item.id === id
        );

      setMessages((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );

      addLog(
        "Message Deleted",
        deletedMessage
          ? deletedMessage.user.username
          : `Message #${id}`,
        "Message was deleted from Global Chat."
      );
    } catch (error) {
      console.error(
        "Failed to delete message:",
        error
      );

      setError(
        "Something went wrong."
      );
    }
  }

  async function deleteAllMessages() {
    if (messages.length === 0) {
      setError("There are no messages to delete.");
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete all ${messages.length} loaded messages?`
      );

    if (!confirmed) return;

    setError("");

    const originalMessages = [...messages];

    try {
      for (const item of originalMessages) {
        const response = await fetch(
          "/api/chat",
          {
            method: "DELETE",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              id: item.id,
            }),
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.error ||
              "Failed to delete a message."
          );
        }
      }

      setMessages([]);

      addLog(
        "Bulk Delete",
        "Global Chat",
        `Deleted ${originalMessages.length} messages.`
      );
    } catch (error) {
      console.error(
        "Failed to delete all messages:",
        error
      );

      setError(
        "Some messages could not be deleted."
      );

      await loadMessages();
    }
  }

  const users = Array.from(
    new Map(
      messages.map((item) => [
        item.user.id,
        item.user,
      ])
    ).values()
  );

  const currentModerationUser =
    users.find(
      (user) =>
        user.id === moderationUserId
    ) ?? null;

  function createWarning() {
    if (
      !currentModerationUser ||
      !warningReason.trim()
    ) {
      return;
    }

    const record: ModerationRecord = {
      id: Date.now(),
      username:
        currentModerationUser.username,
      userId: currentModerationUser.id,
      reason: warningReason.trim(),
      createdAt:
        new Date().toISOString(),
      moderator:
        session?.user?.name ||
        "Owner",
    };

    setWarnings((current) => [
      record,
      ...current,
    ]);

    addLog(
      "Warning Issued",
      currentModerationUser.username,
      warningReason.trim()
    );

    setWarningReason("");
    setModerationUserId(null);
  }

  function removeWarning(id: number) {
    const warning =
      warnings.find(
        (item) => item.id === id
      );

    setWarnings((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );

    if (warning) {
      addLog(
        "Warning Removed",
        warning.username,
        `Removed warning: ${warning.reason}`
      );
    }
  }

  function createMute() {
    if (
      !currentModerationUser ||
      !muteReason.trim()
    ) {
      return;
    }

    const record: ModerationRecord = {
      id: Date.now(),
      username:
        currentModerationUser.username,
      userId: currentModerationUser.id,
      reason: muteReason.trim(),
      createdAt:
        new Date().toISOString(),
      moderator:
        session?.user?.name ||
        "Owner",
    };

    setMutes((current) => [
      record,
      ...current,
    ]);

    addLog(
      "User Muted",
      currentModerationUser.username,
      muteReason.trim()
    );

    setMuteReason("");
    setModerationUserId(null);
  }

  function removeMute(id: number) {
    const mute =
      mutes.find(
        (item) => item.id === id
      );

    setMutes((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );

    if (mute) {
      addLog(
        "Mute Removed",
        mute.username,
        `Removed mute: ${mute.reason}`
      );
    }
  }

  function createBan() {
    if (
      !currentModerationUser ||
      !banReason.trim()
    ) {
      return;
    }

    const record: ModerationRecord = {
      id: Date.now(),
      username:
        currentModerationUser.username,
      userId: currentModerationUser.id,
      reason: banReason.trim(),
      createdAt:
        new Date().toISOString(),
      moderator:
        session?.user?.name ||
        "Owner",
    };

    setBans((current) => [
      record,
      ...current,
    ]);

    addLog(
      "User Banned",
      currentModerationUser.username,
      banReason.trim()
    );

    setBanReason("");
    setModerationUserId(null);
  }

  function removeBan(id: number) {
    const ban =
      bans.find(
        (item) => item.id === id
      );

    setBans((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );

    if (ban) {
      addLog(
        "Ban Removed",
        ban.username,
        `Removed ban: ${ban.reason}`
      );
    }
  }

  function selectUser(
    user: ChatUser
  ) {
    setSelectedUser(user);
  }

  function startModeration(
    user: ChatUser
  ) {
    setModerationUserId(user.id);
  }

  function getSectionTitle() {
    switch (activeSection) {
      case "chat":
        return "💬 Global Chat";
      case "users":
        return "👥 Users";
      case "delete":
        return "🗑️ Delete Messages";
      case "warnings":
        return "⚠️ Warnings";
      case "mutes":
        return "🔇 Mutes";
      case "bans":
        return "🚫 Bans";
      case "logs":
        return "📋 Logs";
      default:
        return "Owner Chat";
    }
  }

  function getSectionDescription() {
    switch (activeSection) {
      case "chat":
        return "Owner controls enabled";
      case "users":
        return `${users.length} unique users found in recent chat`;
      case "delete":
        return "Manage and remove Global Chat messages";
      case "warnings":
        return "Manage user warnings";
      case "mutes":
        return "Manage muted users";
      case "bans":
        return "Manage banned users";
      case "logs":
        return "Recent owner moderation activity";
      default:
        return "Global Chat management";
    }
  }

  if (
    status === "loading" ||
    !session ||
    session.user.role !== "OWNER"
  ) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <div className="text-gray-500">
          Checking permissions...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              🛡️
            </span>

            <div>
              <h1 className="text-3xl font-extrabold">
                Owner Chat
              </h1>

              <p className="text-gray-500 mt-1">
                Global Chat management
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">

          {/* COMMAND SIDEBAR */}

          <aside
            className="
              glass
              rounded-2xl
              border
              border-white/10
              p-3
              h-fit
            "
          >

            <div className="px-3 py-2">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Commands
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveSection("chat")
              }
              className={`
                w-full
                text-left
                px-4
                py-3
                rounded-xl
                transition
                ${
                  activeSection === "chat"
                    ? "bg-purple-500/10 text-purple-400 font-semibold"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              💬 Chat
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection("users")
              }
              className={`
                w-full
                text-left
                px-4
                py-3
                rounded-xl
                transition
                ${
                  activeSection === "users"
                    ? "bg-purple-500/10 text-purple-400 font-semibold"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              👥 Users
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection("delete")
              }
              className={`
                w-full
                text-left
                px-4
                py-3
                rounded-xl
                transition
                ${
                  activeSection === "delete"
                    ? "bg-purple-500/10 text-purple-400 font-semibold"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              🗑️ Delete Messages
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection("warnings")
              }
              className={`
                w-full
                text-left
                px-4
                py-3
                rounded-xl
                transition
                ${
                  activeSection === "warnings"
                    ? "bg-purple-500/10 text-purple-400 font-semibold"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              ⚠️ Warnings
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection("mutes")
              }
              className={`
                w-full
                text-left
                px-4
                py-3
                rounded-xl
                transition
                ${
                  activeSection === "mutes"
                    ? "bg-purple-500/10 text-purple-400 font-semibold"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              🔇 Mutes
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection("bans")
              }
              className={`
                w-full
                text-left
                px-4
                py-3
                rounded-xl
                transition
                ${
                  activeSection === "bans"
                    ? "bg-purple-500/10 text-purple-400 font-semibold"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              🚫 Bans
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection("logs")
              }
              className={`
                w-full
                text-left
                px-4
                py-3
                rounded-xl
                transition
                ${
                  activeSection === "logs"
                    ? "bg-purple-500/10 text-purple-400 font-semibold"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
            >
              📋 Logs
            </button>

            <div className="border-t border-white/10 my-3" />

            <Link
              href="/chat"
              className="
                block
                px-4
                py-3
                rounded-xl
                text-gray-500
                hover:bg-white/5
                hover:text-white
                transition
              "
            >
              ← Back to Chat
            </Link>

          </aside>

          {/* CONTENT */}

          <section
            className="
              glass
              rounded-2xl
              border
              border-white/10
              overflow-hidden
            "
          >

            {/* HEADER */}

            <div
              className="
                px-6
                py-5
                border-b
                border-white/10
                bg-white/[0.02]
                flex
                items-center
                justify-between
              "
            >
              <div>
                <h2 className="font-bold text-xl">
                  {getSectionTitle()}
                </h2>

                <p className="text-sm text-gray-500">
                  {getSectionDescription()}
                </p>
              </div>

              {activeSection === "chat" && (
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-green-400
                  "
                >
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live
                </div>
              )}
            </div>

            {/* CHAT */}

            {activeSection === "chat" && (
              <>
                <div
                  className="
                    h-[600px]
                    overflow-y-auto
                    px-5
                    py-6
                    space-y-5
                  "
                >

                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-gray-500">
                        Loading chat...
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No messages yet.
                    </div>
                  ) : (
                    messages.map((item) => {
                      const userStatus =
                        getUserStatus(
                          item.user.lastSeen
                        );

                      const isOwnMessage =
                        currentUserId !== null &&
                        item.user.id ===
                          currentUserId;

                      const isEditing =
                        editingId ===
                        item.id;

                      const wasEdited =
                        new Date(
                          item.updatedAt
                        ).getTime() >
                        new Date(
                          item.createdAt
                        ).getTime() +
                          1000;

                      return (
                        <div
                          key={item.id}
                          className="flex gap-4 group"
                        >

                          <div className="relative shrink-0 w-12 h-12">

                            {item.user.image ? (
                              <Image
                                src={
                                  item.user.image
                                }
                                alt={
                                  item.user.username
                                }
                                width={48}
                                height={48}
                                className="
                                  w-12
                                  h-12
                                  rounded-full
                                  object-cover
                                  border
                                  border-white/10
                                "
                              />
                            ) : (
                              <div
                                className="
                                  w-12
                                  h-12
                                  rounded-full
                                  bg-purple-600
                                  flex
                                  items-center
                                  justify-center
                                  font-bold
                                  text-lg
                                "
                              >
                                {item.user.username
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}

                            <span
                              className={`
                                absolute
                                bottom-0
                                right-0
                                w-3.5
                                h-3.5
                                rounded-full
                                border-2
                                border-[#09090B]
                                ${userStatus.dot}
                              `}
                            />

                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                              <Link
                                href={`/profile/${encodeURIComponent(
                                  item.user.username
                                )}`}
                                className="
                                  font-bold
                                  hover:text-purple-400
                                  transition
                                "
                              >
                                {item.user.username}
                              </Link>

                              <span
                                className={`
                                  text-xs
                                  font-semibold
                                  ${getRoleStyle(
                                    item.user.role
                                  )}
                                `}
                              >
                                {getRoleBadge(
                                  item.user.role
                                )}
                              </span>

                              <span
                                className={`
                                  text-xs
                                  ${userStatus.text}
                                `}
                              >
                                {userStatus.label}
                              </span>

                              <span className="text-xs text-gray-600">
                                {formatTime(
                                  item.createdAt
                                )}
                              </span>

                              {wasEdited && (
                                <span className="text-xs text-gray-600">
                                  (edited)
                                </span>
                              )}

                            </div>

                            {isEditing ? (
                              <div className="mt-2">

                                <textarea
                                  value={
                                    editingMessage
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    setEditingMessage(
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                  maxLength={500}
                                  autoFocus
                                  rows={3}
                                  className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-purple-500/30
                                    bg-black/30
                                    px-4
                                    py-3
                                    text-white
                                    outline-none
                                    resize-none
                                    focus:border-purple-500/60
                                  "
                                />

                                <div className="flex items-center justify-between mt-2">

                                  <span className="text-xs text-gray-600">
                                    {
                                      editingMessage.length
                                    }
                                    /500
                                  </span>

                                  <div className="flex gap-2">

                                    <button
                                      type="button"
                                      onClick={
                                        cancelEditing
                                      }
                                      className="
                                        px-3
                                        py-1.5
                                        rounded-lg
                                        bg-white/5
                                        border
                                        border-white/10
                                        text-xs
                                        text-gray-400
                                        hover:text-white
                                        hover:bg-white/10
                                        transition
                                      "
                                    >
                                      Cancel
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        saveEdit(
                                          item.id
                                        )
                                      }
                                      disabled={
                                        savingEdit ||
                                        !editingMessage.trim()
                                      }
                                      className="
                                        px-3
                                        py-1.5
                                        rounded-lg
                                        bg-purple-600
                                        text-xs
                                        font-semibold
                                        hover:bg-purple-500
                                        disabled:opacity-50
                                        transition
                                      "
                                    >
                                      {savingEdit
                                        ? "Saving..."
                                        : "Save"}
                                    </button>

                                  </div>

                                </div>

                              </div>
                            ) : (
                              <p
                                className="
                                  text-gray-300
                                  mt-1
                                  break-words
                                  whitespace-pre-wrap
                                "
                              >
                                {item.message}
                              </p>
                            )}

                            {isOwnMessage &&
                              !isEditing && (
                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-2
                                    mt-2
                                    opacity-0
                                    group-hover:opacity-100
                                    transition
                                  "
                                >

                                  <button
                                    type="button"
                                    onClick={() =>
                                      startEditing(
                                        item
                                      )
                                    }
                                    className="
                                      text-xs
                                      text-gray-500
                                      hover:text-purple-400
                                      transition
                                    "
                                  >
                                    ✏️ Edit
                                  </button>

                                  <span className="text-gray-700">
                                    •
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteMessage(
                                        item.id
                                      )
                                    }
                                    className="
                                      text-xs
                                      text-gray-500
                                      hover:text-red-400
                                      transition
                                    "
                                  >
                                    🗑️ Delete
                                  </button>

                                </div>
                              )}

                          </div>

                        </div>
                      );
                    })
                  )}

                  <div ref={messagesEndRef} />

                </div>

                {error && (
                  <div className="px-6 pb-3">
                    <div
                      className="
                        rounded-xl
                        border
                        border-red-500/20
                        bg-red-500/10
                        text-red-400
                        px-4
                        py-3
                        text-sm
                      "
                    >
                      {error}
                    </div>
                  </div>
                )}

                <form
                  onSubmit={sendMessage}
                  className="
                    p-5
                    border-t
                    border-white/10
                    bg-white/[0.02]
                  "
                >
                  <div className="flex gap-3">

                    <input
                      value={message}
                      onChange={(event) =>
                        setMessage(
                          event.target.value
                        )
                      }
                      maxLength={500}
                      placeholder="Send a message..."
                      className="
                        flex-1
                        rounded-xl
                        border
                        border-white/10
                        bg-black/20
                        px-4
                        py-3
                        text-white
                        outline-none
                        placeholder:text-gray-600
                        focus:border-purple-500/50
                        transition
                      "
                    />

                    <button
                      type="submit"
                      disabled={
                        sending ||
                        !message.trim()
                      }
                      className="
                        rounded-xl
                        bg-linear-to-r
                        from-purple-600
                        to-blue-600
                        px-6
                        py-3
                        font-bold
                        transition
                        hover:scale-105
                        disabled:opacity-50
                        disabled:hover:scale-100
                      "
                    >
                      {sending
                        ? "..."
                        : "Send"}
                    </button>

                  </div>

                  <div className="flex justify-between mt-2">

                    <span className="text-xs text-gray-600">
                      Owner mode • Global Chat
                    </span>

                    <span className="text-xs text-gray-600">
                      {message.length}/500
                    </span>

                  </div>

                </form>
              </>
            )}

            {/* USERS */}

            {activeSection === "users" && (
              <div className="p-6">

                {users.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="text-5xl mb-4">
                      👥
                    </div>

                    <h3 className="text-xl font-bold">
                      No users found
                    </h3>

                    <p className="text-gray-500 mt-2">
                      Users will appear here after
                      messages are loaded.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">

                    {users.map((user) => {
                      const userStatus =
                        getUserStatus(
                          user.lastSeen
                        );

                      return (
                        <div
                          key={user.id}
                          className="
                            flex
                            items-center
                            gap-4
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.02]
                            p-4
                            hover:bg-white/[0.04]
                            transition
                          "
                        >

                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.username}
                              width={48}
                              height={48}
                              className="
                                w-12
                                h-12
                                rounded-full
                                object-cover
                                border
                                border-white/10
                              "
                            />
                          ) : (
                            <div
                              className="
                                w-12
                                h-12
                                rounded-full
                                bg-purple-600
                                flex
                                items-center
                                justify-center
                                font-bold
                                text-lg
                              "
                            >
                              {user.username
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                              <Link
                                href={`/profile/${encodeURIComponent(
                                  user.username
                                )}`}
                                className="
                                  font-bold
                                  hover:text-purple-400
                                  transition
                                "
                              >
                                {user.username}
                              </Link>

                              <span
                                className={`
                                  text-xs
                                  font-semibold
                                  ${getRoleStyle(
                                    user.role
                                  )}
                                `}
                              >
                                {getRoleBadge(
                                  user.role
                                )}
                              </span>

                            </div>

                            <div className="flex items-center gap-2 mt-1">

                              <span
                                className={`
                                  w-2
                                  h-2
                                  rounded-full
                                  ${userStatus.dot}
                                `}
                              />

                              <span
                                className={`
                                  text-xs
                                  ${userStatus.text}
                                `}
                              >
                                {userStatus.label}
                              </span>

                            </div>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              selectUser(user)
                            }
                            className="
                              px-4
                              py-2
                              rounded-xl
                              border
                              border-white/10
                              bg-white/5
                              text-sm
                              font-semibold
                              text-gray-400
                              hover:text-white
                              hover:bg-white/10
                              transition
                            "
                          >
                            Manage
                          </button>

                        </div>
                      );
                    })}

                  </div>
                )}

              </div>
            )}

            {/* DELETE MESSAGES */}

            {activeSection === "delete" && (
              <div className="p-6">

                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    gap-4
                    mb-6
                  "
                >
                  <div>
                    <h3 className="font-bold text-lg">
                      Message Management
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {messages.length} messages currently loaded.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={deleteAllMessages}
                    disabled={
                      messages.length === 0
                    }
                    className="
                      px-4
                      py-2.5
                      rounded-xl
                      bg-red-500/10
                      border
                      border-red-500/20
                      text-red-400
                      text-sm
                      font-semibold
                      hover:bg-red-500/20
                      disabled:opacity-40
                      transition
                    "
                  >
                    🗑️ Delete All
                  </button>
                </div>

                {messages.length === 0 ? (
                  <div className="py-20 text-center text-gray-500">
                    No messages available.
                  </div>
                ) : (
                  <div className="space-y-3">

                    {messages
                      .slice()
                      .reverse()
                      .map((item) => (
                        <div
                          key={item.id}
                          className="
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.02]
                            p-4
                          "
                        >

                          <div className="flex items-start gap-3">

                            {item.user.image ? (
                              <Image
                                src={item.user.image}
                                alt={
                                  item.user.username
                                }
                                width={40}
                                height={40}
                                className="
                                  w-10
                                  h-10
                                  rounded-full
                                  object-cover
                                "
                              />
                            ) : (
                              <div
                                className="
                                  w-10
                                  h-10
                                  shrink-0
                                  rounded-full
                                  bg-purple-600
                                  flex
                                  items-center
                                  justify-center
                                  font-bold
                                "
                              >
                                {item.user.username
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}

                            <div className="min-w-0 flex-1">

                              <div className="flex flex-wrap items-center gap-2">

                                <span className="font-semibold">
                                  {item.user.username}
                                </span>

                                <span className="text-xs text-gray-600">
                                  {formatTime(
                                    item.createdAt
                                  )}
                                </span>

                              </div>

                              <p className="text-sm text-gray-400 mt-1 break-words">
                                {item.message}
                              </p>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                deleteMessage(
                                  item.id
                                )
                              }
                              className="
                                shrink-0
                                px-3
                                py-2
                                rounded-lg
                                bg-red-500/10
                                text-red-400
                                text-xs
                                font-semibold
                                hover:bg-red-500/20
                                transition
                              "
                            >
                              Delete
                            </button>

                          </div>

                        </div>
                      ))}

                  </div>
                )}

              </div>
            )}

            {/* WARNINGS */}

            {activeSection === "warnings" && (
              <div className="p-6">

                <div
                  className="
                    rounded-2xl
                    border
                    border-yellow-500/20
                    bg-yellow-500/5
                    p-5
                    mb-6
                  "
                >

                  <h3 className="font-bold text-lg">
                    ⚠️ Issue Warning
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Select a user from the recent chat users.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">

                    <select
                      value={
                        moderationUserId ??
                        ""
                      }
                      onChange={(event) =>
                        setModerationUserId(
                          event.target.value
                            ? Number(
                                event.target.value
                              )
                            : null
                        )
                      }
                      className="
                        rounded-xl
                        border
                        border-white/10
                        bg-black/30
                        px-4
                        py-3
                        text-white
                        outline-none
                      "
                    >
                      <option value="">
                        Select user
                      </option>

                      {users.map((user) => (
                        <option
                          key={user.id}
                          value={user.id}
                        >
                          {user.username}
                        </option>
                      ))}
                    </select>

                    <input
                      value={warningReason}
                      onChange={(event) =>
                        setWarningReason(
                          event.target.value
                        )
                      }
                      placeholder="Warning reason..."
                      className="
                        rounded-xl
                        border
                        border-white/10
                        bg-black/30
                        px-4
                        py-3
                        text-white
                        outline-none
                        placeholder:text-gray-600
                      "
                    />

                  </div>

                  <button
                    type="button"
                    onClick={createWarning}
                    disabled={
                      !moderationUserId ||
                      !warningReason.trim()
                    }
                    className="
                      mt-3
                      px-5
                      py-2.5
                      rounded-xl
                      bg-yellow-500
                      text-black
                      font-bold
                      text-sm
                      hover:bg-yellow-400
                      disabled:opacity-40
                      transition
                    "
                  >
                    Issue Warning
                  </button>

                </div>

                <div className="space-y-3">

                  {warnings.length === 0 ? (
                    <div className="py-16 text-center text-gray-500">
                      No warnings have been issued in this session.
                    </div>
                  ) : (
                    warnings.map((warning) => (
                      <div
                        key={warning.id}
                        className="
                          rounded-2xl
                          border
                          border-white/10
                          bg-white/[0.02]
                          p-4
                        "
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>
                            <h4 className="font-bold">
                              {warning.username}
                            </h4>

                            <p className="text-sm text-gray-400 mt-1">
                              {warning.reason}
                            </p>

                            <p className="text-xs text-gray-600 mt-2">
                              {formatDate(
                                warning.createdAt
                              )}{" "}
                              • by{" "}
                              {warning.moderator}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeWarning(
                                warning.id
                              )
                            }
                            className="
                              px-3
                              py-2
                              rounded-lg
                              bg-white/5
                              text-gray-400
                              text-xs
                              hover:bg-white/10
                              hover:text-white
                              transition
                            "
                          >
                            Remove
                          </button>

                        </div>

                      </div>
                    ))
                  )}

                </div>

              </div>
            )}

            {/* MUTES */}

            {activeSection === "mutes" && (
              <div className="p-6">

                <div
                  className="
                    rounded-2xl
                    border
                    border-blue-500/20
                    bg-blue-500/5
                    p-5
                    mb-6
                  "
                >

                  <h3 className="font-bold text-lg">
                    🔇 Mute User
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Add a mute record for a user.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">

                    <select
                      value={
                        moderationUserId ??
                        ""
                      }
                      onChange={(event) =>
                        setModerationUserId(
                          event.target.value
                            ? Number(
                                event.target.value
                              )
                            : null
                        )
                      }
                      className="
                        rounded-xl
                        border
                        border-white/10
                        bg-black/30
                        px-4
                        py-3
                        text-white
                        outline-none
                      "
                    >
                      <option value="">
                        Select user
                      </option>

                      {users.map((user) => (
                        <option
                          key={user.id}
                          value={user.id}
                        >
                          {user.username}
                        </option>
                      ))}
                    </select>

                    <input
                      value={muteReason}
                      onChange={(event) =>
                        setMuteReason(
                          event.target.value
                        )
                      }
                      placeholder="Mute reason..."
                      className="
                        rounded-xl
                        border
                        border-white/10
                        bg-black/30
                        px-4
                        py-3
                        text-white
                        outline-none
                        placeholder:text-gray-600
                      "
                    />

                  </div>

                  <button
                    type="button"
                    onClick={createMute}
                    disabled={
                      !moderationUserId ||
                      !muteReason.trim()
                    }
                    className="
                      mt-3
                      px-5
                      py-2.5
                      rounded-xl
                      bg-blue-600
                      text-white
                      font-bold
                      text-sm
                      hover:bg-blue-500
                      disabled:opacity-40
                      transition
                    "
                  >
                    Mute User
                  </button>

                </div>

                <div className="space-y-3">

                  {mutes.length === 0 ? (
                    <div className="py-16 text-center text-gray-500">
                      No muted users in this session.
                    </div>
                  ) : (
                    mutes.map((mute) => (
                      <div
                        key={mute.id}
                        className="
                          rounded-2xl
                          border
                          border-white/10
                          bg-white/[0.02]
                          p-4
                        "
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>
                            <h4 className="font-bold">
                              {mute.username}
                            </h4>

                            <p className="text-sm text-gray-400 mt-1">
                              {mute.reason}
                            </p>

                            <p className="text-xs text-gray-600 mt-2">
                              {formatDate(
                                mute.createdAt
                              )}{" "}
                              • by{" "}
                              {mute.moderator}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeMute(
                                mute.id
                              )
                            }
                            className="
                              px-3
                              py-2
                              rounded-lg
                              bg-white/5
                              text-gray-400
                              text-xs
                              hover:bg-white/10
                              hover:text-white
                              transition
                            "
                          >
                            Unmute
                          </button>

                        </div>

                      </div>
                    ))
                  )}

                </div>

              </div>
            )}

            {/* BANS */}

            {activeSection === "bans" && (
              <div className="p-6">

                <div
                  className="
                    rounded-2xl
                    border
                    border-red-500/20
                    bg-red-500/5
                    p-5
                    mb-6
                  "
                >

                  <h3 className="font-bold text-lg">
                    🚫 Ban User
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Add a ban record for a user.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">

                    <select
                      value={
                        moderationUserId ??
                        ""
                      }
                      onChange={(event) =>
                        setModerationUserId(
                          event.target.value
                            ? Number(
                                event.target.value
                              )
                            : null
                        )
                      }
                      className="
                        rounded-xl
                        border
                        border-white/10
                        bg-black/30
                        px-4
                        py-3
                        text-white
                        outline-none
                      "
                    >
                      <option value="">
                        Select user
                      </option>

                      {users.map((user) => (
                        <option
                          key={user.id}
                          value={user.id}
                        >
                          {user.username}
                        </option>
                      ))}
                    </select>

                    <input
                      value={banReason}
                      onChange={(event) =>
                        setBanReason(
                          event.target.value
                        )
                      }
                      placeholder="Ban reason..."
                      className="
                        rounded-xl
                        border
                        border-white/10
                        bg-black/30
                        px-4
                        py-3
                        text-white
                        outline-none
                        placeholder:text-gray-600
                      "
                    />

                  </div>

                  <button
                    type="button"
                    onClick={createBan}
                    disabled={
                      !moderationUserId ||
                      !banReason.trim()
                    }
                    className="
                      mt-3
                      px-5
                      py-2.5
                      rounded-xl
                      bg-red-600
                      text-white
                      font-bold
                      text-sm
                      hover:bg-red-500
                      disabled:opacity-40
                      transition
                    "
                  >
                    Ban User
                  </button>

                </div>

                <div className="space-y-3">

                  {bans.length === 0 ? (
                    <div className="py-16 text-center text-gray-500">
                      No banned users in this session.
                    </div>
                  ) : (
                    bans.map((ban) => (
                      <div
                        key={ban.id}
                        className="
                          rounded-2xl
                          border
                          border-white/10
                          bg-white/[0.02]
                          p-4
                        "
                      >

                        <div className="flex items-start justify-between gap-4">

                          <div>
                            <h4 className="font-bold">
                              {ban.username}
                            </h4>

                            <p className="text-sm text-gray-400 mt-1">
                              {ban.reason}
                            </p>

                            <p className="text-xs text-gray-600 mt-2">
                              {formatDate(
                                ban.createdAt
                              )}{" "}
                              • by{" "}
                              {ban.moderator}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeBan(
                                ban.id
                              )
                            }
                            className="
                              px-3
                              py-2
                              rounded-lg
                              bg-white/5
                              text-gray-400
                              text-xs
                              hover:bg-white/10
                              hover:text-white
                              transition
                            "
                          >
                            Unban
                          </button>

                        </div>

                      </div>
                    ))
                  )}

                </div>

              </div>
            )}

            {/* LOGS */}

            {activeSection === "logs" && (
              <div className="p-6">

                {logs.length === 0 ? (
                  <div className="py-20 text-center">

                    <div className="text-5xl mb-4">
                      📋
                    </div>

                    <h3 className="text-xl font-bold">
                      No activity yet
                    </h3>

                    <p className="text-gray-500 mt-2">
                      Owner actions will appear here.
                    </p>

                  </div>
                ) : (
                  <div className="space-y-3">

                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="
                          rounded-2xl
                          border
                          border-white/10
                          bg-white/[0.02]
                          p-4
                        "
                      >

                        <div className="flex items-start gap-4">

                          <div
                            className="
                              w-10
                              h-10
                              shrink-0
                              rounded-xl
                              bg-purple-500/10
                              flex
                              items-center
                              justify-center
                              text-lg
                            "
                          >
                            📋
                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                              <span className="font-bold">
                                {log.action}
                              </span>

                              <span className="text-gray-700">
                                •
                              </span>

                              <span className="text-purple-400 text-sm">
                                {log.target}
                              </span>

                            </div>

                            <p className="text-sm text-gray-400 mt-1">
                              {log.details}
                            </p>

                            <p className="text-xs text-gray-600 mt-2">
                              {formatDate(
                                log.createdAt
                              )}
                            </p>

                          </div>

                        </div>

                      </div>
                    ))}

                  </div>
                )}

              </div>
            )}

          </section>

        </div>

      </div>

      {/* USER MANAGEMENT MODAL */}

      {selectedUser && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            backdrop-blur-sm
            px-6
          "
          onClick={() =>
            setSelectedUser(null)
          }
        >

          <div
            className="
              w-full
              max-w-md
              glass
              rounded-3xl
              border
              border-white/10
              p-6
              shadow-2xl
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="flex items-center gap-4">

              {selectedUser.image ? (
                <Image
                  src={selectedUser.image}
                  alt={selectedUser.username}
                  width={64}
                  height={64}
                  className="
                    w-16
                    h-16
                    rounded-full
                    object-cover
                    border
                    border-white/10
                  "
                />
              ) : (
                <div
                  className="
                    w-16
                    h-16
                    rounded-full
                    bg-purple-600
                    flex
                    items-center
                    justify-center
                    font-bold
                    text-2xl
                  "
                >
                  {selectedUser.username
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold">
                  {selectedUser.username}
                </h3>

                <p
                  className={`
                    text-sm
                    font-semibold
                    ${getRoleStyle(
                      selectedUser.role
                    )}
                  `}
                >
                  {getRoleBadge(
                    selectedUser.role
                  )}
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 gap-3 mt-6">

              <Link
                href={`/profile/${encodeURIComponent(
                  selectedUser.username
                )}`}
                className="
                  w-full
                  text-center
                  px-4
                  py-3
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  font-semibold
                  text-gray-300
                  hover:bg-white/10
                  hover:text-white
                  transition
                "
                onClick={() =>
                  setSelectedUser(null)
                }
              >
                👤 View Profile
              </Link>

              <button
                type="button"
                onClick={() => {
                  startModeration(
                    selectedUser
                  );
                  setSelectedUser(null);
                  setActiveSection(
                    "warnings"
                  );
                }}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  bg-yellow-500/10
                  border
                  border-yellow-500/20
                  text-yellow-400
                  font-semibold
                  hover:bg-yellow-500/20
                  transition
                "
              >
                ⚠️ Issue Warning
              </button>

              <button
                type="button"
                onClick={() => {
                  startModeration(
                    selectedUser
                  );
                  setSelectedUser(null);
                  setActiveSection(
                    "mutes"
                  );
                }}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  bg-blue-500/10
                  border
                  border-blue-500/20
                  text-blue-400
                  font-semibold
                  hover:bg-blue-500/20
                  transition
                "
              >
                🔇 Mute User
              </button>

              <button
                type="button"
                onClick={() => {
                  startModeration(
                    selectedUser
                  );
                  setSelectedUser(null);
                  setActiveSection(
                    "bans"
                  );
                }}
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  bg-red-500/10
                  border
                  border-red-500/20
                  text-red-400
                  font-semibold
                  hover:bg-red-500/20
                  transition
                "
              >
                🚫 Ban User
              </button>

            </div>

            <button
              type="button"
              onClick={() =>
                setSelectedUser(null)
              }
              className="
                w-full
                mt-3
                px-4
                py-3
                rounded-xl
                bg-white/5
                border
                border-white/10
                text-gray-500
                hover:text-white
                hover:bg-white/10
                transition
              "
            >
              Close
            </button>

          </div>

        </div>
      )}

    </main>
  );
}