# FULLHAUS stylelint configuration

This repository contains the stylelint configuration used for projects maintained by [**FULL**HAUS](https://www.fullhaus.de/).

## Installation

You can install the **FULL**HAUS stylelint configuration using a package manager of your choice:
```shell
pnpm add @fullhaus/stylelint-config --save-dev
```


> [!WARNING]
> The package is **not** hosted on npmjs.com but our private registry at https://npm.fullhaus.dev!
> <details>
> <summary>How to connect:</summary>
>
> #### Using .npmrc
> ```
> @fullhaus:registry=https://npm.fullhaus.dev/
> //npm.fullhaus.dev/:_authToken=INSERT_FH_PRIVATE_NPM_TOKEN_HERE
> ```
>
> #### Interactive login
> ```
> pnpm login --registry=https://npm.fullhaus.dev --scope=@fullhaus
> ```
> </details>

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
