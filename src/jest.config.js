module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    moduleNameMapper: {
        uuid: require.resolve('uuid'),
        "/\.(jpg|jpeg|png|gif|webp|svg)$/": "./fileMock.js"
    },
  };
  