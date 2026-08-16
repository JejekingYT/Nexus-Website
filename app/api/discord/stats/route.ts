import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {

    const filePath = path.join(
      process.cwd(),
      "nexus-bot",
      "data",
      "stats.json"
    );


    if (!fs.existsSync(filePath)) {
      return NextResponse.json({});
    }


    const file = fs.readFileSync(
      filePath,
      "utf8"
    );


    const stats = JSON.parse(file);


    return NextResponse.json(stats);


  } catch (error) {

    console.error(
      "Stats API Error:",
      error
    );


    return NextResponse.json(
      {
        error: "Failed to load stats"
      },
      {
        status: 500
      }
    );

  }
}