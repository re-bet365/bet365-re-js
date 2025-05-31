"use strict";
import {AstTransformer} from "./refactor-obfuscated-code-jscodeshift-common";
import {Void0Transformer} from "./refactor-obfuscated-code-jscodeshift-0";
import {UnaryExpressionTransformer} from "./refactor-obfuscated-code-jscodeshift-1";
import {RefactorVariableTransformer} from "./refactor-obfuscated-code-jscodeshift-2";
import {VariableReplacementTransformer} from "./refactor-obfuscated-code-jscodeshift-3";
import {ParameterRefactorTransformer} from "./refactor-obfuscated-code-jscodeshift-4";
import {FunctionRefactorTransformer} from "./refactor-obfuscated-code-jscodeshift-5";
import {RemoveKeywordsTransformer} from "./refactor-obfuscated-code-jscodeshift-6";
import {BracketToDotNotationTransformer} from "./refactor-obfuscated-code-jscodeshift-7";
import {RemovedUnusedParametersTransformer} from "./refactor-obfuscated-code-jscodeshift-8";
import {RemovedClosestTransformer} from "./refactor-obfuscated-code-jscodeshift-9";
import {RemoveStaleIdentifierTransformer} from "./refactor-obfuscated-code-jscodeshift-10";

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

export {ChainedTransformer};
