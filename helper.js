const isNum = (value) => {
    if (!value) return console.error(`@isNum undefined`);
    return !(isNaN(value))
}

const cleanText = (txt) => {
    var clean = txt;

    // Trim
    clean = clean.trim()

    // Line Breaks
    clean = clean.replaceAll("<br>", "")

    // &nbsp;
    clean = clean.replace(/&nbsp;/gi, '')

    return clean;
}


class betterString {
    constructor(self) {
        this.value = self
    }
    isNum() {return isNum(this.value)}
    cleanText() {return cleanText(this.value)}
}

class betterNum {
    constructor(self) {
        this.value = self
    }
    isNum() {return isNum(this.value)}
}
