import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";

const esprima = require("esprima");
const fs = require('node:fs');
const path = require('path');
const j = require('jscodeshift');
const { v4: uuidv4 } = require('uuid');
const {FunctionRefactorTransformer} = require("./refactor-obfuscated-code-jscodeshift-5");

const ast = j(`function _0x4eecdf() { return 0; }`);

describe("FunctionRefactorTransformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();

        // Assert the file content
        const expectedContents =
`function getModule() {
    return 0;
}`;
        verifyFileExists(transformer.outputBaseName, 5, expectedContents);
    });
});

function createTransformer() {
    return new FunctionRefactorTransformer(5, ast, true, uuidv4());
}
