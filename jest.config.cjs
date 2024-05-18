// jest.config.cjs

const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["json", "text", "lcov", "clover"],
  moduleFileExtensions: [
    "js",
    "mjs",
    "cjs",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node",
  ],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  preset: "ts-jest",
  // setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  collectCoverageFrom: [
    "**/*.{js,ts,jsx,tsx}", // Adjust this pattern to match your source files
    "!src/**/*.d.ts", // Exclude type declaration files
  ],
};

module.exports = config;
