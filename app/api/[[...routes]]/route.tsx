/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// @ts-ignore
import { Image, Box } from "./ui.js";
// @ts-ignore
import { neynarClient } from "./neynarClient.ts";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
// @ts-ignore
import { fetchLiquidityMiningScore } from "./client.ts";

const mainForegroundColor = "#E0453A";
const rankColor = "#F08303";
const pointsColor = "#4387D7";
const boxShadow = "6px 6px #E0453A";

const app = new Frog({
  debug: true,
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

const footerView = (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      width: "850",
      height: "58",
      bottom: 30,
      position: "absolute",
      alignItems: "center",
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
          fontFamily: "Instrument Sans",
          color: mainForegroundColor,
          fontSize: 25,
        }}
      >
        Design by
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
        fontSize: 25,
      }}
    >
      May 3, 2024, 08:14:15 UTC
    </h6>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
      }}
    >
      <h6
        style={{
          fontFamily: "Instrument Sans",
          color: mainForegroundColor,
          fontSize: 25,
        }}
      >
        Frame by
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
);
// Uncomment to use Edge Runtime
// export const runtime = "edge";

// @ts-ignore
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
            borderColor: mainForegroundColor,
            borderWidth: 15,
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

        {footerView}

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
    imageOptions: { width: 1080, height: 1080 },
    intents: [
      <TextInput placeholder="Search by FID" />,
      <Button value="Check" action="/check">
        Check
      </Button>,
    ],
  });
});

// @ts-ignore
app.frame("/check", async (c) => {
  const { frameData } = c;

  const fid = frameData?.fid ?? 0;
  const user = (await neynarClient.fetchBulkUsers([fid])).users[0];
  const username = user.username;
  const custodyAddress = user.verified_addresses.eth_addresses;
  const liqResponse = await fetchLiquidityMiningScore(1, custodyAddress);

  const totalPoints = liqResponse?.score.toFixed(0) ?? "N/A";
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

        {userView(username, fid, totalPoints, rank)}

        {footerView}
      </div>
    ),
    // @ts-ignore
    imageOptions: { width: 1080, height: 1080, debug: true },
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

const userView = (
  // pfpURL: string,
  username: string,
  fid: number,
  totalPoints: string,
  rank: string
) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 850,
        height: 303,
        color: mainForegroundColor,
        background: "white",
        borderColor: mainForegroundColor,
        borderRadius: 30,
        borderWidth: 2,
        boxShadow: boxShadow,
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
          width: "100%",
          alignItems: "center",
        }}
      >
        {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 150,
            height: 150,
            borderColor: mainForegroundColor,
            borderWidth: 2,
            marginRight: 20,
            marginLeft: 50,
            borderRadius: 300,
          }}
        >
          <Image
            src={pfpURL}
            width={"150"}
            height={"150"}
            objectFit={"cover"}
            borderRadius="100%"
          ></Image>
        </div> */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
          }}
        >
          <h1
            style={{
              fontSize: 64,
            }}
          >
            @{username}
          </h1>
          <h1
            style={{
              fontFamily: "Instrument Sans",
              marginTop: -24,
              fontSize: 28,
            }}
          >
            {fid}
          </h1>
        </div>
        <h1
          style={{
            marginLeft: "auto",
            fontSize: 96,
            color: rankColor,
            marginRight: 50,
          }}
        >
          #{rank}
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
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
              fontSize: 38,
              paddingRight: 8,
            }}
          >
            Todays points
          </h1>
          <h1
            style={{
              fontSize: 56,
              color: pointsColor,
            }}
          >
            {totalPoints}
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
              fontSize: 38,
              paddingRight: 8,
            }}
          >
            Total points
          </h1>
          <h1
            style={{
              fontSize: 56,
              color: pointsColor,
            }}
          >
            {totalPoints}
          </h1>
        </div>
      </div>
    </div>
  );
};
