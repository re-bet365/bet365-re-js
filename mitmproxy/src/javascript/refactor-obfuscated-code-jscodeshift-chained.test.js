import {verifyFileExists, getOutputFiles} from "./refactor-obfuscated-code-jscodeshift-test-util.js";

const esprima = require("esprima");
const j = require('jscodeshift');
const fs = require('node:fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const {ChainedTransformer} = require("./refactor-obfuscated-code-jscodeshift-chained");

const jscodeshiftAst = j("");

describe("outputToFile", () => {
    test("transform creates file", () => {
        const transformer = createMock();
        transformer.transform();

        const expectedNumberOfIntermediateFiles = 11;
        const outputFiles = getOutputFiles(transformer.outputBaseName);
        expect(outputFiles.length).toBe(expectedNumberOfIntermediateFiles + 1);
        for (let i = 0; i < expectedNumberOfIntermediateFiles; i++) {
            verifyFileExists(transformer.outputBaseName, i, false);
        }
        verifyFileExists(transformer.outputBaseName, "end");
    });
});

function createMock() {
    return new ChainedTransformer(jscodeshiftAst, true, uuidv4());
}
