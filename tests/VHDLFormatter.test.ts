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
});

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