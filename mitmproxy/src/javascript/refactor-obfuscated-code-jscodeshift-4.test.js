import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";
import j from 'jscodeshift';
import {v4 as uuidv4} from 'uuid';
import {ParameterRefactorTransformer} from "./refactor-obfuscated-code-jscodeshift-4";

const ast = j(`function first(_0x2461da) { return 0; }
function second(_0x2461da) { return 0; }
function third(_0x2461da) { return 0; }
function single(_0x53d8ee) { return 0; }`);

describe("ParameterRefactorTransformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();

        // Assert the file content
        const expectedContents = `function first(keywordArray) {
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
