module.exports = {
  root: true,
  env: {
    browser: true,
    es2019: true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 10,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  ignorePatterns: ['.eslintrc.js'],
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  overrides: [
    {
      files: ['src/**/*.+(js|ts)'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.json',
      },
      plugins: ['@typescript-eslint/eslint-plugin', 'custom-rules'],
      extends: ['plugin:prettier/recommended'],
      env: {
        node: true,
        jest: true,
      },
      rules: {
        'simple-import-sort/imports': 'off',
        'simple-import-sort/exports': 'off',
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: 'verror',
                importNames: ['default'],
                message:
                  "Please use `import { VError } from 'verror'` instead.",
              },
            ],
          },
        ],
        // "custom-rules/require-properties-in-object": [
        //   "error",
        //   {
        //     objectIdentifier: "connect",
        //     condition: { type: "or", conditions: ["id", "uid"] },
        //     message:
        //       "Consider using an 'id' or 'uid' field when connecting to a soft-deletable object through Prisma. Ignore eslint rule for this line if this object is not intended for use with Prisma.",
        //   },
        // ],
      },
    },
  ],
  rules: {
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
  },
};
