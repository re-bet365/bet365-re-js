import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";
import j from 'jscodeshift';
import {v4 as uuidv4} from 'uuid';
import {RefactorVariableTransformer} from "./refactor-obfuscated-code-jscodeshift-2";

const ast = j("var _0x1e16 = [];");

describe("RefactorVariableTransformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();

        verifyFileExists(transformer.outputBaseName, 2, "var keywords = [];");
    });
});

function createTransformer() {
    return new RefactorVariableTransformer(2, ast, true, uuidv4());
}
