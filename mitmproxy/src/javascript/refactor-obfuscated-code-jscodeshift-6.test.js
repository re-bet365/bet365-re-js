import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";

const esprima = require("esprima");
const fs = require('node:fs');
const path = require('path');
const j = require('jscodeshift');
const { v4: uuidv4 } = require('uuid');
const {RemoveKeywordsTransformer} = require("./refactor-obfuscated-code-jscodeshift-6");

const ast = j(`
var a = getKeywordName("0x0");
var b = getKeywordName("0x1");
`);

describe("RemoveKeywordsTransformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();

        const expected = `var a = 'function';
var b = '__vm';`;
        verifyFileExists(transformer.outputBaseName, 6, expected);
    });
});

function createTransformer() {
    return new RemoveKeywordsTransformer(6, ast, true, uuidv4());
}
