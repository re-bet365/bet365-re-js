class AstTransformer {
    constructor(stepNumber, ast, output) {
        if (this.constructor == AstTransformer) {
            throw new Error("not instantiable");
        }
        this.stepNumber = stepNumber;
        this.ast = ast;
        this.output = output;
    }

    transform() {
        throw new Error("implement");
    }
}

module.exports = {AstTransformer};