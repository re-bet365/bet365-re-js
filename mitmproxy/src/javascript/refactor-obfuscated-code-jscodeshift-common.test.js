const esprima = require("esprima");
const {AstTransformer} = require("./refactor-obfuscated-code-jscodeshift-common");
const j = require('jscodeshift');
const fs = require('node:fs');
const path = require('path');

const jscodeshiftAst = j("");

describe("abstract class", () => {
    test("abstract class cannot be instantiated", () => {
        const astTransformer = () => new AstTransformer();
        expect(astTransformer).toThrow(Error);
    });

    test("can instantiate concrete class", () => {
        const astTransformer = createMock();
        expect(astTransformer.stepNumber).toBe(0);
        expect(astTransformer.jscodeshiftAst).toBe(jscodeshiftAst)
        expect(astTransformer.output).toBeTruthy();
    });
});

describe("transform", () => {
    test("throws Error", () => {
        const astTransformer = createMock();
        const transformed = () => astTransformer.transform();
        expect(transformed).toThrow(Error);
    });
});

describe("outputToFile", () => {
    test("creates file", () => {
        const astTransformer = createMock();
        astTransformer.outputToFile();

        const filePath = path.join(__dirname, "test-output-0.js");
        expect(fs.existsSync(filePath)).toBe(true);
        fs.unlinkSync(filePath, err => {
            if (err) {
                console.error(`Error removing file: ${err.message}`);
                return;
            }
        });
        expect(fs.existsSync(filePath)).toBe(false);
    });
});

function createMock() {
    return new MockAstTransformer(0, jscodeshiftAst, true, "test-output");
}

class MockAstTransformer extends AstTransformer {
    constructor(stepNumber, jscodeshiftAst, output, outputBaseName) {
        super(stepNumber, jscodeshiftAst, output, outputBaseName);
    }
}
