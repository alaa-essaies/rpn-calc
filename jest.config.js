// jest.config.js
module.exports = {
    preset: 'ts-jest', // Use ts-jest preset for TypeScript
    testEnvironment: 'jsdom', // Use jsdom as the test environment
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Setup file
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.jest.js' }],
    },
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.jest.json', // Path to your Jest TypeScript config
      },
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Recognize these extensions
  };
  