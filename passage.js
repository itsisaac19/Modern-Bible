var GLOBAL_VAR_ARRAY = {
    "urlParamsObject": {
        book: {
            "name": "book",
            "value": ""
        },
        chapter: {
            "name": "chapter",
            "value": ""
        },
        verse: {
            "name": "verse",
            "value": ""
        },
        version: {
            "name": "version",
            "value": ""
        }
    }
}

async function WEB_VersionRequest (book, chapter, verse) {
    chapter = chapter.includes("-") ? WEBChapters(parseInt(chapter.substring(chapter.indexOf("-") + 1))) : chapter
    let requestStr = verse ? `https://bible-api.com/${book}+${chapter}:${verse}?verse_numbers=true`: `https://bible-api.com/${book}+${chapter}?verse_numbers=true`

    let response = await fetch(requestStr).catch(error => {console.log(error)});
    let data = await response.json();
    WEBparser(data, undefined, requestStr)
}

function NLT_VersionRequest (book, chapter, verse) {

    if (book.toLowerCase().includes('songofsolomon') == true) {
        console.warn('Support for Song of Solomon is not available in NLT')
        return displayMessage('Song of Solomon is not available in NLT.', {
            switchVersion: true,
            redirectLink: false,
            searchError: false
        });
    }

    if (book && isNaN(book.charAt(0)) == false) {
        let num = book.charAt(0);
        book = num + ' ' + book.substring(1, book.length);
    }

    var requestStr;

    // Verse param unspecified:
    if (!verse) {
        requestStr = `https://api.nlt.to/api/passages?ref=${book}+${chapter}&version=NLT&key=251715bb-d01d-4b99-8a83-64043b090660`
        fetch(`https://api.nlt.to/api/passages?ref=${book}+${chapter}&version=NLT&key=251715bb-d01d-4b99-8a83-64043b090660`).then(response => {
            if (response.ok) {
                return response.text();
            } else {
                displayMessage('Error fetching verses.')
            }
        }).then(data => {
            NLTparser(data)
        })
        return;
    }

    requestStr = `https://api.nlt.to/api/passages?ref=${book}+${chapter}:${verse}&version=NLT&key=251715bb-d01d-4b99-8a83-64043b090660`

    // All params specified:
    fetch(`https://api.nlt.to/api/passages?ref=${book}+${chapter}:${verse}&version=NLT&key=251715bb-d01d-4b99-8a83-64043b090660`).then(response => {
        if (response.ok) {
            return response.text();
        } else {
            displayMessage('Error fetching verses.')
        }
    }).then(data => {
        NLTparser(data)
    })
}

function ESV_VersionRequest (book, chapter, verse) {

    var ESVHeaders = new Headers();
    ESVHeaders.append("Authorization", "Token 21e8c9c7473c40e539c611b6b89b431e3e84514a");

    var requestOptions = {
        method: 'GET',
        headers: ESVHeaders,
        redirect: 'follow'
    };

    // Verse param unspecified:
    if (!verse) {
        fetch(`https://api.esv.org/v3/passage/text/?q=${book}+${chapter}`, requestOptions)
        .then(response => response.json()).then(result => {
            ESVparser(result)
        })
        return;
    }

    // All params specified:
    fetch(`https://api.esv.org/v3/passage/text/?q=${book}+${chapter}:${verse}`, requestOptions)
    .then(response => response.json()).then(result => {
        ESVparser(result)
    })
}

function displayMessage (text, options) {
    let DOMel = document.querySelector('.messageDisplayContent');
    DOMel.innerHTML = text;

    let link = document.querySelector('.messageDisplayLink')
    let search = document.querySelector('.messageDisplaySearch')
    let versionSwitcher = document.querySelector('.messageDisplayVersion')

    if (!options) return;

    if (options.switchVersion == true) {
        versionSwitcher.classList.add('shown')
    }

    if (options.searchError == true) {
        search.classList.add('shown')
    }

    if (options.redirectLink == true) {
        link.style.classList.add('shown');
        link.innerHTML = options.redirectLink;
    }
}
function clearMessage () {
    let DOMel = document.querySelector('.messageDisplayContent');
    DOMel.innerHTML = null;
    let link = document.querySelector('.messageDisplayLink')
    link.innerHTML = null;
    let search = document.querySelector('.messageDisplaySearch')
    search.innerHTML = null;
    let versionSwitcher = document.querySelector('.messageDisplayVersion')
    versionSwitcher.innerHTML = null;
}

function setPassageHinter () {
    let p = GLOBAL_VAR_ARRAY.urlParamsObject
    let hinterEl = document.querySelector('.passageHinter')

    let chapterVerse = document.querySelector('biblechapterverse').textContent
    let lastVerse = chapterVerse.substring(chapterVerse.indexOf(':')+1, chapterVerse.length)
    hinterEl.innerHTML = p.chapter.value.includes('-') ? `${p.book.value} • Chapters ${p.chapter.value}` : `${p.book.value} ${p.chapter.value}:${p.verse.value || lastVerse}`
}

function readyCallback () {
    setMetaTags();
    setPassageHinter();
    placeDataLists();

    console.log('Now displaying: ', GLOBAL_VAR_ARRAY.urlParamsObject)
}

function fetchBible (book, chapter, verse, version) {
    hideMainContent(false)

    if (book && isNum(book.charAt(0)) == true) {
        book = `${book.charAt(0)}${book.substring(1, book.length)}`;
    }

    if (!version) return WEB_VersionRequest(book, chapter, verse);

    if (version == "WEB"){ WEB_VersionRequest(book, chapter, verse) }
    if (version == "NLT"){ NLT_VersionRequest(book, chapter, verse) }
    if (version == "ESV"){ ESV_VersionRequest(book, chapter, verse) }
}

function getQueryParams (returnParamsOnly = false, firstTime = false) {
    var urlParams = new URLSearchParams(window.location.search);

    let paramArray = {
        "version": urlParams.get('version') || "ESV", 
        "book": urlParams.get('book') || 'Genesis', 
        "chapter": urlParams.get('chapter') || '1', 
        "verse": urlParams.get('verse') || undefined
    }
    if (returnParamsOnly == true) { return paramArray }

    document.querySelector('.selectTranslations').value = paramArray.version
    fetchBible(paramArray.book, paramArray.chapter, paramArray.verse, paramArray.version)

    if (firstTime == true) {console.log("QUERY PARAMS: ", paramArray)}
    pushCurrentParamsToGlobal()
}
getQueryParams(false, true)


function changeQueryParams (origin, fetch=true) {
    if (!origin) return console.warn('NO ORIGIN SPECIFED. REQUEST DENIED');
    paramArray = GLOBAL_VAR_ARRAY.urlParamsObject

    var newStateURL = "/passage.html?";

    for (var attr in paramArray) {
        if (paramArray[attr].value) {
            if (attr != "book") {
                newStateURL += `&${paramArray[attr].name}=${paramArray[attr].value}`
                continue;
            }
            newStateURL += `${paramArray[attr].name}=${paramArray[attr].value}`
        }
    }
    
    window.history.pushState('page', 'title', newStateURL);

    if (fetch == true) {
        getQueryParams()
    }
}

window.addEventListener('popstate', () => {
    if (window.location.hash) {
        return;
    }
    getQueryParams();
});

function WEBparser (main, scrollBack = true) {
    let fullChapter = GLOBAL_VAR_ARRAY.urlParamsObject.verse.value ? false : true;
    let chapter = GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value.includes('-') ? GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value : parseInt(GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value);
    let isMultipleChapters = chapter.length ? chapter.includes('-') : false;
    let verse = GLOBAL_VAR_ARRAY.urlParamsObject.verse.value;

    let currentBook = GLOBAL_VAR_ARRAY.urlParamsObject.book.value

    document.querySelector('biblechapterverse').classList.remove('multi-chapter')
    document.querySelector('.js-toc').classList.add('wait')
    if (isMultipleChapters) {
        document.querySelector('biblechapterverse').classList.add('multi-chapter')
        document.querySelector('.js-toc').classList.remove('wait')
    }

    //Log
    console.groupCollapsed('WEB Request');
    console.log(`Query: ${currentBook} ${chapter}:${verse}`);

    console.groupCollapsed('Passage');
    console.log(main.text);
    console.groupEnd();
    console.groupEnd();

    // DOM Insert: Book
    var topBook = document.querySelector('.biblecontainer biblepassageinfo biblebook')
    topBook.innerHTML = `${currentBook.toUpperCase()}&nbsp`.repeat(Math.ceil(40 / (currentBook.length + 1)))

    // DOM Insert: Chapter and verse 
    var topChapterVerse = document.querySelector('.biblecontainer biblepassageinfo bibleChapterVerse')
    topChapterVerse.innerHTML = isMultipleChapters ? `Chapters ${chapter}` : `${chapter}:${verse || 1}` 

    // DOM Insert: Text content
    var body = document.querySelector('.biblecontainer bibletextcontainer')
    body.innerHTML = helper_parseVerseNumbers(main.text)
    helper_parseNarratives(main.text)

    if (GLOBAL_VAR_ARRAY.urlParamsObject.verse.value) {
        isOneVersePassage(parseInt(GLOBAL_VAR_ARRAY.urlParamsObject.verse.value))
    }

    ChapterNavigation(chapter)
    showMainContent()

    function spaceOutVerses () {
        let verseNumbers = document.querySelectorAll('bibletextcontainer versenumber')

        verseNumbers.forEach(v => {
            let rawNum = v.innerHTML.replace(/[{()}]/g, '');
            if (parseInt(rawNum) % 5 == 0) {
                let spacerBlocks = document.createElement('div');
                spacerBlocks.innerHTML = '<br>'
                document.querySelector('bibletextcontainer').insertBefore(spacerBlocks, v)
            }
        })
    }
    spaceOutVerses()

    // DOM Timings: Scrolling back to top, and displaying last verse number for a full chapter
    setTimeout(function() {
        if (scrollBack == true) {
            window.scroll({top: 0, behavior: 'smooth'});
        }
        
        var lastVerseNumber = cleanText(document.querySelectorAll('bibletextcontainer versenumber')[document.querySelectorAll('bibletextcontainer versenumber').length - 1].innerHTML)   
        if (fullChapter == true && isMultipleChapters == false) topChapterVerse.innerHTML = chapter + ':' + (verse || 1) + '-' + lastVerseNumber;

        if (fullChapter == true && isMultipleChapters == false) { 
            return readyCallback()
        }

        if (!(verse)) {
            verse = verse + '-' + lastVerseNumber
        }

        if (verse.length && verse.includes('-') == false && fullChapter == true) {
            verse = verse + '-' + lastVerseNumber
        }

        
        if (isMultipleChapters == true) { 
            insertChapterSpacers(chapter)
        }

        readyCallback()
    }, 10)


}


function helper_parseVerseNumbers(string) {
    var result = string.replace(/(\()/g, '&nbsp&nbsp<versenumber>');
    result = result.replace(/(\)[.!?;'",\\-]{1,})/g, ',</versenumber>');
    result = result.replace(/(\))/g, '</versenumber>');
    result = result.replace(":", "")

    return result
}

function helper_parseNarratives(str) {
    var verses = document.querySelectorAll('versenumber')

    verses.forEach(function(vers) {
        if (vers.innerHTML.length > 4) {
            vers.classList.add('narrative')
        }
    })
}

function helper_checkChapterLength (book) {
    if (!(books.includes(book))) return;

    return
}
helper_checkChapterLength('Genesis')

function helper_checkVerseCount (book, chapterNum) {
    if (!(books.includes(book))) return;

    var chaptersInBook = booksAndInfo[book][0]
    var verses;

    if (chapterNum) {
        if (chapterNum > chaptersInBook) {
            return;
        } 
        // This will take a lot of work to check for how many verses are in EACH CHAPTER.
        verses = booksAndInfo[book][1]
    } else {
        verses = booksAndInfo[book][1]
    }



    return console.log(verses)
}

function helper_hasNumber(str) {
    return /\d/.test(str);
}



function helper_parseIntoAbbreviations (bookStr) {
    if (!(books.includes(bookStr)));

    var draft;

    if (helper_hasNumber(bookStr) == true) {
        draft = bookStr.substring(0, 4)
    }

    if (helper_hasNumber(bookStr) == false) {
        draft = bookStr.substring(0, 2)
    }


    return draft;
}

function helper_formatCollapsedSideBarHTML (revert) {
    var bookNames = document.getElementsByClassName('bookName')

    if (revert != true) {
        Array.prototype.forEach.call(bookNames, function(el) {
            var abrv = helper_parseIntoAbbreviations(el.innerHTML)
            el.classList.add(el.innerHTML.replace(/\s/g, '&'))
            el.innerHTML = abrv
        })
    } else {
        Array.prototype.forEach.call(bookNames, function(el) {
            var abrv = helper_parseIntoAbbreviations(el.innerHTML)
            el.innerHTML = el.classList[1].replace("&", " ")
        })
    }


}



// DOM Levels that need to be in under the passage.js scope

function addBookNameClicks () {
    let masterAllBooks = document.querySelectorAll('.bookName')

    masterAllBooks.forEach(bookEl => {
        bookEl.onclick = function () {
            var book = this.classList[1]

            GLOBAL_VAR_ARRAY.urlParamsObject.book.value = book
            GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value = 1
            GLOBAL_VAR_ARRAY.urlParamsObject.verse.value = undefined

            changeQueryParams('bookel')
        }
    })
}
addBookNameClicks()

function pushCurrentParamsToGlobal () {
    GLOBAL_VAR_ARRAY.urlParamsObject.book.value = getQueryParams(true).book
    GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value = getQueryParams(true).chapter
    GLOBAL_VAR_ARRAY.urlParamsObject.verse.value = getQueryParams(true).verse
    GLOBAL_VAR_ARRAY.urlParamsObject.version.value = getQueryParams(true).version
}


async function testValidity (book, chapter, verse) {
    var isFullChapter = true;
    var isMultipleChapters = chapter.includes('-');

    var requestStr = book +'+'+ chapter + ':' + verse

    if(verse) {isFullChapter = false} else {
        requestStr = book +'+'+ chapter
    }

    let result = await fetch('https://bible-api.com/'+requestStr+'?verse_numbers=true')
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            console.log('error in validity', response);

            var firstVerseNumber = document.querySelector('bibletextcontainer versenumber:first-of-type').innerHTML.replace(/(\()/g, '').replace(/(\))/g, '').replaceAll("<br>", "").replace(/&nbsp;/gi, '');  
            var topChapterVerse = document.querySelector('.biblecontainer biblepassageinfo bibleChapterVerse')
            
            if (isFullChapter == true) return false;

            if (GLOBAL_VAR_ARRAY.urlParamsObject.version.value == 'ESV') {
                //topChapterVerse.innerHTML = GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value + ':' + '1-' + document.querySelectorAll('versenumber')[document.querySelectorAll('versenumber').length - 1].innerHTML;
            } else {
                topChapterVerse.innerHTML = GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value + ':' + firstVerseNumber
                GLOBAL_VAR_ARRAY.urlParamsObject.verse.value = parseInt(firstVerseNumber)
                setPassageHinter();
            }            
        }
    }).catch((error) => {
        console.warn('Validity error', error)
    });
}

function isOneVersePassage (verseNumber) {
    var middle = parseInt(masterArray[GLOBAL_VAR_ARRAY.urlParamsObject.book.value].chapters[GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value]) / 2
    var startsWith = GLOBAL_VAR_ARRAY.urlParamsObject.verse.value;

    if (GLOBAL_VAR_ARRAY.urlParamsObject.verse.value.includes('-')) {
        startsWith = GLOBAL_VAR_ARRAY.urlParamsObject.verse.value.substring(0, GLOBAL_VAR_ARRAY.urlParamsObject.verse.value.indexOf('-'))
        verseNumber = parseInt(GLOBAL_VAR_ARRAY.urlParamsObject.verse.value.substring(GLOBAL_VAR_ARRAY.urlParamsObject.verse.value.indexOf('-')+1, GLOBAL_VAR_ARRAY.urlParamsObject.verse.value.length));
    }

    if (middle) {
        if (verseNumber <= middle) {
            hintDirection = 'hintDown'
        }
        if (verseNumber > middle && startsWith > 1) {
            hintDirection = 'hintUp'
        } else {
            hintDirection = 'hintDown'
        }
    } else {
        hintDirection = 'hintDown';
    }


    let DOMbody = document.querySelector('.biblecontainer bibletextcontainer')
    let fullChapterTeaser = document.createElement('div')
    fullChapterTeaser.className = 'fullChapterTeaser'
    fullChapterTeaser.classList.add(hintDirection)
    fullChapterTeaser.onclick = function () {
        GLOBAL_VAR_ARRAY.urlParamsObject.verse.value = undefined
        changeQueryParams('fullChapterTeaser')
    }

    if (hintDirection == 'hintUp') {
        DOMbody.prepend(fullChapterTeaser)
        return;
    }

    DOMbody.appendChild(fullChapterTeaser)
}

function ChapterNavigation(currChap) {

    function chapterNavHandler() {
        const dataSets = this.dataset;
        GLOBAL_VAR_ARRAY.urlParamsObject.verse.value = null

        if (dataSets.bibleBook && dataSets.bibleBook != GLOBAL_VAR_ARRAY.urlParamsObject.book.value) {
            GLOBAL_VAR_ARRAY.urlParamsObject.book.value = this.dataset.bibleBook
            changeQueryParams('changing bible book')
            return;
        }

        GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value = this.dataset.bibleChapter
        changeQueryParams('changing chapter')
    }

    var currentBook = booksAndInfo[GLOBAL_VAR_ARRAY.urlParamsObject.book.value]
    var bookIndex = books.indexOf(GLOBAL_VAR_ARRAY.urlParamsObject.book.value)

    var prevWrap = document.querySelector('.prevChap')
    var nextWrap = document.querySelector('.nextChap')

    var chapterBefore = currChap - 1
    var chapterAfter = currChap + 1

    // if currChap is a range: 
    let chapterRange = new rangeParser(currChap);

    if (currChap.length && chapterRange.isRange()) {
        let range = chapterRange.parse()
        chapterBefore = range.start - 1;
        chapterAfter = range.end + 1;
    }

    console.log('Chapter Navigation Parsed:', {
        chapterBefore,
        chapterAfter
    })

    var bookBefore = books[bookIndex - 1]
    var bookAfter = books[bookIndex + 1]

    // DOM Level: Chapter navigation - previous button 
    if (chapterBefore > 0) {
        prevWrap.dataset.bibleChapter = chapterBefore
        delete prevWrap.dataset.bibleBook
        prevWrap.innerHTML = `&larr; ${GLOBAL_VAR_ARRAY.urlParamsObject.book.value} ${chapterBefore}`
        prevWrap.onclick = chapterNavHandler
    } else {
        prevWrap.dataset.bibleBook = bookBefore
        delete prevWrap.dataset.bibleChapter 
        if (bookBefore) {
            prevWrap.innerHTML = `&larr; ${bookBefore}`
            prevWrap.onclick = chapterNavHandler
        }
    }

    // DOM Level: Chapter navigation - next button
    if (chapterAfter <= currentBook[0]) {
        nextWrap.dataset.bibleChapter = chapterAfter
        delete nextWrap.dataset.bibleBook
        nextWrap.innerHTML = `${GLOBAL_VAR_ARRAY.urlParamsObject.book.value} ${chapterAfter} &rarr;`
        nextWrap.onclick = chapterNavHandler
    } else {
        if (bookIndex <= 64) {
            nextWrap.dataset.bibleBook = bookAfter
            delete nextWrap.dataset.bibleChapter

            if (bookAfter) {
                nextWrap.innerHTML = `${bookAfter} &rarr;`
                nextWrap.onclick = chapterNavHandler
            }
        } 
    }
}

let MouseDrag = false;

document.addEventListener('mousedown', () => MouseDrag = false);
document.addEventListener('mousemove', () => MouseDrag = true);

function showSearchBox () {
    let searchBox = document.querySelector('.searchBox')
    if (searchBox.classList.contains('hidden')) {
        if (window.scrollY > 0) {
            searchBox.classList.add('sticky')
            searchBox.classList.remove('normal')
        } else {
            searchBox.classList.add('normal')
            searchBox.classList.remove('sticky')
        }

        searchBox.classList.remove('hidden')
        setTimeout(() => {
            searchBox.classList.remove('wait')
            searchBox.onoutclick = () => {
                if (MouseDrag) return;
                hideSearchBox()            
            }             
        }, 100) 
    } else {
        hideSearchBox()
        searchBox.onoutclick = () => {
            
        }  
    }
}

function hideSearchBox () {
    if (document.querySelector('.searchBox').classList.contains('hidden') == true) {
        return
    }
    document.querySelector('.searchBox').classList.add('wait')

    wrapperTimeout = setTimeout(() => {
        document.querySelector('.searchBox').classList.add('hidden')
    }, 300)  

    document.querySelector('.searchBox').onoutclick = () => {
        
    }    
}

function searchListeners() {

    document.querySelector('.searchWrapper').onclick = showSearchBox

    document.querySelector('.passageHinterWrapper').onclick = showSearchBox

    document.querySelector('.gobutton').onclick = function () {
        var book = domSelect('.searchqueryBook').value || 'Genesis';
        var chapter = domSelect('.searchqueryChapter').value || 1;
        var verse = domSelect('.searchqueryVerse').value || '';

        [book, chapter, verse] = validSearchQuery(book, chapter, verse);

        console.log(book, chapter, verse)

        document.querySelector('.searchqueryBook').value = book;
        document.querySelector('.searchqueryChapter').value = chapter;
        document.querySelector('.searchqueryVerse').value = verse;
        hideSearchBox()

        GLOBAL_VAR_ARRAY.urlParamsObject.book.value = book;
        GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value = chapter;
        GLOBAL_VAR_ARRAY.urlParamsObject.verse.value = verse;

        changeQueryParams('changing from search')
    }
    
    document.querySelector('.searchqueryBook').addEventListener('input', () => {
        if (books.includes(this.value)) {
            chapterListBasedOffBook(this.value)
        }

        var booksList = document.querySelector('#booksDataList');
        if (booksList.children.length > 0) return;

        booksList.innerHTML = "";
    
        books.forEach((book) => {
                var optionEl = document.createElement('option');
                optionEl.innerHTML = book;

                booksList.appendChild(optionEl);
        })
    })
    document.querySelector('.searchqueryChapter').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            //this.blur();
            document.querySelector('.gobutton').click();
        }
    })
    document.querySelector('.searchqueryVerse').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            this.blur();
            document.querySelector('.gobutton').click();
        }
    })

    document.querySelector('.searchqueryBook').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            this.blur();
            document.querySelector('.gobutton').click();
        }
    })

    document.querySelector('.selectTranslations').addEventListener('change', function () {
        GLOBAL_VAR_ARRAY.urlParamsObject.version.value = this.value
        changeQueryParams('changing version')
    })

}
searchListeners()