const esprima = require("esprima");
const fs = require('node:fs');
const path = require('path');
const j = require('jscodeshift');
const {VariableReplacementTransformer} = require("./refactor-obfuscated-code-jscodeshift-4");

const ast = j("var _0x49b7bf = globalStateContextValues;");

describe("VariableReplacementTransformer", () => {
    test("transform", () => {
        const variableReplacementTransformer = createTransformer();
        variableReplacementTransformer.transform();

        const filePath = path.join(__dirname, "test-output-4.js");
        expect(fs.existsSync(filePath)).toBe(true);
        const fileContent = fs.readFileSync(filePath, "utf8");

        // Assert the file content
        const expectedContents = "";
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
    return new VariableReplacementTransformer(4, ast, true, "test-output");
}
