import {AstTransformer} from "./refactor-obfuscated-code-jscodeshift-common";
import j from 'jscodeshift';

const replaceVariables = {
    '_0x49b7bf': 'globalStateContextValues',
    '_0x173146': 'window'
}

class VariableReplacementTransformer extends AstTransformer {
    constructor(stepNumber, jscodeshiftAst, output, outputBaseName) {
        super(stepNumber, jscodeshiftAst, output, outputBaseName);
    }

    performTransform() {
        Object.entries(replaceVariables).forEach(([oldVariable, newVariable]) => {
            this.jscodeshiftAst.findVariableDeclarators(oldVariable).remove();
            this.jscodeshiftAst.find(j.Identifier, {name: oldVariable})
                .replaceWith(path => j.identifier(newVariable));
            this.jscodeshiftAst.find(j.AssignmentExpression, {operator: '=', left: {name: newVariable}, right: {name: newVariable}})
                .remove();
        });
        this.jscodeshiftAst.find(j.AssignmentExpression, {operator: '='})
            .filter(path => path.value.left.name && path.value.left.name === path.value.right.name)
            .remove();
    }
}

module.exports = {VariableReplacementTransformer};
