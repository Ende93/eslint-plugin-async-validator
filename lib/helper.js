const VALIDATOR_PROP_NAME = 'validator';
exports.VALIDATOR_PROP_NAME = VALIDATOR_PROP_NAME;

function isFunction(node) {
  return node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression';
}

function getFunctionNodes(node) {
  if (Array.isArray(node)) {
    return node.reduce(function(prev, n) {
      return prev.concat(getFunctionNodes(n));
    }, []);
  }
  if (node.type === 'CallExpression') {
    return getFunctionNodes(node.arguments);
  } else if (isFunction(node)) {
    return [node];
  } else if (node.type === 'ConditionalExpression') {
    return getFunctionNodes([node.consequent, node.alternate]);
  }
  return [];
}
exports.getCallbackName = node => {
  return node.params[2].name;
};
exports.getTargetFunctions = node => {
  const prop = node.properties.find(function(t) {
    return t.key.name === VALIDATOR_PROP_NAME;
  });
  if (prop) {
    return getFunctionNodes(prop.value);
  }
  return [];
};

function traver(node, filter = s => s) {
  let ret = [];
  if (!node) {
    return [];
  }
  if (Array.isArray(node)) {
    node
      .filter(t => {
        return !!t;
      })
      .forEach(t => {
        ret = ret.concat(traver(t, filter));
      });
    return ret;
  }
  if (node.type === 'IfStatement' || node.type === 'ConditionalExpression') {
    return traver([node.consequent, node.alternate], filter);
  } else if (
    node.type === 'BlockStatement' ||
    node.type === 'ForStatement' ||
    node.type === 'WhileStatement' ||
    node.type === 'ForInStatement' ||
    node.type === 'ArrowFunctionExpression' ||
    node.type === 'FunctionExpression' ||
    node.type === 'ForOfStatement'
  ) {
    return traver(node.body, filter);
  } else if (node.type === 'ReturnStatement') {
    return traver(node.argument, filter);
  } else if (node.type === 'ExpressionStatement') {
    return traver(node.expression, filter);
  } else if (node.type === 'CallExpression') {
    return traver(node.arguments, filter).concat(filter(node) ? node : []);
  }
  return [];
}
exports.isError = node => {
  return node.type === 'NewExpression' && node.callee.name.indexOf('Error') > -1;
};

exports.traver = traver;
