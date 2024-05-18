import { LMScore, UserScore } from "./types.js";

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
