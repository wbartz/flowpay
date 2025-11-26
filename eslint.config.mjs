import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import jest from 'eslint-plugin-jest';

export default [
  js.configs.recommended,
  {
    env: {
      node: true,
      commonjs: true
    },
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier,
      jest
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['off'],
      'no-unused-vars': ['off'],
      'prettier/prettier': ['error']
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    plugins: { jest },
    languageOptions: {
      globals: {
        jest: true,
        describe: true,
        test: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
      },
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
];
