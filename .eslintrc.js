module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    // get rid of 'process' is not defined error
    node: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    indent: ["error", 2],
    eqeqeq: "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": ["error", "always"],
    "arrow-spacing": ["error", { before: true, after: true }],
    "no-console": 0,
  },
  globals: {
    // get rid of 'next' is not defined error
    next: true,
  },
};
