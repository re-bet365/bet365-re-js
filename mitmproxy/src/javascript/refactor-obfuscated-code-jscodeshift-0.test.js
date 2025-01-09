import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";

const esprima = require("esprima");
const fs = require('node:fs');
const path = require('path');
const j = require('jscodeshift');
const { v4: uuidv4 } = require('uuid');
const {Void0Transformer} = require("./refactor-obfuscated-code-jscodeshift-0");

const ast = j("var a = void 0;");

describe("Void0Transformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();

        verifyFileExists(transformer.outputBaseName, 0, "var a = undefined;");
    });
});

function createTransformer() {
    return new Void0Transformer(0, ast, true, uuidv4());
}
