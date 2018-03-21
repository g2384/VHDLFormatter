"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let isTesting = false;
const ILCommentPrefix = "@@comments";
const ILQuotesPrefix = "@@quotes";
var FormatMode;
(function (FormatMode) {
    FormatMode[FormatMode["Default"] = 0] = "Default";
    FormatMode[FormatMode["EndsWithSemicolon"] = 1] = "EndsWithSemicolon";
    FormatMode[FormatMode["CaseWhen"] = 2] = "CaseWhen";
    FormatMode[FormatMode["IfElse"] = 3] = "IfElse";
    FormatMode[FormatMode["PortGeneric"] = 4] = "PortGeneric";
})(FormatMode || (FormatMode = {}));
let Mode = FormatMode.Default;
class NewLineSettings {
    constructor() {
        this.newLineAfter = [];
        this.noNewLineAfter = [];
    }
    newLineAfterPush(keyword) {
        this.newLineAfter.push(keyword);
    }
    noNewLineAfterPush(keyword) {
        this.noNewLineAfter.push(keyword);
    }
    push(keyword, addNewLine) {
        let str = addNewLine.toLowerCase();
        if (str.indexOf("none") >= 0) {
            return;
        }
        else if (str.indexOf("no") < 0) {
            this.newLineAfterPush(keyword);
        }
        else {
            this.noNewLineAfterPush(keyword);
        }
    }
}
exports.NewLineSettings = NewLineSettings;
function ConstructNewLineSettings(dict) {
    let settings = new NewLineSettings();
    for (let key in dict) {
        settings.push(key, dict[key]);
    }
    return settings;
}
function fetchHeader(url, wch) {
    try {
        var req = new XMLHttpRequest();
        req.open("HEAD", url, false);
        req.send(null);
        if (req.status == 200) {
            return req.getResponseHeader(wch);
        }
        else
            return false;
    }
    catch (e) {
        return "";
    }
}
String.prototype.count = function (text) {
    return this.split(text).length - 1;
};
String.prototype.regexStartsWith = function (pattern) {
    var searchResult = this.search(pattern);
    return searchResult == 0;
};
String.prototype.regexIndexOf = function (pattern, startIndex) {
    startIndex = startIndex || 0;
    var searchResult = this.substr(startIndex).search(pattern);
    return (-1 === searchResult) ? -1 : searchResult + startIndex;
};
String.prototype.regexLastIndexOf = function (pattern, startIndex) {
    startIndex = startIndex === undefined ? this.length : startIndex;
    var searchResult = this.substr(0, startIndex).reverse().regexIndexOf(pattern, 0);
    return (-1 === searchResult) ? -1 : this.length - ++searchResult;
};
String.prototype.reverse = function () {
    return this.split('').reverse().join('');
};
function wordWrap() {
    var d = document.getElementById("result");
    if (d.className == "") {
        d.className = "wordwrap";
    }
    else {
        d.className = "";
    }
}
function getHTMLInputElement(name) {
    return document.getElementById(name);
}
function noFormat() {
    let elements = ["remove_comments",
        "remove_lines",
        "remove_report",
        "check_alias",
        "sign_align",
        "sign_align_all",
        "new_line_after_port",
        "new_line",
        "use_space",
        "compress",
        "mix_letter"];
    var t = !(getHTMLInputElement("remove_comments").disabled);
    elements.forEach(element => {
        getHTMLInputElement(element).disabled = t;
    });
    let keyword = document.getElementById("keyword");
    for (let i = 0; i < keyword.elements.length; i++) {
        keyword.elements[i].disabled = t;
    }
}
function indent_decode() {
    var custom_indent = getHTMLInputElement("cust_indent").value;
    var result = indentDecode(custom_indent);
    document.getElementById("indent_s").innerHTML = result;
}
function indentDecode(input) {
    input = input.replace(/\\t/g, "	");
    var count = [" & one ", " & two ", " & three ", " & four ", " & five ", " & six ", " & seven ", " & eight ", " & many "];
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
            result += count[repeatedCharCount] + char;
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
        result = count[repeatedCharCount] + char;
    }
    result = result.replace(/^ & /, "");
    return result;
}
exports.indentDecode = indentDecode;
function Compress(input) {
    input = input.replace(/\r\n/g, '');
    input = input.replace(/[\t ]+/g, ' ');
    input = input.replace(/[ ]?([&=:\-<>\+|])[ ]?/g, '$1');
    return input;
}
function MixLetters(input) {
    let arr = input.split("");
    for (var k = 0; k < arr.length; k++) {
        if (arr[k] === arr[k].toUpperCase() && Math.random() > 0.5) {
            arr[k] = arr[k].toLowerCase();
        }
        else if (Math.random() > 0.5) {
            arr[k] = arr[k].toUpperCase();
        }
    }
    return arr.join("");
}
function EscapeComments(arr, comments, commentIndex) {
    for (var i = 0; i < arr.length; i++) {
        let line = arr[i];
        var firstCharIndex = line.regexIndexOf(/[a-zA-Z0-9\(\&\)%_\+'"|\\]/);
        var commentStartIndex = line.indexOf("--");
        if (firstCharIndex < commentStartIndex && firstCharIndex >= 0) {
            comments.push(line.substr(commentStartIndex));
            arr[i] = line.substr(firstCharIndex, commentStartIndex - firstCharIndex) + ILCommentPrefix + (commentIndex++);
        }
        else if ((firstCharIndex > commentStartIndex && commentStartIndex >= 0) || (firstCharIndex < 0 && commentStartIndex >= 0)) {
            comments.push(line.substr(commentStartIndex));
            arr[i] = ILCommentPrefix + (commentIndex++);
        }
        else {
            firstCharIndex = firstCharIndex < 0 ? 0 : firstCharIndex;
            arr[i] = line.substr(firstCharIndex);
        }
    }
    return commentIndex;
}
function ToLowerCases(arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].toLowerCase();
    }
}
function ToUpperCases(arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].toUpperCase();
    }
}
function ToCamelCases(arr) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0) + arr[i].slice(1).toLowerCase();
    }
}
function ReplaceKeyWords(text, keywords) {
    for (var k = 0; k < keywords.length; k++) {
        text = text.replace(new RegExp("([^a-zA-Z0-9_@]|^)" + keywords[k] + "([^a-zA-Z0-9_]|$)", 'gi'), "$1" + keywords[k] + "$2");
    }
    return text;
}
function SetKeywordCase(input, keywordcase, keywords, typenames) {
    let inputcase = keywordcase.toLowerCase();
    switch (keywordcase.toLowerCase()) {
        case "lowercase":
            ToLowerCases(keywords);
            ToLowerCases(typenames);
            break;
        case "defaultcase":
            ToCamelCases(keywords);
            ToCamelCases(typenames);
            break;
        case "uppercase":
            ToUpperCases(keywords);
            ToUpperCases(typenames);
    }
    input = ReplaceKeyWords(input, keywords);
    input = ReplaceKeyWords(input, typenames);
    return input;
}
function SetNewLinesAfterSymbols(text, newLineSettings) {
    if (newLineSettings == null) {
        return text;
    }
    if (newLineSettings.newLineAfter != null) {
        newLineSettings.newLineAfter.forEach(symbol => {
            let regex = new RegExp("(" + symbol.toUpperCase() + ")[ ]?([^ \r\n@])", "g");
            text = text.replace(regex, '$1\r\n$2');
        });
    }
    if (newLineSettings.noNewLineAfter != null) {
        newLineSettings.noNewLineAfter.forEach(symbol => {
            let regex = new RegExp("(" + symbol.toUpperCase() + ")[ \r\n]+([^@])", "g");
            text = text.replace(regex, '$1 $2');
        });
    }
    return text;
}
exports.SetNewLinesAfterSymbols = SetNewLinesAfterSymbols;
class BeautifierSettings {
    constructor(removeComments, removeReport, checkAlias, signAlign, signAlignAll, keywordCase, indentation, newLineSettings) {
        this.RemoveComments = removeComments;
        this.RemoveAsserts = removeReport;
        this.CheckAlias = checkAlias;
        this.SignAlignRegional = signAlign;
        this.SignAlignAll = signAlignAll;
        this.KeywordCase = keywordCase;
        this.Indentation = indentation;
        this.NewLineSettings = newLineSettings;
    }
}
exports.BeautifierSettings = BeautifierSettings;
let KeyWords = ["ABS", "ACCESS", "AFTER", "ALIAS", "ALL", "AND", "ARCHITECTURE", "ARRAY", "ASSERT", "ATTRIBUTE", "BEGIN", "BLOCK", "BODY", "BUFFER", "BUS", "CASE", "COMPONENT", "CONFIGURATION", "CONSTANT", "CONTEXT", "COVER", "DISCONNECT", "DOWNTO", "DEFAULT", "ELSE", "ELSIF", "END", "ENTITY", "EXIT", "FAIRNESS", "FILE", "FOR", "FORCE", "FUNCTION", "GENERATE", "GENERIC", "GROUP", "GUARDED", "IF", "IMPURE", "IN", "INERTIAL", "INOUT", "IS", "LABEL", "LIBRARY", "LINKAGE", "LITERAL", "LOOP", "MAP", "MOD", "NAND", "NEW", "NEXT", "NOR", "NOT", "NULL", "OF", "ON", "OPEN", "OR", "OTHERS", "OUT", "PACKAGE", "PORT", "POSTPONED", "PROCEDURE", "PROCESS", "PROPERTY", "PROTECTED", "PURE", "RANGE", "RECORD", "REGISTER", "REJECT", "RELEASE", "REM", "REPORT", "RESTRICT", "RESTRICT_GUARANTEE", "RETURN", "ROL", "ROR", "SELECT", "SEQUENCE", "SEVERITY", "SHARED", "SIGNAL", "SLA", "SLL", "SRA", "SRL", "STRONG", "SUBTYPE", "THEN", "TO", "TRANSPORT", "TYPE", "UNAFFECTED", "UNITS", "UNTIL", "USE", "VARIABLE", "VMODE", "VPROP", "VUNIT", "WAIT", "WHEN", "WHILE", "WITH", "XNOR", "XOR"];
let TypeNames = ["BOOLEAN", "BIT", "CHARACTER", "INTEGER", "TIME", "NATURAL", "POSITIVE", "STRING"];
function beautify(input, settings) {
    input = input.replace(/\r\n/g, "\n");
    input = input.replace(/\n/g, "\r\n");
    var arr = input.split("\r\n");
    var comments = [], commentsIndex = 0;
    commentsIndex = EscapeComments(arr, comments, commentsIndex);
    input = arr.join("\r\n");
    if (settings.RemoveComments) {
        input = input.replace(/\r\n[ \t]*@@comments[0-9]+[ \t]*\r\n/g, '\r\n');
        input = input.replace(/@@comments[0-9]+/g, '');
        commentsIndex = 0;
    }
    input = RemoveExtraNewLines(input);
    input = input.replace(/[\t ]+/g, ' ');
    input = input.replace(/\([\t ]+/g, '\(');
    input = input.replace(/[ ]+;/g, ';');
    input = input.replace(/:[ ]*(PROCESS|ENTITY)/gi, ':$1');
    arr = input.split("\r\n");
    let quotes = EscapeQuotes(arr);
    input = arr.join("\r\n");
    input = SetKeywordCase(input, "uppercase", KeyWords, TypeNames);
    arr = input.split("\r\n");
    if (settings.RemoveAsserts) {
        RemoveAsserts(arr); //RemoveAsserts must be after EscapeQuotes
    }
    ReserveSemicolonInKeywords(arr);
    input = arr.join("\r\n");
    input = input.replace(/(PORT|PROCESS|GENERIC)[\s]*\(/g, '$1 (');
    input = SetNewLinesAfterSymbols(input, settings.NewLineSettings);
    arr = input.split("\r\n");
    ApplyNoNewLineAfter(arr, settings.NewLineSettings.noNewLineAfter);
    input = arr.join("\r\n");
    //new
    input = input.replace(/([a-zA-Z0-9\); ])\);(@@comments[0-9]+)?@@end/g, '$1\r\n);$2@@end');
    input = input.replace(/[ ]?([&=:\-<>\+|\*])[ ]?/g, ' $1 ');
    input = input.replace(/[ ]?([,])[ ]?/g, '$1 ');
    input = input.replace(/[ ]?(['"])(THEN)/g, '$1 $2');
    input = input.replace(/[ ]?(\?)?[ ]?(<|:|>|\/)?[ ]+(=)?[ ]?/g, ' $1$2$3 ');
    input = input.replace(/(IF)[ ]?([\(\)])/g, '$1 $2');
    input = input.replace(/([\(\)])[ ]?(THEN)/gi, '$1 $2');
    input = input.replace(/(^|[\(\)])[ ]?(AND|OR|XOR|XNOR)[ ]*([\(])/g, '$1 $2 $3');
    input = input.replace(/ ([\-\*\/=+<>])[ ]*([\-\*\/=+<>]) /g, " $1$2 ");
    //input = input.replace(/\r\n[ \t]+--\r\n/g, "\r\n");
    input = input.replace(/[ ]+/g, ' ');
    input = input.replace(/[ \t]+\r\n/g, "\r\n");
    input = input.replace(/\r\n\r\n\r\n/g, '\r\n');
    input = input.replace(/[\r\n\s]+$/g, '');
    input = input.replace(/[ \t]+\)/g, ')');
    arr = input.split("\r\n");
    let result = [];
    beautify3(arr, result, settings, 0, 0);
    if (settings.SignAlignAll) {
        AlignSigns(result, 0, result.length - 1);
    }
    arr = FormattedLineToString(result, settings.Indentation);
    input = arr.join("\r\n");
    input = SetKeywordCase(input, settings.KeywordCase, KeyWords, TypeNames);
    for (var k = 0; k < quotes.length; k++) {
        input = input.replace(ILQuotesPrefix + k, quotes[k]);
    }
    for (var k = 0; k < commentsIndex; k++) {
        input = input.replace(ILCommentPrefix + k, comments[k]);
    }
    input = input.replace(/@@semicolon/g, ";");
    input = input.replace(/@@[a-z]+/g, "");
    return input;
}
exports.beautify = beautify;
class FormattedLine {
    constructor(line, indent) {
        this.Line = line;
        this.Indent = indent;
    }
}
exports.FormattedLine = FormattedLine;
function FormattedLineToString(arr, indentation) {
    let result = [];
    if (arr == null) {
        return result;
    }
    arr.forEach(i => {
        if (i instanceof FormattedLine) {
            if (i.Line.length > 0) {
                result.push((Array(i.Indent + 1).join(indentation)) + i.Line);
            }
            else {
                result.push("");
            }
        }
        else {
            result = result.concat(FormattedLineToString(i, indentation));
        }
    });
    return result;
}
exports.FormattedLineToString = FormattedLineToString;
function GetCloseparentheseEndIndex(inputs, startIndex) {
    let openParentheseCount = 0;
    let closeParentheseCount = 0;
    for (let i = startIndex; i < inputs.length; i++) {
        let input = inputs[i];
        openParentheseCount += input.count("(");
        closeParentheseCount += input.count(")");
        if (openParentheseCount > 0
            && openParentheseCount <= closeParentheseCount) {
            return i;
        }
    }
    return startIndex;
}
function beautifyPortGenericBlock(inputs, result, settings, startIndex, parentEndIndex, indent, mode) {
    let firstLine = inputs[startIndex];
    let regex = new RegExp("[\\w\\s:]*(" + mode + ")([\\s]|$)");
    if (!firstLine.regexStartsWith(regex)) {
        return [startIndex, parentEndIndex];
    }
    let firstLineHasParenthese = firstLine.indexOf("(") >= 0;
    let hasParenthese = firstLineHasParenthese;
    let blockBodyStartIndex = startIndex;
    let secondLineHasParenthese = startIndex + 1 < inputs.length && inputs[startIndex + 1].startsWith("(");
    if (secondLineHasParenthese) {
        hasParenthese = true;
        blockBodyStartIndex++;
    }
    let endIndex = hasParenthese ? GetCloseparentheseEndIndex(inputs, startIndex) : startIndex;
    if (endIndex != startIndex && firstLineHasParenthese) {
        inputs[startIndex] = inputs[startIndex].replace(/(PORT|GENERIC|PROCEDURE)([\w ]+)\(([\w\(\) ]+)/, '$1$2(\r\n$3');
        let newInputs = inputs[startIndex].split("\r\n");
        if (newInputs.length == 2) {
            inputs[startIndex] = newInputs[0];
            inputs.splice(startIndex + 1, 0, newInputs[1]);
            endIndex++;
            parentEndIndex++;
        }
    }
    else if (endIndex > startIndex + 1 && secondLineHasParenthese) {
        inputs[startIndex + 1] = inputs[startIndex + 1].replace(/\(([\w\(\) ]+)/, '(\r\n$1');
        let newInputs = inputs[startIndex + 1].split("\r\n");
        if (newInputs.length == 2) {
            inputs[startIndex + 1] = newInputs[0];
            inputs.splice(startIndex + 2, 0, newInputs[1]);
            endIndex++;
            parentEndIndex++;
        }
    }
    if (firstLineHasParenthese && inputs[startIndex].indexOf("MAP") > 0) {
        inputs[startIndex] = inputs[startIndex].replace(/([^\w])(MAP)\s+\(/g, '$1$2(');
    }
    result.push(new FormattedLine(inputs[startIndex], indent));
    if (secondLineHasParenthese) {
        let secondLineIndent = indent;
        if (endIndex == startIndex + 1) {
            secondLineIndent++;
        }
        result.push(new FormattedLine(inputs[startIndex + 1], secondLineIndent));
    }
    let blockBodyEndIndex = endIndex;
    let i = beautify3(inputs, result, settings, blockBodyStartIndex + 1, indent + 1, endIndex);
    if (inputs[i].startsWith(")")) {
        result[i].Indent--;
        blockBodyEndIndex--;
    }
    if (settings.SignAlignRegional && !settings.SignAlignAll
        && settings.SignAlignKeyWords != null
        && settings.SignAlignKeyWords.indexOf(mode) >= 0) {
        blockBodyStartIndex++;
        AlignSigns(result, blockBodyStartIndex, blockBodyEndIndex);
    }
    return [i, parentEndIndex];
}
exports.beautifyPortGenericBlock = beautifyPortGenericBlock;
function AlignSigns(result, startIndex, endIndex) {
    AlignSign_(result, startIndex, endIndex, ":");
    AlignSign_(result, startIndex, endIndex, ":=");
    AlignSign_(result, startIndex, endIndex, "=>");
    AlignSign_(result, startIndex, endIndex, "<=");
}
exports.AlignSigns = AlignSigns;
function AlignSign_(result, startIndex, endIndex, symbol) {
    let maxSymbolIndex = -1;
    let symbolIndices = {};
    let startLine = startIndex;
    for (let i = startIndex; i <= endIndex; i++) {
        let line = result[i].Line;
        let regex = new RegExp("([\\s\\w\\\\]|^)" + symbol + "([\\s\\w\\\\]|$)");
        let colonIndex = line.regexIndexOf(regex);
        if (colonIndex > 0) {
            maxSymbolIndex = Math.max(maxSymbolIndex, colonIndex);
            symbolIndices[i] = colonIndex;
        }
        else if (!line.startsWith(ILCommentPrefix) && line.length != 0) {
            if (startLine < i - 1) {
                AlignSign(result, startLine, i - 1, symbol, maxSymbolIndex, symbolIndices);
            }
            maxSymbolIndex = -1;
            symbolIndices = {};
            startLine = i;
        }
    }
    if (startLine < endIndex) {
        AlignSign(result, startLine, endIndex, symbol, maxSymbolIndex, symbolIndices);
    }
}
function AlignSign(result, startIndex, endIndex, symbol, maxSymbolIndex = -1, symbolIndices = {}) {
    if (maxSymbolIndex < 0) {
        return;
    }
    for (let lineIndex in symbolIndices) {
        let symbolIndex = symbolIndices[lineIndex];
        if (symbolIndex == maxSymbolIndex) {
            continue;
        }
        let line = result[lineIndex].Line;
        result[lineIndex].Line = line.substring(0, symbolIndex)
            + (Array(maxSymbolIndex - symbolIndex + 1).join(" "))
            + line.substring(symbolIndex);
    }
}
exports.AlignSign = AlignSign;
function beautifyCaseBlock(inputs, result, settings, startIndex, indent) {
    if (!inputs[startIndex].regexStartsWith(/(.+:\s*)?(CASE)([\s]|$)/)) {
        return startIndex;
    }
    result.push(new FormattedLine(inputs[startIndex], indent));
    let i = beautify3(inputs, result, settings, startIndex + 1, indent + 2);
    result[i].Indent = indent;
    return i;
}
exports.beautifyCaseBlock = beautifyCaseBlock;
function getSemicolonBlockEndIndex(inputs, settings, startIndex, parentEndIndex) {
    let endIndex = 0;
    let openBracketsCount = 0;
    let closeBracketsCount = 0;
    for (let i = startIndex; i < inputs.length; i++) {
        let input = inputs[i];
        let indexOfSemicolon = input.indexOf(";");
        let splitIndex = indexOfSemicolon < 0 ? input.length : indexOfSemicolon + 1;
        let stringBeforeSemicolon = input.substring(0, splitIndex);
        let stringAfterSemicolon = input.substring(splitIndex);
        stringAfterSemicolon = stringAfterSemicolon.replace(new RegExp(ILCommentPrefix + "[0-9]+"), "");
        openBracketsCount += stringBeforeSemicolon.count("(");
        closeBracketsCount += stringBeforeSemicolon.count(")");
        if (indexOfSemicolon < 0) {
            continue;
        }
        if (openBracketsCount == closeBracketsCount) {
            endIndex = i;
            if (stringAfterSemicolon.trim().length > 0 && settings.NewLineSettings.newLineAfter.indexOf(";") >= 0) {
                inputs[i] = stringBeforeSemicolon;
                inputs.splice(i, 0, stringAfterSemicolon);
                parentEndIndex++;
            }
            break;
        }
    }
    return [endIndex, parentEndIndex];
}
function beautifyComponentBlock(inputs, result, settings, startIndex, indent) {
    let endIndex = startIndex;
    for (let i = startIndex; i < inputs.length; i++) {
        if (inputs[i].regexStartsWith(/END(\s|$)/)) {
            endIndex = i;
            break;
        }
    }
    result.push(new FormattedLine(inputs[startIndex], indent));
    if (endIndex != startIndex) {
        let i = beautify3(inputs, result, settings, startIndex + 1, indent + 1, endIndex);
    }
    return endIndex;
}
exports.beautifyComponentBlock = beautifyComponentBlock;
function beautifySemicolonBlock(inputs, result, settings, startIndex, parentEndIndex, indent) {
    let endIndex = startIndex;
    [endIndex, parentEndIndex] = getSemicolonBlockEndIndex(inputs, settings, startIndex, parentEndIndex);
    result.push(new FormattedLine(inputs[startIndex], indent));
    if (endIndex != startIndex) {
        let i = beautify3(inputs, result, settings, startIndex + 1, indent + 1, endIndex);
    }
    return [endIndex, parentEndIndex];
}
exports.beautifySemicolonBlock = beautifySemicolonBlock;
function beautify3(inputs, result, settings, startIndex, indent, endIndex) {
    let i;
    let regexOneLineBlockKeyWords = new RegExp(/(PROCEDURE)[^\w](?!.+[^\w]IS([^\w]|$))/); //match PROCEDURE..; but not PROCEDURE .. IS;
    let regexFunctionMultiLineBlockKeyWords = new RegExp(/(FUNCTION|IMPURE FUNCTION)[^\w](?=.+[^\w]IS([^\w]|$))/); //match FUNCTION .. IS; but not FUNCTION
    let blockMidKeyWords = ["BEGIN"];
    let blockStartsKeyWords = [
        "IF",
        "CASE",
        "ARCHITECTURE",
        "PROCEDURE",
        "PACKAGE",
        "PROCESS",
        "POSTPONED PROCESS",
        "PROCESS",
        "(.*\\s*PROTECTED)",
        "(COMPONENT)",
        "(ENTITY(?!.+;))",
        "FOR",
        "WHILE",
        "LOOP",
        "(.*\\s*GENERATE)",
        "(CONTEXT[\\w\\s\\\\]+IS)",
        "(CONFIGURATION(?!.+;))",
        "BLOCK",
        "UNITS",
        "\\w+\\s+\\w+\\s+IS\\s+RECORD"
    ];
    let blockEndsKeyWords = ["END"];
    let blockEndsWithSemicolon = ["(WITH\\s+[\\w\\s\\\\]+SELECT)", "([\\w\\\\]+[\\s]*<=)", "([\\w\\\\]+[\\s]*:=)", "FOR\\s+[\\w\\s,]+:\\s*\\w+\\s+USE", "REPORT"];
    let newLineAfterKeyWordsStr = blockStartsKeyWords.join("|");
    let blockEndKeyWordsStr = blockEndsKeyWords.join("|");
    let blockMidKeyWordsStr = blockMidKeyWords.join("|");
    let blockEndsWithSemicolonStr = blockEndsWithSemicolon.join("|");
    let regexBlockMidKeyWords = new RegExp("(" + blockMidKeyWordsStr + ")([^\\w]|$)");
    let regexBlockStartsKeywords = new RegExp("([\\w]+\\s*:\\s*)?(" + newLineAfterKeyWordsStr + ")([^\\w]|$)");
    let regexBlockEndsKeyWords = new RegExp("(" + blockEndKeyWordsStr + ")([^\\w]|$)");
    let regexblockEndsWithSemicolon = new RegExp("(" + blockEndsWithSemicolonStr + ")([^\\w]|$)");
    let regexMidKeyWhen = new RegExp("(" + "WHEN" + ")([^\\w]|$)");
    let regexMidKeyElse = new RegExp("(" + "ELSE|ELSIF" + ")([^\\w]|$)");
    if (endIndex == null) {
        endIndex = inputs.length - 1;
    }
    for (i = startIndex; i <= endIndex; i++) {
        if (indent < 0) {
            indent = 0;
        }
        let input = inputs[i].trim();
        if (input.regexStartsWith(/COMPONENT\s/)) {
            let modeCache = Mode;
            Mode = FormatMode.EndsWithSemicolon;
            i = beautifyComponentBlock(inputs, result, settings, i, indent);
            Mode = modeCache;
            continue;
        }
        if (input.regexStartsWith(/\w+\s*:\s*ENTITY/)) {
            let modeCache = Mode;
            Mode = FormatMode.EndsWithSemicolon;
            [i, endIndex] = beautifySemicolonBlock(inputs, result, settings, i, endIndex, indent);
            Mode = modeCache;
            continue;
        }
        if (Mode != FormatMode.EndsWithSemicolon && input.regexStartsWith(regexblockEndsWithSemicolon)) {
            let modeCache = Mode;
            Mode = FormatMode.EndsWithSemicolon;
            [i, endIndex] = beautifySemicolonBlock(inputs, result, settings, i, endIndex, indent);
            Mode = modeCache;
            continue;
        }
        if (input.regexStartsWith(/(.+:\s*)?(CASE)([\s]|$)/)) {
            let modeCache = Mode;
            Mode = FormatMode.CaseWhen;
            i = beautifyCaseBlock(inputs, result, settings, i, indent);
            Mode = modeCache;
            continue;
        }
        if (input.regexStartsWith(/[\w\s:]*PORT([\s]|$)/)) {
            [i, endIndex] = beautifyPortGenericBlock(inputs, result, settings, i, endIndex, indent, "PORT");
            continue;
        }
        if (input.regexStartsWith(/[\w\s:]*GENERIC([\s]|$)/)) {
            [i, endIndex] = beautifyPortGenericBlock(inputs, result, settings, i, endIndex, indent, "GENERIC");
            continue;
        }
        if (input.regexStartsWith(/[\w\s:]*PROCEDURE[\s\w]+\($/)) {
            [i, endIndex] = beautifyPortGenericBlock(inputs, result, settings, i, endIndex, indent, "PROCEDURE");
            continue;
        }
        if (input.regexStartsWith(/FUNCTION[^\w]/)
            && input.regexIndexOf(/[^\w]RETURN[^\w]/) < 0) {
            [i, endIndex] = beautifyPortGenericBlock(inputs, result, settings, i, endIndex, indent, "FUNCTION");
            i = beautify3(inputs, result, settings, i + 1, indent + 1);
            continue;
        }
        if (input.regexStartsWith(/IMPURE FUNCTION[^\w]/)
            && input.regexIndexOf(/[^\w]RETURN[^\w]/) < 0) {
            [i, endIndex] = beautifyPortGenericBlock(inputs, result, settings, i, endIndex, indent, "IMPURE FUNCTION");
            i = beautify3(inputs, result, settings, i + 1, indent + 1);
            continue;
        }
        result.push(new FormattedLine(input, indent));
        if (startIndex != 0
            && (input.regexStartsWith(regexBlockMidKeyWords)
                || (Mode != FormatMode.EndsWithSemicolon && input.regexStartsWith(regexMidKeyElse))
                || (Mode == FormatMode.CaseWhen && input.regexStartsWith(regexMidKeyWhen)))) {
            result[i].Indent--;
        }
        else if (startIndex != 0
            && (input.regexStartsWith(regexBlockEndsKeyWords))) {
            result[i].Indent--;
            return i;
        }
        if (input.regexStartsWith(regexOneLineBlockKeyWords)) {
            continue;
        }
        if (input.regexStartsWith(regexFunctionMultiLineBlockKeyWords)
            || input.regexStartsWith(regexBlockStartsKeywords)) {
            i = beautify3(inputs, result, settings, i + 1, indent + 1);
        }
    }
    i--;
    return i;
}
exports.beautify3 = beautify3;
function ReserveSemicolonInKeywords(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].match(/FUNCTION|PROCEDURE/) != null) {
            arr[i] = arr[i].replace(/;/g, '@@semicolon');
        }
    }
}
function ApplyNoNewLineAfter(arr, noNewLineAfter) {
    if (noNewLineAfter == null) {
        return;
    }
    for (let i = 0; i < arr.length; i++) {
        noNewLineAfter.forEach(n => {
            let regex = new RegExp("(" + n.toUpperCase + ")[ a-z0-9]+[a-z0-9]+");
            if (arr[i].regexIndexOf(regex) >= 0) {
                arr[i] += "@@singleline";
            }
        });
    }
}
exports.ApplyNoNewLineAfter = ApplyNoNewLineAfter;
function RemoveAsserts(arr) {
    let need_semi = false;
    let inAssert = false;
    let n = 0;
    for (let i = 0; i < arr.length; i++) {
        let has_semi = arr[i].indexOf(";") >= 0;
        if (need_semi) {
            arr[i] = '';
        }
        n = arr[i].indexOf("ASSERT ");
        if (n >= 0) {
            inAssert = true;
            arr[i] = '';
        }
        if (!has_semi) {
            if (inAssert) {
                need_semi = true;
            }
        }
        else {
            need_semi = false;
        }
    }
}
exports.RemoveAsserts = RemoveAsserts;
function EscapeQuotes(arr) {
    let quotes = [];
    let quotesIndex = 0;
    for (let i = 0; i < arr.length; i++) {
        let quote = arr[i].match(/"([^"]+)"/g);
        if (quote != null) {
            for (var j = 0; j < quote.length; j++) {
                arr[i] = arr[i].replace(quote[j], ILQuotesPrefix + quotesIndex);
                quotes[quotesIndex++] = quote[j];
            }
        }
    }
    return quotes;
}
function RemoveExtraNewLines(input) {
    input = input.replace(/(?:\r\n|\r|\n)/g, '\r\n');
    input = input.replace(/ \r\n/g, '\r\n');
    input = input.replace(/\r\n\r\n\r\n/g, '\r\n');
    return input;
}
//# sourceMappingURL=VHDLFormatter.js.map