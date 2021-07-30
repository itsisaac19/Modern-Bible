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


const validSearchQuery = (book, chapter, verse) => {
    // Book
    if (!books.includes(book)) {
        book = validBook(book);
    }

    // Chapter
    if (new rangeParser(chapter).isRange()) {
        validChapter(chapter, book);
    } else {
        chapter = chapter > booksAndInfo[book][0] ? booksAndInfo[book][0] : parseInt(chapter);
    }
    
    // Verse 
    if (new rangeParser(verse).isRange()) {
        validVerse(verse, book, chapter);
    } else {
        if (masterArray[book].chapters[chapter]) {
            verse = verse > masterArray[book].chapters[chapter] ? masterArray[book].chapters[chapter] : parseInt(verse);
        }
    }

    console.log(book, chapter, verse);
    return [book, chapter, verse || ''];
}


const waysToSpellPslams = [
    'psalm',
    'psalms',

    'Psalm',
    'Psalms',

    'pslam',
    'pslams',

    'Pslam',
    'Pslams',
]

const validBook = (book) => {
    if (waysToSpellPslams.includes(book)) return 'Psalms';
    
    let result = new Fuse(books, {
        includeScore: true,
    }).search(book); console.log(result);
     
    return result[0] ? result[0].item : 'Genesis';
}

const validChapter = (chapter, book) => {
    console.log(book, chapter)
    let range = new rangeParser(chapter).parse();
    return `${range.start}-${range.end > booksAndInfo[book][0] ? booksAndInfo[book][0] : range.end}`
}

const validVerse = (verse, book, chapter) => {
    const verseCount = masterArray[book].chapters[chapter]

    let range = new rangeParser(verse).parse();
    let firstVerse = range.start;
    let lastVerse = range.end;

    if (firstVerse >= lastVerse) {
        return firstVerse;
    } 

    if (verseCount) {
        lastVerse = lastVerse > masterArray[book].chapters[chapter] ? masterArray[book].chapters[chapter] : lastVerse;
    }

    return `${firstVerse}-${lastVerse}`;
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
    p.id = `chapter-${num}`;
    p.innerHTML = `${GLOBAL_VAR_ARRAY.urlParamsObject.book.value} ${num}`;
    return p;
}

const insertChapterSpacers = (chapter) => {
    // Get the end chapter in the range 
    var chapterCount = (new rangeParser(chapter).parse().end + 1);
    var chapterStart = new rangeParser(chapter).parse().start;

    // Initalize the occurrence variable
    var occurrenceLookingFor = 1;

    // Loop through the number of chapters
    for (var i = chapterStart+1; i < chapterCount; i++) {
        // Initalize the occurences tracked so far variable
        var occurrencesSoFar = 0;

        // a some loop over all elements with the tag of versenumber
        [...document.querySelectorAll('versenumber')].some((v) => {
            let verseIndex = [...document.querySelectorAll('bibletextcontainer versenumber')].indexOf(v);
            let previousVerseNode = document.querySelectorAll('bibletextcontainer versenumber')[verseIndex - 1];
            let previousVerseNumber = previousVerseNode ? parseInt(previousVerseNode.innerHTML.replace(/&nbsp;/gi, '')) : 0;

            let currentVersenumber = parseInt(v.innerHTML.replace(/&nbsp;/gi, ''));

            // If the current verse number is less than the verse number before it:
            if (currentVersenumber < previousVerseNumber) {
                // Flag that we have found a new occurrence
                occurrencesSoFar++;

                // If the number of occurrences we have found is the same as the number of occurrences we are looking for
                if (occurrencesSoFar == occurrenceLookingFor) {
                    // Insert a spacer element
                    previousVerseNode.nextSibling.after(chapterSpacer(i))
                    
                    // Set the occurrence looking for to the next occurrence
                    occurrenceLookingFor++;
                    return true;
                } 
                return false;
            } 
        })
    }

    document.querySelector('bibletextcontainer').prepend(chapterSpacer(chapterStart));

    tocbot.init({
        // Where to render the table of contents.
        tocSelector: '.js-toc',
        // Where to grab the headings to build the table of contents.
        contentSelector: 'bibletextcontainer',
        // Which headings to grab inside of the contentSelector element.
        headingSelector: 'p',
        // For headings inside relative or absolute positioned containers within content.
        hasInnerContainers: false,

        scrollSmooth: true,
        scrollSmoothDuration: 620,

        headingsOffset: 100,
        scrollSmoothOffset: -100
    });
}


class rangeParser {
    constructor(range, start, end) {
        this.range = range;
        this.start = start;
        this.end = end;
    }
    parse(cb=() => {}) {
        let range = this.range;

        if (range.includes('-')) {
            let firstVerse = parseInt(range.substring(0, range.indexOf('-'))) <= 0 ? 1 : parseInt(range.substring(0, range.indexOf('-')));
            let lastVerse = parseInt(range.substring(range.indexOf('-')+1, range.length));
            this.start = firstVerse;
            this.end = lastVerse;
            cb({
                start: firstVerse, 
                end: lastVerse, 
                length: lastVerse - firstVerse,
                isNegative: firstVerse > lastVerse,
                inverted: `${lastVerse}-${firstVerse}`,
                input: range,
            });
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
        if (this.range.length && this.range.includes('-') && this.parse().start) return true;
        return false;
    }
}