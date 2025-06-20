import {AstTransformer} from "./refactor-obfuscated-code-jscodeshift-common";
import j from "jscodeshift";

const staleIdentifier = "_0x3d52dd";

class RemoveStaleIdentifierTransformer extends AstTransformer {
    constructor(stepNumber, jscodeshiftAst, output, outputBaseName) {
        super(stepNumber, jscodeshiftAst, output, outputBaseName);
    }

    performTransform() {
        this.jscodeshiftAst.find(j.Identifier, {name: staleIdentifier}).closest(j.AssignmentExpression).remove();
    }
}

module.exports = {RemoveStaleIdentifierTransformer};
