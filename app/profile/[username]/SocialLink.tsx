"use client";

interface SocialLinkProps {
  name: string;
  value: string;
  icon: string;
}

export default function SocialLink({
  name,
  value,
  icon,
}: SocialLinkProps) {
  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="
        inline-flex
        items-center
        gap-2
        px-4
        py-2
        rounded-xl
        border
        border-white/10
        bg-white/[0.04]
        hover:bg-white/[0.1]
        hover:border-purple-500/30
        transition
        text-sm
        font-semibold
        cursor-pointer
      "
    >
      <span>{icon}</span>

      <span>{name}</span>
    </a>
  );
}