functions[198] = function () {
    var stateContext = beforeFunctionState("functions[198]", globalState);
    var globalStateWriteIndex = tape[globalState[35]++], globalStateEvalStringIndex = tape[globalState[35]++], evalString = globalState[globalStateEvalStringIndex], globalStateWriteIndex, evalResult;
    evalResult = eval(evalString), globalState[globalStateWriteIndex] = evalResult;
    afterFunctionState(stateContext, globalState);
}