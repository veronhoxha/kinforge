module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        uuid: require.resolve('uuid'),
        "/\.(jpg|jpeg|png|gif|webp|svg)$/": "<rootDir>/src/__mocks__/fileMock.js",
        "\\.(mp4)$": "<rootDir>/src/__mocks__/fileMock.js"
    },
};