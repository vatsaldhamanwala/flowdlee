import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Global Ignores (Applies across the whole monorepo)
  {
    ignores: ['**/node_modules/*', '**/.next/*', '**/out/*', '**/dist/*', '**/.turbo/*'],
  },

  // 1. Base configuration for all JavaScript/TypeScript files in the monorepo
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  eslintPluginPrettierRecommended,

  // 2. Specific overrides just for your Next.js apps
  // This ensures Next.js rules only run inside your actual app folders
  {
    files: ['apps/web/**/*.{ts,tsx,js,jsx}'],
    // plugins: {
    //   ...compat.plugins('eslint-plugin-next'),
    // },
    rules: {
      // Pulls in Next.js core web vitals rules manually for this directory
      ...compat.extends('next/core-web-vitals')[0].rules,
    },
  },

  // 3. Global custom rules
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
