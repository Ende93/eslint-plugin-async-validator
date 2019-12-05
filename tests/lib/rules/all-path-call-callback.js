/**
 * @fileoverview all path should call callback of validator
 * @author ende
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/all-path-call-callback'),
  RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('all-path-call-callback', rule, {
  valid: [
    {
      code: 'const tmp = {validator: function(a, b, cb) {cb()}}',
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: `const tmp = {
        validator: function(a, b, cb) {
          const tmp = 1
          if (tmp === 1) {
            return cb()
          } else {
            cb()
          }
        }
      }`,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: `const tmp = {validator: (a, b, cb) => {
        return tmp === 1? cb() : cb()
      }}`,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: `const tmp = {validator: (a, b, cb) => {
        fn(cb)
      }}`,
      parserOptions: { ecmaVersion: 2015 },
    },
  ],

  invalid: [
    {
      code: 'const tmp = {validator: function() {}}',
      parserOptions: { ecmaVersion: 2015 },
      errors: [
        {
          message: 'validator must have callback argument',
          type: 'FunctionExpression',
        },
      ],
    },
    {
      code: 'const tmp = {validator: () => {}}',
      parserOptions: { ecmaVersion: 2015 },
      errors: [
        {
          message: 'validator must have callback argument',
          type: 'ArrowFunctionExpression',
        },
      ],
    },
    {
      code: `const tmp = {validator: (a, b, cb) => {
        if (tmp !== undefined) {
          cb()
        } else {}
      }}`,
      parserOptions: { ecmaVersion: 2015 },
      errors: [
        {
          message: "The branch don't invoke cb function",
          type: 'IfStatement',
        },
      ],
    },
    {
      code: `const tmp = {validator: (a, b, cb) => {
        if (tmp !== undefined) {
          cb()
        } else if(tmp === 3) {

        } else {
          cb()
        }
      }}`,
      parserOptions: { ecmaVersion: 2015 },
      errors: [
        {
          message: "The branch don't invoke cb function",
          type: 'IfStatement',
        },
      ],
    },
    {
      code: `const tmp = {validator: (a, b, cb) => {
        if (tmp !== undefined) {
          cb()
        }
      }}`,
      parserOptions: { ecmaVersion: 2015 },
      errors: [
        {
          message: 'if statement must have `else`',
          type: 'IfStatement',
        },
      ],
    },
    {
      code: `const tmp = {validator: (a, b, cb) => {
        if (tmp !== undefined) {
        }
      }}`,
      parserOptions: { ecmaVersion: 2015 },
      errors: [
        {
          message: 'must call cb function',
          type: 'ArrowFunctionExpression',
        },
      ],
    },
    {
      code: `const tmp = {validator: 1 ? (a, b, cb) => {
        if (tmp !== undefined) {
        }
      }: (a, b, cb) => cb()}`,
      parserOptions: { ecmaVersion: 2015 },
      errors: [
        {
          message: 'must call cb function',
          type: 'ArrowFunctionExpression',
        },
      ],
    },
    {
      code: `const tmp = {validator: (a, b, cb) => {
        return tmp === 1? cb() : null
      }}`,
      parserOptions: { ecmaVersion: 2015 },
      errors: [
        {
          message: 'must call cb function',
          type: 'ArrowFunctionExpression',
        },
      ],
    },
    {
      code: `const tmp = {validator: (a, b, cb) => {
        return fn()
      }}`,
      parserOptions: { ecmaVersion: 2015 },
      errors: [
        {
          message: 'must call cb function',
          type: 'ArrowFunctionExpression',
        },
      ],
    },
  ],
});
