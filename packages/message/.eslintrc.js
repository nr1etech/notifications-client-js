module.exports = {
	"root": true,
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"tsconfigRootDir": __dirname,
		"project": ["./tsconfig.json"],
	},
	"plugins": [
		"@typescript-eslint",
	],
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:@typescript-eslint/strict",
	],
	"rules": {
		"no-empty": 0,	// I'll have empty blocks if I want to
		"@typescript-eslint/no-empty-interface": 0,
		"@typescript-eslint/no-unused-vars": [2, { "args": "none" }],	// Some interface function implementations don't use all the parameters, and that's ok
		"@typescript-eslint/no-inferrable-types": 0,	// some times I like to explicitly give the type
		"@typescript-eslint/no-non-null-assertion": 0,	// used judiciously
	},
};
