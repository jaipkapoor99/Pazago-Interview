import { defineConfig } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import nextPlugin from "@next/eslint-plugin-next";

const typescriptConfigs = tseslint.configs["flat/recommended"];

export default defineConfig([
  {
    ignores: ["build/**", ".next/**", "next-env.d.ts"]
  },
  ...typescriptConfigs,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@next/next": nextPlugin
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "react/jsx-key": "off"
    }
  }
]);
