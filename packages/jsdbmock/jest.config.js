// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
    verbose: true,
    testEnvironment: "node",
    transform: {
      "^.+\\.csv$": "./jest-csv-transformer.js",
      "^.+\\.[t|j]s$": "babel-jest"
    },
  };
  
  module.exports = config;
