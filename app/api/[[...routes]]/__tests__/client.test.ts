import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fetchLiquidityMiningScore } from "../client.js";

type FetchResponse = {
  ok: boolean;
  json: () => Promise<{ data: { account: string; score: number }[] }>;
};

const mockFetch = (global.fetch = jest.fn() as jest.MockedFunction<
  typeof fetch
>);

describe("fetchLiquidityMiningScore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return found user", async () => {
    const mockResponse: FetchResponse = {
      ok: true,
      json: async () => ({
        data: [
          {
            account: "0x2452e136265e4b2ce559534e9eb18e9907f45973",
            score: 185639.6279888449,
            rank: 1,
          },
          { account: "wallet2", score: 200 },
        ],
      }),
    };

    mockFetch.mockResolvedValue(mockResponse as unknown as Response);

    const result = await fetchLiquidityMiningScore(1, [
      "0x2452e136265e4b2ce559534e9eb18e9907f45973",
    ]);
    expect(result).toEqual({
      account: "0x2452e136265e4b2ce559534e9eb18e9907f45973",
      score: 185639.6279888449,
      rank: 1,
    });
  });

  it("should return null when user not found", async () => {
    const mockResponse: FetchResponse = {
      ok: true,
      json: async () => ({
        data: [
          {
            account: "0x2452e136265e4b2ce559534e9eb18e9907f45973",
            score: 185639.6279888449,
          },
          { account: "wallet2", score: 200 },
        ],
        totalPages: 9,
      }),
    };

    mockFetch.mockResolvedValue(mockResponse as unknown as Response);

    const result = await fetchLiquidityMiningScore(1, ["wallet1"]);
    expect(result).toBeUndefined();
  });

  it("should handle fetch error", async () => {
    mockFetch.mockRejectedValue(new Error() as unknown as Response);
    expect(fetchLiquidityMiningScore(1, ["wallet1"])).rejects.toThrow();
  });
});
