var fs = require('node:fs');
var { argv } = require('node:process');
var j = require('jscodeshift');
var escodegen = require('escodegen');
var esprima = require('esprima');

if (typeof __dirname === 'undefined' || !__dirname) {
    __dirname = '.';
}

var rawObfuscatedJsFileName = argv[2];
var deobfuscatedJsFileName = argv[3];
var outputIntermediateSteps = argv[4] ?? true;
if (!rawObfuscatedJsFileName) {
    throw new Error('Provide an obfuscated file');
}
if (!deobfuscatedJsFileName) {
    throw new Error('Provide an path to deobfuscated file');
}
var rawObfuscatedJsCode = fs.readFileSync(rawObfuscatedJsFileName).toString();

var transform = function(obfuscatedSource) {
    var ast = j(obfuscatedSource);
    performVoidExpressionFactor(ast);
    performUnaryExpressionRefactor(ast);
    performVariableRefactor(ast);
    performVariableReplacement(ast);
    performParameterRefactor(ast);
    performFunctionRefactor(ast)
    removeKeywords(ast);
    changeArrayAccessToFunctionCall(ast);
    removedUnusedParameters(ast);
    performRemoveClosest(ast);
    performRemoveStaleIdentifiers(ast);
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
