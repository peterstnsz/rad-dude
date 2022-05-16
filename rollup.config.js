// import serve from "rollup-plugin-serve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "cjs",
      name: "main",
    },
    plugins: [
      typescript({
        typescript: require("typescript"),
        target: "ES6",
      }),
      commonjs(),
      production && terser(),
    ],
  },
];
