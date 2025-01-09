const {AstTransformer} = require("./refactor-obfuscated-code-jscodeshift-common");
const j = require('jscodeshift');

const removeVariables = new Set([
    'keywords',
    'getKeywordName',
]);

class RemovedUnusedParametersTransformer extends AstTransformer {
    constructor(stepNumber, jscodeshiftAst, output, outputBaseName) {
        super(stepNumber, jscodeshiftAst, output, outputBaseName);
    }

    performTransform() {
        this.jscodeshiftAst.find(j.Identifier, {name: 'unused'}).remove();
        removeVariables.forEach(variable => this.jscodeshiftAst.findVariableDeclarators(variable).remove());
    }
}

module.exports = {RemovedUnusedParametersTransformer};
