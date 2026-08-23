export type UserStatus = {
  label: "Online" | "Idle" | "Offline";
  color: string;
  dot: string;
};

export function getUserStatus(lastSeen: Date): UserStatus {
  const now = Date.now();
  const lastSeenTime = new Date(lastSeen).getTime();

  const minutesSinceLastSeen =
    (now - lastSeenTime) / (1000 * 60);

  if (minutesSinceLastSeen <= 5) {
    return {
      label: "Online",
      color: "text-green-400",
      dot: "bg-green-500",
    };
  }

  if (minutesSinceLastSeen <= 30) {
    return {
      label: "Idle",
      color: "text-yellow-400",
      dot: "bg-yellow-500",
    };
  }

  return {
    label: "Offline",
    color: "text-gray-500",
    dot: "bg-gray-500",
  };
}