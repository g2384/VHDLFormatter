export function assert(testName: string, expected: string, actual: string, message?: undefined) {
    var result = CompareString(actual, expected);
    if (result != true) {
        console.log('"' + testName + "\" failed: \n" + result);
    }
    else {
        //console.log(testName + " pass");
    }
}

export function CompareString(actual: string, expected: string) {
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