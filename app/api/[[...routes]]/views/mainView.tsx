/** @jsxImportSource frog/jsx */
import { ImageResponse } from "@vercel/og";
import { mainForegroundColor } from "../route";
import { Box, Image } from "../ui";

export const mainView = (children: JSX.Element) => {
  return new ImageResponse(
    (
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
        {children}
      </Box>
    )
  );
};
