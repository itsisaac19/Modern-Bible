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

function WEB_VersionRequest (book, chapter, verse) {
    if (chapter && verse) {
        let requestStr = 'https://bible-api.com/'+ book +'+'+ chapter + ':' + verse +'?verse_numbers=true'
        fetch('https://bible-api.com/'+ book +'+'+ chapter + ':' + verse +'?verse_numbers=true')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                displayMessage('Error fetching verses.')
            }
        })
        .then(data => {
            WEBparser(data)
        })
    }
    if (book && chapter && !(verse)) {
        let requestStr = 'https://bible-api.com/'+ book +':'+ chapter +'?verse_numbers=true'
        fetch('https://bible-api.com/'+ book +':'+ chapter +'?verse_numbers=true')
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Something went wrong');
            }
        })
        .then(data => {
            WEBparser(data)
        })
    }

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
    hinterEl.innerHTML = `${p.book.value} ${p.chapter.value}:${p.verse.value || lastVerse}`
}

function readyCallback () {
    setMetaTags()
    setPassageHinter()
    placeDataLists()
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
    getQueryParams();
});

function WEBparser (main, scrollBack = true) {
    let fullChapter = GLOBAL_VAR_ARRAY.urlParamsObject.verse.value ? false : true;
    let chapter = GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value;
    let verse = GLOBAL_VAR_ARRAY.urlParamsObject.verse.value || 1;

    let currentBook = GLOBAL_VAR_ARRAY.urlParamsObject.book.value

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
    topChapterVerse.innerHTML = `${chapter}:${verse}`

    // DOM Insert: Text content
    var body = document.querySelector('.biblecontainer bibletextcontainer')
    body.innerHTML = helper_parseVerseNumbers(main.text)
    helper_parseNarratives(main.text)

    if (GLOBAL_VAR_ARRAY.urlParamsObject.verse.value) {
        isOneVersePassage(parseInt(GLOBAL_VAR_ARRAY.urlParamsObject.verse.value))
    }

    ChapterNavigation(parseInt(chapter))
    showMainContent()

    function spaceOutVerses () {
        let verseNumbers = document.querySelectorAll('bibletextcontainer versenumber')

        verseNumbers.forEach(v => {
            let rawNum = v.innerHTML.replace(/[{()}]/g, '');
            if (parseInt(rawNum) % 5 == 0) {
                v.innerHTML = `<br><br>${v.innerHTML}`
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
        if (fullChapter == true) topChapterVerse.innerHTML = GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value + ':' + verse + '-' + lastVerseNumber;

        if (fullChapter == true) { 
            return readyCallback()
        }

        if (!(GLOBAL_VAR_ARRAY.urlParamsObject.verse.value)) {
            GLOBAL_VAR_ARRAY.urlParamsObject.verse.value = verse + '-' + lastVerseNumber
        }

        if (GLOBAL_VAR_ARRAY.urlParamsObject.verse.value.includes('-') == false && fullChapter == true) {
            GLOBAL_VAR_ARRAY.urlParamsObject.verse.value = verse + '-' + lastVerseNumber
        }

        readyCallback()
    }, 10)


}


function helper_parseVerseNumbers(string) {
    var result = string.replace(/(\()/g, '&nbsp&nbsp<versenumber>');
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
    var requestStr = book +'+'+ chapter + ':' + verse

    if(verse) {isFullChapter = false} else {
        requestStr = book +'+'+ chapter
    }

    let result = await fetch('https://bible-api.com/'+requestStr+'?verse_numbers=true')
    .then(response => {
        if (response.ok) {
            return true;
        } else {
            var firstVerseNumber = document.querySelector('bibletextcontainer versenumber:first-of-type').innerHTML.replace(/(\()/g, '').replace(/(\))/g, '').replaceAll("<br>", "").replace(/&nbsp;/gi, '');  
            var topChapterVerse = document.querySelector('.biblecontainer biblepassageinfo bibleChapterVerse')
            
            if (isFullChapter == false) {
                topChapterVerse.innerHTML = GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value + ':' + firstVerseNumber
                GLOBAL_VAR_ARRAY.urlParamsObject.verse.value = parseInt(firstVerseNumber)
                setPassageHinter();
            }

            //changeQueryParams('validity test', false)
            return false;
        }
    }).catch((error) => {
        console.log(error)
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
        console.log('FULL CHAPTER TEASER ACTIVE')
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
        pushCurrentParamsToGlobal()
        GLOBAL_VAR_ARRAY.urlParamsObject.verse.value = null

        if (this.dataset.bibleBook) {
            if (this.dataset.bibleBook != GLOBAL_VAR_ARRAY.urlParamsObject.book.value) {
                GLOBAL_VAR_ARRAY.urlParamsObject.book.value = this.dataset.bibleBook
                changeQueryParams('changing bible book')
    
                return;
            }
        }


        GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value = this.dataset.bibleChapter
        changeQueryParams('changing chapter')
    }

    var currentBook = booksAndInfo[GLOBAL_VAR_ARRAY.urlParamsObject.book.value]
    var bookIndex = books.indexOf(GLOBAL_VAR_ARRAY.urlParamsObject.book.value)

    var prevWrap = document.querySelector('.prevChap')
    prevWrap.innerHTML = ''
    var nextWrap = document.querySelector('.nextChap')
    nextWrap.innerHTML = ''

    var chapterBefore = currChap - 1
    var chapterAfter = currChap + 1

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

        console.log('showSearchBox triggered')

        searchBox.classList.remove('hidden')
        setTimeout(() => {
            searchBox.classList.remove('wait')
            searchBox.onoutclick = () => {
                hideSearchBox()
                console.log('OUTCLICK @showSearchBox')
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

    console.log('removing outclick')

    document.querySelector('.searchBox').onoutclick = () => {
        
    }    
}

function searchListeners() {

    document.querySelector('.searchWrapper').onclick = showSearchBox

    document.querySelector('.passageHinterWrapper').onclick = showSearchBox

    document.querySelector('.gobutton').onclick = function () {
        var bookValue = new APIString(document.querySelector('.searchqueryBook').value.trim().replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g,"").replace(/\s{2,}/g," "))
        var chapValue = document.querySelector('.searchqueryChapter').value.trim().replace(/[.,\/#!$%\^&\*;:{}=\_`~()]/g,"").replace(/\s{2,}/g," ");
        var verseValue = document.querySelector('.searchqueryVerse').value.trim()

        if (!bookValue){
            document.querySelector('.searchqueryBook').classList.add('unfilled')
            return;
        }

        if (!(booksAndInfo[bookValue.txt])) {
            document.querySelector('.searchqueryBook').classList.add('unfilled')
            return;
        }

        if (chapValue < 1) {
            chapValue = 1
        }
        if (chapValue > booksAndInfo[bookValue.txt][0]) {
            chapValue = booksAndInfo[bookValue.txt][0]
        }

        // Validate verse number
        if (verseValue.includes('-')) {
            let firstVerse = parseInt(verseValue.substring(0, verseValue.indexOf('-')));
            let lastVerse = parseInt(verseValue.substring(verseValue.indexOf('-')+1, verseValue.length));

            console.log(firstVerse, lastVerse)

            if (firstVerse == lastVerse || firstVerse > lastVerse) {
                verseValue = firstVerse;
            } else {

                if (firstVerse < 1) {
                    firstVerse = 1
                }
                if (masterArray[bookValue.parseForAPI()].chapters[parseInt(chapValue)]) {
                    if (lastVerse > masterArray[bookValue.parseForAPI()].chapters[parseInt(chapValue)]) {
                        lastVerse = masterArray[bookValue.parseForAPI()].chapters[parseInt(chapValue)]
                    }
                }
                verseValue = `${firstVerse}-${lastVerse}`
            }
        } else if (verseValue) {
            if (verseValue < 1) {
                verseValue = 1
            }
            if (masterArray[bookValue.parseForAPI()].chapters[parseInt(chapValue)]) {
                if (verseValue > masterArray[bookValue.parseForAPI()].chapters[parseInt(chapValue)]) {
                    verseValue = masterArray[bookValue.parseForAPI()].chapters[parseInt(chapValue)]
                }
            }
        }



        document.querySelector('.searchqueryBook').value = bookValue.parseForAPI()
        document.querySelector('.searchqueryChapter').value = chapValue
        document.querySelector('.searchqueryVerse').value = verseValue

        hideSearchBox()

        GLOBAL_VAR_ARRAY.urlParamsObject.book.value = bookValue.parseForAPI()
        GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value = chapValue
        GLOBAL_VAR_ARRAY.urlParamsObject.verse.value = verseValue
        changeQueryParams('changing from search')
    }
    
    document.querySelector('.searchqueryBook').addEventListener('input', function() {
        this.classList.remove('unfilled')
    
        if (books.includes(this.value)) {
            chapterListBasedOffBook(this.value)
        }

        var booksList = document.querySelector('#booksDataList');
        if (booksList.children.length > 0) return;

        booksList.innerHTML = "";
    
        books.forEach(function(book) {
            var optionEl = document.createElement('option');
            optionEl.innerHTML = book;
    
            booksList.appendChild(optionEl)
        })
    })
    document.querySelector('.searchqueryChapter').addEventListener('input', function() {
        this.classList.remove('unfilled')
    })
    document.querySelector('.searchqueryVerse').addEventListener('keypress', function(e) {
        this.classList.remove('unfilled')
    
        if (e.key === 'Enter') {
            this.blur();
            document.querySelector('.gobutton').click();
        }
    })

    document.querySelector('.searchqueryBook').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            this.blur();
            document.querySelector('.gobutton').click();


            if (!(this.value) || !(document.querySelector('.searchqueryChapter').value)) {
                return;
            } 
        }
    })

    document.querySelector('.searchqueryChapter').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            this.blur();
            document.querySelector('.gobutton').click();

            if (!(this.value) || !(document.querySelector('.searchqueryBook').value)) {
                return;
            } 
        }
    })

    document.querySelector('.selectTranslations').addEventListener('change', function () {
        GLOBAL_VAR_ARRAY.urlParamsObject.version.value = this.value
        changeQueryParams('changing version')
    })

}
searchListeners()