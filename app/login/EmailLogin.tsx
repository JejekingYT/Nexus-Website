"use client";

export default function EmailLogin() {
  return (
    <div
      className="
        text-left
        bg-white/5
        border
        border-white/10
        rounded-2xl
        p-6
      "
    >
      <div className="text-center">

        <div
          className="
            inline-flex
            items-center
            justify-center
            px-4
            py-2
            rounded-full
            bg-yellow-500/10
            border
            border-yellow-500/20
            text-yellow-400
            text-sm
            font-semibold
          "
        >
          🚧 Work in Progress
        </div>

        <h2 className="text-2xl font-bold mt-5">
          Login with Email
        </h2>

        <p className="text-gray-400 mt-3 leading-relaxed">
          Email login is currently being worked on and
          is not available yet.
        </p>

        <div
          className="
            mt-6
            rounded-xl
            bg-black/20
            border
            border-white/5
            px-4
            py-4
            text-sm
            text-gray-500
          "
        >
          Email verification and password login are
          coming soon.
        </div>

        <button
          type="button"
          disabled
          className="
            w-full
            mt-6
            bg-purple-600/40
            text-white/50
            px-8
            py-4
            rounded-xl
            font-bold
            cursor-not-allowed
          "
        >
          Email Login — Coming Soon
        </button>

      </div>
    </div>
  );
}