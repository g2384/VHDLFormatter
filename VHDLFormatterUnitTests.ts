import { beautify } from "./VHDLFormatter";
import { indentDecode } from "./VHDLFormatter";
import { NewLineSettings } from "./VHDLFormatter";
import { BeautifierSettings } from "./VHDLFormatter";

var showUnitTests = true;//window.location.href.indexOf("http") < 0;
if (showUnitTests) {
    UnitTest();
    UnitTestIndentDecode();
}

interface Function {
    readonly name: string;
}

function UnitTestIndentDecode() {
    console.log("=== IndentDecode ===");
    UnitTest2(indentDecode, "one blankspace", " ", "one blankspace");
    UnitTest2(indentDecode, "mixed chars", " A ", "one blankspace & one A & one blankspace");
    UnitTest2(indentDecode, "4 blankspaces", "    ", "four blankspace");
    UnitTest2(indentDecode, "9 blankspaces", "         ", "many blankspace");
}

function assert(testName, expected, actual, message?) {
    var result = CompareString(actual, expected);
    if (result != true) {
        console.log(testName + " failed: " + result);
    }
    else {
        //console.log(testName + " pass");
    }
}

type StringCallback = (text: string) => string;

function UnitTest2(func: StringCallback, testName: string, inputs, expected: string) {
    let actual: string = func(inputs);
    assert(testName, expected, actual);
}

function deepCopy(objectToCopy: BeautifierSettings): BeautifierSettings {
    return (JSON.parse(JSON.stringify(objectToCopy)));
}

function UnitTest() {
    let new_line_after_symbols: NewLineSettings = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["Then", ";"];
    let settings: BeautifierSettings = new BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let input = "architecture TB of TB_CPU is\r\n    component CPU_IF\r\n    port   -- port list\r\n    end component;\r\n    signal CPU_DATA_VALID: std_ulogic;\r\n    signal CLK, RESET: std_ulogic := '0';\r\n    constant PERIOD : time := 10 ns;\r\n    constant MAX_SIM: time := 50 * PERIOD;\r\n    begin\r\n    -- concurrent statements\r\n    end TB;"
    let expected = "ARCHITECTURE TB OF TB_CPU IS\r\n    COMPONENT CPU_IF\r\n        PORT -- port list\r\n    END COMPONENT;\r\n    SIGNAL CPU_DATA_VALID : std_ulogic;\r\n    SIGNAL CLK, RESET : std_ulogic := '0';\r\n    CONSTANT PERIOD : TIME := 10 ns;\r\n    CONSTANT MAX_SIM : TIME := 50 * PERIOD;\r\nBEGIN\r\n    -- concurrent statements\r\nEND TB;";
    let actual = beautify(input, settings);
    console.log("General", actual == expected);

    let newSettings = deepCopy(settings);
    newSettings.RemoveComments = true;
    expected = "ARCHITECTURE TB OF TB_CPU IS\r\n    COMPONENT CPU_IF\r\n        PORT \r\n    END COMPONENT;\r\n    SIGNAL CPU_DATA_VALID : std_ulogic;\r\n    SIGNAL CLK, RESET : std_ulogic := '0';\r\n    CONSTANT PERIOD : TIME := 10 ns;\r\n    CONSTANT MAX_SIM : TIME := 50 * PERIOD;\r\nBEGIN\r\nEND TB;";
    actual = beautify(input, newSettings);
    console.log("Remove comments", actual == expected);

    input = "entity TB_DISPLAY is\r\n-- port declarations\r\nend TB_DISPLAY;\r\n\r\narchitecture TEST of TB_DISPLAY is\r\n-- signal declarations\r\nbegin\r\n-- component instance(s)\r\nend TEST;";
    expected = "ENTITY TB_DISPLAY IS\r\n    -- port declarations\r\nEND TB_DISPLAY;\r\n\r\nARCHITECTURE TEST OF TB_DISPLAY IS\r\n    -- signal declarations\r\nBEGIN\r\n    -- component instance(s)\r\nEND TEST;";
    actual = beautify(input, settings);
    console.log("ENTITY ARCHITECTURE", CompareString(actual, expected));

    newSettings = deepCopy(settings);
    newSettings.SignAlign = true;
    input = "port map(\r\ninput_1 => input_1_sig,\r\ninput_2 => input_2_sig,\r\noutput => output_sig\r\n);";
    expected = "PORT MAP(\r\n    input_1  => input_1_sig, \r\n    input_2  => input_2_sig, \r\n    output   => output_sig\r\n);";
    actual = beautify(input, newSettings);
    console.log("Sign align in PORT", actual == expected);

    input = 'if a(3 downto 0) > "0100" then\r\na(3 downto 0) := a(3 downto 0) + "0011" ;\r\nend if ;';
    expected = 'IF a(3 DOWNTO 0) > "0100" THEN\r\n    a(3 DOWNTO 0) := a(3 DOWNTO 0) + "0011";\r\nEND IF;';
    actual = beautify(input, settings);
    console.log("IF END IF case 1", CompareString(actual, expected));

    input = "if s = '1' then\r\no <= \"010\";\r\nelse\r\no <= \"101\";\r\nend if;";
    expected = "IF s = '1' THEN\r\n    o <= \"010\";\r\nELSE\r\n    o <= \"101\";\r\nEND IF;";
    actual = beautify(input, settings);
    console.log("IF ELSE END IF case 1", actual == expected);

    input = "IF (s = r) THEN rr := '0'; ELSE rr := '1'; END IF;";
    expected = "IF (s = r) THEN\r\n    rr := '0';\r\nELSE\r\n    rr := '1';\r\nEND IF;";
    actual = beautify(input, settings);
    console.log("IF ELSE END IF case 2", actual == expected);

    input = 'P1:process\r\nvariable x: Integer range 1 to 3;\r\nvariable y: BIT_VECTOR (0 to 1);\r\nbegin\r\n  C1: case x is\r\n      when 1 => Out_1 <= 0;\r\n      when 2 => Out_1 <= 1;\r\n  end case C1;\r\n  C2: case y is\r\n      when "00" => Out_2 <= 0;\r\n      when "01" => Out_2 <= 1;\r\n  end case C2;\r\nend process;';
    expected = 'P1 : PROCESS\r\n    VARIABLE x : INTEGER RANGE 1 TO 3;\r\n    VARIABLE y : BIT_VECTOR (0 TO 1);\r\nBEGIN\r\n    C1 : CASE x IS\r\n        WHEN 1 => Out_1 <= 0;\r\n        WHEN 2 => Out_1 <= 1;\r\n    END CASE C1;\r\n    C2 : CASE y IS\r\n        WHEN "00" => Out_2 <= 0;\r\n        WHEN "01" => Out_2 <= 1;\r\n    END CASE C2;\r\nEND PROCESS;';
    actual = beautify(input, settings);
    console.log("WHEN CASE", CompareString(actual, expected));

    input = "case READ_CPU_STATE is\r\n  when WAITING =>\r\n    if CPU_DATA_VALID = '1' then\r\n      CPU_DATA_READ  <= '1';\r\n      READ_CPU_STATE <= DATA1;\r\n    end if;\r\n  when DATA1 =>\r\n    -- etc.\r\nend case;";
    expected = "CASE READ_CPU_STATE IS\r\n    WHEN WAITING => \r\n        IF CPU_DATA_VALID = '1' THEN\r\n            CPU_DATA_READ <= '1';\r\n            READ_CPU_STATE <= DATA1;\r\n        END IF;\r\n    WHEN DATA1 => \r\n        -- etc.\r\nEND CASE;";
    actual = beautify(input, settings);
    console.log("WHEN CASE & IF", CompareString(actual, expected));

    input = "entity aa is\r\n    port (a : in std_logic;\r\n          b : in std_logic;\r\n         );\r\nend aa;\r\narchitecture bb of aa is\r\n   component cc\r\n    port(\r\n         a : in std_logic;\r\n         b : in std_logic;\r\n        );\r\n    end cc;\r\n\r\nbegin\r\n  C : cc port map (\r\n          long => a,\r\n          b => b\r\n        );\r\nend;";
    expected = "ENTITY aa IS\r\n    PORT (\r\n        a : IN std_logic;\r\n        b : IN std_logic;\r\n    );\r\nEND aa;\r\nARCHITECTURE bb OF aa IS\r\n    COMPONENT cc\r\n        PORT (\r\n            a : IN std_logic;\r\n            b : IN std_logic;\r\n        );\r\n    END cc;\r\n\r\nBEGIN\r\n    C : cc\r\n    PORT MAP(\r\n        long => a, \r\n        b => b\r\n    );\r\nEND;";
    actual = beautify(input, settings);
    console.log("PORT MAP", CompareString(actual, expected));

    input = "entity aa is\r\n    port (a : in std_logic;\r\n          b : in std_logic;\r\n         );\r\n    port (a : in std_logic;\r\n          b : in std_logic;\r\n         );\r\nend aa;\r\narchitecture bb of aa is\r\n   component cc\r\n    port(\r\n         a : in std_logic;\r\n         b : in std_logic;\r\n        );\r\n    port(\r\n         a : in std_logic;\r\n         b : in std_logic;\r\n        );\r\n    end cc;\r\n\r\nbegin\r\n  C : cc port map (\r\n          long => a,\r\n          b => b\r\n        );\r\n  D : cc port map (\r\n          long => a,\r\n          b => b\r\n        );\r\nend;";
    expected = "ENTITY aa IS\r\n    PORT (\r\n        a : IN std_logic;\r\n        b : IN std_logic;\r\n    );\r\n    PORT (\r\n        a : IN std_logic;\r\n        b : IN std_logic;\r\n    );\r\nEND aa;\r\nARCHITECTURE bb OF aa IS\r\n    COMPONENT cc\r\n        PORT (\r\n            a : IN std_logic;\r\n            b : IN std_logic;\r\n        );\r\n        PORT (\r\n            a : IN std_logic;\r\n            b : IN std_logic;\r\n        );\r\n    END cc;\r\n\r\nBEGIN\r\n    C : cc\r\n    PORT MAP(\r\n        long => a, \r\n        b => b\r\n    );\r\n    D : cc\r\n    PORT MAP(\r\n        long => a, \r\n        b => b\r\n    );\r\nEND;";
    actual = beautify(input, settings);
    console.log("Multiple PORT MAPs", CompareString(actual, expected));

    input = "port (a : in std_logic;\r\n b : in std_logic;\r\n);";
    expected = "PORT \r\n(\r\n    a : IN std_logic;\r\n    b : IN std_logic;\r\n);";
    let new_line_after_symbols_2: NewLineSettings = new NewLineSettings();
    new_line_after_symbols_2.newLineAfter = ["Then", ";", "generic", "port"];
    newSettings = deepCopy(settings);
    newSettings.NewLineSettings = new_line_after_symbols_2;
    actual = beautify(input, newSettings);
    console.log("New line aster PORT", CompareString(actual, expected));

    input = "component a is\r\nport( Data : inout Std_Logic_Vector(7 downto 0););\r\nend component a;";
    expected = "COMPONENT a IS\r\n    PORT (Data : INOUT Std_Logic_Vector(7 DOWNTO 0););\r\nEND COMPONENT a;";
    actual = beautify(input, newSettings);
    console.log("New line aster PORT (single line)", CompareString(actual, expected));

    input = "process xyx (vf,fr,\r\nde -- comment\r\n)";
    expected = "PROCESS xyx (vf, fr, \r\n             de -- comment\r\n             )";
    actual = beautify(input, newSettings);
    console.log("Align parameters in PROCESS", CompareString(actual, expected));

    input = "architecture a of b is\r\nbegin\r\n    process (w)\r\n    variable t : std_logic_vector (4 downto 0) ;\r\nbegin\r\n    a := (others => '0') ;\r\nend process ;\r\nend a;";
    expected = "ARCHITECTURE a OF b IS\r\nBEGIN\r\n    PROCESS (w)\r\n    VARIABLE t : std_logic_vector (4 DOWNTO 0);\r\n    BEGIN\r\n        a := (OTHERS => '0');\r\n    END PROCESS;\r\nEND a;";
    actual = beautify(input, newSettings);
    console.log("Double BEGIN", CompareString(actual, expected));

    let newSettings2 = deepCopy(newSettings);
    newSettings2.SignAlignAll = true;
    input = "entity a is\r\n    port ( w  : in  std_logic_vector (7 downto 0) ;\r\n           w_s : out std_logic_vector (3 downto 0) ; ) ;\r\nend a ;\r\narchitecture b of a is\r\nbegin\r\n    process ( w )\r\n    variable t : std_logic_vector (4 downto 0) ;\r\n    variable bcd     : std_logic_vector (11 downto 0) ;\r\nbegin\r\n    b(2 downto 0) := w(7 downto 5) ;\r\n    t         := w(4 downto 0) ;\r\n    w_s <= b(11 downto 8) ;\r\n    w <= b(3  downto 0) ;\r\nend process ;\r\nend b ;";
    expected = "ENTITY a IS\r\n    PORT \r\n    (\r\n        w   : IN std_logic_vector (7 DOWNTO 0);\r\n        w_s : OUT std_logic_vector (3 DOWNTO 0); \r\n    );\r\nEND a;\r\nARCHITECTURE b OF a IS\r\nBEGIN\r\n    PROCESS (w)\r\n    VARIABLE t   : std_logic_vector (4 DOWNTO 0);\r\n    VARIABLE bcd : std_logic_vector (11 DOWNTO 0);\r\n    BEGIN\r\n        b(2 DOWNTO 0) := w(7 DOWNTO 5);\r\n        t             := w(4 DOWNTO 0);\r\n        w_s <= b(11 DOWNTO 8);\r\n        w   <= b(3 DOWNTO 0);\r\n    END PROCESS;\r\nEND b;";
    actual = beautify(input, newSettings2);
    console.log("Align signs in all places", CompareString(actual, expected));

    input = "begin\r\n  P0 : process(input)\r\n  variable value: Integer;\r\n  begin\r\n    result(i) := '0';\r\n  end process P0;\r\nend behavior;";
    expected = "BEGIN\r\n    P0 : PROCESS (input)\r\n        VARIABLE value : INTEGER;\r\n    BEGIN\r\n        result(i) := '0';\r\n    END PROCESS P0;\r\nEND behavior;";
    actual = beautify(input, newSettings);
    console.log("Indent after Begin", CompareString(actual, expected));
}

function CompareString(actual: string, expected: string) {
    var l = Math.min(actual.length, expected.length);
    for (var i = 0; i < l; i++) {
        if (actual[i] != expected[i]) {
            var toEnd = Math.min(i + 50, l);
            return '\ndifferent at ' + i.toString() + '\nactual: "\n' + actual.substring(i, toEnd) + '\nexpected: "\n' + expected.substring(i, toEnd) + '"' + "\nactual: \n" + actual;
        }
    }
    if (actual != expected) {
        return 'actual: \n"' + actual + '"\nexpected: \n"' + expected + '"';
    }
    return true;
}