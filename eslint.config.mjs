import next from "eslint-config-next";
import nextTypescript from "eslint-config-next/typescript";

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  ...next,
  ...nextTypescript,
  {
    ignores: [".next/**", "node_modules/**", "coverage/**"],
  },
  {
    rules: {
      // Admin dashboards fetch on mount. The React 19 rule treats that as
      // cascading setState; converting every list to an RSC is a follow-up.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
