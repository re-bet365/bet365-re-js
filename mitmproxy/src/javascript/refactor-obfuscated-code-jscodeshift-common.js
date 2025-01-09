const escodegen = require('escodegen');
const esprima = require('esprima');
const fs = require('node:fs');

class AstTransformer {
    constructor(stepNumber, jscodeshiftAst, output, outputBaseName) {
        if (this.constructor == AstTransformer) {
            throw new Error("not instantiable");
        }
        this.stepNumber = stepNumber;
        this.jscodeshiftAst = jscodeshiftAst;
        this.output = output;
        this.outputBaseName = outputBaseName;
        if (null == this.stepNumber) {
            throw new TypeError("stepNumber cannot be null");
        }
        if (null == this.jscodeshiftAst) {
            throw new TypeError("jscodeshiftAst cannot be null");
        }
        if (null == this.output) {
            throw new TypeError("output cannot be null");
        }
        if (null == this.outputBaseName) {
            this.outputFileName = `deobfuscated-output-${this.stepNumber}.js`;
        } else {
            this.outputFileName = `${outputBaseName}-${this.stepNumber}.js`;
        }
    }

    performTransform() {
        throw new Error("implement");
    }

    transform() {
        this.performTransform();
        if (this.output) {
            this.outputToFile();
        }
        return this.jscodeshiftAst;
    }

    outputToFile() {
        const jsCode = escodegen.generate(esprima.parseScript(this.jscodeshiftAst.toSource()));
        if (typeof __dirname === 'undefined' || !__dirname) {
            __dirname = '.';
        }
        fs.writeFileSync(`${__dirname}/${this.outputFileName}`, jsCode, error => {
            if (error) {
                console.error(error);
            }
        });
    }
}

module.exports = {AstTransformer};
