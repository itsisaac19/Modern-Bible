var GLOBAL_VAR_ARRAY = {
    "urlParamsObject": {
        0: {
            "name": "book",
            "value": ""
        },
        1: {
            "name": "chapter",
            "value": ""
        },
        2: {
            "name": "verse",
            "value": ""
        },
        3: {
            "name": "version",
            "value": "WEB"
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
                throw new Error('Something went wrong');
            }
        })
        .then(data => {
            parseAPIContent(data)
        })
        console.log("Fetching: " + ` @${requestStr}`, book, chapter, verse)
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
            parseAPIContent(data)
        })
        console.log("Fetching: " + ` @${requestStr}`, book, chapter)
    }

}

function ESV_VersionRequest (book, chapter, verse) {
    if (chapter && verse) {
        fetch('https://api.esv.org/v3/passage/text/?q='+ book +'+'+ chapter + ':' + verse, {
                Authorization: 'Token {{e397a574363672586c9b6df4b5d2b819451dc909}}'
            }
        ).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Something went wrong');
            }
        }).then(data => {
            parseAPIContent(data, "ESV")
        })
        console.log("Fetching: ", book, chapter, verse)
    }
    if (book && chapter && !(verse)) {
        fetch('https://api.esv.org/v3/passage/text/?q='+ book +'+'+ chapter, {
                Authorization: 'Token {{e397a574363672586c9b6df4b5d2b819451dc909}}'
            }
        ).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Something went wrong');
            }
        })
        .then(data => {
            parseAPIContent(data)
        })
        console.log("Fetching: ", book, chapter)
    }

}


function fetchBible (book, chapter, verse, version) {
    hideMainContent(false)

    if (!version) return WEB_VersionRequest(book, chapter, verse);

    if (version == "WEB"){ WEB_VersionRequest(book, chapter, verse) }
    if (version == "ESV"){ ESV_VersionRequest(book, chapter, verse) }
}

function getQueryParams (returnParamsOnly = false) {
    var urlParams = new URLSearchParams(window.location.search);

    if (!urlParams) {
        document.getElementsByClassName('bookName')[0].click()
    }

    let paramArray = {
        "version": urlParams.get('version') || "WEB", 
        "book": urlParams.get('book'), 
        "chapter": urlParams.get('chapter'), 
        "verse": urlParams.get('verse') || undefined
    }
    if (returnParamsOnly == true) { return paramArray }

    console.log("Query params: ", paramArray)

    focusBook(paramArray.book)
    fetchBible(paramArray.book, paramArray.chapter, paramArray.verse, paramArray.version)
}
getQueryParams()


function changeQueryParams () {
    paramArray = GLOBAL_VAR_ARRAY.urlParamsObject

    console.log(paramArray)

    var newStateURL = "/passage.html?";

    for (var attr in paramArray) {
        if (paramArray[attr].value) {
            if (attr > 0) {
                console.log(newStateURL)
                newStateURL += `&${paramArray[attr].name}=${paramArray[attr].value}`
                continue;
            }
            newStateURL += `${paramArray[attr].name}=${paramArray[attr].value}`
        }
    }
    
    console.log(newStateURL)
    window.history.pushState('page', 'title', newStateURL);
}


function parseAPIContent (main, version) {
    console.log("From " + main.translation_name, main)

    var fullChapter = false;
    var chapter;
    var verse;
    var book;

    var refModified = main.reference.replace(" ", "")

    books.forEach(b => {
        if (refModified.includes(b) == false) return;
        if (isNaN(refModified.charAt(0)) == false && ( isNaN(b.charAt(0)) == true )) return console.log('Book does not start with number, but book fetched does.')

        book = `${b.toUpperCase()}&nbsp`.repeat(Math.ceil(40 / (b.length + 1)))
        
        var chapterVerse = refModified.replace(b, "")

        if (chapterVerse.includes(":") == true) {
            chapter = chapterVerse.substring(0, chapterVerse.indexOf(":"))
            verse = chapterVerse.substring((chapterVerse.indexOf(":") + 1), chapterVerse.length)
        } else {
            fullChapter = true;
            chapter = chapterVerse
            verse = "1"
        }
    })

    var bodyText = main.text
    var translation = main.translation_name

    // DOM Insert: Book
    var topBook = document.querySelector('.biblecontainer biblepassageinfo biblebook')
    topBook.innerHTML = book

    // DOM Insert: Chapter and verse 
    var topChapterVerse = document.querySelector('.biblecontainer biblepassageinfo bibleChapterVerse')
    topChapterVerse.innerHTML = `${chapter}:${verse}`

    // DOM Insert: Text content
    var body = document.querySelector('.biblecontainer bibletextcontainer')
    body.innerHTML = helper_parseVerseNumbers(bodyText)
    helper_parseNarratives(bodyText)

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
        window.scroll({top: 0, behavior: 'smooth'});

        var lastVerseNumber = document.querySelector('bibletextcontainer versenumber:last-of-type').innerHTML
        lastVerseNumber = lastVerseNumber.replace(/(\()/g, '').replace(/(\))/g, '');     
        if (fullChapter == true) topChapterVerse.innerHTML = chapter + ':' + verse + '-' + lastVerseNumber
    }, 10)
}


function helper_parseVerseNumbers(string) {
    var result = string.replace(/(\()/g, '<versenumber>(');
    result = result.replace(/(\))/g, ')</versenumber>');
    result = result.replace(":", "")

    return result
}

function helper_parseNarratives(str) {
    var verses = document.querySelectorAll('versenumber')

    verses.forEach(function(vers) {
        if (vers.innerHTML.length > 4) {
            var reg = /\(([^)]+)\)/g;
            vers.innerHTML = reg.exec(vers.innerHTML)[1]

            var endsWithPunc = !!vers.innerHTML.match(/[.,:!?;]$/)
            if (endsWithPunc == true) {
                //console.log(endsWithPunc)
            } else {
                vers.innerHTML = vers.innerHTML + ':'
            }

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

            if (this.classList[2] && this.classList[2] != "active") {
                fetchBible(book, this.classList[2].replace("CHAP", ""))
                this.classList.remove(this.classList[2])
            } else {
                fetchBible(book, 1, '')
            }

            let activeEl = document.querySelector('.bookName.active');
            if (activeEl) {activeEl.classList.remove('active')}

            this.classList.add('active')
        }
    })
}
addBookNameClicks()

function pushCurrentParamsToGlobal () {
    GLOBAL_VAR_ARRAY.urlParamsObject[0].value = getQueryParams(true).book
    GLOBAL_VAR_ARRAY.urlParamsObject[1].value = getQueryParams(true).chapter
    GLOBAL_VAR_ARRAY.urlParamsObject[2].value = getQueryParams(true).verse
    GLOBAL_VAR_ARRAY.urlParamsObject[3].value = getQueryParams(true).version
}

function ChapterNavigation(currChap) {



    function chapterNavHandler() {
        pushCurrentParamsToGlobal()
        console.log(this.dataset)

        if (this.dataset.bibleBook) {
            GLOBAL_VAR_ARRAY.urlParamsObject[0].value = this.dataset.bibleBook
            changeQueryParams()

            return;
        }

        GLOBAL_VAR_ARRAY.urlParamsObject[1].value = this.dataset.bibleChapter
        changeQueryParams()
        console.log(this.dataset.bibleChapter)
    }

    var currentBook = booksAndInfo[document.querySelector('span.bookName.active').classList[1]];
    var currBookName = document.querySelector('span.bookName.active').classList[1].replace("&", " ")
    var bookIndex = books.indexOf(currBookName)

    var prevWrap = document.querySelector('.prevChap')
    var nextWrap = document.querySelector('.nextChap')

    var chapterBefore = currChap - 1
    var chapterAfter = currChap + 1

    var bookBefore = books[bookIndex - 1]
    var bookAfter = books[bookIndex + 1]

    // DOM Level: Chapter navigation - previous button 
    if (chapterBefore > 0) {
        prevWrap.dataset.bibleChapter = chapterBefore
        prevWrap.innerHTML = `&larr; Chapter ${chapterBefore}`
        prevWrap.onclick = chapterNavHandler
    } else {
        prevWrap.dataset.bibleBook = bookBefore
        prevWrap.innerHTML = `&larr; ${bookBefore}`
        prevWrap.onclick = chapterNavHandler
    }

    // DOM Level: Chapter navigation - next button
    if (chapterAfter <= currentBook[0]) {
        nextWrap.dataset.bibleChapter = chapterAfter
        nextWrap.innerHTML = `Chapter ${chapterAfter} &rarr;`
        nextWrap.onclick = chapterNavHandler
    } else {
        if (bookIndex <= 64) {
            nextWrap.dataset.bibleBook = bookAfter
            nextWrap.innerHTML = `${bookAfter} &rarr;`
            nextWrap.onclick = chapterNavHandler
        } 
    }
}

function searchListeners() {
    document.querySelector('.gobutton').onclick = function () {
        var book = document.querySelector('.searchqueryBook').value.trim();
        var chap = document.querySelector('.searchqueryChapter').value.trim();
        var verse = document.querySelector('.searchqueryVerse').value.trim();
    
        if (!(book) || (!chap)){
            if (!(book)) document.querySelector('.searchqueryBook').style.boxShadow = '0 0 0 2px #d49b9b'
            if (!(chap)) document.querySelector('.searchqueryChapter').style.boxShadow = '0 0 0 2px #d49b9b'
            return;
        }
    
        focusBook(book)
        fetchBible(book, chap, verse)
    }
    
    document.querySelector('.searchqueryBook').addEventListener('input', function() {
        this.style.boxShadow = null
    
        if (books.includes(this.value)) {
            chapterListBasedOffBook(this.value)
        }
    })
    document.querySelector('.searchqueryChapter').addEventListener('input', function() {
        this.style.boxShadow = null
    })
    document.querySelector('.searchqueryVerse').addEventListener('keypress', function(e) {
        this.style.boxShadow = null
    
        if (e.key === 'Enter') {
            this.blur();
            document.querySelector('.gobutton').click();
        }
    })
}
searchListeners()