import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";
import j from "jscodeshift";
import {v4 as uuidv4} from "uuid";
import {RemovedClosestTransformer} from "./refactor-obfuscated-code-jscodeshift-9";

const ast = j(`
function aFunction(_0x2cf5bb) {
    if (!_0x2cf5bb) {
        return 0;
    }
    return 1;
}
`);

describe("RemovedClosestTransformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();

        const expected = `function aFunction() {
    return 1;
}`;
        verifyFileExists(transformer.outputBaseName, 9, expected);
    });
});

function createTransformer() {
    return new RemovedClosestTransformer(9, ast, true, uuidv4());
}
