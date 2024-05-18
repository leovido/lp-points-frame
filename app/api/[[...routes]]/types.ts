export type LMScore = {
  data: [UserScore];
  currentPage: number;
  totalPages: number;
};

export type UserScore = {
  account: string;
  score: number;
  rank: number;
};
