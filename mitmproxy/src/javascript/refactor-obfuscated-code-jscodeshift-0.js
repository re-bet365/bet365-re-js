import {AstTransformer} from "./refactor-obfuscated-code-jscodeshift-common";
import j from "jscodeshift";

class Void0Transformer extends AstTransformer {
    constructor(stepNumber, jscodeshiftAst, output, outputBaseName) {
        super(stepNumber, jscodeshiftAst, output, outputBaseName);
    }

    performTransform() {
        this.jscodeshiftAst.find(j.UnaryExpression, {operator: 'void', argument: {value: 0}})
            .replaceWith(path => j.identifier('undefined'));
    }
}

module.exports = {Void0Transformer};
