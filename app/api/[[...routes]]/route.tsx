/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// @ts-ignore
import { Image } from "./ui.js";
// @ts-ignore
import { neynarClient } from "./neynarClient.ts";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
// @ts-ignore
import { fetchAllPoints, fetchLiquidityMiningScore } from "./client.ts";

const mainForegroundColor = "#E0453A";
const rankColor = "#F08303";
const pointsColor = "#4387D7";
const boxShadow = "6px 6px #E0453A";

const app = new Frog({
  verify: process.env.CONFIG === "PROD",
  assetsPath: "/",
  basePath: "/api",
  imageAspectRatio: "1:1",
  imageOptions: {
    fonts: [
      {
        name: "Nerko One",
        source: "google",
        weight: 400,
      },
      {
        name: "Instrument Serif",
        source: "google",
      },
      {
        name: "Instrument Sans",
        source: "google",
      },
      {
        name: "DM Serif Display",
        source: "google",
      },
    ],
  },
  // Supply a Hub to enable frame verification.
  hub: {
    apiUrl: "https://hubs.airstack.xyz",
    fetchOptions: {
      headers: {
        "x-airstack-hubs": process.env.AIRSTACK_API_KEY || "",
      },
    },
  },
});

const formatDate = (date: Date) => {
  const dateFormatter = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: false,
  });

  const formattedDate = dateFormatter.format(date);
  const formattedTime = timeFormatter
    .format(date)
    .replace(/^(\d{2}):(\d{2}):(\d{2})$/, "$1:$2");

  return `${formattedDate}, ${formattedTime} UTC`;
};
// Uncomment to use Edge Runtime
// export const runtime = "edge";

// @ts-ignore
app.frame("/", (c) => {
  const formattedDate = formatDate(new Date());
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          textAlign: "center",
          width: "100%",
          fontFamily: "Nerko One",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            zIndex: "-2",
            background: "white",
            borderColor: mainForegroundColor,
            borderWidth: 20,
          }}
        >
          <Image
            src="/lines.png"
            width="256"
            height="256"
            objectFit="contain"
          ></Image>
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
          }}
        >
          <Image
            src="/vectors.png"
            width="256"
            height="256"
            objectFit="contain"
          ></Image>
        </div>

        <h1
          style={{
            color: "white",
            fontSize: 100,
            background: mainForegroundColor,
            marginTop: 246,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 32,
            paddingRight: 32,
            borderRadius: 120,
          }}
        >
          TN100x LP Points
        </h1>

        <div style={{ display: "flex" }}>
          <h1
            style={{
              fontSize: 82,
              color: mainForegroundColor,
              width: "856",
              height: "319",
              background: "white",
              borderColor: mainForegroundColor,
              borderRadius: 30,
              borderWidth: 2,
              paddingLeft: 80,
              paddingRight: 80,
              paddingTop: 8,
              paddingBottom: 8,
              boxShadow: boxShadow,
            }}
          >
            Check your TN100x LP points from this frame
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "850",
            height: "58",
            bottom: 74,
            position: "absolute",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "space-around",
            textAlign: "center",
            borderColor: mainForegroundColor,
            background: "white",
            borderWidth: 2,
            borderRadius: 50,
            boxShadow: boxShadow,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <h6
              style={{
                fontFamily: "Instrument Serif",
                color: mainForegroundColor,
                fontSize: 25,
              }}
            >
              Design by{"  "}
            </h6>
            <h6
              style={{
                color: mainForegroundColor,
                fontSize: 30,
              }}
            >
              @reallyryl
            </h6>
          </div>
          <h6
            style={{
              fontFamily: "Instrument Sans",
              color: mainForegroundColor,
              fontSize: 20,
            }}
          >
            {formattedDate}
          </h6>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <h6
              style={{
                fontFamily: "Instrument Serif",
                color: mainForegroundColor,
                fontSize: 25,
              }}
            >
              Frame by{"  "}
            </h6>
            <h6
              style={{
                color: mainForegroundColor,
                fontSize: 30,
              }}
            >
              @leovido
            </h6>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
          }}
        >
          <Image
            src="/floaties.png"
            width="256"
            height="256"
            objectFit="contain"
          ></Image>
        </div>
      </div>
    ),
    // @ts-ignore
    imageOptions: {
      width: 1080,
      height: 1080,
      headers: {
        "content-type": "image/png",
      },
    },
    intents: [
      false && <TextInput placeholder="Search by FID" />,
      <Button value="Check" action="/check">
        Check
      </Button>,
    ],
  });
});

// @ts-ignore
app.frame("/check", async (c) => {
  const { frameData } = c;

  const formattedDate = formatDate(new Date());
  const fid = frameData?.fid ?? 0;

  const user = (await neynarClient.fetchBulkUsers([fid])).users[0];
  const username = user.username;
  const custodyAddress = user.verified_addresses.eth_addresses;
  const liqResponse = await fetchLiquidityMiningScore(1, custodyAddress);

  const _totalPoints = liqResponse?.score ?? 0;

  const { totalPoints: newTotalPoints, todayPoints: newTodaysPoints } =
    await fetchAllPoints(fid, _totalPoints);

  const totalPoints =
    newTotalPoints.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    }) ?? "N/A";
  const todayPoints =
    newTodaysPoints.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    }) ?? "N/A";

  const rank = liqResponse?.rank.toString() ?? "N/A";

  // const pfpURL =
  //   (await neynarClient.fetchBulkUsers([fid])).users[0].pfp_url ?? "";

  return c.res({
    image: (
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
            background: "white",
            borderColor: mainForegroundColor,
            borderWidth: 20,
          }}
        >
          <Image
            src="/lines.png"
            width="256"
            height="256"
            objectFit="contain"
            borderTopLeftRadius={"10"}
            borderTopRightRadius={"10"}
          ></Image>
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
          <h1
            style={{
              position: "absolute",
              left: "60%",
              top: -45,
              transform: "translateX(-60%)", // Changed to translateX for horizontal centering only
              color: "white",
              fontFamily: "Instrument Serif",
              fontSize: 34,
              background: mainForegroundColor,
              paddingTop: 8,
              paddingBottom: 8,
              display: "flex", // Added display flex for centering text within the element
              alignItems: "center",
              justifyContent: "center",
              width: 200, // Width as a number, not a string
              height: 52, // Height as a number, not a string
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
                color: "#F08303",
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
                color: "#4387D7",
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
                color: "#4387D7",
              }}
            >
              {totalPoints}
            </h1>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "850",
            height: "58",
            bottom: 74,
            position: "absolute",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "space-around",
            textAlign: "center",
            borderColor: mainForegroundColor,
            background: "white",
            borderWidth: 2,
            borderRadius: 50,
            boxShadow: boxShadow,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <h6
              style={{
                fontFamily: "Instrument Serif",
                color: mainForegroundColor,
                fontSize: 25,
              }}
            >
              Design by{"  "}
            </h6>
            <h6
              style={{
                color: mainForegroundColor,
                fontSize: 30,
              }}
            >
              @reallyryl
            </h6>
          </div>
          <h6
            style={{
              fontFamily: "Instrument Sans",
              color: mainForegroundColor,
              fontSize: 20,
            }}
          >
            {formattedDate}
          </h6>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <h6
              style={{
                fontFamily: "Instrument Serif",
                color: mainForegroundColor,
                fontSize: 25,
              }}
            >
              Frame by{"  "}
            </h6>
            <h6
              style={{
                color: mainForegroundColor,
                fontSize: 30,
              }}
            >
              @leovido
            </h6>
          </div>
        </div>
      </div>
    ),
    imageOptions: {
      width: 1080,
      height: 1080,
      headers: {
        "content-type": "image/png",
      },
    },
    intents: [
      <Button value="Back" action="/">
        Back
      </Button>,
      <Button value="leaderboard" action="/leaderboard">
        Leaderboard
      </Button>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
