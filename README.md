# eslint-plugin-async-validator

lint async-validator rules

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-async-validator`:

```
$ npm install eslint-plugin-async-validator --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-async-validator` globally.

## Usage

Add `async-validator` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["async-validator"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "async-validator/rule-name": 2
  }
}
```

## Supported Rules

- Fill in provided rules here
