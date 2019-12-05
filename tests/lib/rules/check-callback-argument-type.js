/**
 * @fileoverview check the argument type of callback on async-validator
 * @author ende
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/check-callback-argument-type'),
  RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('check-callback-argument-type', rule, {
  valid: [
    {
      code: `const tmp = {validator: (a, b, cb) => {
            cb()
              }}`,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: `const tmp = {validator: (a, b, cb) => {
            cb(new Error('213'))
              }}`,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: `const tmp = {validator: (a, b, cb) => {
            cb('1')
              }}`,
      parserOptions: { ecmaVersion: 2015 },
    },
    {
      code: `const tmp = {validator: (a, b, cb) => {
              cb([new Error('123')])
                }}`,
      parserOptions: { ecmaVersion: 2015 },
    },

    {
      code: `const tmp = {validator: (a, b, cb) => {
              cb([])
                }}`,
      parserOptions: { ecmaVersion: 2015 },
    },
  ],

  invalid: [
    {
      code: `const tmp = {validator: (a, b, cb) => {
          cb(false)
            }}`,
      parserOptions: { ecmaVersion: 2015 },
      errors: [
        {
          message: "cb's argument should not be boolean",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `const tmp = {validator: (a, b, cb) => {
          cb(1)
            }}`,
      parserOptions: { ecmaVersion: 2015 },
      errors: [
        {
          message: "cb's argument should not be number",
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `const tmp = {validator: (a, b, cb) => {
          if (tmp) {
            cb([1])
          } else {
            cb([1])
          }
      }}`,
      parserOptions: { ecmaVersion: 2015 },
      errors: [
        {
          message: 'all elements type of the array argument of cb should be Error',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `const tmp = {validator: (a, b, cb) => {
            cb([1])
              }}`,
      parserOptions: { ecmaVersion: 2015 },
      errors: [
        {
          message: 'all elements type of the array argument of cb should be Error',
          type: 'CallExpression',
        },
      ],
    },
    {
      code: `const tmp = {validator: (a, b, cb) => {
          if (tmp) {
            if (a) {
              cb('1')
            } else {
              cb()
            }
            fn(t => {
              cb([1])
            })
          } else {
            cb()
          }
      }}`,
      parserOptions: { ecmaVersion: 2015 },
      errors: [
        {
          message: 'all elements type of the array argument of cb should be Error',
          type: 'CallExpression',
        },
      ],
    },

    {
      code: `const tmp = {validator: (a, b, cb) => {
          if (tmp) {
            cb([1])
          } else {
            cb([1])
          }
      }}`,
      parserOptions: { ecmaVersion: 2015 },
      errors: [
        {
          message: 'all elements type of the array argument of cb should be Error',
          type: 'CallExpression',
        },
      ],
    },
  ],
});
