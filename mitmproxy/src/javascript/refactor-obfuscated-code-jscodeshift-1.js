const {AstTransformer} = require("./refactor-obfuscated-code-jscodeshift-common");
const j = require('jscodeshift');

const operators = {
    "!": [
        [0, true],
        [1, false]
    ]
}

class UnaryExpressionTransformer extends AstTransformer {
    constructor(stepNumber, jscodeshiftAst, output, outputBaseName) {
        super(stepNumber, jscodeshiftAst, output, outputBaseName);
    }

    performTransform() {
        Object.entries(operators).forEach(([operator, values]) => {
            values.forEach(valueArray => {
                this.jscodeshiftAst.find(j.UnaryExpression, {operator: operator, argument: {value: valueArray[0]}})
                    .replaceWith(path => j.booleanLiteral(valueArray[1]));
            });
        });
    }
}

module.exports = {UnaryExpressionTransformer};
