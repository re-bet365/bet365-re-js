import {AstTransformer} from "./refactor-obfuscated-code-jscodeshift-common";

class KeywordTransformer extends AstTransformer {
    constructor(stepNumber, jscodeshiftAst, output, outputBaseName) {
        super(stepNumber, jscodeshiftAst, output, outputBaseName);
    }

    performTransform() {
        const variableDeclarations = this.jscodeshiftAst.find(this.jscodeshiftAst.VariableDeclaration)
            .for(varDecl => {
                console.log(varDecl);
            });
        this.jscodeshiftAst.find(this.jscodeshiftAst.VariableDeclaration)
            .filter(path => {
                const declarations = path.node.declarations;
                if (declarations.length === 0) return false;
                const init = declarations[0].init;
                const id = declarations[0].id;
                return init && init.type === 'ArrayExpression' && init.elements.length > 0 && init.elements.every(el => el.type === 'StringLiteral') && id.type === 'Identifier' && id.name.startsWith('_0x');
            })
            .forEach(path => {
                path.node.declarations[0].id = root.jscodeshift.identifier('keywords');
            });

        return this.jscodeshiftAst;
    }
}

module.exports = {KeywordTransformer};
