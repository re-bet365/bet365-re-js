import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";

const esprima = require("esprima");
const fs = require('node:fs');
const path = require('path');
const j = require('jscodeshift');
const { v4: uuidv4 } = require('uuid');
const {RefactorVariableTransformer} = require("./refactor-obfuscated-code-jscodeshift-2");

const ast = j("var _0x1e16 = [];");

describe("RefactorVariableTransformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();

        verifyFileExists(transformer.outputBaseName, 2, "var keywords = [];");
    });
});

function createTransformer() {
    return new RefactorVariableTransformer(2, ast, true, uuidv4());
}
