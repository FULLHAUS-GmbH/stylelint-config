/** @type {import('stylelint').Config} */
export default {
  plugins: [
    '@stylistic/stylelint-plugin',
    'stylelint-plugin-logical-css',
    'stylelint-order',
  ],
  extends: [
    'stylelint-config-recommended-scss',
  ],
  rules: {
    '@stylistic/indentation': 4,
    '@stylistic/number-leading-zero': 'always',
    '@stylistic/string-quotes': 'single',
    '@stylistic/scss/indentation': 4,
    '@stylistic/scss/number-leading-zero': 'always',
    '@stylistic/scss/string-quotes': 'single',
    'color-named': [
      'never',
      {
        'ignore': [
          'inside-function',
        ],
      },
    ],
    'logical-css/require-logical-keywords': [
      true,
      {
        'severity': 'warning',
      },
    ],
    'logical-css/require-logical-properties': [
      true,
      {
        'severity': 'warning',
        'ignore': [
          'overflow-x',
          'overflow-y',
        ],
      },
    ],
    'logical-css/require-logical-units': [
      true,
      {
        'severity': 'warning',
      },
    ],
    'order/properties-alphabetical-order': true,
    'order/properties-order': [],
    'selector-class-pattern': [
      '^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$',
      {
        'message': 'Expected BEM naming convention for class.',
      },
    ],
    'value-keyword-case': [
      'lower',
      {
        'camelCaseSvgKeywords': true,
      },
    ],
  },
  overrides: [
    {
      files: ['_index.scss'],
      rules: {
        'no-empty-source': null,
      },
    },
  ],
};
