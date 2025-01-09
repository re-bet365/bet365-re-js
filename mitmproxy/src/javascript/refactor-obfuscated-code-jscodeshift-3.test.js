import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";

const esprima = require("esprima");
const fs = require('node:fs');
const path = require('path');
const j = require('jscodeshift');
const { v4: uuidv4 } = require('uuid');
const {VariableReplacementTransformer} = require("./refactor-obfuscated-code-jscodeshift-3");

const ast = j("var _0x49b7bf = globalStateContextValues;");

describe("VariableReplacementTransformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();

        verifyFileExists(transformer.outputBaseName, 3, "");
    });
});

function createTransformer() {
    return new VariableReplacementTransformer(3, ast, true, uuidv4());
}
