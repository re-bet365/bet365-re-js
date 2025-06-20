import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";
import j from "jscodeshift";
import {v4 as uuidv4} from "uuid";
import {RemovedUnusedParametersTransformer} from "./refactor-obfuscated-code-jscodeshift-8";

const ast = j(`
function aFunction(unused) {
    return 0;
}
var keywords = 0;
var getKeywordName = 0;
var a = aFunction(unused);
`);

describe("BracketToDotNotationTransformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();

        const expected = `function aFunction() {
    return 0;
}
var a = aFunction();`;
        verifyFileExists(transformer.outputBaseName, 8, expected);
    });
});

function createTransformer() {
    return new RemovedUnusedParametersTransformer(8, ast, true, uuidv4());
}
