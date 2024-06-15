// export const userView = (
//   // pfpURL: string,
//   username: string,
//   fid: number,
//   totalPoints: string,
//   todayPoints: string,
//   rank: string
// ) => {
//   return (
//     <Box display="flex">
//       <Box
//         position="absolute"
//         left={{ custom: "60%" }}
//         top={{ custom: "-45" }}
//         transform="translateX(-60%)"
//         color={{ custom: "white" }}
//         background={{ custom: mainForegroundColor }}
//         paddingTop={"8"}
//         paddingBottom={"8"}
//         display="flex"
//         alignItems="center"
//         justifyContent="center"
//         width={{ custom: "200" }}
//         height={"52"}
//         borderRadius={{ custom: "152" }}
//       >
//         <Text
//           color={{ custom: "white" }}
//           size={{ custom: "34" }}
//           font={{ custom: "Instrument Serif" }}
//           align="center"
//         >
//           Your stats
//         </Text>
//       </Box>
//       <Text
//         color={{ custom: "#D1BCBB" }}
//         size={{ custom: "48" }}
//         font={{ custom: "Instrument Serif" }}
//         align="center"
//       >
//         Rank
//       </Text>
//       <Box
//         display="flex"
//         flexDirection="row"
//         width="100%"
//         alignItems="center"
//         alignContent="center"
//       >
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <h1
//             style={{
//               fontSize: 80,
//             }}
//           >
//             @{username}
//           </h1>
//           <h1
//             style={{
//               fontFamily: "Instrument Sans",
//               marginTop: -24,
//               fontSize: 32,
//             }}
//           >
//             {fid}
//           </h1>
//         </div>
//         <h1
//           style={{
//             fontSize: 120,
//             color: rankColor,
//             marginLeft: "auto",
//           }}
//         >
//           #{rank}
//         </h1>
//       </Box>

import { fetchAllPoints, fetchLiquidityMiningScore, resetRank } from "./client";
import { neynarClient } from "./neynarClient";

//       <Text
//         color={{ custom: "#D1BCBB" }}
//         size={{ custom: "50" }}
//         font={{ custom: "Instrument Serif" }}
//       >
//         {todayPoints}
//       </Text>

//       <Text
//         color={{ custom: "#D1BCBB" }}
//         size={{ custom: "50" }}
//         font={{ custom: "Instrument Serif" }}
//         align="center"
//       >
//         ......................................................................
//       </Text>

//       <HStack alignHorizontal="center" alignVertical="center">
//         <Text font={{ custom: "Instrument Serif" }} size={"48"}>
//           Todays points
//         </Text>
//         <Text color={{ custom: pointsColor }} size={{ custom: "82" }}>
//           {todayPoints}
//         </Text>
//       </HStack>
//       <HStack alignHorizontal="center" alignVertical="center">
//         <Text font={{ custom: "Instrument Serif" }} size={"48"}>
//           Total points
//         </Text>
//         <Text color={{ custom: pointsColor }} size={{ custom: "82" }}>
//           {totalPoints}
//         </Text>
//       </HStack>
//     </Box>
//   );
// };

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

export const getUserPoints = async (fid: number) => {
  const userResponse = await neynarClient.fetchBulkUsers([fid]);
  const user = userResponse.users[0];
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

  resetRank();

  return { username, totalPoints, todayPoints, rank };
};
