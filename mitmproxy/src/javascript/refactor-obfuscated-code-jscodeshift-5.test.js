const esprima = require("esprima");
const fs = require('node:fs');
const path = require('path');
const j = require('jscodeshift');
const {ParameterRefactorTransformer} = require("./refactor-obfuscated-code-jscodeshift-5");

const ast = j(
`function first(_0x588017) { return 0; }
function second(_0x588017) { return 0; }
function third(_0x588017) { return 0; }
function single(_0x305252) { return 0; }`
);

describe("ParameterRefactorTransformer", () => {
    test("transform", () => {
        const parameterRefactorTransformer = createTransformer();
        parameterRefactorTransformer.transform();

        const filePath = path.join(__dirname, "test-output-5.js");
        expect(fs.existsSync(filePath)).toBe(true);
        const fileContent = fs.readFileSync(filePath, "utf8");

        // Assert the file content
        const expectedContents =
`function first(keywordArray) {
    return 0;
}
function second(keywordArray) {
    return 0;
}
function third(index) {
    return 0;
}
function single(moduleKey) {
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
    return new ParameterRefactorTransformer(5, ast, true, "test-output");
}
