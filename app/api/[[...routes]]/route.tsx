/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// @ts-ignore
import { Image } from "./ui.js";
// @ts-ignore
import { neynarClient } from "./neynarClient.js";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";

const mainForegroundColor = "#E0453A";
const rankColor = "#F08303";
const pointsColor = "#4387D7";

const app = new Frog({
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
        name: "Instrument Sans",
        source: "google",
        weight: 400,
      },
      {
        name: "DM Serif Display",
        source: "google",
      },
    ],
  },
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", (c) => {
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
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
            width: "620",
            height: "610",
            borderColor: mainForegroundColor,
            borderWidth: 15,
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
        <div
          style={{
            display: "flex",
            position: "absolute",
            width: "620",
            height: "610",
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
            fontSize: 60,
            background: mainForegroundColor,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 32,
            paddingRight: 32,
            borderRadius: 50,
          }}
        >
          TN100x LP Points
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            top: 298,
            left: 400,
            position: "absolute",
            borderColor: mainForegroundColor,
            width: 430,
            height: 168,
            background: mainForegroundColor,
            borderWidth: 2,
            borderRadius: 20,
          }}
        ></div>
        <div style={{ display: "flex" }}>
          <h1
            style={{
              fontSize: 40,
              width: 450,
              color: mainForegroundColor,
              background: "white",
              borderColor: mainForegroundColor,
              borderRadius: 10,
              borderWidth: 2,
              paddingLeft: 64,
              paddingRight: 64,
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            Check your TN100x LP points from this frame
          </h1>
        </div>

        {/* Border background */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            bottom: 28,
            right: 327,
            position: "absolute",
            borderColor: mainForegroundColor,
            width: "45%",
            height: 40,
            background: mainForegroundColor,
            borderWidth: 2,
            borderRadius: 20,
          }}
        ></div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            bottom: 30,
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            borderColor: mainForegroundColor,
            width: "45%",
            height: 40,
            background: "white",
            borderWidth: 2,
            borderRadius: 20,
          }}
        >
          <h6
            style={{
              fontFamily: "Instrument Sans",
              color: mainForegroundColor,
              fontSize: 15,
            }}
          >
            Design by @reallyryl
          </h6>
          <h6
            style={{
              fontFamily: "Instrument Sans",
              color: mainForegroundColor,
              fontSize: 12,
            }}
          >
            May 3, 2024, 08:14:15 UTC
          </h6>
          <h6
            style={{
              fontFamily: "Instrument Sans",
              color: mainForegroundColor,
              fontSize: 15,
            }}
          >
            Frame by @leovido
          </h6>
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            width: "620",
            height: "610",
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
    intents: [
      <TextInput placeholder="Search by FID" />,
      <Button value="Check" action="/check">
        Check
      </Button>,
    ],
  });
});

app.frame("/check", async (c) => {
  const { frameData } = c;

  const fid = frameData?.fid ?? 203666;
  const username = await neynarClient.fetchBulkUsers([fid]);

  const pfpURL =
    (await neynarClient.fetchBulkUsers([fid])).users[0].pfp_url ?? "";

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
            width: "620",
            height: "610",
            borderColor: mainForegroundColor,
            borderWidth: 15,
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
            fontSize: 60,
            background: mainForegroundColor,
            top: 24,
            height: "11.67vh",
            paddingLeft: 32,
            paddingRight: 32,
            borderRadius: 50,
          }}
        >
          TN100x LP Points
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 470,
            height: "28.05vh",
            color: mainForegroundColor,
            background: "white",
            borderColor: mainForegroundColor,
            borderRadius: 10,
            borderWidth: 2,
            boxShadow: "4px 4px #E0453A",
            marginTop: 40,
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: 70,
                height: 70,
                borderColor: mainForegroundColor,
                borderWidth: 2,
                marginRight: 20,
                borderRadius: 200,
              }}
            >
              <Image
                src={pfpURL}
                width={"70"}
                objectFit={"cover"}
                borderRadius="100%"
              ></Image>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              <h1
                style={{
                  fontSize: 34,
                }}
              >
                @username
              </h1>
              <h1
                style={{
                  fontFamily: "Instrument Sans",
                  marginTop: -24,
                  fontSize: 20,
                }}
              >
                {fid}
              </h1>
            </div>
            <h1
              style={{
                fontSize: 50,
                color: rankColor,
              }}
            >
              #43
            </h1>
          </div>

          <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <h1
                style={{
                  fontFamily: "Instrument Sans",
                  fontSize: 20,
                  paddingRight: 8,
                }}
              >
                Todays points
              </h1>
              <h1
                style={{
                  fontSize: 30,
                  color: pointsColor,
                }}
              >
                3,000
              </h1>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <h1
                style={{
                  fontFamily: "Instrument Sans",
                  fontSize: 20,
                  paddingRight: 8,
                }}
              >
                Todays points
              </h1>
              <h1
                style={{
                  fontSize: 30,
                  color: pointsColor,
                }}
              >
                3,000
              </h1>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            bottom: 30,
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            borderColor: mainForegroundColor,
            width: "45%",
            height: 40,
            background: "white",
            borderWidth: 2,
            borderRadius: 20,
          }}
        >
          <h6
            style={{
              fontFamily: "Instrument Sans",
              color: mainForegroundColor,
              fontSize: 15,
            }}
          >
            Design by @reallyryl
          </h6>
          <h6
            style={{
              fontFamily: "Instrument Sans",
              color: mainForegroundColor,
              fontSize: 12,
            }}
          >
            May 3, 2024, 08:14:15 UTC
          </h6>
          <h6
            style={{
              fontFamily: "Instrument Sans",
              color: mainForegroundColor,
              fontSize: 15,
            }}
          >
            Frame by @leovido
          </h6>
        </div>
      </div>
    ),
    intents: [
      <Button value="Back" action="/">
        Back
      </Button>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
