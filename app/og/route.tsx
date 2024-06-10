import { ImageResponse } from "@vercel/og";
import {
  formatDate,
  mainForegroundColor,
  pointsColor,
  rankColor,
} from "../api/[[...routes]]/route";
import { Box, Image, Text, HStack, VStack } from "../api/[[...routes]]/ui";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const { searchParams } = req.nextUrl;

  const username = searchParams.get("username");
  const fid = searchParams.get("fid");
  const rank = searchParams.get("rank");
  const todayPoints = searchParams.get("todayPoints");
  const totalPoints = searchParams.get("totalPoints");

  const fontURL = new URL(
    `${baseUrl}/assets/InstrumentSans-Regular.otf`,
    import.meta.url
  );

  const fontData = await fetch(fontURL).then((res) => res.arrayBuffer());
  const fontDataNerko = await fetch(
    new URL(`${baseUrl}/assets/NerkoOne-Regular.ttf`, import.meta.url)
  ).then((res) => res.arrayBuffer());
  const fontDataSerif = await fetch(
    new URL(`${baseUrl}/assets/InstrumentSerif-Regular.ttf`, import.meta.url)
  ).then((res) => res.arrayBuffer());

  const formattedDate = formatDate(new Date());

  return new ImageResponse(
    (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        flexWrap="nowrap"
        height="100%"
        textAlign="center"
        width="100%"
      >
        <Box
          display="flex"
          position="absolute"
          background={{ custom: "white" }}
          borderColor={{ custom: mainForegroundColor }}
          borderWidth={{ custom: "20" }}
        >
          <Image src={`${baseUrl}/lines.png`} objectFit="contain"></Image>
        </Box>

        <Box display="flex" position="absolute">
          <Image src={`${baseUrl}/vectors2.png`} objectFit="contain"></Image>
        </Box>

        <Box paddingTop={"20"}>
          <h1
            style={{
              color: "white",
              fontSize: 100,
              background: mainForegroundColor,
              paddingTop: 8,
              paddingBottom: 8,
              paddingLeft: 32,
              paddingRight: 32,
              borderRadius: 120,
            }}
          >
            TN100x LP Points
          </h1>
        </Box>

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
          paddingLeft={"32"}
          paddingRight={"32"}
          paddingTop={"16"}
          marginTop={{ custom: "-100" }}
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

          <Box marginBottom={{ custom: "-25" }}>
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

          <HStack alignHorizontal="space-between" alignVertical="center">
            <Text
              font={{ custom: "Instrument Serif" }}
              size={{ custom: "48" }}
              color={{ custom: mainForegroundColor }}
            >
              Todays points
            </Text>
            <Text color={{ custom: pointsColor }} size={{ custom: "82" }}>
              {todayPoints}
            </Text>
          </HStack>
          <HStack alignHorizontal="space-between" alignVertical="center">
            <Text
              font={{ custom: "Instrument Serif" }}
              size={{ custom: "48" }}
              color={{ custom: mainForegroundColor }}
            >
              Total points
            </Text>
            <Text color={{ custom: pointsColor }} size={{ custom: "82" }}>
              {totalPoints}
            </Text>
          </HStack>
        </Box>
        <Box display="flex" position="absolute" paddingTop={{ custom: "254" }}>
          <Image
            src={`${baseUrl}/ham.png`}
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
    {
      width: 1080,
      height: 1080,
      fonts: [
        {
          name: "Nerko One",
          data: fontDataNerko,
          style: "normal",
        },
        {
          name: "Instrument Serif",
          data: fontDataSerif,
          style: "normal",
        },
        {
          name: "Instrument Sans",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}
