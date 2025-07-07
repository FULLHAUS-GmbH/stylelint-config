import fhEslint from '@fullhaus/eslint-config';

/** @type { import('eslint').Linter.Config[] } */
export default [
  ...fhEslint.configs.baseConfig,
  ...fhEslint.configs.stylisticConfig,
  ...fhEslint.configs.commentsConfig,
];
