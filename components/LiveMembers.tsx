"use client";

import { useEffect, useState } from "react";

export default function LiveMembers({
  slug,
}: {
  slug: string;
}) {

  const [members, setMembers] = useState<number | null>(null);


  useEffect(() => {

    async function fetchMembers() {

      try {

        const res = await fetch("/api/discord/stats");

        const data = await res.json();


        if (data[slug]) {

          setMembers(data[slug].members);

        } else {

          setMembers(0);

        }


      } catch (error) {

        console.error(
          "Failed to fetch member count:",
          error
        );

        setMembers(0);

      }

    }


    fetchMembers();


    // refresh every 60 seconds
    const interval = setInterval(
      fetchMembers,
      60000
    );


    return () => clearInterval(interval);


  }, [slug]);



  return (
    <p className="text-gray-400 mt-2">

      {members === null
        ? "Loading members..."
        : `${members} Members`
      }

    </p>
  );
}