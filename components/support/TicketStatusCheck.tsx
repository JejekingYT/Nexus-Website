"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TicketStatusCheck({
  status,
}: {
  status: string;
}) {

  const router = useRouter();


  useEffect(() => {

    if (
      status === "CLOSED" ||
      status === "DELETED"
    ) {
      router.push("/support");
    }

  }, [status, router]);


  return null;

}