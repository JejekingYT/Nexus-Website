import Navbar from "@/components/layout/NavbarWrapper";
import Link from "next/link";
import Image from "next/image";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

import PageHeader from "@/components/admin/PageHeader";

import {
  approveCommunityReview,
  deleteCommunityReview,
} from "./actions";

export default async function AdminReviewsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const currentUser = await prisma.user.findUnique({
    where: {
      discordId: session.user.id,
    },
  });

    if (!currentUser) {
        redirect("/");
    }

    // Only the Owner can manage community reviews.
    if (currentUser.role !== "OWNER") {
        redirect("/admin");
    }

  const reviews = await prisma.communityReview.findMany({
    where: {
      status: "PENDING",
    },

    include: {
      user: true,
      community: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      <Navbar />

      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-center justify-between gap-6 flex-wrap">
            <PageHeader
              title="Community Reviews"
              description="Review and manage community reviews waiting for approval."
            />

            <Link
              href="/admin"
              className="
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-6
                py-3
                font-bold
                transition
                hover:bg-white/10
              "
            >
              ← Back to Admin
            </Link>
          </div>

          <div className="mt-12">

            {reviews.length === 0 ? (

              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  p-12
                  text-center
                "
              >

                <div className="text-6xl">
                  ✅
                </div>

                <h2 className="mt-6 text-3xl font-bold">
                  No Pending Reviews
                </h2>

                <p className="mt-3 text-gray-400 text-lg">
                  There are currently no community reviews waiting for approval.
                </p>

              </div>

            ) : (

              <div className="space-y-6">

                {reviews.map((review) => (

                  <div
                    key={review.id}
                    className="
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/5
                      p-7
                      transition
                      hover:border-purple-500/30
                    "
                  >

                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                      <div className="flex items-start gap-5">

                        {review.user.image ? (

                          <Image
                            src={review.user.image}
                            alt={review.user.username}
                            width={56}
                            height={56}
                            className="
                              w-14
                              h-14
                              rounded-full
                              object-cover
                              border
                              border-white/10
                              shrink-0
                            "
                          />

                        ) : (

                          <div
                            className="
                              w-14
                              h-14
                              rounded-full
                              bg-purple-500/20
                              border
                              border-purple-500/30
                              flex
                              items-center
                              justify-center
                              font-bold
                              text-xl
                              text-purple-400
                              shrink-0
                            "
                          >
                            {review.user.username
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                        )}

                        <div>

                          <div className="flex items-center gap-3 flex-wrap">

                            <h3 className="text-xl font-bold">
                              {review.user.username}
                            </h3>

                            <span
                              className="
                                rounded-full
                                border
                                border-yellow-500/20
                                bg-yellow-500/10
                                px-3
                                py-1
                                text-xs
                                font-bold
                                text-yellow-400
                              "
                            >
                              PENDING
                            </span>

                          </div>

                          <p className="mt-1 text-gray-500 text-sm">
                            Submitted{" "}
                            {new Date(
                              review.createdAt
                            ).toLocaleDateString()}
                          </p>

                        </div>

                      </div>


                      <div className="text-left lg:text-right">

                        <p className="text-sm text-gray-500">
                          Community
                        </p>

                        <p className="mt-1 text-lg font-bold text-purple-400">
                          {review.community.name}
                        </p>

                      </div>

                    </div>


                    <div className="mt-7">

                      <div className="flex items-center gap-3">

                        <span className="text-sm text-gray-400">
                          Rating:
                        </span>

                        <div className="flex gap-1 text-xl text-yellow-400">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>

                        <span className="text-sm text-gray-500">
                          {review.rating}/5
                        </span>

                      </div>


                      <div
                        className="
                          mt-5
                          rounded-xl
                          border
                          border-white/10
                          bg-black/20
                          p-5
                        "
                      >

                        <p className="text-gray-300 leading-relaxed">
                          "{review.comment}"
                        </p>

                      </div>

                    </div>


                    <div className="mt-7 flex flex-wrap gap-3">

                      <form
                        action={async () => {
                          "use server";

                          await approveCommunityReview(review.id);
                        }}
                      >

                        <button
                          type="submit"
                          className="
                            rounded-xl
                            bg-green-600
                            px-6
                            py-3
                            font-bold
                            transition
                            hover:bg-green-700
                            hover:scale-105
                          "
                        >
                          ✓ Approve Review
                        </button>

                      </form>


                      <form
                        action={async () => {
                          "use server";

                          await deleteCommunityReview(review.id);
                        }}
                      >

                        <button
                          type="submit"
                          className="
                            rounded-xl
                            bg-red-600/80
                            px-6
                            py-3
                            font-bold
                            transition
                            hover:bg-red-700
                            hover:scale-105
                          "
                        >
                          ✕ Decline & Delete
                        </button>

                      </form>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>
      </section>
    </main>
  );
}