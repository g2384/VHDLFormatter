let isTesting = false;
const ILCommentPrefix = "@@comments";
const ILQuotesPrefix = "@@quotes";

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

function ConstructNewLineSettings(dict): NewLineSettings {
    let settings: NewLineSettings = new NewLineSettings();
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
        else return false;
    } catch (e) {
        return "";
    }
}

declare global {
    interface String {
        regexIndexOf: (pattern: RegExp, startIndex?: number) => number;
        regexLastIndexOf: (pattern: RegExp, startIndex: number) => number;
        reverse: () => string;
        regexStartsWith: (pattern: RegExp) => boolean;
        count: (text: string) => number;
        regexCount: (pattern: RegExp) => number;
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
    startIndex = startIndex === undefined ? this.length : startIndex;
    var searchResult = this.substr(0, startIndex).reverse().regexIndexOf(pattern, 0);
    return (-1 === searchResult) ? -1 : this.length - ++searchResult;
}

String.prototype.reverse = function () {
    return this.split('').reverse().join('');
}

function wordWrap() {
    var d = document.getElementById("result");
    if (d.className == "") {
        d.className = "wordwrap";
    } else {
        d.className = "";
    }
}

function getHTMLInputElement(id: string): HTMLInputElement {
    return <HTMLInputElement>document.getElementById(id);
}

function noFormat() {
    let elements: Array<string> = [
        "remove_comments",
        "remove_lines",
        "remove_report",
        "check_alias",
        "sign_align_in",
        "sign_align_port",
        "sign_align_generic",
        "sign_align_function",
        "sign_align_procedure",
        "sign_align_all",
        "new_line_after",
        "use_space",
        "customise_indentation",
        "compress",
        "mix_letter"
    ];
    var isDisabled = getHTMLInputElement("no_format").checked;
    elements.forEach(element => {
        var htmlElement = getHTMLInputElement(element + "_div");
        try {
            getHTMLInputElement(element).disabled = isDisabled;
        }
        catch{ }
        if (isDisabled) {
            htmlElement.className += " disabled";
        }
        else {
            htmlElement.className = htmlElement.className.replace(/\bdisabled\b/g, "");
        }
    });
    let radioButtons = <HTMLFormElement>document.getElementsByTagName("input");
    for (let i = 0; i < radioButtons.length; i++) {
        if ((<HTMLInputElement>radioButtons[i]).type == "radio") {
            (<HTMLInputElement>radioButtons[i]).disabled = isDisabled;
        }
    }
    getHTMLInputElement("cust_indent").disabled = isDisabled;
}

function indent_decode() {
    var custom_indent: string = getHTMLInputElement("cust_indent").value;
    var result: string = indentDecode(custom_indent);
    document.getElementById("indent_s").innerHTML = result;
}

export function indentDecode(input: string): string {
    input = input.replace(/\\t/g, "	");
    var count = [" & one ", " & two ", " & three ", " & four ", " & five ", " & six ", " & seven ", " & eight ", " & many "];
    var tokens: Array<string> = input.split("");
    var result = "";
    var repeatedCharCount = 0;
    for (var i = 0; i < tokens.length; i++) {
        var char = input.substr(i, 1);
        if (char == input.substr(i + 1, 1)) {
            repeatedCharCount++;
        } else {
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

    result = result.replace(/^ & /, "")
    return result;
}

function Compress(input: string) {
    input = input.replace(/\r\n/g, '');
    input = input.replace(/[\t ]+/g, ' ');
    input = input.replace(/[ ]?([&=:\-<>\+|])[ ]?/g, '$1');
    return input;
}

function MixLetters(input: string) {
    let arr = input.split("");
    for (var k = 0; k < arr.length; k++) {
        if (arr[k] === arr[k].toUpperCase() && Math.random() > 0.5) {
            arr[k] = arr[k].toLowerCase();
        } else if (Math.random() > 0.5) {
            arr[k] = arr[k].toUpperCase();
        }
    }
    return arr.join("");
}

function EscapeComments(arr: Array<string>, comments: Array<string>, commentIndex: number): number {
    for (var i = 0; i < arr.length; i++) {
        let line: string = arr[i];
        var firstCharIndex = line.regexIndexOf(/[a-zA-Z0-9\(\&\)%_\+'"|\\]/);
        var commentStartIndex = line.indexOf("--");
        if (firstCharIndex < commentStartIndex && firstCharIndex >= 0) {
            comments.push(line.substr(commentStartIndex));
            arr[i] = line.substr(firstCharIndex, commentStartIndex - firstCharIndex) + ILCommentPrefix + (commentIndex++);
        } else if ((firstCharIndex > commentStartIndex && commentStartIndex >= 0) || (firstCharIndex < 0 && commentStartIndex >= 0)) {
            comments.push(line.substr(commentStartIndex));
            arr[i] = ILCommentPrefix + (commentIndex++);
        } else {
            firstCharIndex = firstCharIndex < 0 ? 0 : firstCharIndex;
            arr[i] = line.substr(firstCharIndex);
        }
    }
    return commentIndex
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

function SetKeywordCase(input: string, keywordcase: string, keywords: string[], typenames: string[]): string {
    let inputcase: string = keywordcase.toLowerCase();
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

export function SetNewLinesAfterSymbols(text: string, newLineSettings: NewLineSettings): string {
    if (newLineSettings == null) {
        return text;
    }
    if (newLineSettings.newLineAfter != null) {
        newLineSettings.newLineAfter.forEach(symbol => {
            let regex: RegExp = new RegExp("(" + symbol.toUpperCase() + ")[ ]?([^ \r\n@])", "g");
            text = text.replace(regex, '$1\r\n$2');
        });
    }
    if (newLineSettings.noNewLineAfter != null) {
        newLineSettings.noNewLineAfter.forEach(symbol => {
            let regex: RegExp = new RegExp("(" + symbol.toUpperCase() + ")[ \r\n]+([^@])", "g");
            text = text.replace(regex, '$1 $2');
        });
    }
    return text;
}

export class BeautifierSettings {
    RemoveComments: boolean;
    RemoveAsserts: boolean;
    CheckAlias: boolean;
    SignAlignRegional: boolean;
    SignAlignAll: boolean;
    SignAlignKeyWords: Array<string>;
    KeywordCase: string;
    Indentation: string;
    NewLineSettings: NewLineSettings
    constructor(removeComments: boolean, removeReport: boolean, checkAlias: boolean,
        signAlign: boolean, signAlignAll: boolean, keywordCase: string, indentation: string,
        newLineSettings: NewLineSettings) {
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

let KeyWords: Array<string> = ["ABS", "ACCESS", "AFTER", "ALIAS", "ALL", "AND", "ARCHITECTURE", "ARRAY", "ASSERT", "ATTRIBUTE", "BEGIN", "BLOCK", "BODY", "BUFFER", "BUS", "CASE", "COMPONENT", "CONFIGURATION", "CONSTANT", "CONTEXT", "COVER", "DISCONNECT", "DOWNTO", "DEFAULT", "ELSE", "ELSIF", "END", "ENTITY", "EXIT", "FAIRNESS", "FILE", "FOR", "FORCE", "FUNCTION", "GENERATE", "GENERIC", "GROUP", "GUARDED", "IF", "IMPURE", "IN", "INERTIAL", "INOUT", "IS", "LABEL", "LIBRARY", "LINKAGE", "LITERAL", "LOOP", "MAP", "MOD", "NAND", "NEW", "NEXT", "NOR", "NOT", "NULL", "OF", "ON", "OPEN", "OR", "OTHERS", "OUT", "PACKAGE", "PORT", "POSTPONED", "PROCEDURE", "PROCESS", "PROPERTY", "PROTECTED", "PURE", "RANGE", "RECORD", "REGISTER", "REJECT", "RELEASE", "REM", "REPORT", "RESTRICT", "RESTRICT_GUARANTEE", "RETURN", "ROL", "ROR", "SELECT", "SEQUENCE", "SEVERITY", "SHARED", "SIGNAL", "SLA", "SLL", "SRA", "SRL", "STRONG", "SUBTYPE", "THEN", "TO", "TRANSPORT", "TYPE", "UNAFFECTED", "UNITS", "UNTIL", "USE", "VARIABLE", "VMODE", "VPROP", "VUNIT", "WAIT", "WHEN", "WHILE", "WITH", "XNOR", "XOR"];
let TypeNames: Array<string> = ["BOOLEAN", "BIT", "CHARACTER", "INTEGER", "TIME", "NATURAL", "POSITIVE", "STRING"];

export function beautify(input: string, settings: BeautifierSettings) {
    input = input.replace(/\r\n/g, "\n");
    input = input.replace(/\n/g, "\r\n");
    var arr = input.split("\r\n");
    var comments = [],
        commentsIndex = 0;
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
        RemoveAsserts(arr);//RemoveAsserts must be after EscapeQuotes
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
    input = input.replace(/\s*\)\s+RETURN\s+([\w]+;)/g, '\r\n) RETURN $1');//function(..\r\n)return type; -> function(..\r\n)return type;
    arr = input.split("\r\n");
    let result: (FormattedLine | FormattedLine[])[] = [];
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

export class FormattedLine {
    Line: string;
    Indent: number;
    constructor(line: string, indent: number) {
        this.Line = line;
        this.Indent = indent;
    }
}

export function FormattedLineToString(arr: (FormattedLine | FormattedLine[])[], indentation: string): Array<string> {
    let result: Array<string> = [];
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

function GetCloseparentheseEndIndex(inputs: Array<string>, startIndex: number): number {
    let openParentheseCount: number = 0;
    let closeParentheseCount: number = 0;
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

export function beautifyPortGenericBlock(inputs: Array<string>, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, startIndex: number, parentEndIndex: number, indent: number, mode: string): [number, number] {
    let firstLine: string = inputs[startIndex];
    let regex: RegExp = new RegExp("[\\w\\s:]*(" + mode + ")([\\s]|$)");
    if (!firstLine.regexStartsWith(regex)) {
        return [startIndex, parentEndIndex];
    }
    let firstLineHasParenthese: boolean = firstLine.indexOf("(") >= 0;
    let hasParenthese: boolean = firstLineHasParenthese;
    let blockBodyStartIndex = startIndex;
    let secondLineHasParenthese: boolean = startIndex + 1 < inputs.length && inputs[startIndex + 1].startsWith("(");
    if (secondLineHasParenthese) {
        hasParenthese = true;
        blockBodyStartIndex++;
    }
    let endIndex: number = hasParenthese ? GetCloseparentheseEndIndex(inputs, startIndex) : startIndex;
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
        (<FormattedLine>result[i]).Indent--;
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

export function AlignSigns(result: (FormattedLine | FormattedLine[])[], startIndex: number, endIndex: number) {
    AlignSign_(result, startIndex, endIndex, ":");
    AlignSign_(result, startIndex, endIndex, ":=");
    AlignSign_(result, startIndex, endIndex, "=>");
    AlignSign_(result, startIndex, endIndex, "<=");
}

function AlignSign_(result: (FormattedLine | FormattedLine[])[], startIndex: number, endIndex: number, symbol: string) {
    let maxSymbolIndex: number = -1;
    let symbolIndices = {};
    let startLine = startIndex;
    let labelAndKeywords: Array<string> = [
        "([\\w\\s]*:(\\s)*PROCESS)",// with label
        "([\\w\\s]*:(\\s)*POSTPONED PROCESS)",// with label
        "([\\w\\s]*:\\s*$)"// with label
    ];
    let labelAndKeywordsStr: string = labelAndKeywords.join("|");
    let labelAndKeywordsRegex = new RegExp("(" + labelAndKeywordsStr + ")([^\\w]|$)");
    for (let i = startIndex; i <= endIndex; i++) {
        let line = (<FormattedLine>result[i]).Line;
        if (symbol == ":" && line.regexStartsWith(labelAndKeywordsRegex)) {
            continue;
        }

        let regex: RegExp = new RegExp("([\\s\\w\\\\]|^)" + symbol + "([\\s\\w\\\\]|$)");
        if (line.regexCount(regex) > 1) {
            continue;
        }
        let colonIndex = line.regexIndexOf(regex);
        if (colonIndex > 0) {
            maxSymbolIndex = Math.max(maxSymbolIndex, colonIndex);
            symbolIndices[i] = colonIndex;
        }
        else if (!line.startsWith(ILCommentPrefix) && line.length != 0) {
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
            + (Array(maxSymbolIndex - symbolIndex + 1).join(" "))
            + line.substring(symbolIndex);
    }
}

export function beautifyCaseBlock(inputs: Array<string>, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, startIndex: number, indent: number): number {
    if (!inputs[startIndex].regexStartsWith(/(.+:\s*)?(CASE)([\s]|$)/)) {
        return startIndex;
    }
    result.push(new FormattedLine(inputs[startIndex], indent));

    let i = beautify3(inputs, result, settings, startIndex + 1, indent + 2);
    (<FormattedLine>result[i]).Indent = indent;
    return i;
}

function getSemicolonBlockEndIndex(inputs: Array<string>, settings: BeautifierSettings, startIndex: number, parentEndIndex: number): [number, number] {
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

export function beautifyComponentBlock(inputs: Array<string>, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, startIndex: number, indent: number): number {
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

export function beautifySemicolonBlock(inputs: Array<string>, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, startIndex: number, parentEndIndex: number, indent: number): [number, number] {
    let endIndex = startIndex;
    [endIndex, parentEndIndex] = getSemicolonBlockEndIndex(inputs, settings, startIndex, parentEndIndex);
    result.push(new FormattedLine(inputs[startIndex], indent));
    if (endIndex != startIndex) {
        let i = beautify3(inputs, result, settings, startIndex + 1, indent + 1, endIndex);
    }

    return [endIndex, parentEndIndex];
}

export function beautify3(inputs: Array<string>, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, startIndex: number, indent: number, endIndex?: number): number {
    let i: number;
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
    let blockEndsWithSemicolon: Array<string> = ["(WITH\\s+[\\w\\s\\\\]+SELECT)", "([\\w\\\\]+[\\s]*<=)", "([\\w\\\\]+[\\s]*:=)", "FOR\\s+[\\w\\s,]+:\\s*\\w+\\s+USE", "REPORT"];

    let newLineAfterKeyWordsStr: string = blockStartsKeyWords.join("|");
    let blockEndKeyWordsStr: string = blockEndsKeyWords.join("|");
    let blockMidKeyWordsStr: string = blockMidKeyWords.join("|");
    let blockEndsWithSemicolonStr: string = blockEndsWithSemicolon.join("|");
    let regexBlockMidKeyWords: RegExp = new RegExp("(" + blockMidKeyWordsStr + ")([^\\w]|$)")
    let regexBlockStartsKeywords: RegExp = new RegExp("([\\w]+\\s*:\\s*)?(" + newLineAfterKeyWordsStr + ")([^\\w]|$)")
    let regexBlockEndsKeyWords: RegExp = new RegExp("(" + blockEndKeyWordsStr + ")([^\\w]|$)")
    let regexblockEndsWithSemicolon: RegExp = new RegExp("(" + blockEndsWithSemicolonStr + ")([^\\w]|$)")
    let regexMidKeyWhen: RegExp = new RegExp("(" + "WHEN" + ")([^\\w]|$)")
    let regexMidKeyElse: RegExp = new RegExp("(" + "ELSE|ELSIF" + ")([^\\w]|$)")
    if (endIndex == null) {
        endIndex = inputs.length - 1;
    }
    for (i = startIndex; i <= endIndex; i++) {
        if (indent < 0) {
            indent = 0;
        }
        let input: string = inputs[i].trim();
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
            if (!inputs[i].regexStartsWith(regexBlockEndsKeyWords)) {
                i = beautify3(inputs, result, settings, i + 1, indent + 1);
            } else {
                (<FormattedLine>result[i]).Indent++;
            }
            continue;
        }
        if (input.regexStartsWith(/IMPURE FUNCTION[^\w]/)
            && input.regexIndexOf(/[^\w]RETURN[^\w]/) < 0) {
            [i, endIndex] = beautifyPortGenericBlock(inputs, result, settings, i, endIndex, indent, "IMPURE FUNCTION");
            if (!inputs[i].regexStartsWith(regexBlockEndsKeyWords)) {
                i = beautify3(inputs, result, settings, i + 1, indent + 1);
            } else {
                (<FormattedLine>result[i]).Indent++;
            }
            continue;
        }
        result.push(new FormattedLine(input, indent));
        if (startIndex != 0
            && (input.regexStartsWith(regexBlockMidKeyWords)
                || (Mode != FormatMode.EndsWithSemicolon && input.regexStartsWith(regexMidKeyElse))
                || (Mode == FormatMode.CaseWhen && input.regexStartsWith(regexMidKeyWhen)))) {
            (<FormattedLine>result[i]).Indent--;
        }
        else if (startIndex != 0
            && (input.regexStartsWith(regexBlockEndsKeyWords))) {
            (<FormattedLine>result[i]).Indent--;
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

function ReserveSemicolonInKeywords(arr: Array<string>) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].match(/FUNCTION|PROCEDURE/) != null) {
            arr[i] = arr[i].replace(/;/g, '@@semicolon');
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
                arr[i] += "@@singleline";
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

function EscapeQuotes(arr: Array<string>): Array<string> {
    let quotes: Array<string> = [];
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

function RemoveExtraNewLines(input: any) {
    input = input.replace(/(?:\r\n|\r|\n)/g, '\r\n');
    input = input.replace(/ \r\n/g, '\r\n');
    input = input.replace(/\r\n\r\n\r\n/g, '\r\n');
    return input;
}
