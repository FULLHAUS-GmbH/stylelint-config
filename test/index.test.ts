import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import stylelint, { type LinterResult } from 'stylelint';

import config from '../index.js';

const validScss = readFileSync('./test/valid.scss', 'utf-8');
const invalidScss = readFileSync('./test/invalid.scss', 'utf-8');

describe('no issues with valid scss', () => {
  let result: LinterResult;

  beforeEach(async () => {
    result = await stylelint.lint({
      code: validScss,
      config,
    });
  });

  it('did not error', () => {
    assert.equal(result.errored, false);
  });

  it('flags no warnings', () => {
    assert.equal(result.results[0].warnings.length, 0);
  });
});

describe('flags issues with invalid scss', () => {
  let result: LinterResult;

  beforeEach(async () => {
    result = await stylelint.lint({
      code: invalidScss,
      config,
    });
  });

  it('did error', () => {
    assert.equal(result.errored, true);
  });

  it('correct rules flagged', () => {
    assert.equal(result.results[0].warnings[0].rule, 'plugin/use-logical-properties-and-values');
    assert.equal(result.results[0].warnings[1].rule, 'plugin/use-logical-units');
    assert.equal(result.results[0].warnings[2].rule, 'color-named');
  });

  it('correct severity flagged', () => {
    assert.equal(result.results[0].warnings[0].severity, 'warning');
    assert.equal(result.results[0].warnings[1].severity, 'warning');
  });
});
