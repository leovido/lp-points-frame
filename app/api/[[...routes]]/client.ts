import { LMScore, UserScore } from "./types.js";
import kv from "@vercel/kv";

let rank: number = 0;
export const fetchLiquidityMiningScore = async (
  page: number,
  wallets: string[]
): Promise<UserScore | undefined> => {
  try {
    const response = await fetch(
      `https://farcaster.dep.dev/lp/get-liquidity-scores?page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json: LMScore = await response.json();

    const foundUser = json.data.find((d) => {
      return wallets.includes(d.account);
    });

    if (foundUser === undefined) {
      if (page === json.totalPages) {
        return undefined;
      }
      rank += json.data.length;
      return fetchLiquidityMiningScore(page + 1, wallets);
    } else {
      const foundIndex = json.data.findIndex((d) => {
        return wallets.includes(d.account);
      });
      rank += foundIndex + 1;
      return {
        ...foundUser,
        rank,
      };
    }
  } catch (error) {
    throw new Error(`Failed to fetch liquidity mining score: ${error}`);
  }
};

export const fetchCurrentPoints = async (fid: number) => {
  const userPoints: { totalPoints: number; todaysPoints: number } | null =
    await kv.get(`${fid}-lp`);

  return userPoints;
};

export const fetchAllPoints = async (fid: number, lpPoints: number) => {
  const currentPoints = (await fetchCurrentPoints(fid)) ?? {
    todayPoints: 0,
    totalPoints: 0,
  };

  if (lpPoints !== currentPoints.totalPoints) {
    const newPoints = {
      totalPoints: lpPoints,
      todayPoints: lpPoints - currentPoints.totalPoints,
    };
    await kv.set(`${fid}-lp`, newPoints);
    return newPoints;
  } else {
    return currentPoints;
  }
};
