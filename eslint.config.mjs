import { defineConfig } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import nextPlugin from "@next/eslint-plugin-next";

const typescriptConfigs = tseslint.configs["flat/recommended"];

export default defineConfig([
  {
    ignores: ["build/**", ".next/**", "next-env.d.ts"]
  },
  nextPlugin.flatConfig.coreWebVitals,
  ...typescriptConfigs,
  {
    rules: {
      "react/jsx-key": "off"
    }
  }
]);
