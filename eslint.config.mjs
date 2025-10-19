import { defineConfig } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import nextPlugin from "@next/eslint-plugin-next";

const typescriptConfigs = tseslint.configs["flat/recommended"];

export default defineConfig([
  {
    ignores: ["build/**", "**/.next/**", "next-env.d.ts", "node_modules/**"]
  },
  nextPlugin.flatConfig.coreWebVitals,
  ...typescriptConfigs,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2021
      }
    },
    rules: {
      "react/jsx-key": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: "FunctionDeclaration",
          message: "Use arrow functions to stay aligned with ES2021 patterns."
        }
      ]
    }
  }
]);
