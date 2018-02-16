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
            }
            repeatedCharCount = repeatedCharCount > 8 ? 8 : repeatedCharCount;
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
    if (inputcase == "lowercase") {
        ToLowerCases(keywords);
        ToLowerCases(typenames);
    }
    else if (inputcase == "defaultcase") {
        ToCamelCases(keywords);
        ToCamelCases(typenames);
    }
    if (inputcase != "uppercase") {
        input = ReplaceKeyWords(input, keywords);
        input = ReplaceKeyWords(input, typenames);
    }
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
    input = ReplaceKeyWords(input, KeyWords);
    input = ReplaceKeyWords(input, TypeNames);
    arr = input.split("\r\n");
    ReserveSemicolonInKeywords(arr);
    input = arr.join("\r\n");
    input = input.replace(/(PORT|PROCESS|GENERIC)[\s]*\(/g, '$1 (');
    input = SetNewLinesAfterSymbols(input, settings.NewLineSettings);
    arr = input.split("\r\n");
    let quotes = EscapeQuotes(arr);
    if (settings.RemoveAsserts) {
        RemoveAsserts(arr); //RemoveAsserts must be after EscapeQuotes
    }
    ApplyNoNewLineAfter(arr, settings.NewLineSettings.noNewLineAfter);
    input = arr.join("\r\n");
    //input = beautify2(input, settings);
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
    let secondLineHasParenthese = inputs[startIndex + 1].startsWith("(");
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
    else if (endIndex != startIndex && secondLineHasParenthese) {
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
        result.push(new FormattedLine(inputs[startIndex + 1], indent));
    }
    let blockBodyEndIndex = endIndex;
    let i = beautify3(inputs, result, settings, blockBodyStartIndex + 1, indent + 1, endIndex);
    if (inputs[i].startsWith(")")) {
        result[i].Indent--;
        blockBodyEndIndex--;
    }
    if (settings.SignAlignRegional && !settings.SignAlignAll) {
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
function beautifySemicolonBlock(inputs, result, settings, startIndex, parentEndIndex, indent) {
    let openBracketsCount = 0;
    let closeBracketsCount = 0;
    let endIndex = 0;
    for (let i = startIndex; i < inputs.length; i++) {
        let input = inputs[i];
        let indexOfSemicolon = input.indexOf(";");
        let splitIndex = indexOfSemicolon < 0 ? input.length : indexOfSemicolon + 1;
        let stringBeforeSemicolon = input.substring(0, splitIndex);
        let stringAfterSemicolon = input.substring(splitIndex);
        stringAfterSemicolon = stringAfterSemicolon.replace(/@@comment[0-9]+/, "");
        openBracketsCount += stringBeforeSemicolon.count("(");
        closeBracketsCount += stringBeforeSemicolon.count(")");
        if (indexOfSemicolon < 0) {
            continue;
        }
        if (openBracketsCount == closeBracketsCount) {
            endIndex = i;
            if (stringAfterSemicolon.length > 0 && settings.NewLineSettings.newLineAfter.indexOf(";") >= 0) {
                inputs[i] = stringBeforeSemicolon;
                inputs.splice(i, 0, stringAfterSemicolon);
                parentEndIndex++;
            }
            break;
        }
    }
    result.push(new FormattedLine(inputs[startIndex], indent));
    if (endIndex != startIndex) {
        let i = beautify3(inputs, result, settings, startIndex + 1, indent + 1, endIndex);
    }
    return [endIndex, parentEndIndex];
}
exports.beautifySemicolonBlock = beautifySemicolonBlock;
//cannot format entity_instance.vhd
function beautify3(inputs, result, settings, startIndex, indent, endIndex) {
    let i;
    let regexOneLineBlockKeyWords = new RegExp(/(PROCEDURE|FUNCTION|IMPURE FUNCTION)[^\w](?!.+[^\w]IS([^\w]|$))/); //match PROCEDURE..; but not PROCEDURE .. IS;
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
        "FUNCTION",
        "IMPURE FUNCTION",
        "(.*\\s*PROTECTED)",
        "(COMPONENT(?!.+;))",
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
        let input = inputs[i].trim();
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
        if (input.regexStartsWith(regexBlockStartsKeywords)) {
            i = beautify3(inputs, result, settings, i + 1, indent + 1);
        }
    }
    i--;
    return i;
}
exports.beautify3 = beautify3;
function beautify2(input, settings) {
    let arr = input.split("\r\n");
    let quotes = EscapeQuotes(arr);
    if (settings.RemoveAsserts) {
        RemoveAsserts(arr); //RemoveAsserts must be after EscapeQuotes
    }
    ApplyNoNewLineAfter(arr, settings.NewLineSettings.noNewLineAfter);
    var align = [], align_max = [], align_i1 = 0, align_i = 0;
    var str = "", str1 = "";
    var p = 0;
    var n = 0, j = 0;
    var tab_n = 0, str_len = 0, port_s = "";
    var back_tab = false, forward_tab = false, semi_pos = 0, begin_b = true, port_b = false;
    var before_begin = true;
    var l = arr.length;
    for (i = 0; i < l; i++) {
        if (arr[i].indexOf("BEGIN") >= 0) {
            before_begin = false;
        }
        if (port_s) {
            port_s += arr[i];
            var k_port = port_s.split("(").length;
            if (k_port == port_s.split(")").length) {
                arr[i] = arr[i] + "@@end";
                port_s = "";
                port_b = false;
            }
        }
        if ((!port_b && arr[i].regexIndexOf(/(\s|\(|^)(PORT|GENERIC|PROCESS|PROCEDURE)(\s|\(|$)/) >= 0)
            || (arr[i].regexIndexOf(/:[ ]?=[ ]?\(/) >= 0 && before_begin)) {
            port_b = true;
            port_s = arr[i];
            var k_port = port_s.split("(").length;
            if (k_port == 1) {
                port_b = false;
                port_s = "";
            }
            else if (k_port == port_s.split(")").length) {
                port_s = "";
                port_b = false;
                arr[i] = arr[i] + "@@singleend";
            }
            else {
                arr[i] = arr[i].replace(/(PORT|GENERIC|PROCEDURE)([a-z0-9A-Z_ ]+)\(([a-zA-Z0-9_\(\) ]+)/, '$1$2(\r\n$3');
            }
        }
    }
    input = arr.join("\r\n");
    input = input.replace(/([a-zA-Z0-9\); ])\);(@@comments[0-9]+)?@@end/g, '$1\r\n);$2@@end');
    input = input.replace(/[ ]?([&=:\-<>\+|\*])[ ]?/g, ' $1 ');
    input = input.replace(/[ ]?([,])[ ]?/g, '$1 ');
    input = input.replace(/[ ]?(['"])(THEN)/g, '$1 $2');
    input = input.replace(/[ ]?(\?)?[ ]?(<|:|>|\/)?[ ]+(=)?[ ]?/g, ' $1$2$3 ');
    input = input.replace(/(IF)[ ]?([\(\)])/g, '$1 $2');
    input = input.replace(/([\(\)])[ ]?(THEN)/gi, '$1 $2');
    input = input.replace(/(^|[\(\)])[ ]?(AND|OR|XOR|XNOR)[ ]*([\(])/g, '$1 $2 $3');
    input = input.replace(/ ([\-\*\/=+<>])[ ]*([\-\*\/=+<>]) /g, " $1$2 ");
    input = input.replace(/\r\n[ \t]+--\r\n/g, "\r\n");
    input = input.replace(/[ ]+/g, ' ');
    input = input.replace(/\r\n\r\n\r\n/g, '\r\n');
    input = input.replace(/[\r\n\s]+$/g, '');
    input = input.replace(/[ \t]+\)/g, ')');
    var matches = input.match(/'([a-zA-Z]+)\s/g);
    if (matches != null) {
        for (var k2 = 0; k2 < matches.length; k2++) {
            input = input.replace(matches[k2], matches[k2].toUpperCase());
        }
    }
    input = input.replace(/(MAP)[ \r\n]+\(/g, '$1(');
    //input = input.replace(/(;|THEN)[ ]?(@@comments[0-9]+)([a-zA-Z])/g, '$1 $2\r\n$3');
    input = input.replace(/[\r\n ]+RETURN/g, ' RETURN');
    input = input.replace(/BEGIN[\r\n ]+/g, 'BEGIN\r\n');
    input = input.replace(/ (PORT|GENERIC) /g, '\r\n$1 ');
    if (settings.CheckAlias) {
        var alias = [], subarr = [], o = 0, p = 0, p2 = 0, l2 = 0, i2 = 0;
        arr = input.split("ARCHITECTURE ");
        l = arr.length;
        for (i = 0; i < l; i++) {
            subarr = arr[i].split("ALIAS ");
            l2 = subarr.length;
            if (l2 > 1) {
                o = 0;
                for (i2 = 1; i2 < l2; i2++) {
                    o = subarr[i2].indexOf(";", n);
                    str = subarr[i2].substring(0, o);
                    alias[p2++] = str.split(" IS ");
                }
                i2--;
                var str2 = subarr[i2].substr(o);
                for (p = 0; p < p2; p++) {
                    var reg = new RegExp(alias[p][1], 'gi');
                    str2 = str2.replace(reg, alias[p][0]);
                }
                subarr[i2] = subarr[i2].substring(0, o) + str2;
            }
            arr[i] = subarr.join("ALIAS ");
        }
        input = arr.join("ARCHITECTURE ");
    }
    arr = input.split("\r\n");
    l = arr.length;
    var signAlignPos = "";
    var if_b = 0, white_space = "", case_b = false, case_n = 0, procfun_b = false, semi_b = false, set_false = false, entity_b = false, then_b = false, conditional_b = false, generic_map_b = false, architecture_begin_b = false, process_begin_b = false, case_indent = [0, 0, 0, 0, 0, 0, 0];
    var align_groups = [], align_groups_max = [], lastAlignedSign = "", current_align_group = 0, aligned_group_starts = 0;
    var indent_start = [];
    for (i = 0; i < l; i++) {
        str = arr[i];
        str_len = str.length;
        if (str.replace(/[ \-\t]*/, "").length > 0) {
            var first_word = str.split(/[^\w]/)[0];
            var indent_start_last = indent_start.length == 0 ? 0 : indent_start[indent_start.length - 1];
            if (then_b) {
                arr[i] = " " + arr[i];
                if (str.indexOf(" THEN") >= 0) {
                    then_b = false;
                    back_tab = true;
                }
            }
            arr[i] = white_space + arr[i];
            if (first_word == "ELSIF") {
                tab_n = indent_start_last - 1;
                indent_start.pop();
                back_tab = true;
            }
            else if (str.indexOf("END CASE") == 0) {
                indent_start.pop();
                case_n--;
                tab_n = indent_start[indent_start.length - 1];
            }
            else if (first_word == "END") {
                tab_n = indent_start_last - 1;
                indent_start.pop();
                if (str.indexOf("END IF") == 0) {
                    if_b--;
                }
                if (i == l - 1) {
                    tab_n = 1;
                }
            }
            else if (first_word == "ELSE" && if_b) {
                tab_n = indent_start_last - 1;
                indent_start.pop();
                back_tab = true;
            }
            else if (case_n) {
                if (first_word == "WHEN") {
                    tab_n = case_indent[case_n - 1];
                    //back_tab = true;
                }
            }
            else if (first_word == "BEGIN") {
                if (begin_b) {
                    if (architecture_begin_b) {
                        tab_n = indent_start_last - 1;
                        architecture_begin_b = false;
                    }
                    else if (process_begin_b) {
                        tab_n = indent_start_last - 1;
                        process_begin_b = false;
                    }
                    else {
                        tab_n = indent_start_last;
                        indent_start.push(tab_n + 1);
                    }
                    //indent_start.pop();
                    back_tab = true;
                    begin_b = false;
                    if (procfun_b) {
                        tab_n++;
                        indent_start.push(tab_n);
                        begin_b = true;
                    }
                }
                else {
                    back_tab = true;
                }
            }
            else if (first_word == "PROCESS") {
                begin_b = true;
            }
            else if (str.indexOf(": PROCESS") >= 0) {
                back_tab = true;
                begin_b = true;
                process_begin_b = true;
            }
            else if (str.indexOf(": ENTITY") >= 0) {
                back_tab = true;
                entity_b = true;
            }
            else if (str.indexOf("PROCEDURE ") >= 0) {
                back_tab = true;
                begin_b = true;
            }
            if (port_b && str.indexOf("@@") < 0) {
                if (i + 1 <= arr.length - 1 && arr[i + 1].indexOf("@@") < 0) {
                    if (signAlignPos == ":") {
                        if (str.indexOf(';') < 0) {
                            arr[i] += arr[i + 1];
                            arr[i + 1] = '@@removeline';
                        }
                    }
                    else if (signAlignPos == "=>") {
                        if (str.indexOf(',') < 0) {
                            arr[i] += arr[i + 1];
                            arr[i + 1] = '@@removeline';
                        }
                    }
                }
            }
            if (str.indexOf("PORT MAP") >= 0) {
                back_tab = true;
                port_b = true;
                if (str.indexOf(");") < 0) {
                    align_i1 = align_i;
                    var t = str.indexOf("=>");
                    if (t >= 0) {
                        signAlignPos = "=>";
                    }
                    else {
                        if (i + 1 < arr.length) {
                            t = arr[i + 1].indexOf("=>");
                            if (t >= 0) {
                                signAlignPos = "=>";
                            }
                        }
                    }
                }
                else {
                    signAlignPos = "";
                }
            }
            else if (str.indexOf("GENERIC MAP") >= 0) {
                tab_n++;
                indent_start.push(tab_n);
                generic_map_b = true;
                if (!begin_b) {
                    back_tab = false;
                }
            }
            else if (str.indexOf("PORT (") >= 0 && begin_b) {
                back_tab = true;
                port_b = true;
                t = str.indexOf(":");
                if (str.indexOf(");") < 0) {
                    align_i1 = align_i;
                    if (t >= 0) {
                        signAlignPos = ":";
                    }
                    else {
                        t = arr[i + 1].indexOf(":");
                        if (t >= 0) {
                            signAlignPos = ":";
                        }
                    }
                }
                else {
                    signAlignPos = "";
                }
            }
            if (set_false) {
                procfun_b = false;
                set_false = false;
            }
            if (str.indexOf("(") >= 0) {
                if (str.indexOf("PROCEDURE") >= 0 || str.indexOf("FUNCTION") >= 0) {
                    procfun_b = true;
                    back_tab = true;
                }
                if ((str.indexOf("GENERIC") >= 0 || str.indexOf(":= (") >= 0 || str.regexIndexOf(/PROCEDURE[a-zA-Z0-9_ ]+\(/) >= 0) && begin_b) {
                    port_b = true;
                    back_tab = true;
                }
            }
            else if (first_word == "FUNCTION") {
                back_tab = true;
                begin_b = true;
            }
            if (str.indexOf("@@singleend") >= 0) {
                back_tab = false;
                port_b = false;
                if (!begin_b) {
                    forward_tab = true;
                }
            }
            else if (str.indexOf("@@end") >= 0 && port_b) {
                port_b = false;
                indent_start.pop();
                tab_n = indent_start[indent_start.length - 1];
                if (entity_b) {
                    forward_tab = true;
                }
                if (generic_map_b) {
                    forward_tab = true;
                    generic_map_b = false;
                }
            }
            if (settings.SignAlignAll) {
                var alignedSigns = [":", "<=", "=>"];
                for (var currentSign = 0; currentSign < alignedSigns.length; currentSign++) {
                    if (str.indexOf(alignedSigns[currentSign]) > 0) {
                        var char_before_sign = str.split(alignedSigns[currentSign])[0];
                        var char_before_sign_length = char_before_sign.length;
                        align_groups.push(char_before_sign_length);
                        align_groups_max.push(char_before_sign_length);
                        if (alignedSigns[currentSign] == lastAlignedSign) {
                            if (align_groups_max[current_align_group - 1] < char_before_sign_length) {
                                for (var k3 = aligned_group_starts; k3 <= current_align_group; k3++) {
                                    align_groups_max[k3] = char_before_sign_length;
                                }
                            }
                            else {
                                align_groups_max[current_align_group] = align_groups_max[current_align_group - 1];
                            }
                        }
                        else {
                            aligned_group_starts = current_align_group;
                        }
                        arr[i] = char_before_sign + "@@alignall" + (current_align_group++) + str.substring(char_before_sign.length, arr[i].length);
                        lastAlignedSign = alignedSigns[currentSign];
                        break;
                    }
                }
                if (currentSign == alignedSigns.length) {
                    lastAlignedSign = "";
                }
            }
            else if (settings.SignAlignRegional) {
                if (port_b && signAlignPos != "") {
                    if (str.indexOf(signAlignPos) >= 0) {
                        var a1 = arr[i].split(signAlignPos);
                        var l1 = a1[0].length;
                        if (align_i >= 0 && align_i > align_i1) {
                            align_max[align_i] = align_max[align_i - 1];
                        }
                        else {
                            align_max[align_i] = l1;
                        }
                        if (align_i > align_i1 && align_max[align_i] < l1) {
                            for (var k3 = align_i1; k3 <= align_i; k3++) {
                                align_max[k3] = l1;
                            }
                        }
                        align[align_i] = l1;
                        arr[i] = a1[0] + "@@align" + (align_i++) + signAlignPos + arr[i].substring(l1 + signAlignPos.length, arr[i].length);
                    }
                }
            }
            tab_n = tab_n < 1 ? 1 : tab_n;
            if (str_len) {
                if (isTesting) {
                    console.log(tab_n, arr[i], indent_start);
                }
                arr[i] = (Array(tab_n).join(settings.Indentation)) + arr[i]; //indent
                if (settings.NewLineSettings.newLineAfter.indexOf("port")) {
                    if (str.indexOf('@@singleend') < 0) {
                        arr[i] = arr[i].replace(/(PORT)([ \r\n\w]*)\(/, "$1$2\r\n" + (Array(tab_n).join(settings.Indentation)) + "(");
                    }
                }
                if (settings.NewLineSettings.newLineAfter.indexOf("generic")) {
                    if (str.indexOf('@@singleend') < 0) {
                        arr[i] = arr[i].replace(/(GENERIC)([ \r\n\w]*)\(/, "$1$2\r\n" + (Array(tab_n).join(settings.Indentation)) + "(");
                    }
                }
            }
            if (back_tab) {
                tab_n++;
                indent_start.push(tab_n);
                back_tab = false;
            }
            if (forward_tab) {
                tab_n = indent_start_last;
                indent_start.pop();
                forward_tab = false;
            }
            if (conditional_b && str.indexOf(";") >= 0) {
                conditional_b = false;
                white_space = "";
            }
            else if (str.indexOf(";") >= 0 && semi_b) {
                semi_b = false;
                tab_n = indent_start_last;
                indent_start.pop();
            }
            else if (!semi_b && str.indexOf(";") < 0 && !port_b) {
                if (!conditional_b) {
                    if (str.indexOf("WHEN") > 3 && str.indexOf("<=") > 1) {
                        conditional_b = true;
                        white_space = (Array(str.indexOf("= ") + 3).join(" "));
                    }
                    else if (first_word == "WHEN" && i + 1 < arr.length && arr[i + 1].indexOf("WHEN") < 0) {
                        tab_n = indent_start_last + 1;
                    }
                    else if (str.indexOf("=>") < 0 && ((str.indexOf(ILQuotesPrefix) >= 0 && str.indexOf("= " + ILQuotesPrefix) < 0 && str.indexOf("IF") < 0) || (str.indexOf("<=") > 0 && str.indexOf("IF") < 0 && str.indexOf("THEN") < 0))) {
                        tab_n++;
                        indent_start.push(tab_n);
                        semi_b = true;
                    }
                }
            }
            if (first_word == "ENTITY") {
                tab_n++;
                indent_start.push(tab_n);
            }
            else if (",RECORD,PACKAGE,FOR,COMPONENT,CONFIGURATION,".indexOf("," + first_word + ",") >= 0) {
                tab_n++;
                indent_start.push(tab_n);
            }
            else if (str.indexOf(": FOR ") >= 0) {
                tab_n++;
                indent_start.push(tab_n);
            }
            else if (first_word == "CASE" || str.indexOf(": CASE") >= 0) {
                tab_n++;
                indent_start.push(tab_n);
                case_indent[case_n] = tab_n;
                case_n++;
            }
            else if (first_word == "ARCHITECTURE") {
                tab_n++;
                indent_start.push(tab_n);
                begin_b = true;
                architecture_begin_b = true;
            }
            else if (first_word == "IF") {
                if_b++;
                tab_n++;
                indent_start.push(tab_n);
                if (str.indexOf(" THEN") < 0) {
                    then_b = true;
                    tab_n = indent_start_last;
                    //indent_start.pop();
                }
            }
            if (procfun_b) {
                if (str.regexIndexOf(/(\))|(RETURN [A-Za-z0-9 ]+)[\r\n ]+IS/) >= 0) {
                    tab_n = indent_start_last;
                    indent_start.pop();
                    set_false = true;
                }
            }
        }
    }
    input = arr.join("\r\n");
    input = input.replace(/[\t]*@@removeline\r\n/g, '');
    p = input.indexOf('PROCESS');
    while (p >= 0) {
        let nextBracket = input.indexOf('(', p);
        let nextNewLine = input.indexOf('\r\n', p);
        let nextCloseBracket = input.indexOf(')', nextBracket);
        if (nextBracket < nextNewLine && nextCloseBracket > nextNewLine) {
            let processArray = input.substring(p, nextCloseBracket).split('\r\n');
            if (settings.Indentation.replace(/[ ]+/g, '').length == 0) {
                for (var i = 1; i < processArray.length; i++) {
                    processArray[i] = (Array(nextBracket - p + 2).join(' ')) + processArray[i];
                }
            }
            else {
                for (var i = 1; i < processArray.length; i++) {
                    processArray[i] = settings.Indentation + processArray[i];
                }
            }
            input = input.substring(0, p) + processArray.join('\r\n') + input.substring(nextCloseBracket, input.length);
            p = input.regexIndexOf('PROCESS[ ]+\\(', nextCloseBracket);
        }
        else {
            p = input.indexOf('PROCESS[ ]+\\(', p + 7);
        }
    }
    input = SetKeywordCase(input, settings.KeywordCase, KeyWords, TypeNames);
    if (settings.SignAlignAll) {
        for (var k = 0; k < current_align_group; k++) {
            input = input.replace("@@alignall" + k, Array((align_groups_max[k] - align_groups[k] + 1)).join(" "));
        }
    }
    if (settings.SignAlignRegional) {
        for (var k = 0; k < align_i; k++) {
            input = input.replace("@@align" + k, Array((align_max[k] - align[k] + 2)).join(" "));
        }
    }
    for (var k = 0; k < quotes.length; k++) {
        input = input.replace(ILQuotesPrefix + k, quotes[k]);
    }
    input = input.replace(/@@singleline[ \r\n]*/, " ");
    return input;
}
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