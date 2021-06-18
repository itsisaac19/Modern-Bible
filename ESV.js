function ESVparser (response, scrollBack = true) {
    var passage = response.passages[0];

    //Log
    console.groupCollapsed('ESV Request');
    console.log(`Query: ${response.canonical}`);

    console.groupCollapsed('Passage');
    console.log(passage);
    console.groupEnd();
    console.groupEnd();

    let footerNotes = passage.substring(passage.indexOf('Footnotes') + 9, passage.length)
    footerNotes = footerNotes.replace(/(\()/g, '<br>(')

    // Narratives
    const parseNarratives = (DOMbody) => {
        DOMbody.querySelectorAll('versenumber').forEach((versenumber) => {
            if (versenumber.textContent.length > 6) {
                versenumber.classList.add('narrative')
            } 
            if (versenumber.parentElement.tagName.toLowerCase() === 'sup') {
                let savedNum = versenumber.textContent;
                versenumber.parentElement.innerHTML = `[${savedNum}]`
            }
        })
    }

    function parse() {
        let result = passage;
        result = result.replace(/\n    \n    \n/g, "<br><br>").replace(/\n/g, "<br>")

        // ESV text
        result = result.replace('(ESV)', '<br><br>English Standard Version • ESV')

        // Verse Numbers
        result = result.replace(/(\[)/g, '&nbsp&nbsp<versenumber>');
        result = result.replace(/(\])/g, '</versenumber>');

        // Superscripts
        result = result.replace(/(\(\d{1,2}\))/gm, `<sup>$1</sup>`)

        // Narratives
        //console.log(result.match(/(\()/g), result)
        result = result.replace(/(\()/g, '&nbsp&nbsp<versenumber>');
        result = result.replace(/(\))/g, '</versenumber>');

        if (result.includes('Footnotes') == true) {
            result = result.substring(0, result.indexOf('Footnotes')) + ("<br><br>Footnotes", "<span class='footer'>Footnotes</span>" + footerNotes)
        }

        result = result.substring(result.indexOf('<br>'), result.length) 

        return result
    }

    var finalPush;

    if (response.canonical.includes('Song of Solomon') == true) {
        console.log(response)
        finalPush = parse()
    } else {
        finalPush = parse()
    }


    let currentBook = GLOBAL_VAR_ARRAY.urlParamsObject.book.value
    let fullChapter = GLOBAL_VAR_ARRAY.urlParamsObject.verse.value ? false : true;
    let chapter = GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value;
    let verse = GLOBAL_VAR_ARRAY.urlParamsObject.verse.value || 1;

    // DOM Insert: Book
    var topBook = document.querySelector('.biblecontainer biblepassageinfo biblebook')
    topBook.innerHTML = `${currentBook.toUpperCase()}&nbsp`.repeat(Math.ceil(40 / (currentBook.length + 1)))

    // DOM Insert: Chapter and verse 
    var topChapterVerse = document.querySelector('.biblecontainer biblepassageinfo bibleChapterVerse')
    topChapterVerse.innerHTML = `${chapter}:${verse}`

    // DOM Insert: Text content
    var DOMbody = document.querySelector('.biblecontainer bibletextcontainer')
    DOMbody.innerHTML = finalPush;

    if (GLOBAL_VAR_ARRAY.urlParamsObject.verse.value) {
        isOneVersePassage(parseInt(GLOBAL_VAR_ARRAY.urlParamsObject.verse.value))
    }

    function footnotesClicks () {
        let superScriptEls = document.querySelectorAll('bibletextcontainer > sup') 
        superScriptEls.forEach(el => {
            el.onclick = function () {
                let bdyHeight = document.querySelector('bibletextcontainer').scrollHeight
                window.scroll({
                    top: bdyHeight,
                    behavior: 'smooth'
                });
            }
        })
    }
    parseNarratives(DOMbody)
    footnotesClicks()

    ChapterNavigation(parseInt(chapter))
    showMainContent()

    testValidity(currentBook, chapter, verse)

    // DOM Timings: Scrolling back to top, and displaying last verse number for a full chapter
    setTimeout(function() {
        if (scrollBack == true) {
            window.scroll({top: 0, behavior: 'smooth'});
        }

        var lastVerseNumber = cleanText(document.querySelectorAll('bibletextcontainer versenumber')[document.querySelectorAll('bibletextcontainer versenumber').length - 1].innerHTML)   
        if (fullChapter == true) topChapterVerse.innerHTML = chapter + ':' + verse + '-' + lastVerseNumber;

        if (fullChapter == true) { 
            return readyCallback()
        }

        if (!(verse)) {
            verse = verse + '-' + lastVerseNumber
        }

        if (verse.includes('-') == false && fullChapter == true) {
            verse = verse + '-' + lastVerseNumber
        }
        
        readyCallback()
    }, 10)

}

