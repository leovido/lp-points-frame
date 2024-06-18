/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// @ts-ignore
import { Box, HStack, Image, Text, VStack } from "./ui.js";
import { serveStatic } from "frog/serve-static";
// @ts-ignore
import { mainForegroundColor, pointsColor, rankColor } from "./color";
import { formatDate, getUserPoints } from "./helpers";
import { handle } from "frog/next";

interface State {
  isImageReady: boolean;
}

const app = new Frog<{ State: State }>({
  verify: false,
  initialState: {
    isImageReady: false,
  },
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
    width={{ custom: "520" }}
    height={{ custom: "33" }}
    bottom={{ custom: "44" }}
    alignHorizontal="center"
    alignVertical="center"
    position="absolute"
    justifyContent="space-around"
    borderColor={{ custom: mainForegroundColor }}
    background={{ custom: "white" }}
    borderWidth={{ custom: "2" }}
    borderRadius={{ custom: "50" }}
    boxShadow="3px 3px #E0453A"
  >
    <Box display="flex" flexDirection="row">
      <Text
        font={{ custom: "Instrument Serif" }}
        color={{ custom: mainForegroundColor }}
        size={{ custom: "15" }}
      >
        Design by{"  "}
      </Text>
      <Text color={{ custom: mainForegroundColor }} size={"20"}>
        @reallyryl
      </Text>
    </Box>
    <Text
      font={{ custom: "Instrument Sans" }}
      color={{ custom: mainForegroundColor }}
      size={{ custom: "12" }}
    >
      {formattedDate}
    </Text>
    <Box display="flex" flexDirection="row">
      <Text
        font={{ custom: "Instrument Serif" }}
        color={{ custom: mainForegroundColor }}
        size={{ custom: "15" }}
      >
        Frame by{"  "}
      </Text>
      <Text color={{ custom: mainForegroundColor }} size={"20"}>
        @leovido
      </Text>
    </Box>
  </Box>
);

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
          width={{ custom: "53%" }}
          height={"100%"}
          background={{ custom: "white" }}
          borderColor={{ custom: mainForegroundColor }}
          borderWidth={{ custom: "15" }}
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
            width={{ custom: "800" }}
            height={{ custom: "800" }}
            objectFit="cover"
          ></Image>
        </Box>

        <h1
          style={{
            color: "white",
            fontSize: 50,
            background: mainForegroundColor,
            marginTop: 130,
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: 32,
            paddingRight: 32,
            borderRadius: 120,
          }}
        >
          TN100x LP Points
        </h1>
        <h1
          style={{
            fontSize: 42,
            color: mainForegroundColor,
            width: "480",
            height: "190",
            background: "white",
            borderColor: mainForegroundColor,
            borderRadius: 15,
            borderWidth: 2,
            paddingLeft: 70,
            paddingRight: 70,
            paddingTop: 20,
            paddingBottom: 20,
            boxShadow: "3px 3px #E0453A",
          }}
        >
          Check your TN100x LP points from this frame
        </h1>

        <Box display="flex" position="absolute">
          <Image
            src="/floaties.png"
            width={{ custom: "600" }}
            height={{ custom: "600" }}
            objectFit="contain"
          ></Image>
        </Box>
        {footerView(formattedDate)}
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
  const { frameData, inputText, verified, deriveState } = c;

  // if (!verified) {
  //   return c.res({
  //     image: (
  //       <div
  //         key={"unverified-div"}
  //         style={{
  //           fontFamily: "Open Sans",
  //           alignItems: "center",
  //           backgroundColor: "white",
  //           backgroundSize: "100% 100%",
  //           display: "flex",
  //           flexDirection: "column",
  //           flexWrap: "nowrap",
  //           height: "100%",
  //           justifyContent: "center",
  //           textAlign: "center",
  //           width: "100%",
  //         }}
  //       >
  //         <p
  //           style={{
  //             fontFamily: "Nerko One",
  //             fontWeight: 700,
  //             fontSize: 45,
  //             color: mainForegroundColor,
  //           }}
  //         >
  //           Something went wrong
  //         </p>
  //       </div>
  //     ),
  //     intents: [
  //       <Button key={"restart"} action="/">
  //         Restart
  //       </Button>,
  //     ],
  //   });
  // }

  const unwrappedText = inputText !== undefined ? inputText : "";
  const fid = unwrappedText.length > 0 ? Number(unwrappedText) : frameData!.fid;

  const { username, totalPoints, todayPoints, rank } = await getUserPoints(fid);
  console.warn("does it get here");

  const imageLP = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/imageLP?todayPoints=${todayPoints}&totalPoints=${totalPoints}&fid=${fid}&username=${username}&rank=${rank}`
  );

  const state = deriveState((previousState) => {
    imageLP.statusText === "OK" && previousState.isImageReady;
  });
  const imageURL = `${process.env.NEXT_PUBLIC_URL}/api/imageLP?todayPoints=${todayPoints}&totalPoints=${totalPoints}&fid=${fid}&username=${username}&rank=${rank}`;

  // const pfpURL =
  //   (await neynarClient.fetchBulkUsers([fid])).users[0].pfp_url ?? "";

  return c.res({
    imageAspectRatio: "1:1",
    image: (
      <Box display="flex">
        <Image src={imageURL} objectFit="contain" />
      </Box>
    ),
    intents: [
      !state.isImageReady && (
        <Button value="refresh" action="/check">
          Refresh
        </Button>
      ),
      <Button value="Back" action="/">
        Back
      </Button>,
    ],

    headers: {
      ContentType: "image/png",
      "Content-Type": "image/png",
    },
  });
});

app.image("/imageLP", async (c) => {
  const reqJSON = c.req.query();
  const json = removeAmpFromKeys(reqJSON);
  const { todayPoints, totalPoints, fid, username, rank } = json;
  const baseUrl = process.env.NEXT_PUBLIC_API ?? "http://localhost:3000";
  const formattedDate = formatDate(new Date());

  return c.res({
    image: (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        flexWrap="nowrap"
        height="100%"
        textAlign="center"
        width="100%"
        borderColor={{ custom: mainForegroundColor }}
        borderWidth={{ custom: "20" }}
      >
        <Box height="100%" width="100%" position="absolute">
          <Image src={`${baseUrl}/user-bg.jpg`} objectFit="contain"></Image>
        </Box>
        <h1
          style={{
            color: "white",
            fontSize: 100,
            background: mainForegroundColor,
            marginTop: 50,
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: 32,
            paddingRight: 32,
            borderRadius: 120,
          }}
        >
          TN100x LP Points
        </h1>

        <Box
          display="flex"
          flexDirection="column"
          width={{ custom: "857" }}
          height={{ custom: "570" }}
          borderColor={{ custom: mainForegroundColor }}
          background={{ custom: "white" }}
          borderWidth={{ custom: "2" }}
          borderRadius={{ custom: "50" }}
          boxShadow={"6px 6px #E0453A"}
          marginBottom={{ custom: "80" }}
          paddingLeft={"32"}
          paddingRight={"32"}
        >
          <Box
            position="absolute"
            left={{ custom: "60%" }}
            top={{ custom: "-30" }}
            transform="translateX(-60%)"
            color={{ custom: "white" }}
            background={{ custom: mainForegroundColor }}
            justifyContent="center"
            paddingTop={"8"}
            paddingBottom={"8"}
            width={{ custom: "200" }}
            height={{ custom: "52" }}
            borderRadius={{ custom: "152" }}
          >
            <Box marginTop={{ custom: "-2" }}>
              <Text
                color={{ custom: "white" }}
                size={{ custom: "34" }}
                font={{ custom: "Instrument Serif" }}
                align="center"
              >
                Your stats
              </Text>
            </Box>
          </Box>

          <Box marginTop={{ custom: "20" }} marginBottom={{ custom: "-15" }}>
            <Text
              color={{ custom: mainForegroundColor }}
              size={{ custom: "48" }}
              font={{ custom: "Instrument Serif" }}
              align="right"
            >
              Rank
            </Text>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            width="100%"
            alignItems="center"
            alignContent="center"
            marginTop={"-20"}
          >
            <VStack>
              <Text
                size={{ custom: "80" }}
                color={{ custom: mainForegroundColor }}
              >
                @{username}
              </Text>
              <Text
                font={{ custom: "Instrument Sans" }}
                size={{ custom: "32" }}
                color={{ custom: mainForegroundColor }}
              >
                {fid}
              </Text>
            </VStack>
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

          <Box marginTop={{ custom: "-50" }} paddingBottom="18">
            <Text
              color={{ custom: "#D1BCBB" }}
              size={{ custom: "50" }}
              font={{ custom: "Instrument Serif" }}
              align="center"
            >
              ......................................................................
            </Text>
          </Box>

          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            alignHorizontal="center"
          >
            <Text
              font={{ custom: "Instrument Serif" }}
              size={{ custom: "48" }}
              color={{ custom: mainForegroundColor }}
              align="center"
            >
              Today's points:
            </Text>
            <Text
              color={{ custom: pointsColor }}
              size={{ custom: "82" }}
              align="center"
            >
              {todayPoints}
            </Text>
          </Box>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            alignHorizontal="center"
          >
            <Text
              font={{ custom: "Instrument Serif" }}
              size={{ custom: "48" }}
              color={{ custom: mainForegroundColor }}
            >
              Total points:
            </Text>
            <Text color={{ custom: pointsColor }} size={{ custom: "82" }}>
              {totalPoints}
            </Text>
          </Box>
        </Box>
        <Box display="flex" position="absolute" paddingTop={{ custom: "200" }}>
          <Image
            src={"/ham.png"}
            height={{ custom: "700" }}
            objectFit="contain"
          ></Image>
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          width={{ custom: "850" }}
          height={{ custom: "58" }}
          bottom={{ custom: "74" }}
          justifyContent="space-between"
          borderColor={{ custom: mainForegroundColor }}
          background={{ custom: "white" }}
          borderWidth={{ custom: "2" }}
          borderRadius={{ custom: "50" }}
          boxShadow={"6px 6px #E0453A"}
        >
          <HStack
            alignHorizontal="center"
            alignVertical="center"
            gap={"4"}
            padding={"6"}
          >
            <Text
              font={{ custom: "Instrument Serif" }}
              color={{ custom: mainForegroundColor }}
              size={{ custom: "25" }}
            >
              Design by{"  "}
            </Text>
            <Text
              color={{ custom: mainForegroundColor }}
              size={{ custom: "30" }}
            >
              @reallyryl
            </Text>
          </HStack>
          <HStack alignVertical="center" paddingTop={"8"}>
            <Text
              font={{ custom: "Instrument Sans" }}
              color={{ custom: mainForegroundColor }}
              size={{ custom: "20" }}
            >
              {formattedDate}
            </Text>
          </HStack>

          <HStack
            alignHorizontal="center"
            alignVertical="center"
            gap={"4"}
            padding={"6"}
          >
            <Text
              font={{ custom: "Instrument Serif" }}
              color={{ custom: mainForegroundColor }}
              size={{ custom: "25" }}
            >
              Frame by{"  "}
            </Text>
            <Text
              color={{ custom: mainForegroundColor }}
              size={{ custom: "30" }}
            >
              @leovido
            </Text>
          </HStack>
        </Box>
      </Box>
    ),
    headers: {
      "Cache-Control": "max-age=0",
      "Content-Type": "image/png",
      contentType: "image/png",
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
