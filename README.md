# FULLHAUS stylelint configuration

This repository contains the stylelint configuration used for projects maintained by [**FULL**HAUS](https://www.fullhaus.de/).

## Installation

You can install the **FULL**HAUS stylelint configuration using a package manager of your choice:
```shell
pnpm add @fullhaus/stylelint-config --save-dev
```

## Usage

Extend your config by adding `@fullhaus/stylelint-config` to the `extends` field of your stylelint config.
Depending on your stylelint config file format, it might look something like this:

#### ESM (`stylelint.config.mjs`)
```js
/** @type {import('stylelint').Config} */
export default {
  extends: [
    '@fullhaus/stylelint-config',
  ],
};

```

#### JSON (`.stylelintrc.json`)
```json
{
  "extends": [
    "@fullhaus/stylelint-config"
  ]
}
```
