module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/stories/*',
    '!src/entry.js',
    '!src/entry-dev.js',
    '!src/frontend-components-copies/*',
    '!src/bootstrap.js',
    '!src/bootstrap-dev.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/config/setupTests.js'],
  roots: ['<rootDir>/src/', '<rootDir>/src/test'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^uuid$': require.resolve('uuid'),
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!@openshift|lodash-es|@patternfly/react-icons|@patternfly/react-core|@patternfly/react-tokens|@patternfly/react-data-view).+(js|jsx)$'],
};
