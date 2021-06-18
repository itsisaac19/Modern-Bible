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

document.body.onscroll = () => {
    let wrapper = document.querySelector('.controlswrapper')
    let stickyClass = isMobile ? 'mobile-sticky' : 'reg-sticky';
    
    hideSearchBox()
    
    if (window.scrollY > 0) {
        if (wrapper.classList.contains(stickyClass)) return;
        wrapper.classList.add(stickyClass)
    } else {
        if (wrapper.classList.contains(stickyClass)) {
            wrapper.classList.remove(stickyClass)
        }
    }
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


function placeDataLists() {
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

