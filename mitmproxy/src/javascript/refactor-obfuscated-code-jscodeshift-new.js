const fs = require('node:fs');
const { argv } = require('node:process');
const j = require('jscodeshift');
const escodegen = require('escodegen');
const esprima = require('esprima');
const {ChainedTransformer} = require("./refactor-obfuscated-code-jscodeshift-chained");

if (typeof __dirname === 'undefined' || !__dirname) {
    __dirname = '.';
}

const rawObfuscatedJsFileName = argv[2];
const deobfuscatedJsFileName = argv[3];
const outputIntermediateSteps = argv[4] ?? true;
if (!rawObfuscatedJsFileName) {
    throw new Error('Provide an obfuscated file');
}
if (!deobfuscatedJsFileName) {
    throw new Error('Provide an path to deobfuscated file');
}

function transform(rawObfuscatedJsCode) {
    return new ChainedTransformer(j(rawObfuscatedJsCode), true).transform();
}

const rawObfuscatedJsCode = fs.readFileSync(rawObfuscatedJsFileName).toString();
const transformedJscodeshiftAst = transform(rawObfuscatedJsCode);
const ast = esprima.parseScript(transformedJscodeshiftAst.toSource());

// convert into ast for pretty printing
const refactoredJsCode = escodegen.generate(ast);
fs.writeFile(deobfuscatedJsFileName, refactoredJsCode, error => {
    if (error) {
        console.error(error);
    }
});
