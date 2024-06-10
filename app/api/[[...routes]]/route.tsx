/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// @ts-ignore
import { Box, HStack, Image, Text } from "./ui.js";
// @ts-ignore
import { neynarClient } from "./neynarClient.ts";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
// @ts-ignore
import { fetchAllPoints, fetchLiquidityMiningScore } from "./client.ts";
// @ts-ignore

export const mainForegroundColor = "#E0453A";
export const rankColor = "#F08303";
export const pointsColor = "#4387D7";

const app = new Frog({
  verify: false,
  assetsPath: "/",
  basePath: "/api",
  imageAspectRatio: "1:1",
  imageOptions: {
    height: 1080,
    width: 1080,
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
  hub: {
    apiUrl: "https://hubs.airstack.xyz",
    fetchOptions: {
      headers: {
        "x-airstack-hubs": process.env.AIRSTACK_API_KEY || "",
      },
    },
  },
});

const footerView = (formattedDate: string) => (
  <Box
    display="flex"
    flexDirection="row"
    width={{ custom: "850" }}
    height={{ custom: "58" }}
    bottom={{ custom: "74" }}
    position="absolute"
    alignItems="center"
    justifyContent="space-around"
    textAlign="center"
    borderColor={{ custom: mainForegroundColor }}
    background={{ custom: "white" }}
    borderWidth={{ custom: "2" }}
    borderRadius={{ custom: "50" }}
    boxShadow={"6px 6px #E0453A"}
  >
    <Box flexDirection="row" alignItems="center">
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
    </Box>
    <h6
      style={{
        fontFamily: "Instrument Sans",
        color: mainForegroundColor,
        fontSize: 20,
      }}
    >
      {formattedDate}
    </h6>
    <Box flexDirection="row" alignItems="center">
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
    </Box>
  </Box>
);

export const userView = (
  // pfpURL: string,
  username: string,
  fid: number,
  totalPoints: string,
  todayPoints: string,
  rank: string
) => {
  return (
    <Box display="flex">
      <Box
        position="absolute"
        left={{ custom: "60%" }}
        top={{ custom: "-45" }}
        transform="translateX(-60%)"
        color={{ custom: "white" }}
        background={{ custom: mainForegroundColor }}
        paddingTop={"8"}
        paddingBottom={"8"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        width={{ custom: "200" }}
        height={"52"}
        borderRadius={{ custom: "152" }}
      >
        <Text
          color={{ custom: "white" }}
          size={{ custom: "34" }}
          font={{ custom: "Instrument Serif" }}
          align="center"
        >
          Your stats
        </Text>
      </Box>
      <Text
        color={{ custom: "#D1BCBB" }}
        size={{ custom: "48" }}
        font={{ custom: "Instrument Serif" }}
        align="center"
      >
        Rank
      </Text>
      <Box
        display="flex"
        flexDirection="row"
        width="100%"
        alignItems="center"
        alignContent="center"
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
      </Box>

      <Text
        color={{ custom: "#D1BCBB" }}
        size={{ custom: "50" }}
        font={{ custom: "Instrument Serif" }}
      >
        {todayPoints}
      </Text>

      <Text
        color={{ custom: "#D1BCBB" }}
        size={{ custom: "50" }}
        font={{ custom: "Instrument Serif" }}
        align="center"
      >
        ......................................................................
      </Text>

      {/* <p
        style={{
          fontFamily: "Instrument Serif",
          marginTop: -60,
          marginBottom: -40,
        }}
      ></p> */}
      <HStack alignHorizontal="space-between" alignVertical="center">
        <Text font={{ custom: "Instrument Serif" }} size={"48"}>
          Todays points
        </Text>
        <Text color={{ custom: pointsColor }} size={{ custom: "82" }}>
          {todayPoints}
        </Text>
      </HStack>
      <HStack alignHorizontal="space-between" alignVertical="center">
        <Text font={{ custom: "Instrument Serif" }} size={"48"}>
          Total points
        </Text>
        <Text color={{ custom: pointsColor }} size={{ custom: "82" }}>
          {totalPoints}
        </Text>
      </HStack>
    </Box>
  );
};

export const formatDate = (date: Date) => {
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

app.frame("/", (c) => {
  const formattedDate = formatDate(new Date());

  return c.res({
    image: (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        flexWrap="nowrap"
        height="100%"
        textAlign="center"
        width="100%"
        fontFamily={{ custom: "Nerko One" }}
      >
        <Box
          display="flex"
          position="absolute"
          background={{ custom: "white" }}
          borderColor={{ custom: mainForegroundColor }}
          borderWidth={{ custom: "20" }}
        >
          <Image
            src="/lines.png"
            width="256"
            height="256"
            objectFit="contain"
          ></Image>
        </Box>
        <Box display="flex" position="absolute">
          <Image
            src="/vectors2.png"
            width="256"
            height="256"
            objectFit="contain"
          ></Image>
        </Box>

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
            boxShadow: "6px 6px #E0453A",
          }}
        >
          Check your TN100x LP points from this frame
        </h1>

        {footerView(formattedDate)}
        <Box display="flex" position="absolute">
          <Image
            src="/floaties.png"
            width="256"
            height="256"
            objectFit="contain"
          ></Image>
        </Box>
      </Box>
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
  const { frameData, inputText } = c;

  const formattedDate = formatDate(new Date());
  const unwrappedText = inputText !== undefined ? inputText : "";
  const fid = unwrappedText.length > 0 ? Number(unwrappedText) : frameData!.fid;

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

  const params = new URLSearchParams({
    totalPoints: totalPoints,
    todayPoints: todayPoints,
    rank: rank,
    fid: fid.toString(),
    username: username,
  });

  const imageURL = `http://localhost:3000/api/imageLP?${params.toString()}`;

  const jsx = <Image src={imageURL} objectFit="contain" />;

  return c.res({
    image: jsx,
    intents: [
      <Button value="Back" action="/">
        Back
      </Button>,
    ],
  });
});

app.image("/imageLP", async (c) => {
  const reqJSON = c.req.query();
  const json = removeAmpFromKeys(reqJSON);
  const { todayPoints, totalPoints, fid, username, rank } = json;

  // const formattedDate = formatDate(new Date());

  const imageUrl = `http://localhost:3000/og?totalPoints=${totalPoints}&todayPoints=${todayPoints}&rank=${rank}&fid=${fid}&username=${username}`;

  return c.res({
    image: <Image src={imageUrl} objectFit="contain" />,
    headers: {
      "Cache-Control": "max-age=0",
    },
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

function removeAmpFromKeys(obj: Record<string, string>) {
  const newObj: Record<string, string> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = key.replace(/^amp;/, "");
      newObj[newKey] = obj[key];
    }
  }
  return newObj;
}

// const mainView = (children: JSX.Element): JSX.Element => {
//   return (
//     <Box
//       alignItems="center"
//       display="flex"
//       flexDirection="column"
//       flexWrap="nowrap"
//       height="100%"
//       textAlign="center"
//       width="100%"
//       fontFamily={{ custom: "Nerko One" }}
//     >
//       <Box
//         display="flex"
//         position="absolute"
//         background={{ custom: "white" }}
//         borderColor={{ custom: mainForegroundColor }}
//         borderWidth={{ custom: "20" }}
//       >
//         <Image
//           src="/lines.png"
//           width="256"
//           height="256"
//           objectFit="contain"
//         ></Image>
//       </Box>
//       <Box display="flex" position="absolute">
//         <Image
//           src="/vectors2.png"
//           width="256"
//           height="256"
//           objectFit="contain"
//         ></Image>
//       </Box>

//       <h1
//         style={{
//           color: "white",
//           fontSize: 100,
//           background: mainForegroundColor,
//           marginTop: 246,
//           paddingTop: 8,
//           paddingBottom: 8,
//           paddingLeft: 32,
//           paddingRight: 32,
//           borderRadius: 120,
//         }}
//       >
//         TN100x LP Points
//       </h1>
//       {children}
//     </Box>
//   );
// };
