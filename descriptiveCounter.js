"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function indent_decode() {
    var custom_indent = document.getElementById("cust_indent").value;
    var result = descriptiveCounter(custom_indent);
    document.getElementById("indent_s").innerHTML = result;
}
function descriptiveCounter(input) {
    input = input.replace(/\\t/g, "	");
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