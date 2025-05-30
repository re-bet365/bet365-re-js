import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";
import j from 'jscodeshift';
import {v4 as uuidv4} from 'uuid';
import {VariableReplacementTransformer} from "./refactor-obfuscated-code-jscodeshift-3";

const ast = j("var _0x49b7bf = globalStateContextValues;");

describe("VariableReplacementTransformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();

        verifyFileExists(transformer.outputBaseName, 3, "");
    });
});

function createTransformer() {
    return new VariableReplacementTransformer(3, ast, true, uuidv4());
}
