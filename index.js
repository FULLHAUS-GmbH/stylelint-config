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
    'color-named': [
      'never',
      {
        'ignore': [
          'inside-function',
        ],
      },
    ],
    'order/properties-alphabetical-order': true,
    'order/properties-order': [],
    'plugin/use-logical-properties-and-values': [
      true,
      {
        'severity': 'warning',
        'ignore': [
          'overflow-x',
          'overflow-y',
        ],
      },
    ],
    'plugin/use-logical-units': [
      true,
      {
        'severity': 'warning',
      },
    ],
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
