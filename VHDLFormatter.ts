let isTesting = false;
const ILEscape = "@__@";
const ILCommentPrefix = ILEscape + "comments";
const ILIndentedReturnPrefix = ILEscape;
const ILQuote = "⨵";
const ILSingleQuote = "⦼";
const ILBackslash = "⨸";
const ILSemicolon = "⨴";

enum FormatMode {
    Default,
    EndsWithSemicolon,
    CaseWhen,
    IfElse,
    PortGeneric,
}

let Mode: FormatMode = FormatMode.Default;

export class NewLineSettings {
    newLineAfter: Array<string>;
    noNewLineAfter: Array<string>;
    constructor() {
        this.newLineAfter = [];
        this.noNewLineAfter = [];
    }

    newLineAfterPush(keyword: string) {
        this.newLineAfter.push(keyword);
    }

    noNewLineAfterPush(keyword: string) {
        this.noNewLineAfter.push(keyword);
    }

    push(keyword: string, addNewLine: string) {
        let str = addNewLine.toLowerCase();
        if (str == "none") {
            return;
        }
        else if (!str.startsWith("no")) {
            this.newLineAfterPush(keyword);
        }
        else {
            this.noNewLineAfterPush(keyword);
        }
    }
}

function ConstructNewLineSettings(dict): NewLineSettings {
    let settings: NewLineSettings = new NewLineSettings();
    for (let key in dict) {
        settings.push(key, dict[key]);
    }
    return settings;
}

declare global {
    interface String {
        regexIndexOf: (pattern: RegExp, startIndex?: number) => number;
        regexLastIndexOf: (pattern: RegExp, startIndex: number) => number;
        reverse: () => string;
        regexStartsWith: (pattern: RegExp) => boolean;
        count: (text: string) => number;
        regexCount: (pattern: RegExp) => number;
        convertToRegexBlockWords: () => RegExp;
    }
    interface Array<T> {
        convertToRegexBlockWords: () => RegExp;
    }
}

String.prototype.regexCount = function (pattern): number {
    if (pattern.flags.indexOf("g") < 0) {
        pattern = new RegExp(pattern.source, pattern.flags + "g");
    }
    return (this.match(pattern) || []).length;
}

String.prototype.count = function (text): number {
    return this.split(text).length - 1;
}

String.prototype.regexStartsWith = function (pattern): boolean {
    var searchResult = this.search(pattern);
    return searchResult == 0;
}

String.prototype.regexIndexOf = function (pattern, startIndex) {
    startIndex = startIndex || 0;
    var searchResult = this.substr(startIndex).search(pattern);
    return (-1 === searchResult) ? -1 : searchResult + startIndex;
}

String.prototype.regexLastIndexOf = function (pattern, startIndex) {
    pattern = (pattern.global) ? pattern :
        new RegExp(pattern.source, 'g' + (pattern.ignoreCase ? 'i' : '') + (pattern.multiline ? 'm' : ''));
    if (typeof (startIndex) === 'undefined') {
        startIndex = this.length;
    } else if (startIndex < 0) {
        startIndex = 0;
    }
    const stringToWorkWith = this.substring(0, startIndex + 1);
    let lastIndexOf = -1;
    let nextStop = 0;
    let result: RegExpExecArray;
    while ((result = pattern.exec(stringToWorkWith)) != null) {
        lastIndexOf = result.index;
        pattern.lastIndex = ++nextStop;
    }
    return lastIndexOf;
}

String.prototype.reverse = function () {
    return this.split('').reverse().join('');
}

String.prototype.convertToRegexBlockWords = function (): RegExp {
    let result: RegExp = new RegExp("(" + this + ")([^\\w]|$)");
    return result;
}

Array.prototype.convertToRegexBlockWords = function (): RegExp {
    let wordsStr: string = this.join("|");
    let result: RegExp = new RegExp("(" + wordsStr + ")([^\\w]|$)");
    return result;
}

function EscapeComments(arr: Array<string>): Array<string> {
    var comments = [];
    var count = 0;
    for (var i = 0; i < arr.length; i++) {
        var line = arr[i];
        var commentStartIndex = line.indexOf("--");
        if (commentStartIndex >= 0) {
            comments.push(line.substr(commentStartIndex));
            arr[i] = line.substr(0, commentStartIndex) + ILCommentPrefix + count;
            count++;
        }
    }
    var isInComment = false;
    var commentRegex = new RegExp("(?<=" + ILCommentPrefix + "[\\d]+).");
    for (var i = 0; i < arr.length; i++) {
        var commentStartIndex = 0;
        var hasComment = true;
        var commentEndInlineIndex = 0;
        while (hasComment) {
            var line = arr[i];
            if (!isInComment) {
                commentStartIndex = line.indexOf("/*");
                var commentEndIndex = line.indexOf("*/", commentStartIndex);
                if (commentStartIndex >= 0) {
                    if (commentEndIndex >= 0) {
                        commentEndInlineIndex = commentEndIndex + 2;
                        isInComment = false;
                        comments.push(line.substring(commentStartIndex, commentEndInlineIndex));
                        arr[i] = line.substr(0, commentStartIndex) + ILCommentPrefix + count + line.substr(commentEndInlineIndex);
                        count++;
                        hasComment = true;
                        if (commentStartIndex + 2 == line.length) {
                            hasComment = false;
                        }
                    }
                    else {
                        isInComment = true;
                        comments.push(line.substr(commentStartIndex));
                        arr[i] = line.substr(0, commentStartIndex) + ILCommentPrefix + count;
                        count++;
                        hasComment = false;
                    }
                }
                else {
                    hasComment = false;
                }
                continue;
            }
            if (isInComment) {
                var lastCommentEndIndex = line.regexLastIndexOf(commentRegex, line.length);
                if (commentStartIndex == 0) {
                    var commentEndIndex = line.indexOf("*/", lastCommentEndIndex);
                }
                else {
                    var commentEndIndex = line.indexOf("*/", commentStartIndex);
                }
                if (commentEndIndex >= 0) {
                    isInComment = false;
                    comments.push(line.substr(0, commentEndIndex + 2));
                    arr[i] = ILCommentPrefix + count + line.substr(commentEndIndex + 2);
                    count++;
                    hasComment = true;
                } else {
                    comments.push(line);
                    arr[i] = ILCommentPrefix + count;
                    count++;
                    hasComment = false;
                }
            }
        }
    }
    return comments
}

function ToLowerCases(arr: Array<string>) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].toLowerCase();
    }
}

function ToUpperCases(arr: Array<string>) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].toUpperCase();
    }
}

function ToCamelCases(arr: Array<string>) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0) + arr[i].slice(1).toLowerCase();
    }
}

function ReplaceKeyWords(text: string, keywords: Array<string>): string {
    for (var k = 0; k < keywords.length; k++) {
        text = text.replace(new RegExp("([^a-zA-Z0-9_@]|^)" + keywords[k] + "([^a-zA-Z0-9_]|$)", 'gi'), "$1" + keywords[k] + "$2");
    }
    return text;
}

function SetKeywordCase(input: string, keywordcase: string, keywords: string[]): string {
    let inputcase: string = keywordcase.toLowerCase();
    switch (inputcase) {
        case "lowercase":
            ToLowerCases(keywords);
            break;
        case "defaultcase":
            ToCamelCases(keywords);
            break;
        case "uppercase":
            ToUpperCases(keywords);
    }

    input = ReplaceKeyWords(input, keywords);
    return input;
}

export function SetNewLinesAfterSymbols(text: string, newLineSettings: NewLineSettings): string {
    if (newLineSettings == null) {
        return text;
    }
    if (newLineSettings.newLineAfter != null) {
        newLineSettings.newLineAfter.forEach(symbol => {
            let upper = symbol.toUpperCase();
            var rexString = "(" + upper + ")[ ]?([^ \r\n@])";
            let regex: RegExp = null;
            if (upper.regexStartsWith(/\w/)) {
                regex = new RegExp("\\b" + rexString, "g");
            }
            else {
                regex = new RegExp(rexString, "g");
            }
            text = text.replace(regex, '$1\r\n$2');
            if (upper == "PORT") {
                text = text.replace(/\bPORT\b\s+MAP/, "PORT MAP");
            }
        });
    }
    if (newLineSettings.noNewLineAfter != null) {
        newLineSettings.noNewLineAfter.forEach(symbol => {
            let rexString = "(" + symbol.toUpperCase() + ")[ \r\n]+([^@])";
            let regex: RegExp = null;
            if (symbol.regexStartsWith(/\w/)) {
                regex = new RegExp("\\b" + rexString, "g");
                text = text.replace(regex, '$1 $2');
            }
            else {
                regex = new RegExp(rexString, "g");
            }
            text = text.replace(regex, '$1 $2');
        });
    }
    return text;
}

export class signAlignSettings {
    isRegional: boolean;
    isAll: boolean;
    mode: string;
    keyWords: Array<string>;
    alignComments: boolean;
    constructor(isRegional: boolean, isAll: boolean, mode: string, keyWords: Array<string>, alignComments: boolean = false) {
        this.isRegional = isRegional;
        this.isAll = isAll;
        this.mode = mode;
        this.keyWords = keyWords;
        this.alignComments = alignComments;
    }
}

export class BeautifierSettings {
    RemoveComments: boolean;
    RemoveAsserts: boolean;
    CheckAlias: boolean;
    SignAlignSettings: signAlignSettings;
    KeywordCase: string;
    TypeNameCase: string;
    Indentation: string;
    NewLineSettings: NewLineSettings;
    EndOfLine: string;
    AddNewLine: boolean;
    MoveLeadingCommasToPrevLine: boolean;
    constructor(removeComments: boolean, removeReport: boolean, checkAlias: boolean,
        signAlignSettings: signAlignSettings, keywordCase: string, typeNameCase: string, indentation: string,
        newLineSettings: NewLineSettings, endOfLine: string, addNewLine: boolean, MoveLeadingCommasToPrevLine = false) {
        this.RemoveComments = removeComments;
        this.RemoveAsserts = removeReport;
        this.CheckAlias = checkAlias;
        this.SignAlignSettings = signAlignSettings;
        this.KeywordCase = keywordCase;
        this.TypeNameCase = typeNameCase;
        this.Indentation = indentation;
        this.NewLineSettings = newLineSettings;
        this.EndOfLine = endOfLine;
        this.AddNewLine = addNewLine;
        this.MoveLeadingCommasToPrevLine = MoveLeadingCommasToPrevLine;
    }
}

let KeyWords: Array<string> = ["ABS", "ACCESS", "AFTER", "ALIAS", "ALL", "AND", "ARCHITECTURE", "ARRAY", "ASSERT", "ATTRIBUTE", "BEGIN", "BLOCK", "BODY", "BUFFER", "BUS", "CASE", "COMPONENT", "CONFIGURATION", "CONSTANT", "CONTEXT", "COVER", "DISCONNECT", "DOWNTO", "DEFAULT", "ELSE", "ELSIF", "END", "ENTITY", "EXIT", "FAIRNESS", "FILE", "FOR", "FORCE", "FUNCTION", "GENERATE", "GENERIC", "GROUP", "GUARDED", "IF", "IMPURE", "IN", "INERTIAL", "INOUT", "IS", "LABEL", "LIBRARY", "LINKAGE", "LITERAL", "LOOP", "MAP", "MOD", "NAND", "NEW", "NEXT", "NOR", "NOT", "NULL", "OF", "ON", "OPEN", "OR", "OTHERS", "OUT", "PACKAGE", "PORT", "POSTPONED", "PROCEDURE", "PROCESS", "PROPERTY", "PROTECTED", "PURE", "RANGE", "RECORD", "REGISTER", "REJECT", "RELEASE", "REM", "REPORT", "RESTRICT", "RESTRICT_GUARANTEE", "RETURN", "ROL", "ROR", "SELECT", "SEQUENCE", "SEVERITY", "SHARED", "SIGNAL", "SLA", "SLL", "SRA", "SRL", "STRONG", "SUBTYPE", "THEN", "TO", "TRANSPORT", "TYPE", "UNAFFECTED", "UNITS", "UNTIL", "USE", "VARIABLE", "VMODE", "VPROP", "VUNIT", "WAIT", "WHEN", "WHILE", "WITH", "XNOR", "XOR"];
let TypeNames: Array<string> = ["BOOLEAN", "BIT", "CHARACTER", "INTEGER", "TIME", "NATURAL", "POSITIVE", "STD_LOGIC", "STD_LOGIC_VECTOR", "STD_ULOGIC", "STD_ULOGIC_VECTOR", "STRING"];

export function beautify(input: string, settings: BeautifierSettings) {
    input = input.replace(/\r\n/g, "\n");
    input = input.replace(/\n/g, "\r\n");
    var arr = input.split("\r\n");
    var comments = EscapeComments(arr);
    var backslashes = escapeText(arr, "\\\\[^\\\\]+\\\\", ILBackslash);
    let quotes = escapeText(arr, '"([^"]+)"', ILQuote);
    let singleQuotes = escapeText(arr, "'[^']'", ILSingleQuote);
    RemoveLeadingWhitespaces(arr);

    input = arr.join("\r\n");
    if (settings.RemoveComments) {
        input = input.replace(/\r\n[ \t]*@__@comments[0-9]+[ \t]*\r\n/g, '\r\n');
        input = input.replace(/@__@comments[0-9]+/g, '');
        comments = [];
    }

    input = SetKeywordCase(input, "uppercase", KeyWords);
    input = SetKeywordCase(input, "uppercase", TypeNames);
    input = RemoveExtraNewLines(input);
    input = input.replace(/[\t ]+/g, ' ');
    input = input.replace(/\([\t ]+/g, '\(');
    input = input.replace(/[ ]+;/g, ';');
    input = input.replace(/:[ ]*(PROCESS|ENTITY)/gi, ':$1');

    if (settings.MoveLeadingCommasToPrevLine) {
        input = input.replace(/(\s*(@__@comments[0-9]+)?)\r\n(\s*),/g, ',$1\r\n$3');
    }

    arr = input.split("\r\n");
    if (settings.RemoveAsserts) {
        RemoveAsserts(arr);//RemoveAsserts must be after EscapeQuotes
    }
    ReserveSemicolonInKeywords(arr);
    input = arr.join("\r\n");
    input = input.replace(/\b(PORT|GENERIC)\b\s+MAP/g, '$1 MAP');
    input = input.replace(/\b(PORT|PROCESS|GENERIC)\b[\s]*\(/g, '$1 (');
    let newLineSettings = settings.NewLineSettings;
    if (newLineSettings != null) {
        input = SetNewLinesAfterSymbols(input, newLineSettings);
        arr = input.split("\r\n");
        ApplyNoNewLineAfter(arr, newLineSettings.noNewLineAfter);
        input = arr.join("\r\n");
    }

    input = input.replace(/([a-zA-Z0-9\); ])\);(@__@comments[0-9]+)?@__@end/g, '$1\r\n);$2@__@end');
    input = input.replace(/[ ]?([&=:\-\+|\*]|[<>]+)[ ]?/g, ' $1 ');
    input = input.replace(/(\d+e) +([+\-]) +(\d+)/g, '$1$2$3');// fix exponential notation format broken by previous step
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
    input = input.replace(/\s*\)\s+RETURN\s+([\w]+;)/g, '\r\n) RETURN $1');//function(..)\r\nreturn type; -> function(..\r\n)return type;
    input = input.replace(/\)\s*(@__@\w+)\r\n\s*RETURN\s+([\w]+;)/g, ') $1\r\n' + ILIndentedReturnPrefix + 'RETURN $2');//function(..)\r\nreturn type; -> function(..\r\n)return type;
    let keywordAndSignRegex = new RegExp("(\\b" + KeyWords.join("\\b|\\b") + "\\b) +([\\-+]) +(\\w)", "g");
    input = input.replace(keywordAndSignRegex, "$1 $2$3");// `WHEN - 2` -> `WHEN -2`
    input = input.replace(/([,|]) +([+\-]) +(\w)/g, '$1 $2$3');// `1, - 2)` -> `1, -2)`
    input = input.replace(/(\() +([+\-]) +(\w)/g, '$1$2$3');// `( - 2)` -> `(-2)`
    arr = input.split("\r\n");
    let result: (FormattedLine | FormattedLine[])[] = [];
    let block = new CodeBlock(arr);
    beautify3(block, result, settings, 0);
    var alignSettings = settings.SignAlignSettings;
    if (alignSettings != null && alignSettings.isAll) {
        AlignSigns(result, 0, result.length - 1, alignSettings.mode, alignSettings.alignComments);
    }

    arr = FormattedLineToString(result, settings.Indentation);
    input = arr.join("\r\n");
    input = input.replace(/@__@RETURN/g, "RETURN");
    input = SetKeywordCase(input, settings.KeywordCase, KeyWords);
    input = SetKeywordCase(input, settings.TypeNameCase, TypeNames);

    input = replaceEscapedWords(input, quotes, ILQuote);
    input = replaceEscapedWords(input, singleQuotes, ILSingleQuote);
    input = replaceEscapedComments(input, comments, ILCommentPrefix);
    input = replaceEscapedWords(input, backslashes, ILBackslash);
    input = input.replace(new RegExp(ILSemicolon, "g"), ";");
    input = input.replace(/@__@[a-z]+/g, "");
    var escapedTexts = new RegExp("[" + ILBackslash + ILQuote + ILSingleQuote + "]", "g");
    input = input.replace(escapedTexts, "");
    input = input.replace(/\r\n/g, settings.EndOfLine);
    if (settings.AddNewLine && !input.endsWith(settings.EndOfLine)) {
        input += settings.EndOfLine;
    }
    return input;
}

function replaceEscapedWords(input: string, arr: Array<string>, prefix: string): string {
    for (var i = 0; i < arr.length; i++) {
        var text = arr[i];
        var regex = new RegExp("(" + prefix + "){" + text.length + "}");
        input = input.replace(regex, text);
    }
    return input;
}

function replaceEscapedComments(input: string, arr: Array<string>, prefix: string): string {
    for (var i = 0; i < arr.length; i++) {
        input = input.replace(prefix + i, arr[i]);
    }
    return input;
}

function RemoveLeadingWhitespaces(arr: Array<string>) {
    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].replace(/^\s+/, "");
    }
}

export class FormattedLine {
    Line: string;
    Indent: number;
    constructor(line: string, indent: number) {
        this.Line = line;
        this.Indent = indent;
    }
}

export class CodeBlock {
    lines: Array<string>;
    start: number;        // index of first line of range
    end: number;          // index of last line of range
    cursor: number;       // line currently being processed
    parent: CodeBlock;

    constructor(lines: Array<string>, start = 0, end = lines.length - 1) {
        this.lines = lines;
        this.start = start;
        this.end = end;
        this.parent = null;
        this.cursor = start;
    }

    _notifySplit(atLine: number) {
        if (this.start > atLine)
            this.start++;
        if (this.end >= atLine)
            this.end++;
        if (this.cursor >= atLine)
            this.cursor++;
        if (this.parent)
            this.parent._notifySplit(atLine);
    }

    splitLine(atLine: number, firstText: string, secondText: string) {
        this.lines[atLine] = firstText;
        this.lines.splice(atLine + 1, 0, secondText);
        this._notifySplit(atLine);
    }

    subBlock(start: number, end: number): CodeBlock {
        let newBlock = new CodeBlock(this.lines, start, end);
        newBlock.parent = this;
        return newBlock;
    }
}

export function FormattedLineToString(arr: (FormattedLine | FormattedLine[])[], indentation: string): Array<string> {
    let result: Array<string> = [];
    if (arr == null) {
        return result;
    }
    if (indentation == null) {
        indentation = "";
    }
    arr.forEach(i => {
        if (i instanceof FormattedLine) {
            if (i.Line.length > 0) {
                result.push(indentation.repeat(i.Indent) + i.Line);
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

function GetCloseparentheseEndIndex(block: CodeBlock) {
    let openParentheseCount: number = 0;
    let closeParentheseCount: number = 0;
    let startIndex = block.cursor;
    for (; block.cursor <= block.end; block.cursor++) {
        let input = block.lines[block.cursor];
        openParentheseCount += input.count("(");
        closeParentheseCount += input.count(")");
        if (openParentheseCount > 0
            && openParentheseCount <= closeParentheseCount) {
            return;
        }
    }
    block.cursor = startIndex;
}

export function beautifyPortGenericBlock(block: CodeBlock, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, indent: number, mode: string) {
    let startIndex = block.cursor;
    let firstLine: string = block.lines[startIndex];
    let regex: RegExp = new RegExp("[\\w\\s:]*(" + mode + ")([\\s]|$)");
    if (!firstLine.regexStartsWith(regex)) {
        return;
    }

    let firstLineHasParenthese: boolean = firstLine.indexOf("(") >= 0;
    let secondLineHasParenthese: boolean = startIndex + 1 <= block.end && block.lines[startIndex + 1].startsWith("(");
    let hasParenthese: boolean = firstLineHasParenthese || secondLineHasParenthese;
    let blockBodyStartIndex = startIndex + (secondLineHasParenthese ? 1 : 0);
    if (hasParenthese) {
        GetCloseparentheseEndIndex(block);
    }
    let endIndex: number = block.cursor;
    let bodyBlock = block.subBlock(blockBodyStartIndex, endIndex);

    if (endIndex != startIndex && firstLineHasParenthese) {
        block.lines[startIndex] = block.lines[startIndex].replace(/\b(PORT|GENERIC|PROCEDURE)\b([\w ]+)\(([\w\(\) ]+)/, '$1$2(\r\n$3');
        let newInputs = block.lines[startIndex].split("\r\n");
        if (newInputs.length == 2) {
            bodyBlock.splitLine(startIndex, newInputs[0], newInputs[1]);
        }
    }
    else if (endIndex > startIndex + 1 && secondLineHasParenthese) {
        block.lines[startIndex + 1] = block.lines[startIndex + 1].replace(/\(([\w\(\) ]+)/, '(\r\n$1');
        let newInputs = block.lines[startIndex + 1].split("\r\n");
        if (newInputs.length == 2) {
            bodyBlock.splitLine(startIndex + 1, newInputs[0], newInputs[1]);
        }
    }

    if (firstLineHasParenthese && block.lines[startIndex].indexOf("MAP") > 0) {
        block.lines[startIndex] = block.lines[startIndex].replace(/([^\w])(MAP)\s+\(/g, '$1$2(');
    }

    result.push(new FormattedLine(block.lines[startIndex], indent));
    if (secondLineHasParenthese) {
        let secondLineIndent = indent;
        if (endIndex == startIndex + 1) {
            secondLineIndent++;
        }
        result.push(new FormattedLine(block.lines[startIndex + 1], secondLineIndent));
    }

    beautify3(bodyBlock.subBlock(bodyBlock.start + 1, bodyBlock.end), result, settings, indent + 1);
    if (block.lines[block.cursor].startsWith(")")) {
        (<FormattedLine>result[block.cursor]).Indent--;
        bodyBlock.end--;
    }
    var alignSettings = settings.SignAlignSettings;
    if (alignSettings != null) {
        if (alignSettings.isRegional && !alignSettings.isAll
            && alignSettings.keyWords != null
            && alignSettings.keyWords.indexOf(mode) >= 0) {
            AlignSigns(result, bodyBlock.start + 1, bodyBlock.end, alignSettings.mode, alignSettings.alignComments);
        }
    }
}

export function AlignSigns(result: (FormattedLine | FormattedLine[])[], startIndex: number, endIndex: number, mode: string, alignComments: boolean = false) {
    AlignSign_(result, startIndex, endIndex, ":", mode);
    AlignSign_(result, startIndex, endIndex, ":=", mode);
    AlignSign_(result, startIndex, endIndex, "<=", mode);
    AlignSign_(result, startIndex, endIndex, "=>", mode);
    AlignSign_(result, startIndex, endIndex, "direction", mode);
    if (alignComments) {
        AlignSign_(result, startIndex, endIndex, "@__@comments", mode);
    }
}

function indexOfGroup(regex: RegExp, input: string, group: number) {
    var match = regex.exec(input);
    if (match == null) {
        return -1;
    }
    var index = match.index;
    for (let i = 1; i < group; i++) {
        index += match[i].length;
    }
    return index;
}

function AlignSign_(result: (FormattedLine | FormattedLine[])[], startIndex: number, endIndex: number, symbol: string, mode: string) {
    let maxSymbolIndex: number = -1;
    let symbolIndices = {};
    let startLine = startIndex;
    let labelAndKeywords: Array<string> = [
        "([\\w\\s]*:(\\s)*PROCESS)",
        "([\\w\\s]*:(\\s)*POSTPONED PROCESS)",
        "([\\w\\s]*:\\s*$)",
        "([\\w\\s]*:.*\\s+GENERATE)"
    ];
    let labelAndKeywordsStr: string = labelAndKeywords.join("|");
    let labelAndKeywordsRegex = new RegExp("(" + labelAndKeywordsStr + ")([^\\w]|$)");
    for (let i = startIndex; i <= endIndex; i++) {
        let line = (<FormattedLine>result[i]).Line;
        if (symbol == ":" && line.regexStartsWith(labelAndKeywordsRegex)) {
            continue;
        }
        let regex: RegExp;
        if (symbol == "direction") {
            regex = new RegExp("(:\\s*)(IN|OUT|INOUT|BUFFER)(\\s+)(\\w)");
        }
        else {
            regex = new RegExp("([\\s\\w\\\\]|^)" + symbol + "([\\s\\w\\\\]|$)");
        }
        if (line.regexCount(regex) > 1) {
            continue;
        }
        let colonIndex: number;
        if (symbol == "direction") {
            colonIndex = indexOfGroup(regex, line, 4);
        }
        else {
            colonIndex = line.regexIndexOf(regex);
        }
        if (colonIndex > 0) {
            maxSymbolIndex = Math.max(maxSymbolIndex, colonIndex);
            symbolIndices[i] = colonIndex;
        }
        else if ((mode != "local" && !line.startsWith(ILCommentPrefix) && line.length != 0)
            || (mode == "local")) {
            if (startLine < i - 1) // if cannot find the symbol, a block of symbols ends
            {
                AlignSign(result, startLine, i - 1, symbol, maxSymbolIndex, symbolIndices);
            }
            maxSymbolIndex = -1;
            symbolIndices = {};
            startLine = i;
        }
    }
    if (startLine < endIndex) // if cannot find the symbol, a block of symbols ends
    {
        AlignSign(result, startLine, endIndex, symbol, maxSymbolIndex, symbolIndices);
    }
}

export function AlignSign(result: (FormattedLine | FormattedLine[])[], startIndex: number, endIndex: number, symbol: string, maxSymbolIndex: number = -1, symbolIndices = {}) {
    if (maxSymbolIndex < 0) {
        return;
    }

    for (let lineIndex in symbolIndices) {
        let symbolIndex = symbolIndices[lineIndex];
        if (symbolIndex == maxSymbolIndex) {
            continue;
        }
        let line = (<FormattedLine>result[lineIndex]).Line;
        (<FormattedLine>result[lineIndex]).Line = line.substring(0, symbolIndex)
            + " ".repeat(maxSymbolIndex - symbolIndex)
            + line.substring(symbolIndex);
    }
}

export function beautifyCaseBlock(block: CodeBlock, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, indent: number) {
    if (!block.lines[block.cursor].regexStartsWith(/(.+:\s*)?(CASE)([\s]|$)/)) {
        return;
    }
    result.push(new FormattedLine(block.lines[block.cursor], indent));
    block.cursor++;
    beautify3(block, result, settings, indent + 2);
    (<FormattedLine>result[block.cursor]).Indent = indent;
}

function getSemicolonBlockEndIndex(block: CodeBlock, settings: BeautifierSettings) {
    let endIndex = block.cursor;
    let openBracketsCount = 0;
    let closeBracketsCount = 0;
    for (; block.cursor <= block.end; block.cursor++) {
        let input = block.lines[block.cursor];
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
            endIndex = block.cursor;
            if (stringAfterSemicolon.trim().length > 0 && settings.NewLineSettings.newLineAfter.indexOf(";") >= 0) {
                block.splitLine(block.cursor, stringBeforeSemicolon, stringAfterSemicolon);
            }
            break;
        }
    }
    block.cursor = endIndex;
}

export function beautifyComponentBlock(block: CodeBlock, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, indent: number) {
    let startIndex = block.cursor;
    for (; block.cursor <= block.end; block.cursor++) {
        if (block.lines[block.cursor].regexStartsWith(/END(\s|$)/)) {
            break;
        }
    }
    result.push(new FormattedLine(block.lines[startIndex], indent));
    if (block.cursor != startIndex) {
        beautify3(block.subBlock(startIndex + 1, block.cursor), result, settings, indent + 1);
    }
}

export function beautifyPackageIsNewBlock(block: CodeBlock, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, indent: number) {
    let startIndex = block.cursor;
    for (; block.cursor <= block.end; block.cursor++) {
        if (block.lines[block.cursor].regexIndexOf(/;(\s|$)/) >= 0) {
            break;
        }
    }
    result.push(new FormattedLine(block.lines[startIndex], indent));
    if (block.cursor != startIndex) {
        beautify3(block.subBlock(startIndex + 1, block.cursor), result, settings, indent + 1);
    }
}

export function beautifyVariableInitialiseBlock(block: CodeBlock, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, indent: number) {
    let startIndex = block.cursor;
    for (; block.cursor <= block.end; block.cursor++) {
        if (block.lines[block.cursor].regexIndexOf(/;(\s|$)/) >= 0) {
            break;
        }
    }
    result.push(new FormattedLine(block.lines[startIndex], indent));
    if (block.cursor != startIndex) {
        beautify3(block.subBlock(startIndex + 1, block.cursor), result, settings, indent + 1);
    }
}

export function beautifySemicolonBlock(block: CodeBlock, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, indent: number) {
    let startIndex = block.cursor;
    getSemicolonBlockEndIndex(block, settings);
    result.push(new FormattedLine(block.lines[startIndex], indent));
    if (block.cursor != startIndex) {
        beautify3(block.subBlock(startIndex + 1, block.cursor), result, settings, indent + 1);
        alignSignalAssignmentBlock(settings, block.lines, startIndex, block.cursor, result);
    }
}

function alignSignalAssignmentBlock(settings: BeautifierSettings, inputs: string[], startIndex: number, endIndex: number, result: (FormattedLine | FormattedLine[])[]) {
    if (settings.Indentation.replace(/ +/g, "").length == 0) {
        let reg: RegExp = new RegExp("^([\\w\\\\]+[\\s]*<=\\s*)");
        let match = reg.exec(inputs[startIndex]);
        if (match != null) {
            let length = match[0].length;
            let prefixLength = length - settings.Indentation.length;
            let prefix = " ".repeat(prefixLength);
            for (let i = startIndex + 1; i <= endIndex; i++) {
                let fl = (result[i] as FormattedLine);
                fl.Line = prefix + fl.Line;
            }
        }
    }
}

export function beautify3(block: CodeBlock, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, indent: number) {
    let regexOneLineBlockKeyWords: RegExp = new RegExp(/(PROCEDURE)[^\w](?!.+[^\w]IS([^\w]|$))/);//match PROCEDURE..; but not PROCEDURE .. IS;
    let regexFunctionMultiLineBlockKeyWords: RegExp = new RegExp(/(FUNCTION|IMPURE FUNCTION)[^\w](?=.+[^\w]IS([^\w]|$))/);//match FUNCTION .. IS; but not FUNCTION
    let blockMidKeyWords: Array<string> = ["BEGIN"];
    let blockStartsKeyWords: Array<string> = [
        "IF",
        "CASE",
        "ARCHITECTURE",
        "PROCEDURE",
        "PACKAGE",
        "(([\\w\\s]*:)?(\\s)*PROCESS)",// with label
        "(([\\w\\s]*:)?(\\s)*POSTPONED PROCESS)",// with label
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
        "\\w+\\s+\\w+\\s+IS\\s+RECORD"];
    let blockEndsKeyWords: Array<string> = ["END", ".*\\)\\s*RETURN\\s+[\\w]+;"];
    let indentedEndsKeyWords: Array<string> = [ILIndentedReturnPrefix + "RETURN\\s+\\w+;"];
    let blockEndsWithSemicolon: Array<string> = [
        "(WITH\\s+[\\w\\s\\\\]+SELECT)",
        "([\\w\\\\]+[\\s]*<=)",
        "([\\w\\\\]+[\\s]*:=)",
        "FOR\\s+[\\w\\s,]+:\\s*\\w+\\s+USE",
        "REPORT"
    ];

    let newLineAfterKeyWordsStr: string = blockStartsKeyWords.join("|");
    let regexBlockMidKeyWords: RegExp = blockMidKeyWords.convertToRegexBlockWords();
    let regexBlockStartsKeywords: RegExp = new RegExp("([\\w]+\\s*:\\s*)?(" + newLineAfterKeyWordsStr + ")([^\\w]|$)")
    let regexBlockEndsKeyWords: RegExp = blockEndsKeyWords.convertToRegexBlockWords();
    let regexBlockIndentedEndsKeyWords: RegExp = indentedEndsKeyWords.convertToRegexBlockWords();
    let regexblockEndsWithSemicolon: RegExp = blockEndsWithSemicolon.convertToRegexBlockWords();
    let regexMidKeyWhen: RegExp = "WHEN".convertToRegexBlockWords();
    let regexMidKeyElse: RegExp = "ELSE|ELSIF".convertToRegexBlockWords();
    for (; block.cursor <= block.end; block.cursor++) {
        if (indent < 0) {
            indent = 0;
        }
        let input: string = block.lines[block.cursor].trim();
        if (input.regexStartsWith(regexBlockIndentedEndsKeyWords)) {
            result.push(new FormattedLine(input, indent));
            return;
        }
        if (input.regexStartsWith(/COMPONENT\s/)) {
            let modeCache = Mode;
            Mode = FormatMode.EndsWithSemicolon;
            beautifyComponentBlock(block, result, settings, indent);
            Mode = modeCache;
            continue;
        }
        if (input.regexStartsWith(/PACKAGE[\s\w]+IS\s+NEW/)) {
            let modeCache = Mode;
            Mode = FormatMode.EndsWithSemicolon;
            beautifyPackageIsNewBlock(block, result, settings, indent);
            Mode = modeCache;
            continue;
        }
        if (input.regexStartsWith(/\w+\s+\w+\s*:.+:\s*=\s*\(([^;]|$)/)) { // 'variable symbol: type [:= initial_value];'
            let modeCache = Mode;
            Mode = FormatMode.EndsWithSemicolon;
            let endsWithBracket = input.regexIndexOf(/:\s*=\s*\(/) > 0;
            let startIndex = block.cursor;
            beautifySemicolonBlock(block, result, settings, indent);
            if (endsWithBracket && startIndex != block.cursor) {
                let fl = result[block.end] as FormattedLine;
                if (fl.Line.regexStartsWith(/\);$/)) {
                    fl.Indent--;
                }
            }
            Mode = modeCache;
            continue;
        }
        if (input.regexIndexOf(/:=(\s*@@comments\d+\s*)?$/) > 0) {
            let modeCache = Mode;
            Mode = FormatMode.EndsWithSemicolon;
            beautifySemicolonBlock(block, result, settings, indent);
            Mode = modeCache;
            continue;
        }
        if (input.regexStartsWith(/\w+\s*:\s*ENTITY/)) {
            let modeCache = Mode;
            Mode = FormatMode.EndsWithSemicolon;
            beautifySemicolonBlock(block, result, settings, indent);
            Mode = modeCache;
            continue;
        }
        if (Mode != FormatMode.EndsWithSemicolon && input.regexStartsWith(regexblockEndsWithSemicolon)) {
            let modeCache = Mode;
            Mode = FormatMode.EndsWithSemicolon;
            beautifySemicolonBlock(block, result, settings, indent);
            Mode = modeCache;
            continue;
        }
        if (input.regexStartsWith(/(.+:\s*)?(CASE)([\s]|$)/)) {
            let modeCache = Mode;
            Mode = FormatMode.CaseWhen;
            beautifyCaseBlock(block, result, settings, indent);
            Mode = modeCache;
            continue;
        }
        if (input.regexStartsWith(/[\w\s:]*(:=)([\s]|$)/)) {
            beautifyPortGenericBlock(block, result, settings, indent, ":=");
            continue;
        }
        if (input.regexStartsWith(/[\w\s:]*\bPORT\b([\s]|$)/)) {
            beautifyPortGenericBlock(block, result, settings, indent, "PORT");
            continue;
        }
        if (input.regexStartsWith(/TYPE\s+\w+\s+IS\s+\(/)) {
            beautifyPortGenericBlock(block, result, settings, indent, "IS");
            continue;
        }
        if (input.regexStartsWith(/[\w\s:]*GENERIC([\s]|$)/)) {
            beautifyPortGenericBlock(block, result, settings, indent, "GENERIC");
            continue;
        }
        if (input.regexStartsWith(/[\w\s:]*PROCEDURE[\s\w]+\($/)) {
            beautifyPortGenericBlock(block, result, settings, indent, "PROCEDURE");
            if (block.lines[block.cursor].regexStartsWith(/.*\)[\s]*IS/)) {
                block.cursor++;
                beautify3(block, result, settings, indent + 1);
            }
            continue;
        }
        if (input.regexStartsWith(/FUNCTION[^\w]/)
            && input.regexIndexOf(/[^\w]RETURN[^\w]/) < 0) {
            beautifyPortGenericBlock(block, result, settings, indent, "FUNCTION");
            if (!block.lines[block.cursor].regexStartsWith(regexBlockEndsKeyWords)) {
                block.cursor++;
                beautify3(block, result, settings, indent + 1);
            } else {
                (<FormattedLine>result[block.cursor]).Indent++;
            }
            continue;
        }
        if (input.regexStartsWith(/IMPURE FUNCTION[^\w]/)
            && input.regexIndexOf(/[^\w]RETURN[^\w]/) < 0) {
            beautifyPortGenericBlock(block, result, settings, indent, "IMPURE FUNCTION");
            if (!block.lines[block.cursor].regexStartsWith(regexBlockEndsKeyWords)) {
                if (block.lines[block.cursor].regexStartsWith(regexBlockIndentedEndsKeyWords)) {
                    (<FormattedLine>result[block.cursor]).Indent++;
                } else {
                    block.cursor++;
                    beautify3(block, result, settings, indent + 1);
                }
            } else {
                (<FormattedLine>result[block.cursor]).Indent++;
            }
            continue;
        }
        result.push(new FormattedLine(input, indent));
        if (indent > 0
            && (input.regexStartsWith(regexBlockMidKeyWords)
                || (Mode != FormatMode.EndsWithSemicolon && input.regexStartsWith(regexMidKeyElse))
                || (Mode == FormatMode.CaseWhen && input.regexStartsWith(regexMidKeyWhen)))) {
            (<FormattedLine>result[block.cursor]).Indent--;
        }
        else if (indent > 0
            && (input.regexStartsWith(regexBlockEndsKeyWords))) {
            (<FormattedLine>result[block.cursor]).Indent--;
            return;
        }
        if (input.regexStartsWith(regexOneLineBlockKeyWords)) {
            continue;
        }
        if (input.regexStartsWith(regexFunctionMultiLineBlockKeyWords)
            || input.regexStartsWith(regexBlockStartsKeywords)) {
            block.cursor++;
            beautify3(block, result, settings, indent + 1);
        }
    }
    block.cursor--;
}

function ReserveSemicolonInKeywords(arr: Array<string>) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].match(/FUNCTION|PROCEDURE/) != null) {
            arr[i] = arr[i].replace(/;/g, ILSemicolon);
        }
    }
}

export function ApplyNoNewLineAfter(arr: Array<string>, noNewLineAfter: Array<string>) {
    if (noNewLineAfter == null) {
        return;
    }
    for (let i = 0; i < arr.length; i++) {
        noNewLineAfter.forEach(n => {
            let regex = new RegExp("(" + n.toUpperCase + ")[ a-z0-9]+[a-z0-9]+");
            if (arr[i].regexIndexOf(regex) >= 0) {
                arr[i] += "@__@singleline";
            }
        });
    }
}

export function RemoveAsserts(arr: Array<string>) {
    let need_semi: boolean = false;
    let inAssert: boolean = false;
    let n: number = 0;
    for (let i = 0; i < arr.length; i++) {
        let has_semi: boolean = arr[i].indexOf(";") >= 0;
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

function escapeText(arr: Array<string>, regex: string, escapedChar: string): Array<string> {
    let quotes: Array<string> = [];
    let regexEpr = new RegExp(regex, "g");
    for (let i = 0; i < arr.length; i++) {
        let matches = arr[i].match(regexEpr);
        if (matches != null) {
            for (var j = 0; j < matches.length; j++) {
                var match = matches[j];
                arr[i] = arr[i].replace(match, escapedChar.repeat(match.length));
                quotes.push(match);
            }
        }
    }
    return quotes;
}

function RemoveExtraNewLines(input: any) {
    input = input.replace(/(?:\r\n|\r|\n)/g, '\r\n');
    input = input.replace(/ \r\n/g, '\r\n');
    input = input.replace(/\r\n\r\n\r\n/g, '\r\n');
    return input;
}
