// -----------------------------------------------------------------------------
// Deps
// -----------------------------------------------------------------------------

const tsConfig = require('./tsconfig.json');

// -----------------------------------------------------------------------------
// Jest config
// -----------------------------------------------------------------------------

module.exports = {
	clearMocks: true,
	collectCoverage: true,
	cacheDirectory: '<rootDir>/.cache/jest',
	coverageReporters: ['json-summary', 'lcov'],
	displayName: 'tsc',
	testEnvironment: 'node',
	moduleDirectories: ['node_modules', 'src'],
	moduleFileExtensions: ['ts', 'js', 'node'],
	transform: {
		'.ts': ['ts-jest']
	},
	globals: {
		'ts-jest': {
			tsconfig: {
				...tsConfig.compilerOptions
			}
		}
	}
};

