const {AstTransformer} = require("./refactor-obfuscated-code-jscodeshift-common");
const j = require('jscodeshift');

var refactorParameters = {
    // the length of the array is the length of the expected scope
    '_0x2461da': ['keywordArray', 'keywordArray', 'index'],
    '_0x1e165c': ['shiftCount', 'unused'],
    '_0x38dc1b': ['shiftBy'],
    '_0x53d8ee': 'moduleKey',
    '_0x38dc1b': 'moduleArray',
    '_0x2418ef': 'exportedModules',
    '_0x1f8e23': 'moduleKeys',
    '_0xe41d70': 'initialiseArguments',
    '_0x56113d': 'exportedModules',
    '_0x343255': 'tapeBase64',
    '_0x502f29': 'initialiseModule',
    '_0x3af2c4': 'expectErrorFree',
    '_0x11efd2': 'error',
    '_0x19519d': 'functionIndex',
    '_0x58916a': 'base64Tape',
    '_0x27e170': 'base64Tape',
    '_0x2a2310': 'globalStateContexts',
    '_0xfce44a': 'binaryString',
    '_0x56a564': 'bitLength',
    '_0x73b408': 'padValue',
    '_0x244ed2': 'error',
    '_0x4fa810': 'globalStateWriteIndex',
    '_0xda9fcd': 'value',
    '_0x1d870a': 'globalStateWriteIndex',
    '_0x2d8cfa': 'value',
    '_0x5ac09b': 'argumentArray',
    '_0x897962': 'initialiseFunction',
    '_0x458e1c': 'exportedModules',
    '_0x463095': 'stringIndex',
    '_0xc1e270': 'unused',
    '_0xb8c9bb': 'rotateTimes',
    '_0xfd3749': 'initialArgs',
    '_0x2f0753': 'initialArguments'
};

class ParameterRefactorTransformer extends AstTransformer {
    constructor(stepNumber, jscodeshiftAst, output, outputBaseName) {
        super(stepNumber, jscodeshiftAst, output, outputBaseName);
    }

    performTransform() {
        Object.entries(refactorParameters).forEach(([key, refactoredParameterName]) => {
            if (Array.isArray(refactoredParameterName)) {
                var scopeNodes = Array.from(new Set(this.jscodeshiftAst.find(j.Identifier, {name: key}).__paths.map(path => path.scope.node)));
                var refactoredParameterNames = refactoredParameterName;
                this.jscodeshiftAst.find(j.Identifier, {name: key})
                    .replaceWith(path => {
                        var index = scopeNodes.indexOf(path.scope.node);
                        var refactoredParameterName = refactoredParameterNames[index];
                        if (refactoredParameterName) {
                            return j.identifier(refactoredParameterName);
                        }
                        return j.identifier(path.value.name);
                    });

            } else {
                this.jscodeshiftAst.find(j.Identifier, {name: key})
                    .replaceWith(path => j.identifier(refactoredParameterName))
            }
        });
    }
}

module.exports = {ParameterRefactorTransformer};
