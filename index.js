function dummy (book, chapter, verse) {
    console.log("Fetching: ", book, chapter, verse)

    if (chapter && verse) {
        fetch('https://bible-api.com/'+ book +'+'+ chapter + ':' + verse +'?verse_numbers=true')
        .then(response => response.json())
        .then(data => {
            parse(data)
        })
    }
    if (book && chapter && !(verse)) {
        fetch('https://bible-api.com/'+ book +'+'+ chapter +'?verse_numbers=true')
        .then(response => response.json())
        .then(data => {
            parse(data)
        })
    }

    hideMainContent()
}

setTimeout(function() {
    document.getElementsByClassName('bookName')[0].click()
}, 1)


function parse (main) {
    showMainContent()
    console.log("Response: ", main)

    var chapter;
    var fullChapter = false;

    var verse;
    var book;

    books.forEach(b => {
        if (main.reference.includes(b)) {
            book = (b.toUpperCase() + '&nbsp');
            if (40 / book.length) {
                var num = Math.ceil(40 / (b.length + 1))
                book = book.repeat(num)
            }

            var reg = new RegExp(b, "g");
            var chapterVerse = main.reference.replace(reg, "")

            if (chapterVerse.includes(":")) {
                chapter = chapterVerse.substring(0, chapterVerse.indexOf(":"))
                verse = chapterVerse.substring((chapterVerse.indexOf(":") + 1), chapterVerse.length)
            } else {
                fullChapter = true;
                chapter = chapterVerse
                verse = "1"
            }


        }
    })



    var bodyText = main.text
    var translation = main.translation_name

    // DOM Insert: book
    var topBook = document.querySelector('.biblecontainer biblepassageinfo biblebook')
    topBook.innerHTML = book

    // DOM Insert: chapter and verse 
    var topChapterVerse = document.querySelector('.biblecontainer biblepassageinfo bibleChapterVerse')
    topChapterVerse.innerHTML = chapter + ':' + verse

    // DOM Insert: if full chapter get last verse
    setTimeout(function() {
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });

    var lastVerseNumber = document.querySelector('bibletextcontainer versenumber:last-of-type').innerHTML
    lastVerseNumber = lastVerseNumber.replaceAll(/(\()/g, '').replaceAll(/(\))/g, '');     
    if (fullChapter == true) topChapterVerse.innerHTML = chapter + ':' + verse + '-' + lastVerseNumber
    }, 10)
    // DOM Insert: text content
    var body = document.querySelector('.biblecontainer bibletextcontainer')
    body.innerHTML = helper_parseVerseNumbers(bodyText)
    helper_parseNarratives(bodyText)

    ChapterNavigation(chapter)
}


function helper_parseVerseNumbers(string) {
    var result = string.replaceAll(/(\()/g, '<br><br><versenumber>(');
    result = result.replaceAll(/(\))/g, ')</versenumber>');
    result = result.replaceAll(":", "")

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
            el.classList.add(el.innerHTML.replaceAll(/\s/g, '&'))
            el.innerHTML = abrv
        })
    } else {
        Array.prototype.forEach.call(bookNames, function(el) {
            var abrv = helper_parseIntoAbbreviations(el.innerHTML)
            el.innerHTML = el.classList[1].replaceAll("&", " ")
        })
    }


}




// DOM Level

function hideMainContent() {
    var wrap = document.querySelector('.biblecontainer')
    
    wrap.style.transition = '0.3s ease'
    wrap.style.opacity = '0'
}
function showMainContent() {
    var wrap = document.querySelector('.biblecontainer')

    wrap.style.opacity = '1'

    setTimeout(function() {wrap.style.transition = null}, 300)
}

Array.prototype.forEach.call(document.querySelectorAll('.bookName'), function(el) {
    el.onclick = function() {
        if (this.classList[1]) {
            var book = this.classList[1].replaceAll("&", "")

            if (this.classList[2] && this.classList[2] != "active") {
                dummy(book, this.classList[2].replace("CHAP", ""))
                this.classList.remove(this.classList[2])
            } else {
                dummy(book, 1, '')
            }


            if (document.querySelector('.sidebar > div > span.bookName.active')) {
                document.querySelector('.sidebar > div > span.bookName.active').classList.remove('active')
            }
            this.classList.add('active')
        } else {
            var book = this.innerHTML.replaceAll("&", "")
            dummy(book, 1, '')

            if (document.querySelector('.sidebar > div > span.bookName.active')) {
                document.querySelector('.sidebar > div > span.bookName.active').classList.remove('active')
            }
            this.classList.add('active')
        }
    }
})

document.querySelector('.absoluteIcon').onclick = expandSideBar

function expandSideBar () {
    var textWrap = document.querySelector('.outerwrap .biblecontainer');

    if (this.parentElement.classList.contains('hidden')) {
        // EXPANDED
        this.parentElement.classList.remove('hidden')

        this.children[0].classList.remove('material-icons')
        this.classList.remove('hidden')
        this.children[0].innerHTML = 'close'

        textWrap.style.transition = '0.3s ease'
        textWrap.classList.add('pushed')

        helper_formatCollapsedSideBarHTML(true)
    } else {
        // CLOSED
        this.parentElement.classList.add('hidden')

        this.children[0].classList.add('material-icons')
        this.classList.add('hidden')
        this.children[0].innerHTML = 'subject'

        textWrap.classList.remove('pushed')
        setTimeout(function(){textWrap.style.transition = null}, 300)

        helper_formatCollapsedSideBarHTML()
    }
}

document.querySelector('.sidebar').onscroll = function () {
    passiveScrollBar(this)

    if (this.scrollTop && this.scrollTop > 10) {
        if (!(document.querySelector('.absoluteIcon').classList.contains('sticky'))) {
            document.querySelector('.absoluteIcon').classList.add('sticky')
        }
    } else {
        if (document.querySelector('.absoluteIcon').classList.contains('sticky')) {
            document.querySelector('.absoluteIcon').classList.remove('sticky') 
        }
    }
}
document.querySelector('.sidebar').onmouseenter = function () {
    passiveScrollBar(this)
}
document.querySelector('.sidebar').onmouseleave = function () {
    passiveScrollBar(this, true)
}

var scrollTimer;
function passiveScrollBar (elm, reverse) {
    if (!(elm.classList.contains("on-scrollbar"))) {
        clearTimeout(scrollTimer)

        elm.classList.add("on-scrollbar");
        elm.classList.remove("off-scrollbar");

        scrollTimer = setTimeout(function(){
            passiveScrollBar(elm, true)
        }, 1500)    
    } else if (reverse == true) {
        clearTimeout(scrollTimer)

        elm.classList.remove("on-scrollbar");
        elm.classList.add("off-scrollbar");
    } else if (elm.classList.contains("on-scrollbar")) {
        clearTimeout(scrollTimer)
        scrollTimer = setTimeout(function(){
            passiveScrollBar(elm, true)
        }, 1000)    
    }
}


// SEARCH 

function addSearchListener() {
    document.querySelector('.searchBox > .material-icons.ready').onclick = initSearch
}
addSearchListener()

function closeSearch() {
    var box = this.parentElement;
    var querysBox = box.children[0];

    this.classList.remove("active")
    this.classList.add("ready")

    querysBox.classList.remove("shown")

    document.querySelector('.searchBox > .material-icons.ready').onclick = initSearch

    setTimeout(function() {
        querysBox.style.display = null
    }, 300)
}

function initSearch () {
    var thisTransfer = this
    var box = this.parentElement;
    var querysBox = box.children[0];

    querysBox.style.display = "grid"

    setTimeout(function() {
        thisTransfer.classList.remove("ready")
        thisTransfer.classList.add("active")
    
        querysBox.classList.add("shown")
        document.querySelector('.searchBox > .material-icons.active').onclick = closeSearch

    }, 10)
}


function ChapterNavigation(currChap) {
    var currentBook = booksAndInfo[document.querySelector('span.bookName.active').classList[1].replace("&", " ")];
    var currBookName = document.querySelector('span.bookName.active').classList[1].replace("&", " ")

    var prevWrap = document.querySelector('.prevChap')
    var nextWrap = document.querySelector('.nextChap')

    if (parseInt(currChap) - 1 > 0) {
        prevWrap.innerHTML = '&larr; Chapter' + ' ' + (parseInt(currChap) - 1)
        
        prevWrap.onclick = function () {
            dummy(currBookName, (parseInt(currChap) - 1))
        } 
    } else {
        var currIndex = books.indexOf(currBookName)

        if (currIndex > 0) {
            var nameOfPrev = books[currIndex - 1]
            prevWrap.innerHTML = '&larr; ' + nameOfPrev
            prevWrap.onclick = function () {
                console.log(nameOfPrev.replace(" ", "&"))
                document.getElementsByClassName(nameOfPrev.replace(" ", "&"))[0].classList.add("CHAP" + booksAndInfo[nameOfPrev][0])
                document.getElementsByClassName(nameOfPrev.replace(" ", "&"))[0].click()
                //dummy(nameOfPrev, booksAndInfo[nameOfPrev][0])
            } 
        } else {
            prevWrap.innerHTML = null
        }
    }

    if (parseInt(currChap) + 1 <= currentBook[0]) {
        console.log(currentBook)
        nextWrap.innerHTML = 'Chapter' + ' ' + (parseInt(currChap) + 1) + ' &rarr;'
        nextWrap.onclick = function () {
            dummy(currBookName, (parseInt(currChap) + 1))
        } 
    } else {
        var currIndex = books.indexOf(currBookName)

        if (currIndex < 27) {
            var nameOfNext = books[currIndex + 1]
            nextWrap.innerHTML = nameOfNext + ' &rarr;' 
            nextWrap.onclick = function () {
                console.log(nameOfNext.replace(" ", "&"))
                document.getElementsByClassName(nameOfNext.replace(" ", "&"))[0].click()
                //dummy(nameOfNext, booksAndInfo[nameOfNext][0])
            } 
        } else {
            nextWrap.innerHTML = null
        }
    }
}



function placeDataLists() {
    var currentBook = document.querySelector('span.bookName.active').classList[1]
    // BOOKS
    var booksList = document.querySelector('#booksDataList');
    booksList.innerHTML = "";

    books.forEach(function(book) {
        var optionEl = document.createElement('option');
        optionEl.innerHTML = book;

        booksList.appendChild(optionEl)
    })

    // CHAPTERS
    var chaptersList = document.querySelector('#chapterDataList');
    chaptersList.innerHTML = "";

    for(i = 0; i < booksAndInfo[currentBook][0]; i++) {
        var optionEl = document.createElement('option');
        optionEl.innerHTML = (i+1);

        chaptersList.appendChild(optionEl)
    }
}

setTimeout(placeDataLists, 500)


document.querySelector('.gobutton').onclick = function () {
    var book = document.querySelector('.searchqueryBook').value;
    var chap = document.querySelector('.searchqueryChapter').value;
    var verse = document.querySelector('.searchqueryVerse').value;

    if (!(book) || (!chap)){
        if (!(book)) document.querySelector('.searchqueryBook').style.boxShadow = '0 0 0 2px #d49b9b'
        if (!(chap)) document.querySelector('.searchqueryChapter').style.boxShadow = '0 0 0 2px #d49b9b'
        return;
    }

    dummy(book, chap, verse)
}

document.querySelector('.searchqueryBook').addEventListener('input', function() {
    this.style.boxShadow = null
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