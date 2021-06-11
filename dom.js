// DOM Level
// DOM Level
// DOM Level
// DOM Level
// DOM Level
// DOM Level
Selector = (s,c) => (c ?? document).querySelector(s);
SelectorAll = (s,c) => (c ?? document).querySelectorAll(s);

function setMetaTags () {
    const tags = document.head.querySelectorAll('meta')
    var params = GLOBAL_VAR_ARRAY.urlParamsObject

    function replaceNbsps(str) {
        var re = new RegExp(String.fromCharCode(160), "g");
        return str.replace(re, " ");
    }

    let title = `${params.book.value} ${Selector('biblechapterverse').innerHTML}`
    let description = replaceNbsps(Selector('bibletextcontainer').textContent.substring(0, 146).replace())

    Selector('meta[name="title"]').setAttribute('content', title)
    Selector('meta[name="description"]').setAttribute('content', `${description}`)

    Selector('meta[property="og:title"]').setAttribute('content', title)
    Selector('meta[property="og:description"]').setAttribute('content', `${description}`)
}


function hideMainContent(animate = true) {
    var wrap = document.querySelector('.biblecontainer')
    
    wrap.style.transition = '0.3s ease'
    wrap.style.opacity = '0'
}
function showMainContent(animate = true) {
    var wrap = document.querySelector('.biblecontainer')

    wrap.style.opacity = '1'

    setTimeout(function() {wrap.style.transition = null}, 300)
}


function toggleBibleControls () {
    let controls = document.querySelector('.bibleControls')
    let icon = document.querySelector('.bibleControlIcon')
    let isHidden = controls.classList.contains('hidden') 
    
    if (isHidden == false) {
        controls.classList.add('hidden')
        icon.classList.remove('active')
    }

    if (isHidden == true) {
        controls.classList.remove('hidden')
        icon.classList.add('active')
    }
}

function resetBibleControls () {
    let rangeEls = document.querySelectorAll(`.textControl > input[type="range"]`)
   
    rangeEls.forEach(rangeEl => {
        rangeEl.value = rangeEl.getAttribute("dvalue")
        rangeEl.dispatchEvent(new Event('input'));
    })
}

function assignRangeValues () {
    let lineSpacingRange = document.querySelector('#lineSpacingRange');
    let fontSizeRange = document.querySelector('#fontSizeRange');
    let reset = document.querySelector('.reset-text');

    if (localStorage.getItem('lineSpacing') || localStorage.getItem('fontSize')) {
        
        lineSpacingRange.value = localStorage.getItem('lineSpacing') || lineSpacingRange.getAttribute("dvalue")
        fontSizeRange.value = localStorage.getItem('fontSize') || fontSizeRange.getAttribute("dvalue")  
        
        lineSpacingRange.dispatchEvent(new Event('input'));
        fontSizeRange.dispatchEvent(new Event('input'));

        reset.classList.add('valid')
        reset.classList.remove('hidden')
    }
    if (lineSpacingRange.value == lineSpacingRange.getAttribute("dvalue") && fontSizeRange.value == fontSizeRange.getAttribute("dvalue")) {
        reset.classList.remove('valid')
        reset.classList.add('hidden')
    }
}

function saveRangeValues () {
    let lineSpacingRange = document.querySelector('#lineSpacingRange');
    let fontSizeRange = document.querySelector('#fontSizeRange');
    
    localStorage.setItem('lineSpacing', lineSpacingRange.value)
    localStorage.setItem('fontSize', fontSizeRange.value)

    let reset = document.querySelector('.reset-text');
    reset.classList.add('valid')
    reset.classList.remove('hidden')
}

function assignBibleControlListeners() {
    //document.querySelector('.resetButton').onclick = resetBibleControls

    let lineSpacingRange = document.querySelector('#lineSpacingRange');

    lineSpacingRange.addEventListener('input', function () {
        let container = document.querySelector('bibletextcontainer')
        let lineSpacingValue = `${this.value}px`
        container.style.lineHeight = lineSpacingValue

        this.parentElement.children[0].children[0].innerHTML = `${this.value}px`

        saveRangeValues()
    })

    let fontSizeRange = document.querySelector('#fontSizeRange');

    fontSizeRange.addEventListener('input', function () {
        let container = document.querySelector('bibletextcontainer')
        let fontSizeValue = `${this.value}px`
        container.style.fontSize = fontSizeValue

        this.parentElement.children[0].children[0].innerHTML = `${this.value}px`

        saveRangeValues()
    })

    let reset = document.querySelector('.reset-text');
    reset.addEventListener('click', function () {
        resetBibleControls()
        this.classList.remove('valid')
        this.classList.add('hidden')
    })

    assignRangeValues()
}
assignBibleControlListeners()

function focusBook(book, firstTime) {
    return;
    let sidebar = document.querySelector('.sidebar')
    let activeBookEl = document.querySelector('.bookName.active')

    if (activeBookEl && activeBookEl.classList.contains(book)) {
        return console.log("Same book:", activeBookEl)
    }

    let bookEl = document.querySelector(`.bookName[class='bookName ${book}']`)

    if (activeBookEl) activeBookEl.classList.remove('active');
    if (bookEl && bookEl.classList.contains('active') == false) bookEl.classList.add('active');
}

function stickyControls () {
    let wrapper = document.querySelector('.controlswrapper')
    let wrapperChildren = wrapper.querySelectorAll('div')

    if (isMobile == true) {
        wrapper.classList.add('stickyTransitions')
        wrapperChildren.forEach(child => {
            child.classList.add('stickyTransitions')
            child.classList.add('modstickyTransitions')
        })
        
        if (window.scrollY > 0) {
            if (wrapper.classList.contains('mobile-sticky') == true) return;
            wrapper.classList.add('mobile-sticky')
        } else {
            if (wrapper.classList.contains('mobile-sticky')) {
                wrapper.classList.remove('mobile-sticky')
            }
        }
    } else {
        wrapper.classList.add('stickyTransitions')
        wrapperChildren.forEach(child => {
            child.classList.add('stickyTransitions')
        })
        
        if (window.scrollY > 0) {
            if (wrapper.classList.contains('reg-sticky') == true) return;
            wrapper.classList.add('reg-sticky')
        } else {
            if (wrapper.classList.contains('reg-sticky')) {
                wrapper.classList.remove('reg-sticky')
            }
        }
    }
}    

$('.selectTranslations').on('focus', function(e) {
    var savedScrollTop = $(document).scrollTop(); // save scroll position
    $(document).scrollTop(savedScrollTop ); // restore it
    //alert(savedScrollTop)
});

window.onscroll = stickyControls

// SEARCH 

function addSearchListener() {
    document.querySelector('.searchWrapper > .material-icons').onclick = initSearch
}
addSearchListener()

function closeSearch() {
    this.innerHTML = "search"
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

}


function cleanText(txt) {
    var clean = txt;

    // Trim
    clean = clean.trim()

    // Line Breaks
    clean = clean.replaceAll("<br>", "")

    // &nbsp;
    clean = clean.replace(/&nbsp;/gi, '')

    return clean;
}



function placeDataLists(firstTime = true) {
    var currentBook = GLOBAL_VAR_ARRAY.urlParamsObject.book.value
    // BOOKS
    var booksList = document.querySelector('#booksDataList');
    booksList.innerHTML = "";

    books.forEach((book) => {
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

function chapterListBasedOffBook(book) {
    var currentBook = book

    var chaptersList = document.querySelector('#chapterDataList');
    chaptersList.innerHTML = "";

    for(i = 0; i < booksAndInfo[currentBook][0]; i++) {
        var optionEl = document.createElement('option');
        optionEl.innerHTML = (i+1);

        chaptersList.appendChild(optionEl)
    }
}





function faviconTheme() {
    const none = document.querySelector('link#none')
    const darkFavicon = document.querySelector('link#dark')
    const lightFavicon = document.querySelector('link#light')

    if (window.matchMedia('prefers-color-scheme:dark').matches) {
        // It's a dark theme...'
        darkFavicon.remove()
    } else if (window.matchMedia('prefers-color-scheme:light').matches) {
        // It's not a dark theme...
        lightFavicon.remove()
    } else {
        darkFavicon.remove()
        lightFavicon.remove()
    }
}
faviconTheme()
