// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylistic,
  tseslint.configs.strict,
  {
    languageOptions: {
      parserOptions: {
        project: ['./packages/**/tsconfig.json', './**/**/tsconfig.json'],
      },
    },
  },
  {
    ignores: ['eslint.config.mjs'],
  }
);