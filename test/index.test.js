import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import stylelint from 'stylelint';
import config from '../index.js';

/**
 * Lints the given code with the config and returns the single result.
 * @param {string} code - The stylesheet source.
 * @param {string} [codeFilename] - The virtual file name, which drives syntax and overrides.
 * @returns {Promise<import('stylelint').LintResult>} The lint result.
 */
async function lint(code, codeFilename = 'test.scss') {
  const { results } = await stylelint.lint({ code, codeFilename, config });

  return results[0];
}

/**
 * Lints the given code and returns the names of the rules that reported.
 * @param {string} code - The stylesheet source.
 * @param {string} [codeFilename] - The virtual file name.
 * @returns {Promise<string[]>} The reporting rule names.
 */
async function rulesFor(code, codeFilename) {
  const result = await lint(code, codeFilename);

  return result.warnings.map(({ rule }) => rule);
}

/**
 * Asserts that the code reports exactly the given rule, with the given severity.
 * @param {string} code - The stylesheet source.
 * @param {string} rule - The expected rule name.
 * @param {'error'|'warning'} [severity] - The expected severity.
 */
async function assertReports(code, rule, severity = 'error') {
  const { warnings } = await lint(code);

  assert.deepEqual(
    warnings.map((w) => [w.rule, w.severity]),
    [[rule, severity]],
  );
}

/**
 * Asserts that the code produces no warnings at all.
 * @param {string} code - The stylesheet source.
 * @param {string} [codeFilename] - The virtual file name.
 */
async function assertValid(code, codeFilename) {
  const { warnings } = await lint(code, codeFilename);

  assert.deepEqual(warnings, []);
}

const validScss = `@use 'sass:color';

$primary: #336699;

.card {
    background: linear-gradient(white, black);
    color: color.adjust($primary, $lightness: -10%);
    font-family: 'Helvetica Neue', sans-serif;
    margin-block: 0.5rem;
    opacity: 0.75;
    text-rendering: optimizeLegibility;

    &__title {
        font-size: 1.5rem;
    }

    &--highlighted {
        border-inline-start: 1px solid currentColor;
    }
}
`;

describe('config integrity', () => {
  it('loads without invalid options or deprecations', async () => {
    const result = await lint(validScss);

    assert.deepEqual(result.invalidOptionWarnings, []);
    assert.deepEqual(result.deprecations, []);
  });

  it('only configures rules that exist and accept the parsed syntax', async () => {
    // Unknown rules and syntax refusals surface as warnings on every file, even a valid one.
    for (const file of ['test.scss', 'test.css']) {
      const result = await lint(validScss, file);
      const broken = result.warnings.filter(({ text }) => /Unknown rule|does not read a stylesheet/.test(text));

      assert.deepEqual(broken, [], `broken rules for ${file}`);
    }
  });

  it('accepts idiomatic SCSS', async () => {
    await assertValid(validScss);
  });

  it('accepts idiomatic CSS', async () => {
    await assertValid('.card {\n    color: #fff;\n    margin-block: 0.5rem;\n}\n', 'test.css');
  });
});

describe('@stylistic', () => {
  it('requires 4-space indentation', async () => {
    await assertReports('.a {\n  color: #fff;\n}\n', '@stylistic/scss/indentation');
  });

  it('requires a leading zero', async () => {
    await assertReports('.a {\n    opacity: .5;\n}\n', '@stylistic/scss/number-leading-zero');
  });

  it('requires single quotes', async () => {
    await assertReports('.a {\n    content: "x";\n}\n', '@stylistic/scss/string-quotes');
  });

  it('autofixes stylistic issues', async () => {
    const { code } = await stylelint.lint({
      code: '.a {\n  content: "x";\n  opacity: .5;\n}\n',
      codeFilename: 'test.scss',
      config,
      fix: true,
    });

    assert.equal(code, ".a {\n    content: 'x';\n    opacity: 0.5;\n}\n");
  });
});

describe('color-named', () => {
  it('disallows named colors', async () => {
    await assertReports('.a {\n    color: red;\n}\n', 'color-named');
  });

  it('allows named colors inside functions', async () => {
    await assertValid('.a {\n    background: linear-gradient(red, blue);\n}\n');
  });
});

describe('logical-css', () => {
  it('warns about physical properties', async () => {
    await assertReports('.a {\n    margin-top: 0;\n}\n', 'logical-css/require-logical-properties', 'warning');
  });

  it('warns about overflow-x and overflow-y', async () => {
    const { warnings } = await lint('.a {\n    overflow-x: hidden;\n    overflow-y: auto;\n}\n');

    assert.deepEqual(
      warnings.map((w) => [w.rule, w.severity]),
      [
        ['logical-css/require-logical-properties', 'warning'],
        ['logical-css/require-logical-properties', 'warning'],
      ],
    );
  });

  it('warns about physical keywords', async () => {
    await assertReports('.a {\n    text-align: left;\n}\n', 'logical-css/require-logical-keywords', 'warning');
  });

  it('warns about physical units', async () => {
    await assertReports('.a {\n    block-size: 100vh;\n}\n', 'logical-css/require-logical-units', 'warning');
  });

  it('does not fail the lint run for warnings only', async () => {
    const result = await lint('.a {\n    margin-top: 0;\n}\n');

    assert.equal(result.errored, false);
  });
});

describe('order', () => {
  it('requires alphabetical property order', async () => {
    await assertReports('.a {\n    margin-block: 0;\n    color: #fff;\n}\n', 'order/properties-alphabetical-order');
  });
});

describe('selector-class-pattern', () => {
  for (const selector of ['.block', '.block-name', '.block__element', '.block__element-name', '.block--modifier', '.block__element--modifier', '.block--modifier--variant', '.b1']) {
    it(`accepts ${selector}`, async () => {
      await assertValid(`${selector} {\n    color: #fff;\n}\n`);
    });
  }

  for (const selector of ['.Block', '.blockName', '.block_element', '.block__Element', '.block__a__b', '.1block', '.block__']) {
    it(`rejects ${selector}`, async () => {
      const { warnings } = await lint(`${selector} {\n    color: #fff;\n}\n`);

      assert.deepEqual(warnings.map(({ rule }) => rule), ['selector-class-pattern']);
      assert.match(warnings[0].text, /Expected BEM naming convention for class/);
    });
  }
});

describe('value-keyword-case', () => {
  it('requires lowercase keywords', async () => {
    await assertReports('.a {\n    display: BLOCK;\n}\n', 'value-keyword-case');
  });

  it('allows camelCase SVG keywords', async () => {
    await assertValid('.a {\n    text-rendering: optimizeLegibility;\n}\n');
  });
});

describe('stylelint-config-recommended-scss', () => {
  it('is extended', async () => {
    assert.deepEqual(await rulesFor('.a {\n    color: darken(#fff, 10%);\n}\n'), ['scss/no-global-function-names']);
  });
});

describe('overrides', () => {
  it('disallows empty sources', async () => {
    assert.deepEqual(await rulesFor(''), ['no-empty-source']);
  });

  it('allows empty _index.scss files', async () => {
    await assertValid('', '_index.scss');
    await assertValid('', 'src/components/_index.scss');
  });
});
