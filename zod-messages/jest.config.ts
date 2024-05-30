/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
  },
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  clearMocks: true,
  testEnvironment: "jsdom",
  transformIgnorePatterns: ["/node_modules/"]
};

export default config;
