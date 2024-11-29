const fs = require('node:fs');
const { argv } = require('node:process');
const j = require('jscodeshift');
const escodegen = require('escodegen');
const esprima = require('esprima');
const {AstTransformer} = require("./refactor-obfuscated-code-jscodeshift-common");
const {Void0Transformer} = require("./refactor-obfuscated-code-jscodeshift-0");
const {UnaryExpressionTransformer} = require("./refactor-obfuscated-code-jscodeshift-1");
const {RefactorVariableTransformer} = require("./refactor-obfuscated-code-jscodeshift-2");
const {VariableReplacementTransformer} = require("./refactor-obfuscated-code-jscodeshift-3");
const {ParameterRefactorTransformer} = require("./refactor-obfuscated-code-jscodeshift-4");
const {FunctionRefactorTransformer} = require("./refactor-obfuscated-code-jscodeshift-5");
const {RemoveKeywordsTransformer} = require("./refactor-obfuscated-code-jscodeshift-6");
const {BracketToDotNotationTransformer} = require("./refactor-obfuscated-code-jscodeshift-7");
const {RemovedUnusedParametersTransformer} = require("./refactor-obfuscated-code-jscodeshift-8");
const {RemovedClosestTransformer} = require("./refactor-obfuscated-code-jscodeshift-9");
const {RemoveStaleIdentifierTransformer} = require("./refactor-obfuscated-code-jscodeshift-10");

class ChainedTransformer extends AstTransformer {
    constructor(jscodeshiftAst, output, outputBaseName) {
        super("end", jscodeshiftAst, output, outputBaseName);
    }

    performTransform() {
        let ast = this.jscodeshiftAst;
        debugger;
        ast = new Void0Transformer(0, ast, this.output, this.outputBaseName).transform();
        ast = new UnaryExpressionTransformer(1, ast, this.output, this.outputBaseName).transform();
        ast = new RefactorVariableTransformer(2, ast, this.output, this.outputBaseName).transform();
        ast = new VariableReplacementTransformer(3, ast, this.output, this.outputBaseName).transform();
        ast = new ParameterRefactorTransformer(4, ast, this.output, this.outputBaseName).transform();
        ast = new FunctionRefactorTransformer(5, ast, this.output, this.outputBaseName).transform();
        ast = new RemoveKeywordsTransformer(6, ast, this.output, this.outputBaseName).transform();
        ast = new BracketToDotNotationTransformer(7, ast, this.output, this.outputBaseName).transform();
        ast = new RemovedUnusedParametersTransformer(8, ast, this.output, this.outputBaseName).transform();
        ast = new RemovedClosestTransformer(9, ast, this.output, this.outputBaseName).transform();
        ast = new RemoveStaleIdentifierTransformer(10, ast, this.output, this.outputBaseName).transform();
        return ast;
    }
}

module.exports = {ChainedTransformer};
