import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";
import j from 'jscodeshift';
import {v4 as uuidv4} from 'uuid';
import {RemoveStaleIdentifierTransformer} from "./refactor-obfuscated-code-jscodeshift-10";

const ast = j(`
var _0x3d52dd = "";
`);

describe("RemoveStaleIdentifierTransformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();

        verifyFileExists(transformer.outputBaseName, 10, "");
    });
});

function createTransformer() {
    return new RemoveStaleIdentifierTransformer(10, ast, true, uuidv4());
}
