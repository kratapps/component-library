const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');
const setupFilesAfterEnv = jestConfig.setupFilesAfterEnv || [];
setupFilesAfterEnv.push('<rootDir>/jest-sa11y-setup.js');
module.exports = {
    ...jestConfig,
    moduleNameMapper: {
        /* CSS library import fix in test context. See:
    https://github.com/salesforce/sfdx-lwc-jest/issues/288) */
        '^c/cssLibrary$': '<rootDir>/src/main/default/lwc/cssLibrary/cssLibrary.css',
        // Jest mocks
        '^lightning/platformShowToastEvent$':
            '<rootDir>/node_modules/@salesforce/sfdx-lwc-jest/src/lightning-stubs/platformShowToastEvent/platformShowToastEvent.js',
        '^lightning/modal$': '<rootDir>/src/test/jest-mocks/lightning/modal'
    },
    setupFiles: ['jest-canvas-mock'],
    setupFilesAfterEnv,
    testTimeout: 10000
};
