/**
 * @fileoverview check the argument type of callback on async-validator
 * @author ende
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const helper = require('../helper');
module.exports = {
  meta: {
    docs: {
      description: 'check the argument type of callback on async-validator',
      category: 'custom rules',
      recommended: true,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },

  create: function(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ObjectExpression: function(node) {
        helper.getTargetFunctions(node).some(function(t) {
          const callbackName = helper.getCallbackName(t);
          const callNodes = helper.traver(
            t,
            n =>
              n &&
              n.type === 'CallExpression' &&
              n.callee.name === callbackName &&
              n.arguments &&
              n.arguments.length > 0,
          );
          callNodes.some(callNode => {
            if (!callNode || callNode.arguments.length === 0) {
              return;
            }
            if (callNode.arguments.length > 1) {
              context.report({
                node: callNode,
                message: `${callbackName} only support one argument`,
              });
              return true;
            }
            const arg = callNode.arguments[0];
            if (arg.type === 'Literal' && typeof arg.value !== 'string') {
              context.report({
                node: callNode,
                message: `${callbackName}'s argument should not be ${typeof arg.value}`,
              });
              return true;
            } else if (arg.type === 'ArrayExpression' && arg.elements.length > 0) {
              const isAllError = arg.elements.every(t => helper.isError(t));
              if (!isAllError) {
                context.report({
                  node: callNode,
                  message: `all elements type of the array argument of ${callbackName} should be Error`,
                });
                return true;
              }
            }
          });
        });
      },
    };
  },
};
