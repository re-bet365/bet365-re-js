import {getOutputFiles, verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";
import j from "jscodeshift";
import {v4 as uuidv4} from "uuid";
import {ChainedTransformer} from "./refactor-obfuscated-code-jscodeshift-chained";

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
