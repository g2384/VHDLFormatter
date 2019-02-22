function noFormat() {
    let elements = [
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
        "mix_letter",
        "cust_eol"
    ];
    var isDisabled = getHTMLInputElement("no_format").checked;
    elements.forEach(element => {
        var htmlElement = getHTMLInputElement(element + "_div");
        try {
            getHTMLInputElement(element).disabled = isDisabled;
        }
        catch (_a) { }
        if (isDisabled) {
            htmlElement.className += " disabled";
        }
        else {
            htmlElement.className = htmlElement.className.replace(/\bdisabled\b/g, "");
        }
    });
    let radioButtons = document.getElementsByTagName("input");
    for (let i = 0; i < radioButtons.length; i++) {
        if (radioButtons[i].type == "radio") {
            radioButtons[i].disabled = isDisabled;
        }
    }
}
function getHTMLInputElement(id) {
    return document.getElementById(id);
}
function Compress(input) {
    input = input.replace(/\r\n/g, '');
    input = input.replace(/[\t ]+/g, ' ');
    input = input.replace(/[ ]?([&=:\-<>\+|])[ ]?/g, '$1');
    return input;
}
function MixLetters(input) {
    let arr = input.split("");
    for (var k = 0; k < arr.length; k++) {
        if (arr[k] === arr[k].toUpperCase() && Math.random() > 0.5) {
            arr[k] = arr[k].toLowerCase();
        }
        else if (Math.random() > 0.5) {
            arr[k] = arr[k].toUpperCase();
        }
    }
    return arr.join("");
}
function wordWrap() {
    var d = document.getElementById("result");
    if (d.className == "") {
        d.className = "wordwrap";
    }
    else {
        d.className = "";
    }
}
//# sourceMappingURL=main.js.map