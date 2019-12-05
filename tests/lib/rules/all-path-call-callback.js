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
    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: '{validator: () => {}}',
      parserOptions: { ecmaVersion: 2015 },
      errors: [
        {
          message: 'Fill me in.',
          type: 'Me too',
        },
      ],
    },
  ],
});
