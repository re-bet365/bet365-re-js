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

var performVoidExpressionFactor = function(ast) {
    ast.find(j.UnaryExpression, {operator: 'void', argument: {value: 0}})
        .replaceWith(path => j.identifier('undefined'));
};

var transform = function(source) {
    var ast = j(source);
    performVoidExpressionFactor(ast);
    return ast.toSource();
}

var transformedSource = transform(rawObfuscatedJsCode);

// convert into ast for pretty printing
var ast = esprima.parseScript(transformedSource);
var refactoredJsCode = escodegen.generate(ast);

if (outputToFile) {
    fs.writeFile("deobfuscated-output-1.js", refactoredJsCode, error => {
        if (error) {
            console.error(error);
        }
    });
}
