import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";
import j from "jscodeshift";
import {v4 as uuidv4} from "uuid";
import {FunctionRefactorTransformer} from "./refactor-obfuscated-code-jscodeshift-5";

const ast = j(`function _0x21f1e2() { return 0; }`);

describe("FunctionRefactorTransformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();

        // Assert the file content
        const expectedContents = `function getModule() {
    return 0;
}`;
        verifyFileExists(transformer.outputBaseName, 5, expectedContents);
    });
});

function createTransformer() {
    return new FunctionRefactorTransformer(5, ast, true, uuidv4());
}
