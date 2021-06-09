function NLTparser (HTML) {
    //console.groupCollapsed("Raw");
    //console.log(HTML)
    //console.groupEnd();

    const h = {
        content: HTML,
        getBody: function () {
            let bStart = this.content.indexOf("<body") + 6;
            let bEnd = this.content.indexOf("</body");
            let body = this.content.slice(bStart, bEnd).trim();
            
            return body;
        },
        convToObject: function () {
            let body = this.getBody();
            let bWrap = document.createElement("body");

            bWrap.innerHTML = body;
            //console.log("obj:", bWrap);
            
            let comments = bWrap.querySelectorAll('span.tn');
            let stars = bWrap.querySelectorAll('a.a-tn')

            if (comments) {
                let cArray = [];
                comments.forEach(comment => {
                    cArray.push(comment)
                    comment.remove()
                })
                //console.log('Removed comments:', cArray);
            }
            if (stars) {
                stars.forEach(star => {
                    star.remove()
                })
            }

            return bWrap;
        }
    };

    const body = h.convToObject()


    let allVerses = body.querySelectorAll('section > verse_export');

    let pushAllText = {
        content: "",
        convToObject: function () {
            let tempWrap = document.createElement("div");
            tempWrap.innerHTML = this.content;
            return tempWrap;
        },
        formatVerseNumbers: function () {
            let HTML = this.convToObject(); 
            let verseNumberEls = HTML.querySelectorAll('span.vn')

            verseNumberEls.forEach(v => {
                let parentOfV = v.parentElement;
                let num = `&nbsp&nbsp${v.innerHTML} `;
                let newVerseNumber = document.createElement('versenumber');
                
                newVerseNumber.innerHTML = num;
                parentOfV.replaceChild(newVerseNumber, v)
            })

            console.log('Formatted Verse Numbers (Final Push):', HTML)

            return HTML;
        }
    }

    allVerses.forEach(function(v, index) {
        let allText = v.querySelectorAll('p');
        allText.forEach(t => {
            if (t.classList.length == 0) return; 
            if (t.classList[0].includes('poet') == false && t.classList[0].includes('body') == false && t.classList[0].includes('ext') == false) return; //console.log('Does not contain poet, body, or ext: ', t)
            pushAllText.content += t.innerHTML;
        })
    })

    let finalPush = pushAllText.formatVerseNumbers();

    let currentBook = GLOBAL_VAR_ARRAY.urlParamsObject.book.value
    // DOM Insert: Book
    var topBook = document.querySelector('.biblecontainer biblepassageinfo biblebook')
    topBook.innerHTML = `${currentBook.toUpperCase()}&nbsp`.repeat(Math.ceil(40 / (currentBook.length + 1)))

    // DOM Insert: Chapter and verse 
    var topChapterVerse = document.querySelector('.biblecontainer biblepassageinfo bibleChapterVerse')
    topChapterVerse.innerHTML = `${GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value}:${GLOBAL_VAR_ARRAY.urlParamsObject.verse.value}`

    // DOM Insert: Text content
    var DOMbody = document.querySelector('.biblecontainer bibletextcontainer')
    DOMbody.innerHTML = finalPush.innerHTML;

    if (parseInt(GLOBAL_VAR_ARRAY.urlParamsObject.verse.value)) {
        isOneVersePassage()
    }

    function spaceOutVerses () {
        let verseNumbers = document.querySelectorAll('bibletextcontainer versenumber')

        verseNumbers.forEach(v => {
            let rawNum = v.innerHTML.replace(/&nbsp;/gi, '')
            if (parseInt(rawNum) % 5 == 0) {
                v.innerHTML = `<br><br>${v.innerHTML}`
            }
        })
    }
    spaceOutVerses()

    ChapterNavigation(parseInt(GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value))
    showMainContent()

    var fullChapter = true;
    let verse = GLOBAL_VAR_ARRAY.urlParamsObject.verse.value || 1

    if (GLOBAL_VAR_ARRAY.urlParamsObject.verse.value) {
        fullChapter = false;
    } 
    testValidity(GLOBAL_VAR_ARRAY.urlParamsObject.book.value, GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value, GLOBAL_VAR_ARRAY.urlParamsObject.verse.value)

    // DOM Timings: Scrolling back to top, and displaying last verse number for a full chapter
    setTimeout(function() {
        window.scroll({top: 0, behavior: 'smooth'});
        
        var lastVerseNumber = cleanText(document.querySelectorAll('bibletextcontainer versenumber')[document.querySelectorAll('bibletextcontainer versenumber').length - 1].innerHTML)   
        if (fullChapter == true) topChapterVerse.innerHTML = GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value + ':' + verse + '-' + lastVerseNumber;

        if (fullChapter == true) { 
            return readyCallback()
        }

        if (!(GLOBAL_VAR_ARRAY.urlParamsObject.verse.value)) {
            GLOBAL_VAR_ARRAY.urlParamsObject.verse.value = verse + '-' + lastVerseNumber
        }

        if (GLOBAL_VAR_ARRAY.urlParamsObject.verse.value.includes('-') == false) {
            GLOBAL_VAR_ARRAY.urlParamsObject.verse.value = verse + '-' + lastVerseNumber
        }
        
        readyCallback()
    }, 10)

}

