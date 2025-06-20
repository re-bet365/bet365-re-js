functions[198] = function () {
    var globalStateWriteIndex = tape[globalState[35]++], globalStateEvalStringIndex = tape[globalState[35]++], evalString = globalState[globalStateEvalStringIndex], globalStateWriteIndex, evalResult;
    evalResult = eval(evalString), globalState[globalStateWriteIndex] = evalResult;
}