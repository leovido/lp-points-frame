import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { randomUUID } from "crypto";
import { deleteFileAfter, saveAsPNG, tsxToPNGBuffer } from "./tsxToPNG";

const SECONDS_BEFORE_PNG_IS_DELETED: number = 120;

export async function POST(req: NextRequest) {
  try {
    const reqJSON = await req.json();
    const { frameType, data } = reqJSON;

    let jsx: JSX.Element = <div>INSERT YOUR JSX HERE</div>;
    let fileName = `./${randomUUID}.png`;
    const filePath = path.join(process.cwd(), "public", "temp", fileName);
    let buffer = await tsxToPNGBuffer(jsx);
    saveAsPNG(buffer, filePath);
    deleteFileAfter(filePath, SECONDS_BEFORE_PNG_IS_DELETED);

    // Send the file path in the response
    return NextResponse.json({
      // process.env.NEXT_PUBLIC_HOST is the public domain of your app
      filePath: `${process.env.NEXT_PUBLIC_HOST}/temp/${fileName}`,
      status: "success",
      message: "Image Created Succesully!",
      timestamp: new Date().getTime(),
    });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
