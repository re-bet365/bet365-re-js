import fs from 'node:fs';

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
