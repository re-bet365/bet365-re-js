import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";

const esprima = require("esprima");
const fs = require('node:fs');
const path = require('path');
const j = require('jscodeshift');
const { v4: uuidv4 } = require('uuid');
const {UnaryExpressionTransformer} = require("./refactor-obfuscated-code-jscodeshift-1");

const ast = j("var a = !0; var b = !1;");

describe("UnaryExpressionTransformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();
        const expectedContents =
`var a = true;
var b = false;`;

        verifyFileExists(transformer.outputBaseName, 1, expectedContents);
    });
});

function createTransformer() {
    return new UnaryExpressionTransformer(1, ast, true, uuidv4());
}
