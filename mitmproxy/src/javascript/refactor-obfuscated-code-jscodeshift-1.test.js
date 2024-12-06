const esprima = require("esprima");
const fs = require('node:fs');
const path = require('path');
const j = require('jscodeshift');
const {Void0Transformer} = require("./refactor-obfuscated-code-jscodeshift-1");

const ast = j("var a = void 0;");

describe("Void0Transformer", () => {
    test("transform", () => {
        const void0Transformer = createTransformer();
        void0Transformer.transform();

        const filePath = path.join(__dirname, "test-output-1.js");
        expect(fs.existsSync(filePath)).toBe(true);
        const fileContent = fs.readFileSync(filePath, "utf8");

        // Assert the file content
        expect(fileContent).toBe("var a = undefined;");
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
    return new Void0Transformer(1, ast, true, "test-output");
}
