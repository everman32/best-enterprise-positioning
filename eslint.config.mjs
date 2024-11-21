import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import jestPlugin from "eslint-plugin-jest";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

// const filename = fileURLToPath(import.meta.url); // for config with .js ext
// const dirname = path.dirname(filename);
const dirname = import.meta.dirname;

export default [
  {
    ignores: ["**/build/**", "**/dist/**", "**/node_modules/**"],
  },
  {
    files: ["src/**/*", "test/**/*"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      jest: jestPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: "module",
        globals: {
          ...globals.node,
        },
        projectService: true,
        tsconfigRootDir: dirname,
      },
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.mjs"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ["test/**"],
    ...jestPlugin.configs["flat/recommended"],
  },
];
