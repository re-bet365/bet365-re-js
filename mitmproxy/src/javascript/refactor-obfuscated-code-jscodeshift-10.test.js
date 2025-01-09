import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";

const esprima = require("esprima");
const fs = require('node:fs');
const path = require('path');
const j = require('jscodeshift');
const { v4: uuidv4 } = require('uuid');
const {RemoveStaleIdentifierTransformer} = require("./refactor-obfuscated-code-jscodeshift-10");

const ast = j(`
var _0x3d52dd = "";
`);

describe("RemoveStaleIdentifierTransformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();

        verifyFileExists(transformer.outputBaseName, 10, "");
    });
});

function createTransformer() {
    return new RemoveStaleIdentifierTransformer(10, ast, true, uuidv4());
}
