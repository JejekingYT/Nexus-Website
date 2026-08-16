import Image from "next/image";
import CommunityReviewForm from "@/components/community/CommunityReviewForm";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: Date;
  user: {
    username: string;
    image: string | null;
  };
}

interface Props {
  reviews: Review[];
  communityId: number;
}

export default function CommunityReviews({
  reviews,
  communityId,
}: Props) {
  return (
    <div className="mt-24">

      <div className="text-center mb-10">

        <h2 className="text-4xl font-bold">
          💬 Community{" "}
          <span className="text-purple-400">
            Reviews
          </span>
        </h2>

        <p className="
          mt-4
          text-gray-400
          text-lg
          max-w-2xl
          mx-auto
        ">
          See what members of the Nexus community think about this community.
        </p>

      </div>


      <div className="mb-10">
        <CommunityReviewForm
            communityId={communityId}
        />
    </div>


      {reviews.length === 0 ? (

        <div className="
          glass
          p-10
          text-center
        ">

          <div className="text-5xl mb-5">
            💭
          </div>

          <h3 className="text-2xl font-bold">
            No Reviews Yet
          </h3>

          <p className="mt-3 text-gray-400">
            Be the first person to review this community.
          </p>

        </div>

      ) : (

        <div className="
          grid
          md:grid-cols-2
          gap-6
        ">

          {reviews.map((review) => (

            <div
              key={review.id}
              className="
                glass
                card-hover
                p-7
              "
            >

              <div className="
                flex
                items-center
                justify-between
                gap-4
              ">

                <div className="
                  flex
                  items-center
                  gap-4
                ">

                  {review.user.image ? (

                    <Image
                      src={review.user.image}
                      alt={review.user.username}
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

                    <div className="
                      w-12
                      h-12
                      rounded-full
                      bg-purple-500/20
                      border
                      border-purple-500/30
                      flex
                      items-center
                      justify-center
                      font-bold
                      text-purple-400
                    ">

                      {review.user.username
                        .charAt(0)
                        .toUpperCase()}

                    </div>

                  )}

                  <div>

                    <p className="font-bold">
                      {review.user.username}
                    </p>

                    <p className="
                      text-gray-500
                      text-sm
                    ">
                      Community Member
                    </p>

                  </div>

                </div>


                <div className="
                  flex
                  gap-1
                  text-yellow-400
                ">

                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}

                </div>

              </div>


              <p className="
                mt-6
                text-gray-300
                leading-relaxed
              ">
                "{review.comment}"
              </p>


              <p className="
                mt-5
                text-gray-500
                text-sm
              ">
                {new Date(
                  review.createdAt
                ).toLocaleDateString()}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}