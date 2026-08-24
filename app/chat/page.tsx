"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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

export default function GlobalChatPage() {
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

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

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
  }, []);

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
              item.id === data.message.id
          )
        ) {
          return current;
        }

        return [
          ...current,
          data.message,
        ].slice(-50);
      });
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

    if (savingEdit) {
      return;
    }

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

      cancelEditing();
    } catch (error) {
      console.error(
        "Failed to edit chat message:",
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

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

      setMessages((current) =>
        current.filter(
          (item) => item.id !== id
        )
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

  return (
    <main className="min-h-screen text-white">
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-extrabold">
              Nexus{" "}
              <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Global Chat
              </span>
            </h1>

            <p className="text-gray-400 mt-5 text-lg">
              Talk with members across the Nexus community.
            </p>
          </div>

          <div
            className="
              glass
              rounded-3xl
              border
              border-white/10
              overflow-hidden
            "
          >

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
                  💬 Global Chat
                </h2>

                <p className="text-sm text-gray-500">
                  Community-wide conversation
                </p>
              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-gray-400
                "
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live
              </div>
            </div>

            <div
              className="
                h-[550px]
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
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="text-5xl mb-4">
                    💬
                  </div>

                  <h3 className="text-xl font-bold">
                    No messages yet
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Be the first person to start the conversation.
                  </p>
                </div>
              ) : (
                messages.map((item) => {
                  const status =
                    getUserStatus(
                      item.user.lastSeen
                    );

                  const isOwnMessage =
                    currentUserId !== null &&
                    item.user.id ===
                      currentUserId;

                  const isEditing =
                    editingId === item.id;

                  const wasEdited =
                    new Date(
                      item.updatedAt
                    ).getTime() >
                    new Date(
                      item.createdAt
                    ).getTime() + 1000;

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 group"
                    >

                      {/* Avatar + Status */}

                      <div className="relative shrink-0 w-12 h-12">
                        {item.user.image ? (
                          <Image
                            src={item.user.image}
                            alt={item.user.username}
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
                            ${status.dot}
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
                              ${status.text}
                            `}
                          >
                            {status.label}
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
                              onChange={(event) =>
                                setEditingMessage(
                                  event.target.value
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
                                  startEditing(item)
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
                  Be respectful and follow the Nexus rules.
                </span>

                <span className="text-xs text-gray-600">
                  {message.length}/500
                </span>

              </div>
            </form>

          </div>

          <div className="text-center mt-8">
            <Link
              href="/"
              className="
                inline-block
                px-6
                py-3
                rounded-xl
                border
                border-white/10
                bg-white/[0.04]
                font-semibold
                text-gray-400
                transition
                hover:bg-white/[0.08]
                hover:text-white
              "
            >
              ← Back to Nexus
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}