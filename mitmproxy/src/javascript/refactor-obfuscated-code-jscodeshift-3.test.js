const esprima = require("esprima");
const fs = require('node:fs');
const path = require('path');
const j = require('jscodeshift');
const {RefactorVariableTransformer} = require("./refactor-obfuscated-code-jscodeshift-3");

const ast = j("var _0x7c91 = [];");

describe("RefactorVariableTransformer", () => {
    test("transform", () => {
        const refactorVariableTransformer = createTransformer();
        refactorVariableTransformer.transform();

        const filePath = path.join(__dirname, "test-output-3.js");
        expect(fs.existsSync(filePath)).toBe(true);
        const fileContent = fs.readFileSync(filePath, "utf8");

        // Assert the file content
        const expectedContents = "var keywords = [];";
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
    return new RefactorVariableTransformer(3, ast, true, "test-output");
}
