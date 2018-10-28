module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'script',
    ecmaFeatures: {
        jsx: true
    }
  },
  env: {
      node: true,
      mocha: true
  },
  extends: ['eslint:recommended', 'prettier'], // extending recommended config and config derived from eslint-config-prettier
  plugins: ['prettier'], // activating esling-plugin-prettier (--fix stuff)
  rules: {
    "no-console": "warn",
    "prefer-const": "error"
  }
};