module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'prettier'
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/semi': [2, 'always'],
    '@typescript-eslint/comma-dangle': ['error', 'never'],
    'prettier/prettier': 'error'
  },
  overrides: [
    {
      'files': ['*.ts'],
      'rules': {
        '@typescript-eslint/no-non-null-assertion': 'off'
      }
    }
  ]
};
