import {AstTransformer} from "./refactor-obfuscated-code-jscodeshift-common";
import j from 'jscodeshift';

const membershipRefactor = new Set([
    'push',
    'shift',
    'code',
    'length',
    'call',
    'exports',
    'charCodeAt',
    'fromCharCode',
    'toString',
    'charAt',
    'substr',
    'indexOf',
    'pow',
    'pop',
    'apply',
    'slice',
    'from',
    'repeat',
    'ns_gen5_search',
    'Serialiser',
    'Parser',
    '__vm',
    '__spreadArrays',
    'bind',
    'prototype'
]);

class BracketToDotNotationTransformer extends AstTransformer {
    constructor(stepNumber, jscodeshiftAst, output, outputBaseName) {
        super(stepNumber, jscodeshiftAst, output, outputBaseName);
    }

    performTransform() {
        membershipRefactor.forEach(membership => {
            this.jscodeshiftAst.find(j.MemberExpression, {
                property: {value: membership}
            })
            .replaceWith(path =>  j.memberExpression(path.node.object, j.identifier(path.node.property.value)));
        });
    }
}

module.exports = {BracketToDotNotationTransformer};
