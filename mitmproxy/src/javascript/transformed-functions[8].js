functions[8] = function () {
    var globalStateWriteIndex = tape[globalState[35]++], globalStateWriteStringValue = function () {
            for (var length = tape[globalState[35]++] << 8 | tape[globalState[35]++], stringFromTape = '', i = 0; i < length; i++)
                stringFromTape += String.fromCharCode(114 ^ tape[globalState[35]++]);
            return stringFromTape;
        }();
    globalState[globalStateWriteIndex] = globalStateWriteStringValue;
}