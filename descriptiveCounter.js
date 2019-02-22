"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function counterDecode(inputId, outputId) {
    var custom_indent = document.getElementById(inputId).value;
    var result = descriptiveCounter(custom_indent);
    document.getElementById(outputId).innerHTML = result;
}
function descriptiveCounter(input) {
    input = input.replace(/\\t/g, "	");
    input = input.replace(/\\r/g, "\r");
    input = input.replace(/\\n/g, "\n");
    var tokens = input.split("");
    var result = "";
    var repeatedCharCount = 0;
    for (var i = 0; i < tokens.length; i++) {
        var char = input.substr(i, 1);
        if (char == input.substr(i + 1, 1)) {
            repeatedCharCount++;
        }
        else {
            switch (char) {
                case " ":
                    char = "blankspace";
                    break;
                case "\t":
                    char = "tab";
                    break;
                case "\n":
                    char = "\\n";
                    break;
                case "\r":
                    char = "\\r";
                    break;
                default:
                    char = "'" + char + "'";
            }
            repeatedCharCount = repeatedCharCount > 8 ? 8 : repeatedCharCount;
            if (repeatedCharCount > 0) {
                char += "s";
            }
            result += getCountText(repeatedCharCount, char);
            repeatedCharCount = 0;
        }
    }
    if (result.length < 0) {
        switch (char) {
            case " ":
                char = "blankspace";
                break;
            case "\t":
                char = "tab";
        }
        repeatedCharCount = repeatedCharCount > 8 ? 8 : repeatedCharCount;
        result = getCountText(repeatedCharCount, char);
    }
    result = result.replace(/^ & /, "");
    return result;
}
exports.descriptiveCounter = descriptiveCounter;
function getCountText(count, char) {
    const dict = ["one", "two", "three", "four", "five", "six", "seven", "eight", "many"];
    const ampersand = " & ";
    return ampersand + dict[count] + " " + char;
}
//# sourceMappingURL=descriptiveCounter.js.map