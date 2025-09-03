module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  overrides: [
    {
      files: ['*.ejs'],
      parser: '@eslint/eslintrc',
      rules: {
        // Disable all rules for EJS files
        '@typescript-eslint/no-unused-vars': 'off',
        'no-undef': 'off'
      }
    }
  ]
};