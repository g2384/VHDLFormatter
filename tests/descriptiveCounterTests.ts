import { descriptiveCounter } from "../descriptiveCounter";
import { assert } from "./assert";

let testCount: number = 0;

type StringCallback = (text: string) => string;

var showUnitTests = true;//window.location.href.indexOf("http") < 0;
export function testDescriptiveCounter() {
    if (showUnitTests) {
        testCount = 0;
        start();
        console.log("total tests: " + testCount);
    }
}

function start() {
    console.log("=== descriptiveCounter ===");
    test(descriptiveCounter, "one blankspace", " ", "one blankspace");
    test(descriptiveCounter, "mixed chars", " A ", "one blankspace & one 'A' & one blankspace");
    test(descriptiveCounter, "4 blankspaces", "    ", "four blankspaces");
    test(descriptiveCounter, "9 blankspaces", "         ", "many blankspaces");
    test(descriptiveCounter, "2 As", "AA", "two 'A's");
}

function test(func: StringCallback, testName: string, inputs, expected: string) {
    let actual: string = func(inputs);
    assert(testName, expected, actual);
    testCount++;
}