import { beautify } from "../VHDLFormatter";
import { NewLineSettings } from "../VHDLFormatter";
import { BeautifierSettings } from "../VHDLFormatter";
import { RemoveAsserts } from "../VHDLFormatter";
import { ApplyNoNewLineAfter } from "../VHDLFormatter";
import { SetNewLinesAfterSymbols } from "../VHDLFormatter";
import { beautify3 } from "../VHDLFormatter";
import { FormattedLine } from "../VHDLFormatter";
import { FormattedLineToString } from "../VHDLFormatter";
import { CompareString } from "./assert";
import { assert } from "./assert";
import { testDescriptiveCounter } from "./descriptiveCounterTests";

let testCount: number = 0;

var showUnitTests = true;//window.location.href.indexOf("http") < 0;
if (showUnitTests) {
    testCount = 0;
    IntegrationTest();

    UnitTestRemoveAsserts();
    UnitTestApplyNoNewLineAfter();
    UnitTestSetNewLinesAfterSymbols();
    UnitTestFormattedLineToString();
    UnitTestbeautify3();
    console.log("total tests: " + testCount);
    testDescriptiveCounter();
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
    Beautify3Case16();
    Beautify3Case17();
    Beautify3Case18();
    Beautify3Case19();
    Beautify3Case20();
    Beautify3Case21();
}

function Beautify3Case1() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
    let inputs: Array<string> = ["a;", "b;"];
    let expected: (FormattedLine | FormattedLine[])[] = [new FormattedLine("a;", 0), new FormattedLine("b;", 0)];
    UnitTest6(beautify3, "General", settings, inputs, expected, 0, 1, 0);
}

function Beautify3Case2() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
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
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
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
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
    let inputs: Array<string> = ["END"];
    let expected: (FormattedLine | FormattedLine[])[] = [new FormattedLine("END", 0)];
    UnitTest6(beautify3, "one line END", settings, inputs, expected, 0, 0, 0);
}

function Beautify3Case5() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
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
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
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
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
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
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
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
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
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
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
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
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
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
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
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
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
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
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
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
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
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

function Beautify3Case16() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
    let inputs: Array<string> = [
        "x <= 1 WHEN foo",
        "ELSE 2 WHEN bar",
        "ELSE 3;",
        "y <= 2;"
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("x <= 1 WHEN foo", 0),
        new FormattedLine("ELSE 2 WHEN bar", 1),
        new FormattedLine("ELSE 3;", 1),
        new FormattedLine("y <= 2;", 0)
    ];
    UnitTest6(beautify3, "one line ends with ;", settings, inputs, expected, 0, expected.length - 1, 0);
}

function Beautify3Case17() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
    let inputs: Array<string> = [
        "WITH y SELECT x <=",
        "1 WHEN a,",
        "2 WHEN b,",
        "3 WHEN OTHERS;",
        "y <= 2;"
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("WITH y SELECT x <=", 0),
        new FormattedLine("1 WHEN a,", 1),
        new FormattedLine("2 WHEN b,", 1),
        new FormattedLine("3 WHEN OTHERS;", 1),
        new FormattedLine("y <= 2;", 0)
    ];
    UnitTest6(beautify3, "WITH SELECT line ends with ;", settings, inputs, expected, 0, expected.length - 1, 0);
}

function Beautify3Case18() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
    let inputs: Array<string> = [
        "CONFIGURATION conf OF ent IS",
        "USE work.foo;",
        "ATTRIBUTE x OF y : SIGNAL IS 5;",
        "FOR arch",
        "FOR ALL : comp",
        "USE ENTITY work.foo(x);",
        "END FOR;",
        "END FOR;",
        "END CONFIGURATION;",
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("CONFIGURATION conf OF ent IS", 0),
        new FormattedLine("USE work.foo;", 1),
        new FormattedLine("ATTRIBUTE x OF y : SIGNAL IS 5;", 1),
        new FormattedLine("FOR arch", 1),
        new FormattedLine("FOR ALL : comp", 2),
        new FormattedLine("USE ENTITY work.foo(x);", 3),
        new FormattedLine("END FOR;", 2),
        new FormattedLine("END FOR;", 1),
        new FormattedLine("END CONFIGURATION;", 0)
    ];
    UnitTest6(beautify3, "configuration & for", settings, inputs, expected, 0, expected.length - 1, 0);
}

function Beautify3Case19() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
    let inputs: Array<string> = [
        "FUNCTION \" + \"(x, y : integer) return integer IS",
        "BEGIN",
        "RETURN 42;",
        "END FUNCTION \"+\";",
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("FUNCTION \" + \"(x, y : integer) return integer IS", 0),
        new FormattedLine("BEGIN", 0),
        new FormattedLine("RETURN 42;", 1),
        new FormattedLine("END FUNCTION \"+\";", 0),
    ];
    UnitTest6(beautify3, "function", settings, inputs, expected, 0, expected.length - 1, 0);
}

function Beautify3Case20() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
    let inputs: Array<string> = [
        "m <= ((1, 2, 3, 4)",
        "(5, 6, 7, 8));",
        "y <= 2;"
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("m <= ((1, 2, 3, 4)", 0),
        new FormattedLine("(5, 6, 7, 8));", 1),
        new FormattedLine("y <= 2;", 0)
    ];
    UnitTest6(beautify3, "function", settings, inputs, expected, 0, expected.length - 1, 0);
}

function Beautify3Case21() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
    let inputs: Array<string> = [
        "g: ENTITY work.foo",
        "GENERIC MAP( X => 1 )",
        "PORT MAP( a, b );",
        "h: ENTITY work.foo",
        "PORT MAP( a => open );"
    ];
    let expected: (FormattedLine | FormattedLine[])[] = [
        new FormattedLine("g: ENTITY work.foo", 0),
        new FormattedLine("GENERIC MAP( X => 1 )", 1),
        new FormattedLine("PORT MAP( a, b );", 1),
        new FormattedLine("h: ENTITY work.foo", 0),
        new FormattedLine("PORT MAP( a => open );", 1)
    ];
    UnitTest6(beautify3, "function", settings, inputs, expected, 0, expected.length - 1, 0);
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
    assertAndCountTest(testName, expected, actual);
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

function deepCopy(objectToCopy: BeautifierSettings): BeautifierSettings {
    return (JSON.parse(JSON.stringify(objectToCopy)));
}

function IntegrationTest() {
    console.log("=== IntegrationTests ===");

    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
    let input = "architecture TB of TB_CPU is\r\n    component CPU_IF\r\n    port   -- port list\r\n    end component;\r\n    signal CPU_DATA_VALID: std_ulogic;\r\n    signal CLK, RESET: std_ulogic := '0';\r\n    constant PERIOD : time := 10 ns;\r\n    constant MAX_SIM: time := 50 * PERIOD;\r\n    begin\r\n    -- concurrent statements\r\n    end TB;"
    let expected = "ARCHITECTURE TB OF TB_CPU IS\r\n    COMPONENT CPU_IF\r\n        PORT -- port list\r\n    END COMPONENT;\r\n    SIGNAL CPU_DATA_VALID : std_ulogic;\r\n    SIGNAL CLK, RESET : std_ulogic := '0';\r\n    CONSTANT PERIOD : TIME := 10 ns;\r\n    CONSTANT MAX_SIM : TIME := 50 * PERIOD;\r\nBEGIN\r\n    -- concurrent statements\r\nEND TB;";
    let actual = beautify(input, settings);
    assertAndCountTest("General", expected, actual);

    IntegrationTest2();

    let new_line_after_symbols_2: NewLineSettings = new NewLineSettings();
    new_line_after_symbols_2.newLineAfter = [];
    new_line_after_symbols_2.noNewLineAfter = ["then", ";", "generic", "port"];
    let newSettings = deepCopy(settings);
    newSettings.NewLineSettings = new_line_after_symbols_2;
    expected = "a; b; c;";
    input = "a; \r\nb;\r\n c;"
    actual = beautify(input, newSettings);
    assertAndCountTest("Remove line after ;", expected, actual);

    newSettings = deepCopy(settings);
    newSettings.RemoveAsserts = true;
    input = "architecture arch of ent is\r\nbegin\r\n    assert False report sdfjcsdfcsdj;\r\n    assert False report sdfjcsdfcsdj severity note;\r\nend architecture;";
    expected = "ARCHITECTURE arch OF ent IS\r\nBEGIN\r\nEND ARCHITECTURE;"
    actual = beautify(input, newSettings);
    assertAndCountTest("Remove asserts", expected, actual);

    input = "entity TB_DISPLAY is\r\n-- port declarations\r\nend TB_DISPLAY;\r\n\r\narchitecture TEST of TB_DISPLAY is\r\n-- signal declarations\r\nbegin\r\n-- component instance(s)\r\nend TEST;";
    expected = "ENTITY TB_DISPLAY IS\r\n    -- port declarations\r\nEND TB_DISPLAY;\r\n\r\nARCHITECTURE TEST OF TB_DISPLAY IS\r\n    -- signal declarations\r\nBEGIN\r\n    -- component instance(s)\r\nEND TEST;";
    actual = beautify(input, settings);
    assertAndCountTest("ENTITY ARCHITECTURE", expected, actual);

    IntegrationTest5();
    IntegrationTest6();
    IntegrationTest7();

    input = 'if a(3 downto 0) > "0100" then\r\na(3 downto 0) := a(3 downto 0) + "0011" ;\r\nend if ;';
    expected = 'IF a(3 DOWNTO 0) > "0100" THEN\r\n    a(3 DOWNTO 0) := a(3 DOWNTO 0) + "0011";\r\nEND IF;';
    actual = beautify(input, settings);
    assertAndCountTest("IF END IF case 1", expected, actual);

    input = "if s = '1' then\r\no <= \"010\";\r\nelse\r\no <= \"101\";\r\nend if;";
    expected = "IF s = '1' THEN\r\n    o <= \"010\";\r\nELSE\r\n    o <= \"101\";\r\nEND IF;";
    actual = beautify(input, settings);
    assertAndCountTest("IF ELSE END IF case 1", expected, actual);

    newSettings = deepCopy(settings);
    newSettings.NewLineSettings.newLineAfter.push("ELSE");
    input = "IF (s = r) THEN rr := '0'; ELSE rr := '1'; END IF;";
    expected = "IF (s = r) THEN\r\n    rr := '0';\r\nELSE\r\n    rr := '1';\r\nEND IF;";
    actual = beautify(input, newSettings);
    assertAndCountTest("IF ELSE END IF case 2", expected, actual);

    input = 'P1:process\r\nvariable x: Integer range 1 to 3;\r\nvariable y: BIT_VECTOR (0 to 1);\r\nbegin\r\n  C1: case x is\r\n      when 1 => Out_1 <= 0;\r\n      when 2 => Out_1 <= 1;\r\n  end case C1;\r\n  C2: case y is\r\n      when "00" => Out_2 <= 0;\r\n      when "01" => Out_2 <= 1;\r\n  end case C2;\r\nend process;';
    expected = 'P1 : PROCESS\r\n    VARIABLE x : INTEGER RANGE 1 TO 3;\r\n    VARIABLE y : BIT_VECTOR (0 TO 1);\r\nBEGIN\r\n    C1 : CASE x IS\r\n        WHEN 1 => Out_1 <= 0;\r\n        WHEN 2 => Out_1 <= 1;\r\n    END CASE C1;\r\n    C2 : CASE y IS\r\n        WHEN "00" => Out_2 <= 0;\r\n        WHEN "01" => Out_2 <= 1;\r\n    END CASE C2;\r\nEND PROCESS;';
    actual = beautify(input, settings);
    assertAndCountTest("WHEN CASE", expected, actual);

    input = "case READ_CPU_STATE is\r\n  when WAITING =>\r\n    if CPU_DATA_VALID = '1' then\r\n      CPU_DATA_READ  <= '1';\r\n      READ_CPU_STATE <= DATA1;\r\n    end if;\r\n  when DATA1 =>\r\n    -- etc.\r\nend case;";
    expected = "CASE READ_CPU_STATE IS\r\n    WHEN WAITING =>\r\n        IF CPU_DATA_VALID = '1' THEN\r\n            CPU_DATA_READ <= '1';\r\n            READ_CPU_STATE <= DATA1;\r\n        END IF;\r\n    WHEN DATA1 =>\r\n        -- etc.\r\nEND CASE;";
    actual = beautify(input, settings);
    assertAndCountTest("WHEN CASE & IF", expected, actual);

    input = "entity aa is\r\n    port (a : in std_logic;\r\n          b : in std_logic;\r\n         );\r\nend aa;\r\narchitecture bb of aa is\r\n   component cc\r\n    port(\r\n         a : in std_logic;\r\n         b : in std_logic;\r\n        );\r\n    end cc;\r\n\r\nbegin\r\n  C : cc port map (\r\n          long => a,\r\n          b => b\r\n        );\r\nend;";
    expected = "ENTITY aa IS\r\n    PORT (\r\n        a : IN std_logic;\r\n        b : IN std_logic;\r\n    );\r\nEND aa;\r\nARCHITECTURE bb OF aa IS\r\n    COMPONENT cc\r\n        PORT (\r\n            a : IN std_logic;\r\n            b : IN std_logic;\r\n        );\r\n    END cc;\r\n\r\nBEGIN\r\n    C : cc PORT MAP(\r\n        long => a,\r\n        b => b\r\n    );\r\nEND;";
    actual = beautify(input, settings);
    assertAndCountTest("PORT MAP", expected, actual);

    input = "entity aa is\r\n    port (a : in std_logic;\r\n          b : in std_logic;\r\n         );\r\n    port (a : in std_logic;\r\n          b : in std_logic;\r\n         );\r\nend aa;\r\narchitecture bb of aa is\r\n   component cc\r\n    port(\r\n         a : in std_logic;\r\n         b : in std_logic;\r\n        );\r\n    port(\r\n         a : in std_logic;\r\n         b : in std_logic;\r\n        );\r\n    end cc;\r\n\r\nbegin\r\n  C : cc port map (\r\n          long => a,\r\n          b => b\r\n        );\r\n  D : cc port map (\r\n          long => a,\r\n          b => b\r\n        );\r\nend;";
    expected = "ENTITY aa IS\r\n    PORT (\r\n        a : IN std_logic;\r\n        b : IN std_logic;\r\n    );\r\n    PORT (\r\n        a : IN std_logic;\r\n        b : IN std_logic;\r\n    );\r\nEND aa;\r\nARCHITECTURE bb OF aa IS\r\n    COMPONENT cc\r\n        PORT (\r\n            a : IN std_logic;\r\n            b : IN std_logic;\r\n        );\r\n        PORT (\r\n            a : IN std_logic;\r\n            b : IN std_logic;\r\n        );\r\n    END cc;\r\n\r\nBEGIN\r\n    C : cc PORT MAP(\r\n        long => a,\r\n        b => b\r\n    );\r\n    D : cc PORT MAP(\r\n        long => a,\r\n        b => b\r\n    );\r\nEND;";
    actual = beautify(input, settings);
    assertAndCountTest("Multiple PORT MAPs", expected, actual);

    input = "port (a : in std_logic;\r\n b : in std_logic;\r\n);";
    expected = "PORT\r\n(\r\n    a : IN std_logic;\r\n    b : IN std_logic;\r\n);";
    new_line_after_symbols_2 = new NewLineSettings();
    new_line_after_symbols_2.newLineAfter = ["then", ";", "generic", "port"];
    newSettings = deepCopy(settings);
    newSettings.NewLineSettings = new_line_after_symbols_2;
    actual = beautify(input, newSettings);
    assertAndCountTest("New line after PORT", expected, actual);

    newSettings = deepCopy(settings);
    newSettings.NewLineSettings.newLineAfter = [];
    input = "component a is\r\nport( Data : inout Std_Logic_Vector(7 downto 0););\r\nend component a;";
    expected = "COMPONENT a IS\r\n    PORT (Data : INOUT Std_Logic_Vector(7 DOWNTO 0););\r\nEND COMPONENT a;";
    actual = beautify(input, newSettings);
    assertAndCountTest("New line after PORT (single line)", expected, actual);

    //IntegrationTest20();

    input = "architecture a of b is\r\nbegin\r\n    process (w)\r\n    variable t : std_logic_vector (4 downto 0) ;\r\nbegin\r\n    a := (others => '0') ;\r\nend process ;\r\nend a;";
    expected = "ARCHITECTURE a OF b IS\r\nBEGIN\r\n    PROCESS (w)\r\n        VARIABLE t : std_logic_vector (4 DOWNTO 0);\r\n    BEGIN\r\n        a := (OTHERS => '0');\r\n    END PROCESS;\r\nEND a;";
    actual = beautify(input, newSettings);
    assertAndCountTest("Double BEGIN", expected, actual);

    let newSettings2 = deepCopy(newSettings);
    newSettings2.SignAlignAll = true;
    newSettings2.NewLineSettings.newLineAfter = ["then", ";", "generic", "port"];
    newSettings2.NewLineSettings.noNewLineAfter = [];
    input = "entity a is\r\n    port ( w  : in  std_logic_vector (7 downto 0) ;\r\n           w_s : out std_logic_vector (3 downto 0) ; ) ;\r\nend a ;\r\narchitecture b of a is\r\nbegin\r\n    process ( w )\r\n    variable t : std_logic_vector (4 downto 0) ;\r\n    variable bcd     : std_logic_vector (11 downto 0) ;\r\nbegin\r\n    b(2 downto 0) := w(7 downto 5) ;\r\n    t         := w(4 downto 0) ;\r\n    w_s <= b(11 downto 8) ;\r\n    w <= b(3  downto 0) ;\r\nend process ;\r\nend b ;";
    expected = "ENTITY a IS\r\n    PORT\r\n    (\r\n        w   : IN std_logic_vector (7 DOWNTO 0);\r\n        w_s : OUT std_logic_vector (3 DOWNTO 0);\r\n    );\r\nEND a;\r\nARCHITECTURE b OF a IS\r\nBEGIN\r\n    PROCESS (w)\r\n        VARIABLE t   : std_logic_vector (4 DOWNTO 0);\r\n        VARIABLE bcd : std_logic_vector (11 DOWNTO 0);\r\n    BEGIN\r\n        b(2 DOWNTO 0) := w(7 DOWNTO 5);\r\n        t             := w(4 DOWNTO 0);\r\n        w_s <= b(11 DOWNTO 8);\r\n        w   <= b(3 DOWNTO 0);\r\n    END PROCESS;\r\nEND b;";
    actual = beautify(input, newSettings2);
    assertAndCountTest("Align signs in all places", expected, actual);

    IntegrationTest23();
    IntegrationTest24();
    IntegrationTest25();
    IntegrationTest26();
    IntegrationTest27();
    IntegrationTest28();
    IntegrationTest29();
    IntegrationTest30();
    IntegrationTest31();
    IntegrationTest32();
    IntegrationTest33();
    IntegrationTest34();
    IntegrationTest35();
    IntegrationTest36();
    IntegrationTest37();
    IntegrationTest38();
    IntegrationTest39();
    IntegrationTest40();
    IntegrationTest41();
    IntegrationTest42();
    IntegrationTest43();
    IntegrationTest44();
    IntegrationTest45();
    IntegrationTest46();
    IntegrationTest47();
    IntegrationTest48();
    IntegrationTest49();
    IntegrationTest50();
    IntegrationTest51();
    IntegrationTest52();
    IntegrationTest53();
    IntegrationTest54();
    IntegrationTest55();
    IntegrationTest56();
    IntegrationTest57();
    IntegrationTest58();
    IntegrationTest59();
    IntegrationTest60();
    IntegrationTest61();
    IntegrationTest62();
    IntegrationTest63();
    IntegrationTest64();
    IntegrationTest65();
    IntegrationTest66();
    IntegrationTest67();
    IntegrationTest68();
    IntegrationTest69();
    IntegrationTest70();
    IntegrationTest71();
    IntegrationTest72();
    IntegrationTest73();
    IntegrationTest74();
    IntegrationTest75();
    IntegrationTest76();
    IntegrationTest77();
    IntegrationTest78();
}

function IntegrationTest23() {
    let settings = GetDefaultSettings("\t");
    let input = "PACKAGE p IS\r\n	TYPE int_array IS ARRAY (INTEGER RANGE <>) OF INTEGER;\r\n	TYPE ten_ints IS ARRAY (1 TO 10) OF INTEGER;\r\n	TYPE chars IS (A, B, C);\r\n	TYPE char_counts IS ARRAY (chars) OF INTEGER;\r\n	TYPE two_d IS ARRAY (1 TO 3, 4 TO 6) OF INTEGER;\r\n	TYPE ab_chars IS ARRAY (chars RANGE A TO B) OF INTEGER;\r\nEND PACKAGE;";
    let actual = beautify(input, settings);
    assertAndCountTest("Type array", input, actual);
}

function IntegrationTest24() {
    let settings = GetDefaultSettings();
    let input = "ARCHITECTURE a OF e IS\r\n    ATTRIBUTE foo : INTEGER;\r\n    ATTRIBUTE foo OF x : SIGNAL IS 5;\r\n    ATTRIBUTE foo OF x : COMPONENT IS 5;\r\n    ATTRIBUTE foo OF x : LABEL IS 6;\r\n    ATTRIBUTE foo OF x : TYPE IS 4;\r\nBEGIN\r\n    ASSERT x'foo(5);\r\nEND ARCHITECTURE;";
    let actual = beautify(input, settings);
    assertAndCountTest("attribute", input, actual);
}

function IntegrationTest25() {
    let settings = GetDefaultSettings();
    let input = 'PACKAGE bitstring IS\r\n    CONSTANT x : t := X"1234";\r\n    CONSTANT y : t := O"1234";\r\n    CONSTANT z : t := X"ab";\r\n    CONSTANT b : t := B"101";\r\n    CONSTANT c : t := x"f";\r\n    CONSTANT d : t := X"a_b";\r\nEND PACKAGE;\r\nPACKAGE bitstring_error IS\r\n    CONSTANT e1 : t := O"9"; -- Error\r\nEND PACKAGE;';
    let actual = beautify(input, settings);
    assertAndCountTest("bitstring", input, actual);
}

function IntegrationTest26() {
    let settings = GetDefaultSettings();
    let input = 'ARCHITECTURE a OF e IS\r\nBEGIN\r\n    b : BLOCK IS\r\n    BEGIN\r\n    END BLOCK;\r\n    c : BLOCK IS\r\n        SIGNAL x : INTEGER;\r\n        SIGNAL y : real;\r\n    BEGIN\r\n        x <= y;\r\n    END BLOCK;\r\nEND ARCHITECTURE;';
    let actual = beautify(input, settings);
    assertAndCountTest("block", input, actual);
}

function IntegrationTest27() {
    let settings = GetDefaultSettings("	");
    let input = 'CONTEXT widget_context IS\r\n	LIBRARY ieee;\r\n	USE ieee.std_logic_1164.ALL, ieee.numeric_std.ALL;\r\n	USE widget_lib.widget_defs.ALL;\r\n	USE widget_lib.widget_comps.ALL;\r\nEND CONTEXT;\r\n\r\nCONTEXT dongle_context IS\r\n	LIBRARY widget_lib;\r\n	CONTEXT widget_lib.widget_context;\r\nEND CONTEXT;\r\n\r\nLIBRARY foo;\r\nUSE foo.moo;\r\n\r\nCONTEXT bad IS -- Error\r\nEND CONTEXT;';
    let actual = beautify(input, settings);
    assertAndCountTest("context", input, actual);
}

function IntegrationTest28() {
    let settings = GetDefaultSettings("	");
    let input = 'ARCHITECTURE foo OF bar IS\r\n	SIGNAL \\foo bar\\ : INTEGER;\r\n	SIGNAL \\a\\\\b\\ : INTEGER;\r\n	SIGNAL \\Thing!!! \\ : INTEGER;\r\n	SIGNAL \\name\\ : INTEGER;\r\n	SIGNAL name : INTEGER;\r\nBEGIN\r\n	\\foo.bar.baz\\ <= \\hello\\;\r\nEND ARCHITECTURE;';
    let actual = beautify(input, settings);
    assertAndCountTest("extended \\ 28", input, actual);
}

function IntegrationTest29() {
    let settings = GetDefaultSettings("	");
    let input = 'PACKAGE func IS\r\n	FUNCTION add(x, y : INTEGER; y : IN INTEGER) RETURN INTEGER;\r\n	IMPURE FUNCTION naughty RETURN INTEGER;\r\n	FUNCTION "+"(x, y : INTEGER) RETURN INTEGER;\r\nEND PACKAGE;';
    let actual = beautify(input, settings);
    assertAndCountTest("extended \\ 29", input, actual);
}

function IntegrationTest30() {
    let settings = GetDefaultSettings("	");
    let input = 'ARCHITECTURE a OF g IS\r\nBEGIN\r\n\r\n	g1 : IF foo GENERATE\r\n		SIGNAL x : INTEGER;\r\n	BEGIN\r\n		x <= 5;\r\n	END GENERATE;\r\n\r\n	g2 : IF bar GENERATE\r\n		g2a : IF x < 5 GENERATE\r\n			g <= 7;\r\n		END GENERATE;\r\n	END GENERATE;\r\n\r\n	g3 : FOR i IN 1 TO 40 GENERATE\r\n		SIGNAL x : INTEGER;\r\n	BEGIN\r\n		f <= h;\r\n	END GENERATE;\r\n\r\n	g4 : FOR i IN x\'RANGE GENERATE\r\n	END GENERATE;\r\n\r\n	g5 : FOR i IN x\'RANGE GENERATE\r\n	BEGIN\r\n	END GENERATE;\r\n\r\n	g6 : FOR i IN 1 TO 3 GENERATE\r\n		COMPONENT sub_ent IS\r\n			PORT (val : OUT NATURAL);\r\n		END COMPONENT sub_ent; -- OK\r\n	BEGIN\r\n	END GENERATE;\r\n\r\n	g7 : IF true GENERATE\r\n		PROCEDURE doit IS -- OK\r\n		BEGIN\r\n			write(OUTPUT, "OK." & LF);\r\n		END PROCEDURE doit;\r\n	BEGIN\r\n	END GENERATE g7;\r\n\r\nEND ARCHITECTURE;';
    let actual = beautify(input, settings);
    assertAndCountTest("generate", input, actual);
}

function IntegrationTest31() {
    let settings = GetDefaultSettings("	");
    let input = 'ENTITY ent IS\r\nEND ENTITY;\r\n\r\nARCHITECTURE a OF ent IS\r\nBEGIN\r\n	main : PROCESS\r\n	BEGIN\r\n		REPORT """""";\r\n		WAIT;\r\n	END PROCESS;\r\nEND ARCHITECTURE;';
    let actual = beautify(input, settings);
    assertAndCountTest("report \"\"", input, actual);
}

function IntegrationTest32() {
    let settings = GetDefaultSettings("	");
    let input = 'PACKAGE p IS\r\n\r\n	TYPE SharedCounter IS PROTECTED\r\n		PROCEDURE increment (N : INTEGER := 1);\r\n		PROCEDURE decrement (N : INTEGER := 1);\r\n		IMPURE FUNCTION value RETURN INTEGER;\r\n	END PROTECTED SharedCounter;\r\n\r\n	TYPE SharedCounter IS PROTECTED BODY\r\n		VARIABLE counter : INTEGER := 0;\r\n\r\n		PROCEDURE increment (N : INTEGER := 1) IS\r\n		BEGIN\r\n			counter := counter + N;\r\n		END PROCEDURE increment;\r\n\r\n		PROCEDURE decrement (N : INTEGER := 1) IS\r\n		BEGIN\r\n			counter := counter - N;\r\n		END PROCEDURE decrement;\r\n\r\n		IMPURE FUNCTION value RETURN INTEGER IS\r\n		BEGIN\r\n			RETURN counter;\r\n		END FUNCTION value;\r\n	END PROTECTED BODY;\r\n\r\nEND PACKAGE;';
    let actual = beautify(input, settings);
    assertAndCountTest("protected", input, actual);
}

function IntegrationTest33() {
    let settings = GetDefaultSettings("	");
    let input = 'ARCHITECTURE a OF b IS\r\nBEGIN\r\n\r\n	-- Wait statements\r\n	PROCESS IS\r\n	BEGIN\r\n		WAIT FOR 1 ns;\r\n		block_forever : WAIT;\r\n		WAIT ON x;\r\n		WAIT ON x, y, z(1 DOWNTO 0);\r\n		WAIT ON w(1) FOR 2 ns;\r\n		WAIT UNTIL x = 3;\r\n		WAIT UNTIL y = x FOR 5 ns;\r\n		WAIT ON x UNTIL x = 2 FOR 1 ns;\r\n	END PROCESS;\r\n\r\n	-- Blocking assignment\r\n	PROCESS IS\r\n		VARIABLE a : INTEGER;\r\n	BEGIN\r\n		a := 2;\r\n		a := a + (a * 3);\r\n	END PROCESS;\r\n\r\n	-- Assert and report\r\n	PROCESS IS\r\n	BEGIN\r\n		ASSERT true;\r\n		ASSERT false SEVERITY note;\r\n		ASSERT 1 > 2 REPORT "oh no" SEVERITY failure;\r\n		REPORT "hello";\r\n		REPORT "boo" SEVERITY error;\r\n	END PROCESS;\r\n\r\n	-- Function calls\r\n	PROCESS IS\r\n	BEGIN\r\n		x := foo(1, 2, 3);\r\n		a := "ABS"(b);\r\n	END PROCESS;\r\n\r\n	-- If\r\n	PROCESS IS\r\n	BEGIN\r\n		IF true THEN\r\n			x := 1;\r\n		END IF;\r\n		test : IF true THEN\r\n			x := y;\r\n		END IF test;\r\n		IF x > 2 THEN\r\n			x := 5;\r\n		ELSE\r\n			y := 2;\r\n		END IF;\r\n		IF x > 3 THEN\r\n			NULL;\r\n		ELSIF x > 5 THEN\r\n			NULL;\r\n		ELSIF true THEN\r\n			NULL;\r\n		ELSE\r\n			x := 2;\r\n		END IF;\r\n	END PROCESS;\r\n\r\n	-- Null\r\n	PROCESS IS\r\n	BEGIN\r\n		NULL;\r\n	END PROCESS;\r\n\r\n	-- Return\r\n	PROCESS IS\r\n	BEGIN\r\n		RETURN 4 * 4;\r\n	END PROCESS;\r\n\r\n	-- While\r\n	PROCESS IS\r\n	BEGIN\r\n		WHILE n > 0 LOOP\r\n			n := n - 1;\r\n		END LOOP;\r\n		LOOP\r\n			NULL;\r\n		END LOOP;\r\n	END PROCESS;\r\n\r\n	-- Delayed assignment\r\n	PROCESS IS\r\n	BEGIN\r\n		x <= 4 AFTER 5 ns;\r\n		x <= 5 AFTER 1 ns, 7 AFTER 8 ns;\r\n		x <= 5, 7 AFTER 8 ns;\r\n		x <= INERTIAL 5;\r\n		x <= TRANSPORT 4 AFTER 2 ns;\r\n		x <= REJECT 4 ns INERTIAL 6 AFTER 10 ns;\r\n	END PROCESS;\r\n\r\n	-- For\r\n	PROCESS IS\r\n	BEGIN\r\n		FOR i IN 0 TO 10 LOOP\r\n			NULL;\r\n		END LOOP;\r\n		FOR i IN foo\'RANGE LOOP\r\n			NULL;\r\n		END LOOP;\r\n	END PROCESS;\r\n\r\n	-- Exit\r\n	PROCESS IS\r\n	BEGIN\r\n		EXIT;\r\n		EXIT WHEN x = 1;\r\n	END PROCESS;\r\n\r\n	-- Procedure call\r\n	PROCESS IS\r\n	BEGIN\r\n		foo(x, y, 1);\r\n		bar;\r\n		foo(a => 1, b => 2, 3);\r\n	END PROCESS;\r\n\r\n	-- Case\r\n	PROCESS IS\r\n	BEGIN\r\n		CASE x IS\r\n			WHEN 1 =>\r\n				NULL;\r\n			WHEN 2 =>\r\n				NULL;\r\n			WHEN 3 | 4 =>\r\n				NULL;\r\n			WHEN OTHERS =>\r\n				NULL;\r\n		END CASE;\r\n	END PROCESS;\r\n\r\n	-- Next\r\n	PROCESS IS\r\n	BEGIN\r\n		NEXT;\r\n		NEXT WHEN foo = 5;\r\n	END PROCESS;\r\n\r\n	-- Signal assignment to aggregate\r\n	PROCESS IS\r\n	BEGIN\r\n		(x, y, z) <= foo;\r\n	END PROCESS;\r\n\r\n	-- Case statement range bug\r\n	PROCESS IS\r\n	BEGIN\r\n		CASE f IS\r\n			WHEN 1 =>\r\n				FOR i IN x\'RANGE LOOP\r\n				END LOOP;\r\n		END CASE;\r\n	END PROCESS;\r\n\r\nEND ARCHITECTURE;';
    let actual = beautify(input, settings);
    assertAndCountTest("sequence", input, actual);
}

function IntegrationTest34() {
    let settings = GetDefaultSettings("	");
    let input = 'ARCHITECTURE a OF b IS\r\n	FOR x : y USE ENTITY work.foo;\r\n	FOR x1, x2 : y USE ENTITY work.foo;\r\n	FOR x : y USE ENTITY work.foo(bar);\r\n	FOR x : y USE ENTITY work.foo(bar)\r\n		GENERIC MAP(a => 1)\r\n		PORT MAP(b => g);\r\n	FOR ALL : y USE CONFIGURATION yah;\r\n	FOR OTHERS : y USE OPEN;\r\nBEGIN\r\nEND ARCHITECTURE;';
    let actual = beautify(input, settings);
    assertAndCountTest("spec", input, actual);
}

function IntegrationTest35() {
    let settings = GetDefaultSettings("	");
    let input = 'ARCHITECTURE a OF b IS\r\n	TYPE my_int IS RANGE 0 TO 100;\r\n	SIGNAL x : my_int := 2;\r\n\r\n	TYPE resistance IS RANGE 0 TO 10000000\r\n	UNITS\r\n		ohm;\r\n		kohm = 1000 ohm;\r\n		Mohm = 1000 kohm;\r\n	END UNITS;\r\n	SIGNAL r : resistance := 100 ohm;\r\n\r\n	SUBTYPE big_r IS resistance RANGE 1000 TO 2000;\r\n\r\n	SUBTYPE my_small_int IS my_int RANGE 0 TO 5;\r\n\r\n	SUBTYPE foo IS my_int RANGE 2 TO my_int\'high;\r\n\r\n	SUBTYPE rint IS resolved my_int;\r\n\r\n	TYPE p IS ACCESS my_int;\r\n\r\n	TYPE f IS FILE OF my_int;\r\n\r\n	FILE f1 : f OPEN READ_MODE IS "foo";\r\n\r\n	FILE f2 : f IS "bar";\r\n\r\n	FILE f3 : f;\r\n\r\n	TYPE r1 IS RECORD\r\n		a : INTEGER;\r\n		b : INTEGER;\r\n		c : foo(1 TO 5);\r\n	END RECORD;\r\n\r\n	FILE f4 : f IS OUT "bar"; -- VHDL-87 compat\r\n\r\n	FILE f5 : f IS IN "bar"; -- VHDL-87 compat\r\n\r\n	TYPE r2 IS RECORD\r\n		x : INTEGER;\r\n	END RECORD r2;\r\n\r\nBEGIN\r\n\r\nEND ARCHITECTURE;';
    let actual = beautify(input, settings);
    assertAndCountTest("types", input, actual);
}

function IntegrationTest36() {
    let settings = GetDefaultSettings("	");
    let input = 'ARCHITECTURE test OF bufr_test IS\r\nBEGIN\r\n\r\n	BUF_DATA_CLK : BUFR\r\n	GENERIC MAP(\r\n		BUFR_DIVIDE => "BYPASS",\r\n		SIM_DEVICE => "7SERIES")\r\n	PORT MAP(\r\n		O => amu_adc_dco,\r\n		CE => \'1\',\r\n		CLR => \'0\',\r\n		I => amu_adc_dco_i);\r\n\r\nEND ARCHITECTURE;';
    let actual = beautify(input, settings);
    assertAndCountTest("new line after (", input, actual);
}

function IntegrationTest37() {
    let settings = GetDefaultSettings("	");
    let input = 'ENTITY nest1 IS\r\nEND ENTITY;\r\nARCHITECTURE test OF nest1 IS\r\nBEGIN\r\n	PROCESS IS\r\n		VARIABLE x : INTEGER := 2;\r\n		VARIABLE y : bit_vector(7 DOWNTO 0);\r\n		IMPURE FUNCTION add_to_x(y : INTEGER) RETURN INTEGER IS\r\n			IMPURE FUNCTION do_it RETURN INTEGER IS\r\n			BEGIN\r\n				RETURN x + y;\r\n			END FUNCTION;\r\n		BEGIN\r\n			RETURN do_it;\r\n		END FUNCTION;\r\n	BEGIN\r\n		ASSERT add_to_x(5) = 7;\r\n		WAIT;\r\n	END PROCESS;\r\nEND ARCHITECTURE;';
    let actual = beautify(input, settings);
    assertAndCountTest("nested functions", input, actual);
}

function IntegrationTest38() {
    let settings = GetDefaultSettings("	");
    let input = 'REPORT INTEGER\'image(a) & " " & INTEGER\'image(b) & " "\r\n	& INTEGER\'image(c) & " " & INTEGER\'image(d) & " "\r\n	& INTEGER\'image(e) & " " & INTEGER\'image(f);\r\nWAIT;';
    let actual = beautify(input, settings);
    assertAndCountTest("report severl lines", input, actual);
}

function IntegrationTest39() {
    let settings = GetDefaultSettings("	");
    let input = 'assert v /  = ( X  "01", X  "02" )  ;';
    let expected = 'ASSERT v /= (X "01", X "02");';
    let actual = beautify(input, settings);
    assertAndCountTest("signs", expected, actual);
}

function IntegrationTest40() {
    let settings = GetDefaultSettings();
    let input = 'PORT MAP\r\n    (we => NOT cpu_rw, spo => ram_dout);\r\nPORT MAP(we => NOT cpu_rw, spo => ram_dout);\r\nPORT MAP\r\n(\r\n    we => NOT cpu_rw, spo => ram_dout\r\n);';
    let actual = beautify(input, settings);
    assertAndCountTest("port map in newline", input, actual);
}

function IntegrationTest41() {
    let settings = GetDefaultSettings("	");
    let input = 'ARCHITECTURE test3 OF test IS\r\n	COMPONENT comp IS PORT (a : BOOLEAN);\r\n	END COMPONENT;\r\n	SIGNAL s_ok : BOOLEAN;\r\nBEGIN\r\n	comp PORT MAP(a => s_ok); -- unlabeled component instantiation\r\nEND ARCHITECTURE;';
    let actual = beautify(input, settings);
    assertAndCountTest("end component", input, actual);
}

function IntegrationTest42() {
    let settings = GetDefaultSettings("	");
    let input = 'ENTITY bar IS\r\nEND ENTITY bar;\r\nENTITY \\foo\\ IS\r\n	PORT (test : IN BIT);\r\nEND ENTITY \\foo\\;\r\nARCHITECTURE structural OF \\foo\\ IS\r\nBEGIN -- architecture structural\r\nEND ARCHITECTURE structural;\r\nARCHITECTURE structural OF bar IS\r\n	SIGNAL test : BIT;\r\nBEGIN -- architecture structural\r\n	foo_1 : ENTITY work.\\foo\\\r\n		PORT MAP(test => test);\r\nEND ARCHITECTURE structural;';
    let actual = beautify(input, settings);
    assertAndCountTest("end component", input, actual);
}

function IntegrationTest43() {
    let settings = GetDefaultSettings("	");
    let input = 'ARCHITECTURE test OF issue122 IS\r\n	IMPURE FUNCTION func(x : INTEGER) RETURN INTEGER IS\r\n		IMPURE FUNCTION nested RETURN INTEGER IS\r\n		BEGIN\r\n			RETURN x;\r\n		END FUNCTION;\r\n		VARIABLE v : INTEGER := nested;\r\n	BEGIN\r\n		RETURN v;\r\n	END FUNCTION;\r\nBEGIN\r\nEND ARCHITECTURE;';
    let actual = beautify(input, settings);
    assertAndCountTest("end component", input, actual);
}

function IntegrationTest44() {
    let settings = GetDefaultSettings("	");
    let input = 'REPORT\n"A_ARITH_MOD_tester.main Tester is now ready. A total of " &\nINTEGER\'image(totalTests) & " tests have been detected.";';
    let expected = 'REPORT\r\n	"A_ARITH_MOD_tester.main Tester is now ready. A total of " &\r\n	INTEGER\'image(totalTests) & " tests have been detected.";';
    let actual = beautify(input, settings);
    assertAndCountTest("ingore keywords in quotes", expected, actual);
}

function IntegrationTest45() {
    let settings = GetDefaultSettings();
    settings.KeywordCase = "lowercase";
    settings.Indentation = "	";
    let input = 'REPORT\n"A_ARITH_MOD_tester.main Tester is now ready. A total OF " &\nINTEGER\'image(totalTests) & " tests have been detected.";';
    let expected = 'report\r\n	"A_ARITH_MOD_tester.main Tester is now ready. A total OF " &\r\n	integer\'image(totalTests) & " tests have been detected.";';
    let actual = beautify(input, settings);
    assertAndCountTest("ingore keywords in quotes & convert to lowercase", expected, actual);
}

function IntegrationTest46() {
    let settings = GetDefaultSettings();
    settings.KeywordCase = "lowercase";
    let input = 'impure function delay(\r\n    l : integer\r\n) return time is\r\n    variable r : real;\r\nbegin\r\n    result := 2ps;\r\n    return result;\r\nend function;';
    let actual = beautify(input, settings);
    assertAndCountTest("impure function indent", input, actual);
}

function IntegrationTest47() {
    let settings = GetDefaultSettings();
    settings.KeywordCase = "lowercase";
    settings.Indentation = " ";
    let input = 'result := 1\r\n 1\r\n + 1; -- hello';
    let actual = beautify(input, settings);
    assertAndCountTest("multiline expression & comment", input, actual);
}

function IntegrationTest48() {
    let settings = GetDefaultSettings();
    settings.KeywordCase = "lowercase";
    let input = 'function delay(\r\n    l : integer\r\n) return time is\r\n    variable r : real;\r\nbegin\r\n    result := 2ps;\r\n    return result;\r\nend function;';
    let actual = beautify(input, settings);
    assertAndCountTest("function indent", input, actual);
}

function IntegrationTest49() {
    let settings = GetDefaultSettings();
    settings.SignAlignRegional = true;
    settings.SignAlignKeyWords = ["PROCEDURE"];
    let input = 'PROCEDURE wait_until(\r\n    SIGNAL a : IN data_status;\r\n    b        : data_status\r\n);';
    let actual = beautify(input, settings);
    assertAndCountTest("align sign in procedure", input, actual);
}

function IntegrationTest50() {
    let settings = GetDefaultSettings();
    settings.SignAlignRegional = true;
    let input = 'PROCEDURE wait_until(\r\n    SIGNAL a : IN data_status;\r\n    b : data_status\r\n);';
    let actual = beautify(input, settings);
    assertAndCountTest("does not align sign in procedure", input, actual);
}

function IntegrationTest51() {
    let settings = GetDefaultSettings();
    settings.SignAlignAll = true;
    let input = 'architecture behaviour of a is\r\nbegin\r\n    main : process\r\n        variable b : e := (others => DR_INIT);\r\n        variable c, d : positive := 8;\r\n    begin\r\n    end process main;\r\nend architecture behaviour;';
    let expected = 'ARCHITECTURE behaviour OF a IS\r\nBEGIN\r\n    main : PROCESS\r\n        VARIABLE b    : e        := (OTHERS => DR_INIT);\r\n        VARIABLE c, d : POSITIVE := 8;\r\n    BEGIN\r\n    END PROCESS main;\r\nEND ARCHITECTURE behaviour;';
    let actual = beautify(input, settings);
    assertAndCountTest("process with name", expected, actual);
}

function IntegrationTest52() {
    let settings = GetDefaultSettings();
    settings.KeywordCase = "lowercase";
    let input = 'function a(\r\n    b : integer\r\n    c : integer\r\n) return integer;\r\n\r\nimpure function a(\r\n    b : integer\r\n    c : integer\r\n) return integer;\r\n\r\nfunction a(\r\n    b : integer\r\n    c : integer\r\n) return integer;';
    let actual = beautify(input, settings);
    assertAndCountTest("function without sequential statements", input, actual);
}

function IntegrationTest53() {
    let settings = GetDefaultSettings();
    settings.KeywordCase = "lowercase";
    let input = 'function a(\r\n    b : integer\r\n    c : integer\r\n) return integer;\r\n\r\nimpure function a(\r\n    b : integer\r\n    c : integer\r\n) return integer;\r\n\r\nfunction a(\r\n    b : integer\r\n    c : integer\r\n) return integer;';
    let actual = beautify(input, settings);
    assertAndCountTest("function without sequential statements, without new line", input, actual);
}

function IntegrationTest54() {
    let settings = GetDefaultSettings();
    let input = 'PACKAGE a IS\r\n    FUNCTION b(\r\n        c : INTEGER\r\n    ) RETURN INTEGER;\r\nEND PACKAGE;';
    let actual = beautify(input, settings);
    assertAndCountTest("package & function without sequential statements", input, actual);
}

function IntegrationTest55() {
    let settings = GetDefaultSettings();
    settings.SignAlignAll = true;
    let input = 'main :\r\nPROCESS\r\n    VARIABLE b : a := (OTHERS => DR_INIT);\r\nBEGIN';
    let actual = beautify(input, settings);
    assertAndCountTest("package with label and align all symbols", input, actual);
}

function IntegrationTest56() {
    let settings = GetDefaultSettings();
    settings.SignAlignAll = true;
    let input = 'a  <= (2 => DR_ONE, 5 => DR_ZERO);\r\nbc <= (32 => DR_ONE);';
    let actual = beautify(input, settings);
    assertAndCountTest("package with label and align all symbols", input, actual);
}

function IntegrationTest57() {
    let settings = GetDefaultSettings();
    let input = 'result := (\'-\', \'1\');';
    let actual = beautify(input, settings);
    assertAndCountTest("- in quotes", input, actual);
}

function IntegrationTest58() {
    let settings = GetDefaultSettings();
    settings.KeywordCase = "lowercase";
    let input = 'package body a is\r\n    procedure b(\r\n        signal a : in boolean;\r\n        b : boolean\r\n    ) is\r\n    begin\r\n        a = 1\r\n    end procedure b;\r\nend a;';
    let actual = beautify(input, settings);
    assertAndCountTest("package body", input, actual);
}

function IntegrationTest59() {
    let settings = GetDefaultSettings();
    settings.KeywordCase = "lowercase";
    let input = 'package body a is\r\n    procedure b(\r\n        signal a : in boolean;\r\n        b : boolean) is\r\n    begin\r\n        a = 1\r\n    end procedure b;\r\nend a;';
    let actual = beautify(input, settings);
    assertAndCountTest("package body 2", input, actual);
}

function IntegrationTest60() {
    let settings = GetDefaultSettings();
    let input = 'abcde : FOR i IN 0 TO b - 1 GENERATE\r\n    b : A_REG_MOD\r\nEND GENERATE aaa;';
    let actual = beautify(input, settings);
    assertAndCountTest("generate with label", input, actual);
}

function IntegrationTest61() {
    let settings = GetDefaultSettings();
    settings.NewLineSettings.newLineAfter.push("port map")
    let input = 'port\r\nmap(\r\na => a(i)\r\n);';
    let expected = 'PORT MAP\r\n(\r\n    a => a(i)\r\n);';
    let actual = beautify(input, settings);
    assertAndCountTest("port new line map", expected, actual);
}

function IntegrationTest62() {
    let settings = GetDefaultSettings();
    settings.NewLineSettings.newLineAfter.push("port map")
    let input = 'port map(\r\na => a(i)\r\n);';
    let expected = 'PORT MAP\r\n(\r\n    a => a(i)\r\n);';
    let actual = beautify(input, settings);
    assertAndCountTest("port map new line", expected, actual);
}

function IntegrationTest63() {
    let settings = GetDefaultSettings();
    settings.NewLineSettings.newLineAfter.push("port", "port map");
    let input = 'reg : a PORT\r\nMAP(\r\nb => c(i)\r\n);';
    let expected = 'reg : a PORT MAP\r\n(\r\n    b => c(i)\r\n);';
    let actual = beautify(input, settings);
    assertAndCountTest("port map new line 2", expected, actual);
}

function IntegrationTest64() {
    let settings = GetDefaultSettings();
    let input = 'reg : a PORT\r\nMAP(\r\nb => c(i)\r\n);';
    let expected = 'reg : a PORT MAP(\r\n    b => c(i)\r\n);';
    let actual = beautify(input, settings);
    assertAndCountTest("port map no new line", expected, actual);
}

function IntegrationTest65() {
    let settings = GetDefaultSettings();
    settings.NewLineSettings.noNewLineAfter.push("port", "port map");
    let input = 'reg : a PORT\r\nMAP\r\n(\r\nb => c(i)\r\n);';
    let expected = 'reg : a PORT MAP(\r\n    b => c(i)\r\n);';
    let actual = beautify(input, settings);
    assertAndCountTest("port map no new line 2", expected, actual);
}

function IntegrationTest66() {
    let settings = GetDefaultSettings();
    settings.NewLineSettings.noNewLineAfter.push("port", "port map");
    let input = 'component a is\r\n      generic (b\r\n         );\r\n      port (\r\n          c\r\n	 );\r\n    end component;\r\n-- anything1\r\n-- anything2';
    let expected = 'COMPONENT a IS\r\n    GENERIC (\r\n        b\r\n    );\r\n    PORT (\r\n        c\r\n    );\r\nEND COMPONENT;\r\n-- anything1\r\n-- anything2';
    let actual = beautify(input, settings);
    assertAndCountTest("component generic", expected, actual);
}

function IntegrationTest67() {
    let settings = GetDefaultSettings();
    let input = 'type STATE_TYPE is (\r\n      A,\r\nB,\r\n    C);\r\nA';
    let expected = 'TYPE STATE_TYPE IS (\r\n    A,\r\n    B,\r\n    C);\r\nA';
    let actual = beautify(input, settings);
    assertAndCountTest("multiline enumerated type is", expected, actual);
}

function IntegrationTest68() {
    let settings = GetDefaultSettings();
    let input = 'type STATE_TYPE is (A,  B, C);\r\nA';
    let expected = 'TYPE STATE_TYPE IS (A, B, C);\r\nA';
    let actual = beautify(input, settings);
    assertAndCountTest("single line enumerated type is", expected, actual);
}

function IntegrationTest69() {
    let settings = GetDefaultSettings();
    let input = 'type STATE_TYPE is (\r\n      A,\r\nB,\r\n    C\r\n);\r\nA';
    let expected = 'TYPE STATE_TYPE IS (\r\n    A,\r\n    B,\r\n    C\r\n);\r\nA';
    let actual = beautify(input, settings);
    assertAndCountTest("multiline enumerated type is", expected, actual);
}

function IntegrationTest70() {
    let settings = GetDefaultSettings();
    let input = 'test\r\n        := test';
    let expected = 'test\r\n:= test';
    let actual = beautify(input, settings);
    assertAndCountTest("multiline assignment", expected, actual);
}

function IntegrationTest71() {
    let settings = GetDefaultSettings();
    let input = 'VARIABLE \\#$)!?\\ : INTEGER;\r\nVARIABLE \\try this in verilog\\ : BIT;\r\nVARIABLE \\Buffer\\ : BIT;';
    let expected = 'VARIABLE \\#$)!?\\ : INTEGER;\r\nVARIABLE \\try this in verilog\\ : BIT;\r\nVARIABLE \\Buffer\\ : BIT;';
    let actual = beautify(input, settings);
    assertAndCountTest("backslash, extended indentifier", expected, actual);
}

function IntegrationTest72() {
    let settings = GetDefaultSettings();
    let input = 'test := 12e+6';
    let expected = 'test := 12e+6';
    let actual = beautify(input, settings);
    assertAndCountTest("scientific notation", expected, actual);
}

function IntegrationTest73() {
    let settings = GetDefaultSettings();
    settings.EndOfLine = "\n";
    let input = 'test := test;\ntest := test;';
    let actual = beautify(input, settings);
    assertAndCountTest("end of line", input, actual);
}

function IntegrationTest74() {
    let settings = GetDefaultSettings();
    settings.EndOfLine = " EOF ";
    let input = 'test := test;\ntest := test;';
    let expected = 'test := test; EOF test := test;';
    let actual = beautify(input, settings);
    assertAndCountTest("end of line 2", expected, actual);
}

function IntegrationTest75() {
    let settings = GetDefaultSettings();
    settings.SignAlignAll = true;
    let input = 'test := loooong; -- test\r\ntest := short; -- test';
    let expected = 'test := loooong; -- test\r\ntest := short;   -- test';
    let actual = beautify(input, settings);
    assertAndCountTest("align comments", expected, actual);
}

function IntegrationTest76() {
    let settings = GetDefaultSettings();
    settings.SignAlignAll = true;
    let input = "a <= (b => '000'); -- test\r\nlooong <= (others => '0'); -- test";
    let expected = "a      <= (b      => '000'); -- test\r\nlooong <= (OTHERS => '0');   -- test";
    let actual = beautify(input, settings);
    assertAndCountTest("align <= => signs", expected, actual);
}

function IntegrationTest77() {
    let settings = GetDefaultSettings();
    settings.SignAlignAll = true;
    let input = "WHEN -2;\r\nSIGNAL +0;";
    let actual = beautify(input, settings);
    assertAndCountTest("negative sign and number", input, actual);
}

function IntegrationTest78() {
    let settings = GetDefaultSettings();
    settings.SignAlignAll = true;
    let input = "sfixed(4 downto - 18);\r\nx <= to_sfixed( - 2.3, x);\r\nresize(x + 1, 4, - 18) when others;";
    let expected = "sfixed(4 DOWNTO -18);\r\nx <= to_sfixed(-2.3, x);\r\nresize(x + 1, 4, -18) WHEN OTHERS;";
    let actual = beautify(input, settings);
    assertAndCountTest("negative sign and number", expected, actual);
}

function GetDefaultSettings(indentation: string = "    "): BeautifierSettings {
    let new_line_after_symbols = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["generic"];
    let settings = getDefaultBeautifierSettings(new_line_after_symbols, indentation);
    return settings;
}

function getDefaultBeautifierSettings(newLineSettings: NewLineSettings, indentation: string = "    "): BeautifierSettings {
    return new BeautifierSettings(false, false, false, false, false, "uppercase", indentation, newLineSettings, "\r\n");
}

function IntegrationTest20() {
    let settings = GetDefaultSettings();
    let input = "process xyx (vf,fr,\r\nde -- comment\r\n)";
    let expected = "PROCESS xyx (vf, fr, \r\n             de -- comment\r\n             )";
    let actual = beautify(input, settings);
    assertAndCountTest("Align parameters in PROCESS", expected, actual);
}

function IntegrationTest5() {
    let settings = GetDefaultSettings();
    settings.SignAlignRegional = true;
    settings.SignAlignKeyWords = ["PORT"];
    let input = "port map(\r\ninput_1 => input_1_sig,\r\ninput_2 => input_2_sig,\r\noutput => output_sig\r\n);";
    let expected = "PORT MAP(\r\n    input_1 => input_1_sig,\r\n    input_2 => input_2_sig,\r\n    output  => output_sig\r\n);";
    let actual = beautify(input, settings);
    assertAndCountTest("Sign align in PORT", expected, actual);
}

function IntegrationTest6() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";", "port map"];
    new_line_after_symbols.noNewLineAfter = ["generic"];
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
    settings.SignAlignRegional = true;
    settings.SignAlignKeyWords = ["PORT"];
    let input = "port map(\r\ninput_1 => input_1_sig,\r\ninput_2 => input_2_sig,\r\noutput => output_sig\r\n);";
    let expected = "PORT MAP\r\n(\r\n    input_1 => input_1_sig,\r\n    input_2 => input_2_sig,\r\n    output  => output_sig\r\n);";
    let actual = beautify(input, settings);
    assertAndCountTest("Sign align in PORT & new line after MAP", expected, actual);
}

function IntegrationTest7() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
    settings.SignAlignRegional = true;
    settings.SignAlignKeyWords = ["PORT", "GENERIC"];
    let input = "entity p is\r\n  generic\r\n  (\r\n    -- INCLK\r\n    INCLK0_INPUT_FREQUENCY  : natural;\r\n\r\n    -- CLK1\r\n    CLK1_DIVIDE_BY          : natural := 1;\r\n    CLK1_MULTIPLY_BY        : unnatural:= 1;\r\n    CLK1_PHASE_SHIFT        : string := \"0\"\r\n  );\r\n	port\r\n	(\r\n		inclk0	: in std_logic  := '0';\r\n		c0		    : out std_logic ;\r\n		c1		    : out std_logic \r\n	);\r\nEND pll;";
    let expected = "ENTITY p IS\r\n    GENERIC (\r\n        -- INCLK\r\n        INCLK0_INPUT_FREQUENCY : NATURAL;\r\n\r\n        -- CLK1\r\n        CLK1_DIVIDE_BY         : NATURAL   := 1;\r\n        CLK1_MULTIPLY_BY       : unnatural := 1;\r\n        CLK1_PHASE_SHIFT       : STRING    := \"0\"\r\n    );\r\n    PORT (\r\n        inclk0 : IN std_logic := '0';\r\n        c0     : OUT std_logic;\r\n        c1     : OUT std_logic\r\n    );\r\nEND pll;";
    let actual = beautify(input, settings);
    assertAndCountTest("Sign align in PORT & GENERIC", expected, actual);
}

function IntegrationTest2() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["generic"];
    let settings = getDefaultBeautifierSettings(new_line_after_symbols);
    settings.RemoveComments = true;
    let input = "architecture TB of TB_CPU is\r\n    component CPU_IF\r\n    port   -- port list\r\n    end component;\r\n    signal CPU_DATA_VALID: std_ulogic;\r\n    signal CLK, RESET: std_ulogic := '0';\r\n    constant PERIOD : time := 10 ns;\r\n    constant MAX_SIM: time := 50 * PERIOD;\r\n    begin\r\n    -- concurrent statements\r\n    end TB;"
    let expected = "ARCHITECTURE TB OF TB_CPU IS\r\n    COMPONENT CPU_IF\r\n        PORT\r\n    END COMPONENT;\r\n    SIGNAL CPU_DATA_VALID : std_ulogic;\r\n    SIGNAL CLK, RESET : std_ulogic := '0';\r\n    CONSTANT PERIOD : TIME := 10 ns;\r\n    CONSTANT MAX_SIM : TIME := 50 * PERIOD;\r\nBEGIN\r\nEND TB;";
    let actual = beautify(input, settings);
    assertAndCountTest("Remove comments", expected, actual);
}

function assertAndCountTest(testName: string, expected: string, actual: string, message?: undefined) {
    testCount++;
    return assert(testName, expected, actual, message);
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