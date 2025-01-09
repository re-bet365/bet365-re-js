import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";

const esprima = require("esprima");
const {AstTransformer} = require("./refactor-obfuscated-code-jscodeshift-common");
const j = require('jscodeshift');
const fs = require('node:fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const jscodeshiftAst = j("");

describe("abstract class", () => {
    test("abstract class cannot be instantiated", () => {
        const transformer = () => new AstTransformer();
        expect(transformer).toThrow(Error);
    });

    test("can instantiate concrete class", () => {
        const transformer = createMock();
        expect(transformer.stepNumber).toBe(0);
        expect(transformer.jscodeshiftAst).toBe(jscodeshiftAst)
        expect(transformer.output).toBeTruthy();
    });
});

describe("transform", () => {
    test("throws implement Error", () => {
        const transformer = createMock();
        expect(() => transformer.transform()).toThrow(Error);
    });
});

describe("outputToFile", () => {
    test("creates file", () => {
        const transformer = createMock();
        transformer.outputToFile();

        verifyFileExists(transformer.outputBaseName, "0");
    });
});

function createMock() {
    return new MockAstTransformer(0, jscodeshiftAst, true, uuidv4());
}

class MockAstTransformer extends AstTransformer {
    constructor(stepNumber, jscodeshiftAst, output, outputBaseName) {
        super(stepNumber, jscodeshiftAst, output, outputBaseName);
    }
}
