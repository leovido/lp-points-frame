// points.test.ts
import { fetchCurrentPoints, fetchAllPoints } from "../client";
import { kv } from "@vercel/kv";

// Mocking the kv.get and kv.set methods
jest.mock("@vercel/kv", () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

// Casting kv.get and kv.set to jest.Mock
const mockedKvGet = kv.get as jest.Mock;
const mockedKvSet = kv.set as jest.Mock;

describe("fetchCurrentPoints", () => {
  it("should return user points when found", async () => {
    const fid = 123;
    const userPoints = { totalPoints: 100, todaysPoints: 10 };
    mockedKvGet.mockResolvedValue(userPoints);

    const result = await fetchCurrentPoints(fid);
    expect(result).toEqual(userPoints);
    expect(kv.get).toHaveBeenCalledWith(`${fid}-lp`);
  });

  it("should return null when user points are not found", async () => {
    const fid = 123;
    mockedKvGet.mockResolvedValue(null);

    const result = await fetchCurrentPoints(fid);
    expect(result).toBeNull();
    expect(kv.get).toHaveBeenCalledWith(`${fid}-lp`);
  });
});

describe("fetchAllPoints", () => {
  it("should return updated points and set new values in kv when lpPoints is different", async () => {
    const fid = 123;
    const lpPoints = 150;
    const currentPoints = { totalPoints: 100, todaysPoints: 10 };
    mockedKvGet.mockResolvedValue(currentPoints);

    const result = await fetchAllPoints(fid, lpPoints);
    const newPoints = {
      totalPoints: lpPoints,
      todayPoints: lpPoints - currentPoints.totalPoints,
    };

    expect(result).toEqual(newPoints);
    expect(kv.set).toHaveBeenCalledWith(`${fid}-lp`, newPoints);
  });

  it("should return current points when lpPoints is the same", async () => {
    const fid = 123;
    const lpPoints = 100;
    const currentPoints = { totalPoints: 100, todaysPoints: 10 };
    mockedKvGet.mockResolvedValue(currentPoints);

    const result = await fetchAllPoints(fid, lpPoints);

    expect(result).toEqual(currentPoints);
    expect(kv.set).not.toHaveBeenCalled();
  });

  it("should handle case when current points are null", async () => {
    const fid = 123;
    const lpPoints = 150;
    mockedKvGet.mockResolvedValue(null);

    const result = await fetchAllPoints(fid, lpPoints);
    const newPoints = { totalPoints: lpPoints, todayPoints: lpPoints };

    expect(result).toEqual(newPoints);
    expect(kv.set).toHaveBeenCalledWith(`${fid}-lp`, newPoints);
  });
});
