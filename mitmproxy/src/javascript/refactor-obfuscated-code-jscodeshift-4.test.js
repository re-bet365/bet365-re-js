import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";

const esprima = require("esprima");
const fs = require('node:fs');
const path = require('path');
const j = require('jscodeshift');
const { v4: uuidv4 } = require('uuid');
const {ParameterRefactorTransformer} = require("./refactor-obfuscated-code-jscodeshift-4");

const ast = j(
`function first(_0x588017) { return 0; }
function second(_0x588017) { return 0; }
function third(_0x588017) { return 0; }
function single(_0x305252) { return 0; }`
);

describe("ParameterRefactorTransformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();

        // Assert the file content
        const expectedContents =
`function first(keywordArray) {
    return 0;
}
function second(keywordArray) {
    return 0;
}
function third(index) {
    return 0;
}
function single(moduleKey) {
    return 0;
}`;
        verifyFileExists(transformer.outputBaseName, 4, expectedContents);
    });
});

function createTransformer() {
    return new ParameterRefactorTransformer(4, ast, true, uuidv4());
}
