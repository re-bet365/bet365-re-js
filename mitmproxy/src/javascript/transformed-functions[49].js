functions[49] = function () {
    var bitwiseSignedRightShiftResult, globalStateWriteIndex = tape[globalState[35]++], globalStateReadIndex1 = tape[globalState[35]++], globalStateReadIndex2 = tape[globalState[35]++], input1 = globalState[globalStateReadIndex1], input2 = globalState[globalStateReadIndex2];
    bitwiseSignedRightShiftResult = input1 >> input2, globalState[globalStateWriteIndex] = bitwiseSignedRightShiftResult;
}