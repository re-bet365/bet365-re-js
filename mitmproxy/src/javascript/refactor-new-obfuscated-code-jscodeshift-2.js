import {AstTransformer} from "./refactor-obfuscated-code-jscodeshift-common";
import j from "jscodeshift";

class KeywordTransformer extends AstTransformer {
    constructor(stepNumber, jscodeshiftAst, output, outputBaseName) {
        super(stepNumber, jscodeshiftAst, output, outputBaseName);
    }

    performTransform() {
        const keywords = this.jscodeshiftAst.find(j.VariableDeclaration)
            .filter(path => {
                const declarations = path.node.declarations;
                if (declarations.length === 0) return false;
                const initialValue = declarations[0].init;
                const identifier = declarations[0].id;
                return initialValue && initialValue.type === "ArrayExpression" && initialValue.elements.length > 0 && initialValue.elements.every(el => el.type === "StringLiteral" || el.type === "Literal") && identifier.type === "Identifier";
            })

        return this.jscodeshiftAst;
    }
}

module.exports = {KeywordTransformer};
