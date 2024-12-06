const esprima = require("esprima");
const fs = require('node:fs');
const path = require('path');
const j = require('jscodeshift');
const {UnaryExpressionTransformer} = require("./refactor-obfuscated-code-jscodeshift-2");

const ast = j("var a = !0; var b = !1;");

describe("UnaryExpressionTransformer", () => {
    test("transform", () => {
        const unaryExpressionTransformer = createTransformer();
        unaryExpressionTransformer.transform();

        const filePath = path.join(__dirname, "test-output-2.js");
        expect(fs.existsSync(filePath)).toBe(true);
        const fileContent = fs.readFileSync(filePath, "utf8");

        // Assert the file content
        const expectedContents =
`var a = true;
var b = false;`;
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
    return new UnaryExpressionTransformer(2, ast, true, "test-output");
}
