import {AstTransformer} from "./refactor-obfuscated-code-jscodeshift-common";
import j from 'jscodeshift';

const removeClosest = {
    '_0x2cf5bb': 'IfStatement',
};

class RemovedClosestTransformer extends AstTransformer {
    constructor(stepNumber, jscodeshiftAst, output, outputBaseName) {
        super(stepNumber, jscodeshiftAst, output, outputBaseName);
    }

    performTransform() {
        Object.entries(removeClosest).forEach(([parameterName, closest]) => {
            var temp1 = this.jscodeshiftAst.find(j.Identifier, {name: parameterName}).closest(j[closest]);
            var temp2 = this.jscodeshiftAst.find(j.Identifier, {name: parameterName});
            this.jscodeshiftAst.find(j.Identifier, {name: parameterName}).closest(j[closest]).remove();
            this.jscodeshiftAst.find(j.Identifier, {name: parameterName}).remove();
        });
    }
}

module.exports = {RemovedClosestTransformer};
