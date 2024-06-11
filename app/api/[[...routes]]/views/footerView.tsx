import { mainForegroundColor } from "../color";
import { Box } from "../ui";
import { ImageResponse } from "@vercel/og";

export const footerView = (formattedDate: string) => {
  return new ImageResponse(
    (
      <>
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
      </>
    )
  );
};

export const footerViewOld = (formattedDate: string) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      width: "850",
      height: "58",
      bottom: 74,
      position: "absolute",
      alignItems: "center",
      justifyContent: "space-around",
      textAlign: "center",
      borderColor: mainForegroundColor,
      background: "white",
      borderWidth: 2,
      borderRadius: 50,
      boxShadow: "6px 6px #E0453A",
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
);
