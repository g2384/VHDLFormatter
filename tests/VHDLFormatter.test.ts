import { beautify, signAlignSettings } from "../VHDLFormatter";
import { NewLineSettings } from "../VHDLFormatter";
import { BeautifierSettings } from "../VHDLFormatter";
import { RemoveAsserts } from "../VHDLFormatter";
import { ApplyNoNewLineAfter } from "../VHDLFormatter";
import { SetNewLinesAfterSymbols } from "../VHDLFormatter";
import { beautify3 } from "../VHDLFormatter";
import { FormattedLine } from "../VHDLFormatter";
import { FormattedLineToString } from "../VHDLFormatter";

describe('VHDLFormatter', function () {
    it('do not format block comments', function () {
        let settings = GetDefaultSettings();
        let input = 'a;\r\n/*a;  \r\n  b;\r\nport ( ) ;\r\n/*\r\n*/c;';
        let result = beautify(input, settings);
        expect(result).toBe(input);
    });

    it('do not format block comments 2', function () {
        let settings = GetDefaultSettings();
        let input = 'a;/*a;*/b;\r\nc;';
        let result = beautify(input, settings);
        expect(result).toBe(input);
    });

    it('do not format block comments 3', function () {
        let settings = GetDefaultSettings();
        let input = 'a;\r\n/*a;*//*\r\n*/c;';
        let result = beautify(input, settings);
        expect(result).toBe(input);
    });

    it('do not format block comments 4', function () {
        let settings = GetDefaultSettings();
        let input = '/*\r\nwoof\r\n*//*\r\nwoof\r\n*//*\r\nwoof\r\n*/';
        let result = beautify(input, settings);
        expect(result).toBe(input);
    });

    it('add new line at the end of the file', function () {
        let settings = GetDefaultSettings();
        settings.AddNewLine = true;
        let input = 'test';
        let result = beautify(input, settings);
        expect(result).toBe("test\r\n");
    });

    it('upper case types', function () {
        let settings = GetDefaultSettings();
        let input = "x : string;\r\ny : std_logic_vector;";
        let result = beautify(input, settings);
        expect(result).toBe("x : STRING;\r\ny : STD_LOGIC_VECTOR;");
    });

    it('package ends with ;', function () {
        let settings = GetDefaultSettings();
        let input = "PACKAGE p IS NEW work.p_template\r\n    GENERIC MAP(N => N);\r\nUSE p.ALL;";
        let result = beautify(input, settings);
        expect(result).toBe(input);
    });

    it('package ends with ; (same line)', function () {
        let settings = GetDefaultSettings();
        let input = "PACKAGE p IS NEW work.p_template;\r\nUSE p.ALL;";
        let result = beautify(input, settings);
        expect(result).toBe(input);
    });

    it('align in, out, inout, buffer', function () {
        let settings = GetDefaultSettings();
        settings.SignAlignSettings.isAll = true;
        let input = "Incr, Load, Clock : IN     BIT;\r\nCarry             : OUT    BIT;\r\nData_Out          : BUFFER bit_vector(7 DOWNTO 0);\r\nData_In           : IN     bit_vector(7 DOWNTO 0)";
        let result = beautify(input, settings);
        expect(result).toBe(input);
    });

    it('align sign in PORT & GENERIC', function () {
        let new_line_after_symbols: NewLineSettings = new NewLineSettings();
        new_line_after_symbols.newLineAfter = ["then", ";"];
        let settings = getDefaultBeautifierSettings(new_line_after_symbols);
        settings.SignAlignSettings = new signAlignSettings(true, false, "global", ["PORT", "GENERIC"]);
        let input = "entity p is\r\n  generic\r\n  (\r\n    -- INCLK\r\n    INCLK0_INPUT_FREQUENCY  : natural;\r\n\r\n    -- CLK1\r\n    CLK1_DIVIDE_BY          : natural := 1;\r\n    CLK1_MULTIPLY_BY        : unnatural:= 1;\r\n    CLK1_PHASE_SHIFT        : string := \"0\"\r\n  );\r\n	port\r\n	(\r\n		inclk0	: in bit  := '0';\r\n		c0		    : out bit;\r\n		c1		    : out bit \r\n	);\r\nEND pll;";
        let expected = "ENTITY p IS\r\n    GENERIC (\r\n        -- INCLK\r\n        INCLK0_INPUT_FREQUENCY : NATURAL;\r\n\r\n        -- CLK1\r\n        CLK1_DIVIDE_BY         : NATURAL   := 1;\r\n        CLK1_MULTIPLY_BY       : unnatural := 1;\r\n        CLK1_PHASE_SHIFT       : STRING    := \"0\"\r\n    );\r\n    PORT (\r\n        inclk0 : IN  BIT := '0';\r\n        c0     : OUT BIT;\r\n        c1     : OUT BIT\r\n    );\r\nEND pll;";
        let result = beautify(input, settings);
        expect(result).toBe(expected);
    });

    it('align signs in all places', function () {
        let setting = getDefaultBeautifierSettings(new NewLineSettings());
        setting.SignAlignSettings = new signAlignSettings(false, true, "", []);
        setting.NewLineSettings.newLineAfter = ["then", ";", "generic", "port"];
        setting.NewLineSettings.noNewLineAfter = [];
        let input = "entity a is\r\n    port ( w  : in  bit;\r\n           w_s : out bit; ) ;\r\nend a ;\r\narchitecture b of a is\r\nbegin\r\n    process ( w )\r\n    variable t : bit;\r\n    variable bcd     : bit;\r\nbegin\r\n    b(2 downto 0) := w(7 downto 5) ;\r\n    t         := w(4 downto 0) ;\r\n    w_s <= b(11 downto 8) ;\r\n    w <= b(3  downto 0) ;\r\nend process ;\r\nend b;";
        let expected = "ENTITY a IS\r\n    PORT\r\n    (\r\n        w   : IN  BIT;\r\n        w_s : OUT BIT;\r\n    );\r\nEND a;\r\nARCHITECTURE b OF a IS\r\nBEGIN\r\n    PROCESS (w)\r\n        VARIABLE t   : BIT;\r\n        VARIABLE bcd : BIT;\r\n    BEGIN\r\n        b(2 DOWNTO 0) := w(7 DOWNTO 5);\r\n        t             := w(4 DOWNTO 0);\r\n        w_s <= b(11 DOWNTO 8);\r\n        w   <= b(3 DOWNTO 0);\r\n    END PROCESS;\r\nEND b;";
        let result = beautify(input, setting);
        expect(result).toBe(expected);
    });

    it('semicolon blocks are aligned', function () {
        let settings = GetDefaultSettings();
        let input = 'OUT <= In0 AFTER 2ns WHEN "00",\r\n       In1 AFTER 2ns WHEN "01",\r\n       In2 AFTER 2ns WHEN "10",\r\n       In3 AFTER 2ns WHEN "11";';
        let result = beautify(input, settings);
        expect(result).toBe(input);
    });

    it('align comments', function () {
        let settings = GetDefaultSettings();
        settings.SignAlignSettings = new signAlignSettings(false, true, "", [], true);
        let input = 'test := loooong; -- test\r\ntest := short; -- test';
        let expected = 'test := loooong; -- test\r\ntest := short;   -- test';
        let result = beautify(input, settings);
        expect(result).toBe(expected);
    });

    it('do not align comments', function () {
        let settings = GetDefaultSettings();
        settings.SignAlignSettings = new signAlignSettings(false, true, "", [], false);
        let input = 'test := loooong; -- test\r\ntest := short; -- test';
        let result = beautify(input, settings);
        expect(result).toBe(input);
    });

    it('support invalid line', function () {
        let settings = GetDefaultSettings();
        settings.SignAlignSettings = new signAlignSettings(false, true, "", [], false);
        let input = '(5 * 32 - 1 DOWNTO 0) := (\r\n);';
        let result = beautify(input, settings);
        expect(result).toBe(input);
    });

    it('align initial values for constant', function () {
        let settings = GetDefaultSettings();
        settings.SignAlignSettings = new signAlignSettings(false, true, "", [], false);
        let input = 'CONSTANT ADDR_MATCH : STD_LOGIC_VECTOR(5 * 32 - 1 DOWNTO 0) := (\r\n    X"00000000" &\r\n    X"00010000" &\r\n    X"00020000" &\r\n    X"00030000" &\r\n    X"00040000"\r\n);';
        let result = beautify(input, settings);
        expect(result).toBe(input);
    });

    it('one-line initial values for constant', function () {
        let settings = GetDefaultSettings();
        settings.SignAlignSettings = new signAlignSettings(false, true, "", [], false);
        let input = "CONSTANT Vcc   : SIGNAL             := '1'; --logic 1 constant\r\nCONSTANT zero4 : bit_vector(0 TO 3) := ('0', '0', '0', '0');\r\nCONSTANT Vcc   : SIGNAL             := '1'; --logic 1 constant";
        let result = beautify(input, settings);
        expect(result).toBe(input);
    });

    it('indent assignment statement (multiline, no comment)', function () {
        let settings = GetDefaultSettings();
        settings.SignAlignSettings = new signAlignSettings(false, true, "", [], false);
        let input = "CONSTANT Vcc : SIGNAL :=\r\n'1'; --logic 1 constant\r\nCONSTANT zero4 : bit_vector(0 TO 3) :=\r\n('0', '0', '0', '0');";
        let output = "CONSTANT Vcc : SIGNAL :=\r\n    '1'; --logic 1 constant\r\nCONSTANT zero4 : bit_vector(0 TO 3) :=\r\n    ('0', '0', '0', '0');";
        let result = beautify(input, settings);
        expect(result).toBe(output);
    })

    it('indent assignment statement (with comment)', function () {
        let settings = GetDefaultSettings();
        settings.SignAlignSettings = new signAlignSettings(false, true, "", [], false);
        let input = "CONSTANT Vcc : SIGNAL := --logic 1 constant\r\n'1';\r\nCONSTANT zero4 : bit_vector(0 TO 3) :=--test\r\n('0', '0', '0', '0');";
        let output = "CONSTANT Vcc : SIGNAL := --logic 1 constant\r\n    '1';\r\nCONSTANT zero4 : bit_vector(0 TO 3) := --test\r\n    ('0', '0', '0', '0');";
        let result = beautify(input, settings);
        expect(result).toBe(output);
    })

    it('indent assignment statement (multi line)', function () {
        let settings = GetDefaultSettings();
        settings.SignAlignSettings = new signAlignSettings(false, true, "", [], false);
        let input = [
            "CONSTANT ALMOST_EMPTY_OFFSET : bit_vector(12 DOWNTO 0) :=",
            "    to_bitvector(STD_ULOGIC_VECTOR(to_unsigned(C_M_AXI_BURST_LEN - 1, 13)));",
            "CONSTANT ALMOST_FULL_OFFSET : bit_vector(12 DOWNTO 0) :=",
            "    to_bitvector(STD_ULOGIC_VECTOR(to_unsigned(C_M_AXI_BURST_LEN - 1, 13)));"
        ];
        let output = [
            "CONSTANT ALMOST_EMPTY_OFFSET : bit_vector(12 DOWNTO 0) :=",
            "    to_bitvector(STD_ULOGIC_VECTOR(to_unsigned(C_M_AXI_BURST_LEN - 1, 13)));",
            "CONSTANT ALMOST_FULL_OFFSET : bit_vector(12 DOWNTO 0) :=",
            "    to_bitvector(STD_ULOGIC_VECTOR(to_unsigned(C_M_AXI_BURST_LEN - 1, 13)));"
        ];
        let result = beautifyTestHelper(input, settings);
        expect(result).toStrictEqual(output);
    })

    it('indent assignment statement (multi line (2))', function () {
        let settings = GetDefaultSettings();
        settings.SignAlignSettings = new signAlignSettings(false, true, "", [], false);
        let input = [
            "CONSTANT ALMOST_EMPTY_OFFSET : bit_vector(12 DOWNTO 0) :=",
            "to_bitvector(",
            "STD_ULOGIC_VECTOR(",
            "to_unsigned(",
            "C_M_AXI_BURST_LEN - 1, 13)));",
            "CONSTANT ALMOST_FULL_OFFSET : bit_vector(12 DOWNTO 0) :=",
            "to_bitvector(",
            "STD_ULOGIC_VECTOR(",
            "to_unsigned(",
            "C_M_AXI_BURST_LEN - 1, 13)));"
        ];
        let output = [
            "CONSTANT ALMOST_EMPTY_OFFSET : bit_vector(12 DOWNTO 0) :=",
            "    to_bitvector(",
            "    STD_ULOGIC_VECTOR(",
            "    to_unsigned(",
            "    C_M_AXI_BURST_LEN - 1, 13)));",
            "CONSTANT ALMOST_FULL_OFFSET : bit_vector(12 DOWNTO 0) :=",
            "    to_bitvector(",
            "    STD_ULOGIC_VECTOR(",
            "    to_unsigned(",
            "    C_M_AXI_BURST_LEN - 1, 13)));"
        ];
        let result = beautifyTestHelper(input, settings);
        expect(result).toStrictEqual(output);
    })
});

function beautifyTestHelper(array: Array<string>, settings: BeautifierSettings): Array<string> {
    let input = array.join("\r\n");
    let result = beautify(input, settings);
    return result.split("\r\n");
}

function GetDefaultSettings(indentation: string = "    "): BeautifierSettings {
    let new_line_after_symbols = new NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["generic"];
    let signAligns = new signAlignSettings(false, false, "", []);
    let settings = getDefaultBeautifierSettings(new_line_after_symbols, signAligns, indentation);
    return settings;
}

function getDefaultBeautifierSettings(newLineSettings: NewLineSettings, signAlignSettings: signAlignSettings = null, indentation: string = "    "): BeautifierSettings {
    return new BeautifierSettings(false, false, false, signAlignSettings, "uppercase", "uppercase", indentation, newLineSettings, "\r\n", false);
}