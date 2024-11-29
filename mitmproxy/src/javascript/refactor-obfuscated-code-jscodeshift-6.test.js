const esprima = require("esprima");
const fs = require('node:fs');
const path = require('path');
const j = require('jscodeshift');
const {FunctionRefactorTransformer} = require("./refactor-obfuscated-code-jscodeshift-6");

const ast = j(`function _0x4eecdf() { return 0; }`);

describe("FunctionRefactorTransformer", () => {
    test("transform", () => {
        const functionRefactorTransformer = createTransformer();
        functionRefactorTransformer.transform();

        const filePath = path.join(__dirname, "test-output-6.js");
        expect(fs.existsSync(filePath)).toBe(true);
        const fileContent = fs.readFileSync(filePath, "utf8");

        // Assert the file content
        const expectedContents =
`function getModule() {
    return 0;
}`;
        expect(fileContent).toBe(expectedContents);
        fs.unlinkSync(filePath, err => {
            if (err) {
                console.error(`Error removing file: ${err.message}`);
                return;
            }
        });
        expect(fs.existsSync(filePath)).toBe(false);
    });
});

function createTransformer() {
    return new FunctionRefactorTransformer(6, ast, true, "test-output");
}
