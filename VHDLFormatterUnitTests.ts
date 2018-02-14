import { beautify } from "./VHDLFormatter";
import { indentDecode } from "./VHDLFormatter";
import { NewLineSettings } from "./VHDLFormatter";
import { BeautifierSettings } from "./VHDLFormatter";
import { RemoveAsserts } from "./VHDLFormatter";
import { ApplyNoNewLineAfter } from "./VHDLFormatter";
import { SetNewLinesAfterSymbols } from "./VHDLFormatter";
import { beautify3 } from "./VHDLFormatter";
import { FormattedLine } from "./VHDLFormatter";
import { FormattedLineToString } from "./VHDLFormatter";

let testCount: number = 0;

var showUnitTests = true;//window.location.href.indexOf("http") < 0;
if (showUnitTests) {
    testCount = 0;
    IntegrationTest();

    UnitTestIndentDecode();
    UnitTestRemoveAsserts();
    UnitTestApplyNoNewLineAfter();
    UnitTestSetNewLinesAfterSymbols();
    UnitTestFormattedLineToString();
    UnitTestbeautify3();
    console.log("total tests: " + testCount);
}

interface Function {
    readonly name: string;
}

function UnitTestFormattedLineToString() {
    console.log("=== FormattedLineToString ===");
    FormattedLineToStringCase1();
    FormattedLineToStringCase2();
}

function FormattedLineToStringCase1() {
    let inputs: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("a;", 0),
        new FormattedLine("b;", 0)];
    let expected: Array<string> = ["a;", "b;"];
    UnitTest7(FormattedLineToString, "General", "    ", inputs, expected);
}

function FormattedLineToStringCase2() {
    let inputs: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("a;", 1),
        new FormattedLine("b;", 2)];
    let expected: Array<string> = [" a;", "  b;"];
    UnitTest7(FormattedLineToString, "General", " ", inputs, expected);
}

function UnitTestbeautify3() {
    console.log("=== beautify3 ===");
    Beautify3Case1();
    Beautify3Case2();
    Beautify3Case3();
    Beautify3Case4();
    Beautify3Case5();
    Beautify3Case6();
    Beautify3Case7();
    Beautify3Case8();
    Beautify3Case9();
    Beautify3Case10();
    Beautify3Case11();
    Beautify3Case12();
    Beautify3Case13();
    Beautify3Case14();
    Beautify3Case15();
}

function Beautify3Case1() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let inputs: Array<string> = ["a;", "b;"];
    let expected: (FormattedLine | FormattedLine[])[] = [new FormattedLine("a;", 0), new FormattedLine("b;", 0)];
    UnitTest6(beautify3, "General", settings, inputs, expected, 0, 1, 0);
}

function Beautify3Case2() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let inputs: Array<string> = ["IF x = '1' THEN", "RETURN 1;", "END IF;"];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("IF x = '1' THEN", 0),
        new FormattedLine("RETURN 1;", 1),
        new FormattedLine("END IF;", 0)
    ];
    UnitTest6(beautify3, "IF END", settings, inputs, expected, 0, 2, 0);
}

function Beautify3Case3() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let inputs: Array<string> = [
        "IF x = '1' THEN",
        "RETURN 1;",
        "ELSIF x = '0' THEN",
        "RETURN 0;",
        "ELSE",
        "RETURN -1;",
        "END IF;"];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("IF x = '1' THEN", 0),
        new FormattedLine("RETURN 1;", 1),
        new FormattedLine("ELSIF x = '0' THEN", 0),
        new FormattedLine("RETURN 0;", 1),
        new FormattedLine("ELSE", 0),
        new FormattedLine("RETURN -1;", 1),
        new FormattedLine("END IF;", 0)
    ];
    UnitTest6(beautify3, "if elsif else end", settings, inputs, expected, 0, 6, 0);
}

function Beautify3Case4() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let inputs: Array<string> = ["END"];
    let expected: (FormattedLine | FormattedLine[])[] = [new FormattedLine("END", 0)];
    UnitTest6(beautify3, "one line END", settings, inputs, expected, 0, 0, 0);
}

function Beautify3Case5() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let inputs: Array<string> = [
        "CASE b",
        "WHEN 1 =>",
        "c <= d;",
        "WHEN 2 =>",
        "d <= f;",
        "END CASE;"
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("CASE b", 0),
        new FormattedLine("WHEN 1 =>", 1),
        new FormattedLine("c <= d;", 2),
        new FormattedLine("WHEN 2 =>", 1),
        new FormattedLine("d <= f;", 2),
        new FormattedLine("END CASE;", 0)
    ];
    UnitTest6(beautify3, "case when when end", settings, inputs, expected, 0, 5, 0);
}

function Beautify3Case6() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let inputs: Array<string> = [
        "CASE b",
        "WHEN 1 =>",
        "c <= d;",
        "CASE b",
        "WHEN 1 =>",
        "c <= d;",
        "WHEN 2 =>",
        "d <= f;",
        "END CASE;",
        "WHEN 2 =>",
        "d <= f;",
        "END CASE;"
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("CASE b", 0),
        new FormattedLine("WHEN 1 =>", 1),
        new FormattedLine("c <= d;", 2),
        new FormattedLine("CASE b", 2),
        new FormattedLine("WHEN 1 =>", 3),
        new FormattedLine("c <= d;", 4),
        new FormattedLine("WHEN 2 =>", 3),
        new FormattedLine("d <= f;", 4),
        new FormattedLine("END CASE;", 2),
        new FormattedLine("WHEN 2 =>", 1),
        new FormattedLine("d <= f;", 2),
        new FormattedLine("END CASE;", 0)
    ];
    UnitTest6(beautify3, "case & case end", settings, inputs, expected, 0, 11, 0);
}

function Beautify3Case7() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let inputs: Array<string> = [
        "ARCHITECTURE a OF one IS",
        "SIGNAL x : INTEGER;",
        "BEGIN",
        "-- architecture",
        "END ARCHITECTURE;"
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("ARCHITECTURE a OF one IS", 0),
        new FormattedLine("SIGNAL x : INTEGER;", 1),
        new FormattedLine("BEGIN", 0),
        new FormattedLine("-- architecture", 1),
        new FormattedLine("END ARCHITECTURE;", 0),
    ];
    UnitTest6(beautify3, "architecture", settings, inputs, expected, 0, 4, 0);
}

function Beautify3Case8() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let inputs: Array<string> = [
        "ARCHITECTURE a OF one IS",
        "SIGNAL x : INTEGER;",
        "BEGIN",
        "-- architecture",
        "END ARCHITECTURE;",
        "ARCHITECTURE b OF one IS",
        "SIGNAL x : INTEGER;",
        "BEGIN",
        "-- architecture",
        "END ARCHITECTURE;"
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("ARCHITECTURE a OF one IS", 0),
        new FormattedLine("SIGNAL x : INTEGER;", 1),
        new FormattedLine("BEGIN", 0),
        new FormattedLine("-- architecture", 1),
        new FormattedLine("END ARCHITECTURE;", 0),
        new FormattedLine("ARCHITECTURE b OF one IS", 0),
        new FormattedLine("SIGNAL x : INTEGER;", 1),
        new FormattedLine("BEGIN", 0),
        new FormattedLine("-- architecture", 1),
        new FormattedLine("END ARCHITECTURE;", 0),
    ];
    UnitTest6(beautify3, "architecture 2", settings, inputs, expected, 0, 9, 0);
}

function Beautify3Case9() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let inputs: Array<string> = [
        "PROCEDURE foo(x : IN INTEGER; y : OUT INTEGER) IS",
        "VARIABLE i : INTEGER;",
        "BEGIN",
        "y := x + 1;",
        "END PROCEDURE;"
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("PROCEDURE foo(x : IN INTEGER; y : OUT INTEGER) IS", 0),
        new FormattedLine("VARIABLE i : INTEGER;", 1),
        new FormattedLine("BEGIN", 0),
        new FormattedLine("y := x + 1;", 1),
        new FormattedLine("END PROCEDURE;", 0)
    ];
    UnitTest6(beautify3, "procedure", settings, inputs, expected, 0, 4, 0);
}

function Beautify3Case10() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let inputs: Array<string> = [
        "PACKAGE three IS",
        "SIGNAL s : INTEGER;",
        "ALIAS sa IS s;",
        "END PACKAGE;"
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("PACKAGE three IS", 0),
        new FormattedLine("SIGNAL s : INTEGER;", 1),
        new FormattedLine("ALIAS sa IS s;", 1),
        new FormattedLine("END PACKAGE;", 0)
    ];
    UnitTest6(beautify3, "package", settings, inputs, expected, 0, 3, 0);
}

function Beautify3Case11() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let inputs: Array<string> = [
        "PACKAGE p IS",
        "PROCEDURE foo(x : IN INTEGER; y : OUT INTEGER);",
        "END PACKAGE;",
        "PACKAGE BODY p IS",
        "PROCEDURE foo(x : IN INTEGER; y : OUT INTEGER) IS",
        "VARIABLE i : INTEGER;",
        "BEGIN",
        "y := x + 1;",
        "END PROCEDURE;",
        "PROCEDURE bar(FILE x : text);",
        "PROCEDURE baz IS",
        "TYPE foo;",
        "ALIAS x IS y;",
        "BEGIN",
        "END PROCEDURE;",
        "PROCEDURE tralala IS",
        "USE work.foo;",
        "BEGIN",
        "END PROCEDURE;",
        "END PACKAGE BODY;"
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("PACKAGE p IS", 0),
        new FormattedLine("PROCEDURE foo(x : IN INTEGER; y : OUT INTEGER);", 1),
        new FormattedLine("END PACKAGE;", 0),
        new FormattedLine("PACKAGE BODY p IS", 0),
        new FormattedLine("PROCEDURE foo(x : IN INTEGER; y : OUT INTEGER) IS", 1),
        new FormattedLine("VARIABLE i : INTEGER;", 2),
        new FormattedLine("BEGIN", 1),
        new FormattedLine("y := x + 1;", 2),
        new FormattedLine("END PROCEDURE;", 1),
        new FormattedLine("PROCEDURE bar(FILE x : text);", 1),
        new FormattedLine("PROCEDURE baz IS", 1),
        new FormattedLine("TYPE foo;", 2),
        new FormattedLine("ALIAS x IS y;", 2),
        new FormattedLine("BEGIN", 1),
        new FormattedLine("END PROCEDURE;", 1),
        new FormattedLine("PROCEDURE tralala IS", 1),
        new FormattedLine("USE work.foo;", 2),
        new FormattedLine("BEGIN", 1),
        new FormattedLine("END PROCEDURE;", 1),
        new FormattedLine("END PACKAGE BODY;", 0)
    ];
    UnitTest6(beautify3, "package procedure", settings, inputs, expected, 0, expected.length - 1, 0);
}

function Beautify3Case12() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let inputs: Array<string> = [
        "ARCHITECTURE a OF b IS",
        "SIGNAL x : INTEGER := 0;",
        "BEGIN",
        "p: PROCESS IS",
        "BEGIN",
        "END PROCESS;",
        "PROCESS",
        "VARIABLE y : INTEGER := 5;",
        "BEGIN",
        "x <= y;",
        "END PROCESS;",
        "PROCESS (x) IS",
        "BEGIN",
        "x <= x + 1;",
        "END PROCESS;",
        "POSTPONED PROCESS IS",
        "BEGIN",
        "END PROCESS;",
        "POSTPONED assert x = 1;",
        "END ARCHITECTURE;"
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("ARCHITECTURE a OF b IS", 0),
        new FormattedLine("SIGNAL x : INTEGER := 0;", 1),
        new FormattedLine("BEGIN", 0),
        new FormattedLine("p: PROCESS IS", 1),
        new FormattedLine("BEGIN", 1),
        new FormattedLine("END PROCESS;", 1),
        new FormattedLine("PROCESS", 1),
        new FormattedLine("VARIABLE y : INTEGER := 5;", 2),
        new FormattedLine("BEGIN", 1),
        new FormattedLine("x <= y;", 2),
        new FormattedLine("END PROCESS;", 1),
        new FormattedLine("PROCESS (x) IS", 1),
        new FormattedLine("BEGIN", 1),
        new FormattedLine("x <= x + 1;", 2),
        new FormattedLine("END PROCESS;", 1),
        new FormattedLine("POSTPONED PROCESS IS", 1),
        new FormattedLine("BEGIN", 1),
        new FormattedLine("END PROCESS;", 1),
        new FormattedLine("POSTPONED assert x = 1;", 1),
        new FormattedLine("END ARCHITECTURE;", 0)
    ];
    UnitTest6(beautify3, "package postponed procedure", settings, inputs, expected, 0, expected.length - 1, 0);
}

function Beautify3Case13() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let inputs: Array<string> = [
        "TYPE SharedCounter IS PROTECTED",
        "PROCEDURE increment (N : INTEGER := 1);",
        "IMPURE FUNCTION value RETURN INTEGER;",
        "END PROTECTED SharedCounter;"
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("TYPE SharedCounter IS PROTECTED", 0),
        new FormattedLine("PROCEDURE increment (N : INTEGER := 1);", 1),
        new FormattedLine("IMPURE FUNCTION value RETURN INTEGER;", 1),
        new FormattedLine("END PROTECTED SharedCounter;", 0)
    ];
    UnitTest6(beautify3, "type projected", settings, inputs, expected, 0, expected.length - 1, 0);
}

function Beautify3Case14() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let inputs: Array<string> = [
        "PACKAGE p IS",
        "TYPE SharedCounter IS PROTECTED",
        "PROCEDURE increment (N : INTEGER := 1);",
        "IMPURE FUNCTION value RETURN INTEGER;",
        "END PROTECTED SharedCounter;",
        "TYPE SharedCounter IS PROTECTED BODY"
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("PACKAGE p IS", 0),
        new FormattedLine("TYPE SharedCounter IS PROTECTED", 1),
        new FormattedLine("PROCEDURE increment (N : INTEGER := 1);", 2),
        new FormattedLine("IMPURE FUNCTION value RETURN INTEGER;", 2),
        new FormattedLine("END PROTECTED SharedCounter;", 1),
        new FormattedLine("TYPE SharedCounter IS PROTECTED BODY", 1)
    ];
    UnitTest6(beautify3, "type projected", settings, inputs, expected, 0, expected.length - 1, 0);
}

function Beautify3Case15() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let inputs: Array<string> = [
        "constant a : integer := 2#1101#",
        "constant b : integer := 3#20#;",
        "constant g : integer := 2:1_0:;"
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("constant a : integer := 2#1101#", 0),
        new FormattedLine("constant b : integer := 3#20#;", 0),
        new FormattedLine("constant g : integer := 2:1_0:;", 0)
    ];
    UnitTest6(beautify3, "constant", settings, inputs, expected, 0, expected.length - 1, 0);
}

function UnitTestSetNewLinesAfterSymbols() {
    console.log("=== SetNewLinesAfterSymbols ===");
    let input = "a; @@comments1\r\nb;"
    let expected = "a; @@comments1\r\nb;";
    let parameters: NewLineSettings = new NewLineSettings();
    parameters.newLineAfter = ["then", ";"];
    parameters.noNewLineAfter = ["port", "generic"];
    UnitTest5(SetNewLinesAfterSymbols, "no new line after comment", parameters, input, expected);

    input = "a; b;"
    expected = "a;\r\nb;";
    UnitTest5(SetNewLinesAfterSymbols, "new line after ;", parameters, input, expected);
}

function UnitTestApplyNoNewLineAfter() {
    console.log("=== ApplyNoNewLineAfter ===");
    let input: Array<string> = ["a;", "b;"];
    let expected: Array<string> = ["a;@@singleline", "b;@@singleline"];
    let parameters: Array<string> = [";"];
    UnitTest4(ApplyNoNewLineAfter, "one blankspace", parameters, input, expected);

    input = ["a;", "b THEN", "c"];
    expected = ["a;@@singleline", "b THEN@@singleline", "c"];
    parameters = [";", "then"];
    UnitTest4(ApplyNoNewLineAfter, "one blankspace", parameters, input, expected);
}

function UnitTestRemoveAsserts() {
    console.log("=== RemoveAsserts ===");
    let input: Array<string> = ["ASSERT a;"];
    let expected: Array<string> = [""];
    UnitTest3(RemoveAsserts, "one assert", input, expected);

    input = ["ASSERT a", "b;", "c"];
    expected = ["", "", "c"];
    UnitTest3(RemoveAsserts, "multiline assert", input, expected);
}

function UnitTestIndentDecode() {
    console.log("=== IndentDecode ===");
    UnitTest2(indentDecode, "one blankspace", " ", "one blankspace");
    UnitTest2(indentDecode, "mixed chars", " A ", "one blankspace & one A & one blankspace");
    UnitTest2(indentDecode, "4 blankspaces", "    ", "four blankspace");
    UnitTest2(indentDecode, "9 blankspaces", "         ", "many blankspace");
}

function compareFormattedLines(expected: (FormattedLine | FormattedLine[])[], actual: (FormattedLine | FormattedLine[])[], message?): string {
    var l = Math.min(actual.length, expected.length);
    let result: string = "";
    for (var i = 0; i < l; i++) {
        if (actual[i] instanceof FormattedLine) {
            if (expected[i] instanceof FormattedLine) {
                let compareResult = compareFormattedLine(<FormattedLine>(expected[i]), <FormattedLine>(actual[i]), message, false);
                if (compareResult.length > 0) {
                    result += "index " + i + "\n" + compareResult;
                }
            }
            else {
                result += "index " + i + "\nexpected FormatLine[], actual FormattedLine. actual:" + (<FormattedLine>(actual[i])).Line;
            }
        }
        else {
            if (expected[i] instanceof FormattedLine) {
                result += "index " + i + "\nexpected FormatLine, actual FormattedLine[]. expected:" + (<FormattedLine>(expected[i])).Line;
            }
            else {
                let compareResult = compareFormattedLines(<FormattedLine[]>(actual[i]), <FormattedLine[]>(expected[i]), message);
                if (compareResult.length > 0) {
                    result += "index " + i + "\n" + compareResult;
                }
            }
        }
    }
    if (actual.length > expected.length) {
        result += "actual has more items";
        for (var i = expected.length; i < actual.length; i++) {
            result += "actual[" + i + "] = " + actual[i];
        }
    }
    else if (actual.length < expected.length) {
        result += "expected has more items";
        for (var i = actual.length; i < expected.length; i++) {
            result += "expected[" + i + "] = " + expected[i];
        }
    }
    return result;
}

function assertFormattedLines(testName, expected: (FormattedLine | FormattedLine[])[], actual: (FormattedLine | FormattedLine[])[], message?) {
    let result = compareFormattedLines(expected, actual, message);
    if (result.length > 0) {
        console.log(testName + " failed:\n" + result);
    }
    testCount++;
}

function compareFormattedLine(expected: FormattedLine, actual: FormattedLine, message?, cumulateTestCount?: boolean) {
    let result = "";
    if (expected.Indent != actual.Indent) {
        result += 'indents are not equal;\nexpected: "' + expected.Line + '", ' + expected.Indent
            + ';\nactual: "' + actual.Line + '", ' + actual.Indent + "\n";
    }
    let compareResult = CompareString(actual.Line, expected.Line);
    if (compareResult != true) {
        result += compareResult;
    }
    return result;
}

function assert(testName, expected: string, actual: string, message?) {
    var result = CompareString(actual, expected);
    if (result != true) {
        console.log(testName + " failed: \n" + result);
    }
    else {
        //console.log(testName + " pass");
    }
    testCount++;
}

function assertArray(testName, expected, actual, message?) {
    var result = CompareArray(actual, expected);
    if (result != true) {
        console.log(testName + " failed: " + result);
    }
    else {
        //console.log(testName + " pass");
    }
    testCount++;
}

type StringCallback = (text: string) => string;

type ArrayCallback = (arr: Array<string>) => void;

type Array2Callback = (arr: Array<string>, parameters: Array<string>) => void;

type String2Callback = (text: string, parameters: NewLineSettings) => string;

type BeautifyCallback = (inputs: Array<string>, result: (FormattedLine | FormattedLine[])[], settings: BeautifierSettings, startIndex: number, indent: number) => number;

type FormattedLinesCallback = (inputs: (FormattedLine | FormattedLine[])[], indentation: string) => Array<string>;

function UnitTest7(func: FormattedLinesCallback, testName: string, indentation: string, inputs: (FormattedLine | FormattedLine[])[], expected: Array<string>) {
    let actual = func(inputs, indentation);
    assertArray(testName, expected, actual);
}

function UnitTest6(func: BeautifyCallback, testName: string, parameters: BeautifierSettings, inputs: Array<string>, expected: (FormattedLine | FormattedLine[])[], startIndex: number, expectedEndIndex: number, indent: number) {
    let actual: (FormattedLine | FormattedLine[])[] = []
    let endIndex: number = func(inputs, actual, parameters, startIndex, indent);
    if (endIndex != expectedEndIndex) {
        console.log(testName + " failed;\nend index, actual: " + endIndex + "; expected: " + expectedEndIndex)
    }
    assertFormattedLines(testName, expected, actual);
}

function UnitTest5(func: String2Callback, testName: string, parameters: NewLineSettings, inputs, expected: string) {
    let actual: string = func(inputs, parameters);
    assert(testName, expected, actual);
}

function UnitTest4(func: Array2Callback, testName: string, parameters: Array<string>, inputs: Array<string>, expected: Array<string>) {
    let actual = JSON.parse(JSON.stringify(inputs));
    func(actual, parameters);
    assertArray(testName, expected, actual);
}

function UnitTest3(func: ArrayCallback, testName: string, inputs: Array<string>, expected: Array<string>) {
    let actual = JSON.parse(JSON.stringify(inputs));
    func(actual);
    assertArray(testName, expected, actual);
}

function UnitTest2(func: StringCallback, testName: string, inputs, expected: string) {
    let actual: string = func(inputs);
    assert(testName, expected, actual);
}

function deepCopy(objectToCopy: BeautifierSettings): BeautifierSettings {
    return (JSON.parse(JSON.stringify(objectToCopy)));
}

function IntegrationTest() {
    console.log("=== IntegrationTests ===");
    
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let input = "architecture TB of TB_CPU is\r\n    component CPU_IF\r\n    port   -- port list\r\n    end component;\r\n    signal CPU_DATA_VALID: std_ulogic;\r\n    signal CLK, RESET: std_ulogic := '0';\r\n    constant PERIOD : time := 10 ns;\r\n    constant MAX_SIM: time := 50 * PERIOD;\r\n    begin\r\n    -- concurrent statements\r\n    end TB;"
    let expected = "ARCHITECTURE TB OF TB_CPU IS\r\n    COMPONENT CPU_IF\r\n        PORT -- port list\r\n    END COMPONENT;\r\n    SIGNAL CPU_DATA_VALID : std_ulogic;\r\n    SIGNAL CLK, RESET : std_ulogic := '0';\r\n    CONSTANT PERIOD : TIME := 10 ns;\r\n    CONSTANT MAX_SIM : TIME := 50 * PERIOD;\r\nBEGIN\r\n    -- concurrent statements\r\nEND TB;";
    let actual = beautify(input, settings);
    assert("General", expected, actual);

    IntegrationTest2();

    let new_line_after_symbols_2: NewLineSettings = new NewLineSettings();
    new_line_after_symbols_2.newLineAfter = [];
    new_line_after_symbols_2.noNewLineAfter = ["then", ";", "generic", "port"];
    let newSettings = deepCopy(settings);
    newSettings.NewLineSettings = new_line_after_symbols_2;
    expected = "a; b; c;";
    input = "a; \r\nb;\r\n c;"
    actual = beautify(input, newSettings);
    assert("Remove line after ;", expected, actual);

    newSettings = deepCopy(settings);
    newSettings.RemoveAsserts = true;
    input = "architecture arch of ent is\r\nbegin\r\n    assert False report sdfjcsdfcsdj;\r\n    assert False report sdfjcsdfcsdj severity note;\r\nend architecture;";
    expected = "ARCHITECTURE arch OF ent IS\r\nBEGIN\r\nEND ARCHITECTURE;"
    actual = beautify(input, newSettings);
    assert("Remove asserts", expected, actual);

    input = "entity TB_DISPLAY is\r\n-- port declarations\r\nend TB_DISPLAY;\r\n\r\narchitecture TEST of TB_DISPLAY is\r\n-- signal declarations\r\nbegin\r\n-- component instance(s)\r\nend TEST;";
    expected = "ENTITY TB_DISPLAY IS\r\n    -- port declarations\r\nEND TB_DISPLAY;\r\n\r\nARCHITECTURE TEST OF TB_DISPLAY IS\r\n    -- signal declarations\r\nBEGIN\r\n    -- component instance(s)\r\nEND TEST;";
    actual = beautify(input, settings);
    assert("ENTITY ARCHITECTURE", expected, actual);

    IntegrationTest5();
    IntegrationTest6();
    IntegrationTest7();

    input = 'if a(3 downto 0) > "0100" then\r\na(3 downto 0) := a(3 downto 0) + "0011" ;\r\nend if ;';
    expected = 'IF a(3 DOWNTO 0) > "0100" THEN\r\n    a(3 DOWNTO 0) := a(3 DOWNTO 0) + "0011";\r\nEND IF;';
    actual = beautify(input, settings);
    assert("IF END IF case 1", expected, actual);

    input = "if s = '1' then\r\no <= \"010\";\r\nelse\r\no <= \"101\";\r\nend if;";
    expected = "IF s = '1' THEN\r\n    o <= \"010\";\r\nELSE\r\n    o <= \"101\";\r\nEND IF;";
    actual = beautify(input, settings);
    assert("IF ELSE END IF case 1", expected, actual);

    newSettings = deepCopy(settings);
    newSettings.NewLineSettings.newLineAfter.push("ELSE");
    input = "IF (s = r) THEN rr := '0'; ELSE rr := '1'; END IF;";
    expected = "IF (s = r) THEN\r\n    rr := '0';\r\nELSE\r\n    rr := '1';\r\nEND IF;";
    actual = beautify(input, newSettings);
    assert("IF ELSE END IF case 2", expected, actual);

    input = 'P1:process\r\nvariable x: Integer range 1 to 3;\r\nvariable y: BIT_VECTOR (0 to 1);\r\nbegin\r\n  C1: case x is\r\n      when 1 => Out_1 <= 0;\r\n      when 2 => Out_1 <= 1;\r\n  end case C1;\r\n  C2: case y is\r\n      when "00" => Out_2 <= 0;\r\n      when "01" => Out_2 <= 1;\r\n  end case C2;\r\nend process;';
    expected = 'P1 : PROCESS\r\n    VARIABLE x : INTEGER RANGE 1 TO 3;\r\n    VARIABLE y : BIT_VECTOR (0 TO 1);\r\nBEGIN\r\n    C1 : CASE x IS\r\n        WHEN 1 => Out_1 <= 0;\r\n        WHEN 2 => Out_1 <= 1;\r\n    END CASE C1;\r\n    C2 : CASE y IS\r\n        WHEN "00" => Out_2 <= 0;\r\n        WHEN "01" => Out_2 <= 1;\r\n    END CASE C2;\r\nEND PROCESS;';
    actual = beautify(input, settings);
    assert("WHEN CASE", expected, actual);

    input = "case READ_CPU_STATE is\r\n  when WAITING =>\r\n    if CPU_DATA_VALID = '1' then\r\n      CPU_DATA_READ  <= '1';\r\n      READ_CPU_STATE <= DATA1;\r\n    end if;\r\n  when DATA1 =>\r\n    -- etc.\r\nend case;";
    expected = "CASE READ_CPU_STATE IS\r\n    WHEN WAITING =>\r\n        IF CPU_DATA_VALID = '1' THEN\r\n            CPU_DATA_READ <= '1';\r\n            READ_CPU_STATE <= DATA1;\r\n        END IF;\r\n    WHEN DATA1 =>\r\n        -- etc.\r\nEND CASE;";
    actual = beautify(input, settings);
    assert("WHEN CASE & IF", expected, actual);

    input = "entity aa is\r\n    port (a : in std_logic;\r\n          b : in std_logic;\r\n         );\r\nend aa;\r\narchitecture bb of aa is\r\n   component cc\r\n    port(\r\n         a : in std_logic;\r\n         b : in std_logic;\r\n        );\r\n    end cc;\r\n\r\nbegin\r\n  C : cc port map (\r\n          long => a,\r\n          b => b\r\n        );\r\nend;";
    expected = "ENTITY aa IS\r\n    PORT (\r\n        a : IN std_logic;\r\n        b : IN std_logic;\r\n    );\r\nEND aa;\r\nARCHITECTURE bb OF aa IS\r\n    COMPONENT cc\r\n        PORT (\r\n            a : IN std_logic;\r\n            b : IN std_logic;\r\n        );\r\n    END cc;\r\n\r\nBEGIN\r\n    C : cc PORT MAP(\r\n        long => a,\r\n        b => b\r\n    );\r\nEND;";
    actual = beautify(input, settings);
    assert("PORT MAP", expected, actual);

    input = "entity aa is\r\n    port (a : in std_logic;\r\n          b : in std_logic;\r\n         );\r\n    port (a : in std_logic;\r\n          b : in std_logic;\r\n         );\r\nend aa;\r\narchitecture bb of aa is\r\n   component cc\r\n    port(\r\n         a : in std_logic;\r\n         b : in std_logic;\r\n        );\r\n    port(\r\n         a : in std_logic;\r\n         b : in std_logic;\r\n        );\r\n    end cc;\r\n\r\nbegin\r\n  C : cc port map (\r\n          long => a,\r\n          b => b\r\n        );\r\n  D : cc port map (\r\n          long => a,\r\n          b => b\r\n        );\r\nend;";
    expected = "ENTITY aa IS\r\n    PORT (\r\n        a : IN std_logic;\r\n        b : IN std_logic;\r\n    );\r\n    PORT (\r\n        a : IN std_logic;\r\n        b : IN std_logic;\r\n    );\r\nEND aa;\r\nARCHITECTURE bb OF aa IS\r\n    COMPONENT cc\r\n        PORT (\r\n            a : IN std_logic;\r\n            b : IN std_logic;\r\n        );\r\n        PORT (\r\n            a : IN std_logic;\r\n            b : IN std_logic;\r\n        );\r\n    END cc;\r\n\r\nBEGIN\r\n    C : cc PORT MAP(\r\n        long => a,\r\n        b => b\r\n    );\r\n    D : cc PORT MAP(\r\n        long => a,\r\n        b => b\r\n    );\r\nEND;";
    actual = beautify(input, settings);
    assert("Multiple PORT MAPs", expected, actual);

    input = "port (a : in std_logic;\r\n b : in std_logic;\r\n);";
    expected = "PORT\r\n(\r\n    a : IN std_logic;\r\n    b : IN std_logic;\r\n);";
    new_line_after_symbols_2 = new NewLineSettings();
    new_line_after_symbols_2.newLineAfter = ["then", ";", "generic", "port"];
    newSettings = deepCopy(settings);
    newSettings.NewLineSettings = new_line_after_symbols_2;
    actual = beautify(input, newSettings);
    assert("New line after PORT", expected, actual);

    newSettings = deepCopy(settings);
    newSettings.NewLineSettings.newLineAfter = [];
    input = "component a is\r\nport( Data : inout Std_Logic_Vector(7 downto 0););\r\nend component a;";
    expected = "COMPONENT a IS\r\n    PORT (Data : INOUT Std_Logic_Vector(7 DOWNTO 0););\r\nEND COMPONENT a;";
    actual = beautify(input, newSettings);
    assert("New line after PORT (single line)", expected, actual);

    //IntegrationTest20();

    input = "architecture a of b is\r\nbegin\r\n    process (w)\r\n    variable t : std_logic_vector (4 downto 0) ;\r\nbegin\r\n    a := (others => '0') ;\r\nend process ;\r\nend a;";
    expected = "ARCHITECTURE a OF b IS\r\nBEGIN\r\n    PROCESS (w)\r\n        VARIABLE t : std_logic_vector (4 DOWNTO 0);\r\n    BEGIN\r\n        a := (OTHERS => '0');\r\n    END PROCESS;\r\nEND a;";
    actual = beautify(input, newSettings);
    assert("Double BEGIN", expected, actual);

    let newSettings2 = deepCopy(newSettings);
    newSettings2.SignAlignAll = true;
    newSettings2.NewLineSettings.newLineAfter = ["then", ";", "generic", "port"];
    newSettings2.NewLineSettings.noNewLineAfter = [];
    input = "entity a is\r\n    port ( w  : in  std_logic_vector (7 downto 0) ;\r\n           w_s : out std_logic_vector (3 downto 0) ; ) ;\r\nend a ;\r\narchitecture b of a is\r\nbegin\r\n    process ( w )\r\n    variable t : std_logic_vector (4 downto 0) ;\r\n    variable bcd     : std_logic_vector (11 downto 0) ;\r\nbegin\r\n    b(2 downto 0) := w(7 downto 5) ;\r\n    t         := w(4 downto 0) ;\r\n    w_s <= b(11 downto 8) ;\r\n    w <= b(3  downto 0) ;\r\nend process ;\r\nend b ;";
    expected = "ENTITY a IS\r\n    PORT\r\n    (\r\n        w   : IN std_logic_vector (7 DOWNTO 0);\r\n        w_s : OUT std_logic_vector (3 DOWNTO 0);\r\n    );\r\nEND a;\r\nARCHITECTURE b OF a IS\r\nBEGIN\r\n    PROCESS (w)\r\n        VARIABLE t   : std_logic_vector (4 DOWNTO 0);\r\n        VARIABLE bcd : std_logic_vector (11 DOWNTO 0);\r\n    BEGIN\r\n        b(2 DOWNTO 0) := w(7 DOWNTO 5);\r\n        t             := w(4 DOWNTO 0);\r\n        w_s <= b(11 DOWNTO 8);\r\n        w   <= b(3 DOWNTO 0);\r\n    END PROCESS;\r\nEND b;";
    actual = beautify(input, newSettings2);
    assert("Align signs in all places", expected, actual);
    
    IntegrationTest23();
    IntegrationTest24();
    IntegrationTest25();
    IntegrationTest26();
}

function IntegrationTest23() {
    let new_line_after_symbols = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["generic"];
    let settings = new BeautifierSettings(false, false, false, false, false, "uppercase", "\t", new_line_after_symbols);
    let input = "PACKAGE p IS\r\n	TYPE int_array IS ARRAY (INTEGER RANGE <>) OF INTEGER;\r\n	TYPE ten_ints IS ARRAY (1 TO 10) OF INTEGER;\r\n	TYPE chars IS (A, B, C);\r\n	TYPE char_counts IS ARRAY (chars) OF INTEGER;\r\n	TYPE two_d IS ARRAY (1 TO 3, 4 TO 6) OF INTEGER;\r\n	TYPE ab_chars IS ARRAY (chars RANGE A TO B) OF INTEGER;\r\nEND PACKAGE;";
    let actual = beautify(input, settings);
    assert("Type array", input, actual);
}

function IntegrationTest24() {
    let new_line_after_symbols = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["generic"];
    let settings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let input = "ARCHITECTURE a OF e IS\r\n    ATTRIBUTE foo : INTEGER;\r\n    ATTRIBUTE foo OF x : SIGNAL IS 5;\r\n    ATTRIBUTE foo OF x : COMPONENT IS 5;\r\n    ATTRIBUTE foo OF x : LABEL IS 6;\r\n    ATTRIBUTE foo OF x : TYPE IS 4;\r\nBEGIN\r\n    ASSERT x'foo(5);\r\nEND ARCHITECTURE;";
    let actual = beautify(input, settings);
    assert("attribute", input, actual);
}

function IntegrationTest25() {
    let new_line_after_symbols = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["generic"];
    let settings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let input = 'PACKAGE bitstring IS\r\n    CONSTANT x : t := X"1234";\r\n    CONSTANT y : t := O"1234";\r\n    CONSTANT z : t := X"ab";\r\n    CONSTANT b : t := B"101";\r\n    CONSTANT c : t := x"f";\r\n    CONSTANT d : t := X"a_b";\r\nEND PACKAGE;\r\nPACKAGE bitstring_error IS\r\n    CONSTANT e1 : t := O"9"; -- Error\r\nEND PACKAGE;';
    let actual = beautify(input, settings);
    assert("bitstring", input, actual);
}

function IntegrationTest26() {
    let new_line_after_symbols = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["generic"];
    let settings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let input = 'ARCHITECTURE a OF e IS\r\nBEGIN\r\n    b : BLOCK IS\r\n    BEGIN\r\n    END BLOCK;\r\n    c : BLOCK IS\r\n        SIGNAL x : INTEGER;\r\n        SIGNAL y : real;\r\n    BEGIN\r\n        x <= y;\r\n    END BLOCK;\r\nEND ARCHITECTURE;';
    let actual = beautify(input, settings);
    assert("block", input, actual);
}

function IntegrationTest20() {
    let new_line_after_symbols = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["generic"];
    let settings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let input = "process xyx (vf,fr,\r\nde -- comment\r\n)";
    let expected = "PROCESS xyx (vf, fr, \r\n             de -- comment\r\n             )";
    let actual = beautify(input, settings);
    assert("Align parameters in PROCESS", expected, actual);
}

function IntegrationTest5() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    settings.SignAlignRegional = true;
    let input = "port map(\r\ninput_1 => input_1_sig,\r\ninput_2 => input_2_sig,\r\noutput => output_sig\r\n);";
    let expected = "PORT MAP(\r\n    input_1 => input_1_sig,\r\n    input_2 => input_2_sig,\r\n    output  => output_sig\r\n);";
    let actual = beautify(input, settings);
    assert("Sign align in PORT", expected, actual);
}

function IntegrationTest6() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";","port map"];
    new_line_after_symbols.noNewLineAfter = ["generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    settings.SignAlignRegional = true;
    let input = "port map(\r\ninput_1 => input_1_sig,\r\ninput_2 => input_2_sig,\r\noutput => output_sig\r\n);";
    let expected = "PORT MAP\r\n(\r\n    input_1 => input_1_sig,\r\n    input_2 => input_2_sig,\r\n    output  => output_sig\r\n);";
    let actual = beautify(input, settings);
    assert("Sign align in PORT & new line after MAP", expected, actual);
}

function IntegrationTest7() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    settings.SignAlignRegional = true;
    let input = "entity p is\r\n  generic\r\n  (\r\n    -- INCLK\r\n    INCLK0_INPUT_FREQUENCY  : natural;\r\n\r\n    -- CLK1\r\n    CLK1_DIVIDE_BY          : natural := 1;\r\n    CLK1_MULTIPLY_BY        : unnatural:= 1;\r\n    CLK1_PHASE_SHIFT        : string := \"0\"\r\n  );\r\n	port\r\n	(\r\n		inclk0	: in std_logic  := '0';\r\n		c0		    : out std_logic ;\r\n		c1		    : out std_logic \r\n	);\r\nEND pll;";
    let expected = "ENTITY p IS\r\n    GENERIC (\r\n        -- INCLK\r\n        INCLK0_INPUT_FREQUENCY : NATURAL;\r\n\r\n        -- CLK1\r\n        CLK1_DIVIDE_BY         : NATURAL   := 1;\r\n        CLK1_MULTIPLY_BY       : unnatural := 1;\r\n        CLK1_PHASE_SHIFT       : STRING    := \"0\"\r\n    );\r\n    PORT (\r\n        inclk0 : IN std_logic := '0';\r\n        c0     : OUT std_logic;\r\n        c1     : OUT std_logic\r\n    );\r\nEND pll;";
    let actual = beautify(input, settings);
    assert("Sign align in PORT & GENERIC", expected, actual);
}

function IntegrationTest2() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["generic"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    settings.RemoveComments = true;
    let input = "architecture TB of TB_CPU is\r\n    component CPU_IF\r\n    port   -- port list\r\n    end component;\r\n    signal CPU_DATA_VALID: std_ulogic;\r\n    signal CLK, RESET: std_ulogic := '0';\r\n    constant PERIOD : time := 10 ns;\r\n    constant MAX_SIM: time := 50 * PERIOD;\r\n    begin\r\n    -- concurrent statements\r\n    end TB;"
    let expected = "ARCHITECTURE TB OF TB_CPU IS\r\n    COMPONENT CPU_IF\r\n        PORT\r\n    END COMPONENT;\r\n    SIGNAL CPU_DATA_VALID : std_ulogic;\r\n    SIGNAL CLK, RESET : std_ulogic := '0';\r\n    CONSTANT PERIOD : TIME := 10 ns;\r\n    CONSTANT MAX_SIM : TIME := 50 * PERIOD;\r\nBEGIN\r\nEND TB;";
    let actual = beautify(input, settings);
    assert("Remove comments", expected, actual);
}

function CompareString(actual: string, expected: string) {
    var l = Math.min(actual.length, expected.length);
    for (var i = 0; i < l; i++) {
        if (actual[i] != expected[i]) {
            var toEnd = Math.min(i + 50, l);
            return '\ndifferent at ' + i.toString() +
                '\nactual: "\n' + actual.substring(i, toEnd) +
                '\nexpected: "\n' + expected.substring(i, toEnd) + '"\n---' +
                "\nactual (full): \n" + actual + "\n---" +
                "\nexpected (full): \n" + expected + "\n====\n";
        }
    }
    if (actual != expected) {
        return 'actual: \n"' + actual + '"\nexpected: \n"' + expected + '"';
    }
    return true;
}

function CompareArray(actual: Array<string>, expected: Array<string>) {
    var l = Math.min(actual.length, expected.length);
    let result: string = "";
    for (var i = 0; i < l; i++) {
        if (actual[i] != expected[i]) {
            result += CompareString(actual[i], expected[i]) + "\n";
        }
    }
    if (actual.length > expected.length) {
        result += "actual has more items";
        for (var i = expected.length; i < actual.length; i++) {
            result += "actual[" + i + "] = " + actual[i];
        }
    }
    else if (actual.length < expected.length) {
        result += "expected has more items";
        for (var i = actual.length; i < expected.length; i++) {
            result += "expected[" + i + "] = " + expected[i];
        }
    }
    return true;
}