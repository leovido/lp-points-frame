import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import { deleteFileAfter, saveAsPNG, tsxToPNGBuffer } from "./tsxToPNG";
import {
  footerView,
  mainForegroundColor,
  pointsColor,
  rankColor,
} from "../api/[[...routes]]/route";

const SECONDS_BEFORE_PNG_IS_DELETED: number = 120;

// Function to convert an image file to a Base64-encoded string
function encodeImageToBase64(filePath: string): string {
  const file = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1); // Get file extension without the dot
  const mimeType = `image/${ext}`;
  return `data:${mimeType};base64,${file.toString("base64")}`;
}

const imagePath = path.join(process.cwd(), "public", "lines.png");
const base64Image = encodeImageToBase64(imagePath);

const hamImagePath = path.join(process.cwd(), "public", "ham.png");
const base64HamImage = encodeImageToBase64(hamImagePath);

export async function POST(req: NextRequest) {
  try {
    const reqJSON = await req.json();
    const { todayPoints, totalPoints, fid, username, rank, formattedDate } =
      reqJSON;

    let jsx: JSX.Element = (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          textAlign: "center",
          height: "100%",
          width: "100%",
          fontFamily: "Nerko One",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            zIndex: "-2",
            width: "100%",
            height: "100%",
            background: "white",
            borderColor: mainForegroundColor,
            borderWidth: 20,
          }}
        >
          <img src={base64Image} />
        </div>

        <h1
          style={{
            color: "white",
            fontSize: 100,
            background: mainForegroundColor,
            marginTop: 60,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 32,
            paddingRight: 32,
            borderRadius: 120,
          }}
        >
          TN100x LP Points
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 857,
            height: 570,
            color: "#E0453A",
            background: "white",
            borderColor: "#E0453A",
            borderRadius: 30,
            borderWidth: 2,
            boxShadow: "6px 6px #E0453A",
            marginTop: 40,
            paddingLeft: 55,
            paddingRight: 55,
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              position: "absolute",
              zIndex: "10",
              top: -40,
              left: -60,
              width: "130%",
              height: "130%",
            }}
          >
            <img src={base64HamImage} />
          </div>
          <h1
            style={{
              position: "absolute",
              left: "60%",
              top: -45,
              transform: "translateX(-60%)",
              color: "white",
              fontFamily: "Instrument Serif",
              fontSize: 34,
              background: mainForegroundColor,
              paddingTop: 8,
              paddingBottom: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 200,
              height: 52,
              borderRadius: 120,
            }}
          >
            Your stats
          </h1>

          <h1
            style={{
              fontSize: 48,
              fontFamily: "Instrument Serif",
              marginLeft: "auto",
              marginTop: 20,
              marginBottom: -80,
            }}
          >
            Rank
          </h1>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h1
                style={{
                  fontSize: 80,
                }}
              >
                @{username}
              </h1>
              <h1
                style={{
                  fontFamily: "Instrument Sans",
                  marginTop: -24,
                  fontSize: 32,
                }}
              >
                {fid}
              </h1>
            </div>
            <h1
              style={{
                fontSize: 120,
                color: rankColor,
                marginLeft: "auto",
              }}
            >
              #{rank}
            </h1>
          </div>
          <p
            style={{
              fontFamily: "Instrument Serif",
              fontSize: 50,
              color: "#D1BCBB",
              marginTop: -60,
              marginBottom: -40,
              textAlign: "center",
            }}
          >
            ......................................................................
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1
              style={{
                fontFamily: "Instrument Serif",
                fontSize: 48,
              }}
            >
              Today's points
            </h1>
            <h1
              style={{
                fontSize: 82,
                color: pointsColor,
              }}
            >
              {todayPoints}
            </h1>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: -90,
              marginBottom: 40,
            }}
          >
            <h1
              style={{
                fontFamily: "Instrument Serif",
                fontSize: 48,
              }}
            >
              Total points
            </h1>
            <h1
              style={{
                fontSize: 82,
                color: pointsColor,
              }}
            >
              {totalPoints}
            </h1>
          </div>
        </div>

        {footerView(formattedDate)}
      </div>
    );
    let fileName = `mysuperfile.png`;
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
