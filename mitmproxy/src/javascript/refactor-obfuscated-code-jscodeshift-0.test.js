import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";

import j from 'jscodeshift';
import {v4 as uuidv4} from 'uuid';
import {Void0Transformer} from "./refactor-obfuscated-code-jscodeshift-0";

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
