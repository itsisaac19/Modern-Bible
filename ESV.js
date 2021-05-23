function ESVparser (response) {
    var passage = response.passages[0];

    console.groupCollapsed('Passage:')
    console.log(passage);
    console.groupEnd()

    let footerNotes = passage.substring(passage.indexOf('Footnotes') + 9, passage.length)
    footerNotes = footerNotes.replace(/(\()/g, '<br>(')
    
    passage = passage.replace(/\n/g, "<br>");

    function parse() {
        let result = passage.replace(/(\[)/g, '&nbsp&nbsp<versenumber>');
        result = result.replace(/(\])/g, '</versenumber>');
        result = result.replace(":", "")

        if (result.includes('Footnotes') == true) {
            result = result.substring(0, result.indexOf('Footnotes')) + ("<br><br>Footnotes", "<span class='footer'>Footnotes</span>" + footerNotes)
        }

        result = result.substring(result.indexOf('<br>'), result.length) 

        return result
    }

    let finalPush = parse()

    let currentBook = GLOBAL_VAR_ARRAY.urlParamsObject.book.value
    // DOM Insert: Book
    var topBook = document.querySelector('.biblecontainer biblepassageinfo biblebook')
    topBook.innerHTML = `${currentBook.toUpperCase()}&nbsp`.repeat(Math.ceil(40 / (currentBook.length + 1)))

    // DOM Insert: Chapter and verse 
    var topChapterVerse = document.querySelector('.biblecontainer biblepassageinfo bibleChapterVerse')
    topChapterVerse.innerHTML = `${GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value}:${GLOBAL_VAR_ARRAY.urlParamsObject.verse.value}`

    // DOM Insert: Text content
    var DOMbody = document.querySelector('.biblecontainer bibletextcontainer')
    DOMbody.innerHTML = finalPush;

    if (parseInt(GLOBAL_VAR_ARRAY.urlParamsObject.verse.value) == 1) {
        isOneVersePassage()
    }

    ChapterNavigation(parseInt(GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value))
    showMainContent()

    var fullChapter = true;
    let verse = GLOBAL_VAR_ARRAY.urlParamsObject.verse.value || 1

    if (GLOBAL_VAR_ARRAY.urlParamsObject.verse.value) fullChapter = false;

    // DOM Timings: Scrolling back to top, and displaying last verse number for a full chapter
    setTimeout(function() {
        window.scroll({top: 0, behavior: 'smooth'});

        var lastVerseNumber = document.querySelectorAll('bibletextcontainer versenumber')[document.querySelectorAll('bibletextcontainer versenumber').length - 1].innerHTML
        lastVerseNumber = lastVerseNumber.replace(/(\()/g, '').replace(/(\))/g, '').replaceAll("<br>", "");    
        if (fullChapter == true) topChapterVerse.innerHTML = GLOBAL_VAR_ARRAY.urlParamsObject.chapter.value + ':' + verse + '-' + lastVerseNumber.trim()
    }, 10)
}

