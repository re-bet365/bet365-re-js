functions[82] = function () {
    var globalStateWriteIndex = tape[globalState[35]++], executionContextCoefficient = function () {
            for (var binaryString = '', i = 0; i < 8; ++i)
                binaryString += createPaddedBinaryString(tape[globalState[35]++].toString(2), 8, '0');
            var leastSignificant53BitsString, signBit = '1' === binaryString.charAt(0) ? -1 : 1, mostSignificant11BitIntValue = parseInt(binaryString.substr(1, 11), 2), leastSignificant52BitsString = binaryString.substr(12);
            if (0 === mostSignificant11BitIntValue) {
                if (-1 === leastSignificant52BitsString.indexOf('1'))
                    return 0;
                mostSignificant11BitIntValue = -1022, leastSignificant53BitsString = '0' + leastSignificant52BitsString;
            } else
                mostSignificant11BitIntValue -= 1023, leastSignificant53BitsString = '1' + leastSignificant52BitsString;
            for (var coefficient = 0, i = 0, binaryPlaceValue = 1; i < leastSignificant53BitsString.length; ++i, binaryPlaceValue /= 2)
                coefficient += binaryPlaceValue * parseInt(leastSignificant53BitsString.charAt(i));
            return signBit * coefficient * Math.pow(2, mostSignificant11BitIntValue);
        }();
    globalState[globalStateWriteIndex] = executionContextCoefficient;
}