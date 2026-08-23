"use client";

import { useEffect } from "react";

export default function ActivityTracker() {
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const updateActivity = async () => {
      try {
        await fetch("/api/user/activity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Failed to update activity:", error);
      }
    };

    // Update immediately
    updateActivity();

    // Update every 2 minutes
    interval = setInterval(updateActivity, 2 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return null;
}