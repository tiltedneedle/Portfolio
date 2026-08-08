import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
  {
    rules: {
      // Both rules fire on deliberate patterns in this codebase:
      //
      // set-state-in-effect — the `mounted` / `isMobile` flags must be set
      // after hydration. Reading window during render would produce a server
      // /client mismatch, so the post-mount setState is the point.
      //
      // refs — PortfolioBoard measures its container during render to decide
      // which frames to mount. The measurement only drives virtualization and
      // is recomputed whenever scale/position change, so a stale read is
      // self-correcting; moving it into state would add a render per pan frame.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
    },
  },
];

export default eslintConfig;
