module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'unused-imports'],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
    'airbnb-typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  globals: {
    Express: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
  ],
  rules: {
    'arrow-body-style': 'warn',
    'prefer-arrow-callback': 'warn',
    'consistent-return': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/int-spec-helper.util.ts',
          '**/*{.,-}{test,spec}.ts', // tests where the extension or filename suffix denotes that it is a test
          '**/jest-*.json', // jest config
        ],
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'import/no-default-export': 'error',
    'import/no-absolute-path': 'off',
    'max-len': ['warn', { code: 160, ignoreStrings: true, ignoreTemplateLiterals: true }],
    'no-undef': 'warn',
    'no-unused-expressions': 'error',
    'no-unused-vars': 'error',
    'one-var': ['error', 'never'],
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    radix: 'off',
    'react/jsx-filename-extension': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        disallowTypeAnnotations: false,
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'error',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/brace-style': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-shadow': ['error', { allow: ['_'] }],
    '@typescript-eslint/no-use-before-define': ['warn', { functions: false }],
    '@typescript-eslint/restrict-template-expressions': 'off',
    'unused-imports/no-unused-imports': 'error',
    'import/no-cycle': 'warn',
    'no-unsafe-finally': 'warn',
    'no-shadow': 'warn',
  },
};
