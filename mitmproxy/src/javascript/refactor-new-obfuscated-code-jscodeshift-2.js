import {AstTransformer} from "./refactor-obfuscated-code-jscodeshift-common";

class KeywordTransformer extends AstTransformer {
    constructor(stepNumber, jscodeshiftAst, output, outputBaseName) {
        super(stepNumber, jscodeshiftAst, output, outputBaseName);
    }

    performTransform() {
        Object.entries(refactorVariables).forEach(([key, refactoredVariableName]) => {
            this.jscodeshiftAst.findVariableDeclarators(key).renameTo(refactoredVariableName);
        });
    }
}

module.exports = {KeywordTransformer};
