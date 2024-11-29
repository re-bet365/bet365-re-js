import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";

const esprima = require("esprima");
const fs = require('node:fs');
const path = require('path');
const j = require('jscodeshift');
const { v4: uuidv4 } = require('uuid');
const {BracketToDotNotationTransformer} = require("./refactor-obfuscated-code-jscodeshift-7");

const ast = j(`
var a = []["length"];
var b = []["toString"]();
`);

describe("BracketToDotNotationTransformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();

        const expected = `var a = [].length;
var b = [].toString();`;
        verifyFileExists(transformer.outputBaseName, 7, expected);
    });
});

function createTransformer() {
    return new BracketToDotNotationTransformer(7, ast, true, uuidv4());
}
