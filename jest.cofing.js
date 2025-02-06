export default {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest"
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    transformIgnorePatterns: ["/node_modules/"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    }
};
