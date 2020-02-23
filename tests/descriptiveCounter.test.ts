import { descriptiveCounter } from "../descriptiveCounter";

describe('descriptiveCounter', function () {
    it('one blankspace', function () {
        let result = descriptiveCounter(" ");
        expect(result).toBe("one blankspace");
    });

    it('mixed chars', function () {
        let result = descriptiveCounter(" A ");
        expect(result).toBe("one blankspace & one 'A' & one blankspace");
    });

    it('4 blankspaces', function () {
        let result = descriptiveCounter("    ");
        expect(result).toBe("four blankspaces");
    });

    it('9 blankspaces', function () {
        let result = descriptiveCounter("         ");
        expect(result).toBe("many blankspaces");
    });

    it('2 As', function () {
        let result = descriptiveCounter("AA");
        expect(result).toBe("two 'A's");
    });
});
