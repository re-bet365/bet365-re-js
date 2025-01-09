const {AstTransformer} = require("./refactor-obfuscated-code-jscodeshift-common");
const j = require('jscodeshift');

var refactorFunctions = {
    '_0x21f1e2': 'getModule',
    '_0x2facc3': 'bootstrapModule',
    '_0x50286d': 'initialiseState',
    '_0x68e20a': 'executeFunctionAtExecutionIndex',
    '_0x4fdfce': 'executeFunction',
    '_0x50ee92': 'base64ToBytes',
    '_0x5953e4': 'createPaddedBinaryString'
};

class FunctionRefactorTransformer extends AstTransformer {
    constructor(stepNumber, jscodeshiftAst, output, outputBaseName) {
        super(stepNumber, jscodeshiftAst, output, outputBaseName);
    }

    performTransform() {
        Object.entries(refactorFunctions).forEach(([key, refactoredFunctionName]) => {
            this.jscodeshiftAst.find(j.Identifier, {name: key})
                .replaceWith(path => j.identifier(refactoredFunctionName));
        });
    }
}

module.exports = {FunctionRefactorTransformer};
