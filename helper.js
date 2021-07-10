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

const toTitleCase = (str, start=0) => {
    return str.charAt(start).toUpperCase() + str.substring(start+1).toLowerCase();
}

class betterString {
    constructor(self) {
        this.value = self
    }
    isNum() {return isNum(this.value)}
    cleanText() {return cleanText(this.value)}
    toTitleCase(start=0) {return toTitleCase(this.value, start)}
}

class betterNum {
    constructor(self) {
        this.value = parseInt(self)
    }
    isNum() {return isNum(this.value)}
}

class APIValue {
    constructor(txt) {
        this.txt = txt.trim().replace(/\s{1,}/g,'').replace(/[.\/#!$%\^&\*;:{}=\_`~()]/g,'');
    }
    parseString () {
        let str = new betterString(this.txt);
        return str.value;
    }
    parseNumber() {
        if (this.txt.includes('-')) {
            let tempRange = new rangeParser(this.txt);

            if (tempRange.isRange()) {
                let range = tempRange.parse();
                return range.start == range.end ? range.start : range.isNegative ? range.inverted : range.input;
            } else {
                return 1;
            }

        } else if (this.txt.includes(',')) {
            return this.txt.substring(0, this.txt.indexOf(',')) + '-' + this.txt.substring(this.txt.indexOf(',') + 1, this.txt.length);
        } else {
            let value = parseInt(this.txt);
            return value <= 0 ? 1 : value;
        }
    }
}

const validBook = (book) => {
    if (books.includes(book)) {
        return book;
    }
    
    if (book.toLowerCase() == 'songofsolomon') {
        return 'SongofSolomon';
    } 

    if (isNum(book.charAt(0))) { // If the first character IS A NUMBER
        return book.charAt(0) + book.toTitleCase(1)
    } else {
        return book.toTitleCase()
    }
}

const validChapter = (chapter, book) => {
    let range = new rangeParser(chapter);
    if (chapter.length && range.isRange()) {
        let start = range.parse().start;
        let end = range.parse().end;
        return `${start}-${end > booksAndInfo[book][0] ? booksAndInfo[book][0] : end}`
    }

    return chapter > booksAndInfo[book][0] ? booksAndInfo[book][0] : chapter;
}

const validVerse = (verse, book, chapter) => {
    const verseCount = masterArray[book].chapters[chapter]

    if (verse.length && verse.includes('-')) {
        let firstVerse = parseInt(verse.substring(0, verse.indexOf('-'))) <= 0 ? 1 : parseInt(verse.substring(0, verse.indexOf('-')));
        let lastVerse = parseInt(verse.substring(verse.indexOf('-')+1, verse.length));

        console.log(firstVerse, lastVerse)

        if (firstVerse >= lastVerse) {
            return firstVerse;
        } 

        if (verseCount) {
            lastVerse = lastVerse > verseCount ? verseCount : lastVerse;
        }

        return `${firstVerse}-${lastVerse}`;
    }  

    if (verseCount) {
        return verse > verseCount ? verseCount : verse;
    }
}

const WEBChapters = (length) => {
    var chapterString = '';
    for (var i = 1; i <= length; i++) {
        if (i == length) {
            chapterString += `${i}`;
        } else {
            chapterString += `${i},`;
        }
    }
    return chapterString;
}

const chapterSpacer = (num) => {
    // create a p element that has the text of num and a class of 'chapterSpacer' and return it
    let p = document.createElement('p');
    p.className = 'chapterSpacer';
    p.innerHTML = `${GLOBAL_VAR_ARRAY.urlParamsObject.book.value} ${num}`;
    return p;
}


const insertChapterSpacers = (chapter) => {
    var chapterCount = parseInt(chapter.substring(chapter.indexOf('-') + 1)) + 1;
    var occurrenceLookingFor = 1;

    for (var i = 2; i < chapterCount; i++) {
        var occurrencesSoFar = 0;

        // a some loop over all elements with the tag of versenumber
        [...document.querySelectorAll('versenumber')].some((v) => {
            let verseIndex = [...document.querySelectorAll('bibletextcontainer versenumber')].indexOf(v);
            let previousVerseNode = document.querySelectorAll('bibletextcontainer versenumber')[verseIndex - 1];
            let previousVerseNumber = previousVerseNode ? parseInt(previousVerseNode.innerHTML) : 0;

            let currentVersenumber = parseInt(v.innerHTML);

            if (currentVersenumber < previousVerseNumber) {
                occurrencesSoFar++;

                if (occurrencesSoFar == occurrenceLookingFor) {
                    previousVerseNode.nextSibling.after(chapterSpacer(i))
                    occurrenceLookingFor++;
                    return true;
                } 
                return false;
            } 
        })
    }
}


class rangeParser {
    constructor(range) {
        this.range = range;
    }
    parse() {
        let range = this.range;

        if (range.includes('-')) {
            let firstVerse = parseInt(range.substring(0, range.indexOf('-'))) <= 0 ? 1 : parseInt(range.substring(0, range.indexOf('-')));
            let lastVerse = parseInt(range.substring(range.indexOf('-')+1, range.length));
            return {
                start: firstVerse, 
                end: lastVerse, 
                length: lastVerse - firstVerse,
                isNegative: firstVerse > lastVerse,
                inverted: `${lastVerse}-${firstVerse}`,
                input: range,
            };
        }
    }
    isRange() {
        if (this.range.includes('-') && this.parse().start) return true;
        return false;
    }
}