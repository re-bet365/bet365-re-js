functions[166] = function () {
    var bitwiseAndResult, globalStateWriteIndex = tape[globalState[35]++], globalStateReadIndex1 = tape[globalState[35]++], globalStateReadIndex2 = tape[globalState[35]++], input1 = globalState[globalStateReadIndex1], input2 = globalState[globalStateReadIndex2];
    bitwiseAndResult = input1 & input2, globalState[globalStateWriteIndex] = bitwiseAndResult;
}