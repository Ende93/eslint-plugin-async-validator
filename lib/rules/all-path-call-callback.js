/**
 * @fileoverview all path should call callback of validator
 * @author ende
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const helper = require('../helper');
const VALIDATOR_PROP_NAME = helper.VALIDATOR_PROP_NAME;
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
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function checkArguments(node) {
      if (node.params.length < 3) {
        context.report({
          node: node,
          message: `${VALIDATOR_PROP_NAME} must have callback argument`,
        });
        return false;
      }
      return true;
    }

    function checkIfStatement(nodes, callbackName) {
      const ifNodes = nodes.filter(function(t) {
        return t.type === 'IfStatement';
      });
      if (ifNodes.length) {
        const failed = ifNodes.some(function(node) {
          if (checkIfDirectCalled(node.consequent.body, callbackName)) {
            if (node.alternate) {
              if (
                node.alternate.type === 'BlockStatement' &&
                checkIfDirectCalled(node.alternate.body, callbackName)
              ) {
                return false;
              } else if (node.alternate.type === 'IfStatement') {
                let tmp = node;
                while (tmp.alternate && tmp.alternate.type === 'IfStatement') {
                  tmp = tmp.alternate;
                  if (!checkIfDirectCalled(tmp.consequent.body, callbackName)) {
                    context.report({
                      node: node,
                      message: `The branch don\'t invoke ${callbackName} function`,
                    });
                    return true;
                  }
                }
              } else {
                context.report({
                  node: node,
                  message: `The branch don\'t invoke ${callbackName} function`,
                });
                return true;
              }
            } else {
              context.report({
                node: node,
                message: 'if statement must have `else`',
              });
              return true;
            }
          } else {
            return false;
          }
        });
        return failed;
      } else {
        return false;
      }
    }

    function checkIsCall(node, callbackName) {
      return node.type === 'CallExpression' && node.callee.name === callbackName;
    }
    function checkIfDirectCalled(nodes, callbackName) {
      nodes = nodes.filter(function(t) {
        return t.type !== 'IfStatement';
      });
      if (!nodes.length) {
        return false;
      }
      return nodes.some(function(t) {
        switch (t.type) {
          case 'ExpressionStatement':
            if (
              t.expression.type === 'CallExpression' &&
              t.expression.callee.name !== callbackName
            ) {
              return t.expression.arguments.some(function(argu) {
                if (argu.type === 'Identifier' && argu.name === callbackName) {
                  return true;
                } else {
                  return getFunctionNodes(argu).some(function(fnNode) {
                    return checkFunction(fnNode);
                  });
                }
              });
            }
            return checkIsCall(t.expression, callbackName);
          case 'ReturnStatement':
            return t.argument.type === 'CallExpression'
              ? checkIsCall(t.argument, callbackName)
              : checkIfDirectCalled([t.argument], callbackName);
          case 'ConditionalExpression':
            return (
              checkIsCall(t.consequent, callbackName) && checkIsCall(t.alternate, callbackName)
            );
          case 'WhileStatement':
          case 'ForStatement':
          case 'ForInStatement':
          case 'ForOfStatement':
            return checkIsCall(t.body, callbackName);
          default:
            return true;
        }
      });
    }

    function checkFunction(node, callbackName) {
      if (!callbackName) {
        if (!checkArguments(node)) {
          return true;
        }
        callbackName = helper.getCallbackName(node);
      }
      if (
        node.body &&
        node.body.body &&
        (checkIfStatement(node.body.body, callbackName) ||
          checkIfDirectCalled(node.body.body, callbackName))
      ) {
        return true;
      } else if (node.body && node.body.type !== 'BlockStatement') {
        return checkIfDirectCalled([node.body], callbackName);
      } else {
        context.report({
          node: node,
          message: `must call ${callbackName} function`,
        });
        return false;
      }
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      ObjectExpression: function(node) {
        helper.getTargetFunctions(node).some(function(t) {
          return checkFunction(t);
        });
      },
    };
  },
};
