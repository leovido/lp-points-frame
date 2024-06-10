import { ImageResponse } from "@vercel/og";
import { formatDate, mainForegroundColor } from "../api/[[...routes]]/route";
import { Box, Image, Text, HStack } from "../api/[[...routes]]/ui";
import { NextRequest } from "next/server";
import { footerView } from "../api/[[...routes]]/views/footerView";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_URL;

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
        <Box
          display="flex"
          flexDirection="row"
          width={{ custom: "850" }}
          height={{ custom: "58" }}
          bottom={{ custom: "74" }}
          justifyContent="space-between"
          // alignItems="center"
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
      debug: true,
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
