import Navbar from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { updateBadge } from "../../actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const badgeCategories = [
  {
    name: "Special/Role",
    icon: "👑",
  },
  {
    name: "Events",
    icon: "🎉",
  },
  {
    name: "Contribution",
    icon: "🛠️",
  },
  {
    name: "Membership",
    icon: "🕰️",
  },
  {
    name: "Community",
    icon: "🌐",
  },
  {
    name: "Secret",
    icon: "🔮",
  },
];

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBadgePage({ params }: Props) {
  await requireRole(["OWNER"]);

  const { id } = await params;
  const badgeId = Number(id);

  if (!Number.isInteger(badgeId)) {
    notFound();
  }

  const badge = await prisma.badge.findUnique({
    where: {
      id: badgeId,
    },
  });

  if (!badge) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div>
            <Link
              href="/admin/badges"
              className="
                inline-flex
                items-center
                gap-2
                text-gray-400
                hover:text-white
                transition
              "
            >
              ← Back to Badge Management
            </Link>

            <div className="mt-8">
              <div className="flex items-center gap-4">
                <div
                  className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-purple-500/10
                    border
                    border-purple-500/20
                    flex
                    items-center
                    justify-center
                    text-4xl
                  "
                >
                  {badge.icon}
                </div>

                <div>
                  <h1 className="text-4xl font-extrabold">
                    Edit{" "}
                    <span className="text-purple-500">
                      Badge
                    </span>
                  </h1>

                  <p className="text-gray-400 mt-1">
                    Update the information for {badge.name}.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-8">

            <form
              action={updateBadge}
              className="space-y-6"
            >
              <input
                type="hidden"
                name="badgeId"
                value={badge.id}
              />

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Badge Name
                </label>

                <input
                  name="name"
                  required
                  defaultValue={badge.name}
                  placeholder="Badge name"
                  className="
                    w-full
                    bg-black/30
                    border
                    border-white/10
                    rounded-xl
                    px-5
                    py-4
                    outline-none
                    focus:border-purple-500
                    transition
                  "
                />
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Badge Icon
                </label>

                <input
                  name="icon"
                  required
                  defaultValue={badge.icon}
                  maxLength={10}
                  placeholder="🏆"
                  className="
                    w-full
                    bg-black/30
                    border
                    border-white/10
                    rounded-xl
                    px-5
                    py-4
                    outline-none
                    focus:border-purple-500
                    transition
                  "
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Badge Category
                </label>

                <select
                  name="category"
                  required
                  defaultValue={badge.category}
                  className="
                    w-full
                    bg-black/30
                    border
                    border-white/10
                    rounded-xl
                    px-5
                    py-4
                    outline-none
                    focus:border-purple-500
                    transition
                  "
                >
                  {badgeCategories.map((category) => (
                    <option
                      key={category.name}
                      value={category.name}
                      className="bg-[#09090B]"
                    >
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  required
                  defaultValue={badge.description}
                  placeholder="Describe what this badge represents..."
                  className="
                    w-full
                    min-h-40
                    bg-black/30
                    border
                    border-white/10
                    rounded-xl
                    px-5
                    py-4
                    outline-none
                    focus:border-purple-500
                    transition
                    resize-y
                  "
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">

                <button
                  type="submit"
                  className="
                    flex-1
                    bg-purple-600
                    hover:bg-purple-700
                    px-6
                    py-3
                    rounded-xl
                    font-bold
                    transition
                  "
                >
                  Save Changes
                </button>

                <Link
                  href="/admin/badges"
                  className="
                    flex-1
                    text-center
                    bg-white/5
                    hover:bg-white/10
                    border
                    border-white/10
                    px-6
                    py-3
                    rounded-xl
                    font-bold
                    transition
                  "
                >
                  Cancel
                </Link>

              </div>

            </form>
          </div>

          {/* Preview */}
          <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-8">

            <h2 className="text-xl font-bold">
              Current Badge
            </h2>

            <div
              className="
                mt-5
                flex
                items-center
                gap-5
                bg-black/20
                border
                border-white/10
                rounded-2xl
                p-5
              "
            >
              <div className="text-5xl">
                {badge.icon}
              </div>

              <div>
                <h3 className="text-xl font-bold">
                  {badge.name}
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  {badge.description}
                </p>

                <span
                  className="
                    inline-block
                    mt-3
                    rounded-full
                    border
                    border-purple-500/20
                    bg-purple-500/10
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    text-purple-400
                  "
                >
                  {badge.category}
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}