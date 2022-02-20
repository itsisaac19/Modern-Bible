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
    let isChapterRange = chapter.includes('-') || chapter.includes(',');
    if (isChapterRange) {
        let range = rangeValues(chapter, 'auto');
        console.log('Dealing with a range',  [range.start, range.end]);

        let ceilingChapter = booksAndInfo[book][0];

        if (range.length > 4) {
            range.end = range.start + 4;
        }
        if (range.end > ceilingChapter) {
            range.end = ceilingChapter;
        }

        chapter = `${range.start}-${range.end}`;
    } else {
        chapter = chapter > booksAndInfo[book][0] ? booksAndInfo[book][0] : parseInt(chapter);
    }
    
    // Verse 
    let ceilingVerse = masterArray[book].chapters[chapter];

    if (isChapterRange) {
        verse = ''
    } else if (verse.includes('-') || verse.includes(',')) {
        let range = rangeValues(verse, 'auto');
        let firstVerse = range.start;
        let lastVerse = range.end;
    
        if (firstVerse >= lastVerse) {
            firstVerse = lastVerse;
        } 
        
        if (ceilingVerse) {
            if (lastVerse > ceilingVerse) {
                lastVerse = ceilingVerse;
            }
        }
    
        verse = `${firstVerse}-${lastVerse}`;
    } else {
        if (ceilingVerse) {
            if (verse > ceilingVerse) {
                verse = ceilingVerse;
            } else {
                verse = parseInt(verse);
            }
        }
    }

    console.log('Validated Search Query:', {book, chapter, verse});
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

    let range = rangeValues(chapter, '-');
    let chapterStart = range.start;
    let chapterCount = range.length;

    // New idea:
    let verseElements = document.querySelectorAll('versenumber:not(.narrative)');
    let currentCount = chapterStart + 1;
    let prevVerseValue = 0;

    verseElements.forEach(v => {
        let verseValue = parseInt(v.innerHTML);
        if (verseValue > prevVerseValue) { // If the verse is greater than the previous verse, THIS IS NORMAL :)
            prevVerseValue = verseValue;
        } else { // If the verse is less than the previous verse, THIS IS NOT NORMAL :(, this means a new chapter has started
            if (currentCount > (chapterCount + chapterStart)) {
                console.warn('Found occurence but there should not be any more chapters');
            };

            let spacer = chapterSpacer(currentCount);
            v.parentNode.insertBefore(spacer, v.previousElementSibling); 
            console.log('Inserted chapter spacer', spacer);
            currentCount++;
        };

        prevVerseValue = verseValue;
    })


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

const rangeValues = (range, rangeKey='auto') => {
    if (rangeKey = 'auto') {
        rangeKey = range.includes('-') ? '-' : ',';
    }

    let start = range.substring(0, range.indexOf(rangeKey));
    let end = range.substring(range.indexOf(rangeKey) + 1);

    return {
        start: parseInt(start), 
        end: parseInt(end), 
        length: (end - start),
        isNegative: (start > end),
        inverted: `${end}-${start}`,
        input: range,
    };
};

class rangeParser {
    constructor(range, start, end) {
        this.range = range;
        this.start = start;
        this.end = end;
    }
    parse(cb=() => {}) {
        let range = this.range;

        if (range.includes('-')) {
            let start = range.substring(0, range.indexOf('-'));
            let end = range.substring(range.indexOf('-') + 1);

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