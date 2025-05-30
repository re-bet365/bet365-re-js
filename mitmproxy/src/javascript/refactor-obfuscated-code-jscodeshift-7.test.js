import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util.js";
import j from 'jscodeshift';
import {v4 as uuidv4} from 'uuid';
import {BracketToDotNotationTransformer} from "./refactor-obfuscated-code-jscodeshift-7";

const ast = j(`
var a = []["length"];
var b = []["toString"]();
`);

describe("BracketToDotNotationTransformer", () => {
    test("transform", () => {
        const transformer = createTransformer();
        transformer.transform();

        const expected = `var a = [].length;
var b = [].toString();`;
        verifyFileExists(transformer.outputBaseName, 7, expected);
    });
});

function createTransformer() {
    return new BracketToDotNotationTransformer(7, ast, true, uuidv4());
}
