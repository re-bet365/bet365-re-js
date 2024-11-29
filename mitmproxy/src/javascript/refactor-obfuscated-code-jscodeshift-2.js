var fs = require('node:fs');
var { argv } = require('node:process');
var j = require('jscodeshift');
var escodegen = require('escodegen');
var esprima = require('esprima');

if (typeof __dirname === 'undefined' || !__dirname) {
    __dirname = '.';
}

var rawObfuscatedJsFileName = argv[2];
var outputToFile = argv[3];
if (!rawObfuscatedJsFileName) {
    throw new Error('Provide an obfuscated file');
}
if (!outputToFile) {
    throw new Error('Provide an path to deobfuscated file');
}
var rawObfuscatedJsCode = fs.readFileSync(rawObfuscatedJsFileName).toString();

var operators = {
    "!": [
        [0, true],
        [1, false]
    ]
};

var performUnaryExpressionRefactor = function(ast) {
    Object.entries(operators).forEach(([operator, values]) => {
        values.forEach(valueArray => {
            ast.find(j.UnaryExpression, {operator: operator, argument: {value: valueArray[0]}})
                .replaceWith(path => j.booleanLiteral(valueArray[1]));
        });
    });
};

var transform = function(source) {
    var ast = j(source);
    performUnaryExpressionRefactor(ast);
    return ast.toSource();
}

var transformedSource = transform(rawObfuscatedJsCode);

// convert into ast for pretty printing
var ast = esprima.parseScript(transformedSource);
var refactoredJsCode = escodegen.generate(ast);
fs.writeFile(deobfuscatedJsFileName, refactoredJsCode, error => {
    if (error) {
        console.error(error);
    }
});
