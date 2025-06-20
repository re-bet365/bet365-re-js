import j from "jscodeshift";
import {v4 as uuidv4} from "uuid";
import {KeywordTransformer} from "./refactor-new-obfuscated-code-jscodeshift-2";
import {verifyFileExists} from "./refactor-obfuscated-code-jscodeshift-test-util";

describe("KeywordTransformer", () => {
    it("transform", () => {
        const contents_1746447434_4952288_received_14 = `var _0x409e = ['charAt', 'push'];`;
        const transformer = createTransformer(contents_1746447434_4952288_received_14);
        transformer.transform();
        const expected = `var keywords = ['charAt', 'push'];`;

        verifyFileExists(transformer.outputBaseName, 2, expected);
    });
});

function createTransformer(javascriptString) {
    const ast = j(javascriptString);
    return new KeywordTransformer(2, ast, true, uuidv4());
}
