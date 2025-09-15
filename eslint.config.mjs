// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [{
  ignores: [
    'node_modules/**',
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    '.conductor/**',
    '.prettierrc',
    '*.config.js',
    '*.config.mjs',
    'jest.config.js',
    'jest.setup.js',
  ],
}, ...compat.extends('next/core-web-vitals', 'next/typescript'), {
  files: ['**/*.{js,jsx,ts,tsx}'],
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
  },
}, {
  files: ['**/*.{test,spec}.{ts,tsx,js,jsx}'],
  rules: {
    // Allow explicit any in tests to keep mocks simple
    '@typescript-eslint/no-explicit-any': 'off',
  },
}, ...storybook.configs["flat/recommended"]]

export default eslintConfig
