/**
 * @fileoverview all path should call callback of validator
 * @author ende
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const VALIDATOR_PROP_NAME = 'validator';
module.exports = {
  meta: {
    docs: {
      description: 'all path should call callback of validator',
      category: 'custom rules',
      recommended: false,
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ],
  },

  create: function(context) {
    const { report } = context;
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function checkArguments(node) {
      if (node.params.length < 3) {
        report({
          node: node,
          message: `${VALIDATOR_PROP_NAME} must have callback argument`,
        });
        return false;
      }
      return true;
    }

    function getFunctionNodes() {}

    function checkIfStatement() {}

    function checkPromise() {}

    function checkReturnStatement() {}
    function checkIsDirectCalled(node, targetName) {
      
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      'ObjectExpression Property': function(node) {
        if (node.key.name === VALIDATOR_PROP_NAME) {
          var fns = getFunctionNodes(node);
          fns.some(function(t) {
            if (!checkArguments(t)) {
              return true;
            }
            const argumentName = t.params[2].name;
            if (
              !checkIfStatement(t.body, argumentName) ||
              !checkPromise(t.body, argumentName) ||
              !checkReturnStatement(t.body, argumentName) ||
              !checkIsDirectCalled(t.body, argumentName)
            ) {
              return true;
            }
            return false;
          });
        } else {
          // never
        }
      },
    };
  },
};
