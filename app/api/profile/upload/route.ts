import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { prisma } from "@/lib/prisma";

import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    "Missing Cloudinary environment variables."
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export async function POST(request: Request) {
  try {
    // ==========================================
    // CHECK LOGIN
    // ==========================================

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    // ==========================================
    // GET USER
    // ==========================================

    const userId = Number(session.user.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json(
        {
          error: "Invalid user.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    // ==========================================
    // GET FILE
    // ==========================================

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No image was provided.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // FILE TYPE CHECK
    // ==========================================

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Only PNG, JPG, JPEG, and WebP images are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // FILE SIZE CHECK
    // ==========================================

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "The image must be smaller than 5 MB.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================
    // CONVERT FILE
    // ==========================================

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    // ==========================================
    // UPLOAD TO CLOUDINARY
    // ==========================================

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder: "nexus/profiles",
            resource_type: "image",
            transformation: [
              {
                width: 512,
                height: 512,
                crop: "fill",
                gravity: "face",
              },
            ],
          },
          (error, result) => {
            if (error) {
              console.error(
                "CLOUDINARY UPLOAD ERROR:",
                {
                  message:
                    error instanceof Error
                      ? error.message
                      : error,
                  name:
                    error instanceof Error
                      ? error.name
                      : "Unknown",
                  http_code:
                    typeof error === "object" &&
                    error !== null &&
                    "http_code" in error
                      ? error.http_code
                      : undefined,
                  error,
                }
              );

              reject(error);

              return;
            }

            if (!result) {
              reject(
                new Error(
                  "Cloudinary returned no result."
                )
              );

              return;
            }

            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );

      uploadStream.end(buffer);
    });

    // ==========================================
    // UPDATE USER
    // ==========================================

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        image: uploadResult.secure_url,
      },
    });

    // ==========================================
    // DELETE OLD CLOUDINARY IMAGE
    // ==========================================

    if (
      user.image &&
      user.image.includes("res.cloudinary.com")
    ) {
      try {
        const oldUrl = user.image;

        const match = oldUrl.match(
          /\/nexus\/profiles\/([^.?/]+)/
        );

        if (match?.[1]) {
          await cloudinary.uploader.destroy(
            `nexus/profiles/${match[1]}`
          );
        }
      } catch (error) {
        console.error(
          "OLD PROFILE IMAGE DELETE ERROR:",
          error
        );
      }
    }

    // ==========================================
    // SUCCESS
    // ==========================================

    return NextResponse.json({
      success: true,
      image: uploadResult.secure_url,
    });
  } catch (error) {
    console.error(
      "PROFILE IMAGE UPLOAD ERROR:",
      {
        message:
          error instanceof Error
            ? error.message
            : error,
        name:
          error instanceof Error
            ? error.name
            : "Unknown",
        http_code:
          typeof error === "object" &&
          error !== null &&
          "http_code" in error
            ? error.http_code
            : undefined,
        error,
      }
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while uploading your profile picture.",
      },
      {
        status: 500,
      }
    );
  }
}