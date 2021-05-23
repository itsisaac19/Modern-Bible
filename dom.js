// DOM Level
// DOM Level
// DOM Level
// DOM Level
// DOM Level
// DOM Level


if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    document.body.classList.add('mobiledevice')
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
    let rangeEls = document.querySelectorAll(`.bibleControl > input[type="range"]`)
   
    rangeEls.forEach(rangeEl => {
        rangeEl.value = rangeEl.getAttribute("dvalue")
        rangeEl.dispatchEvent(new Event('input'));
    })
}

function assignRangeValues () {
    if (localStorage.getItem('lineSpacing') || localStorage.getItem('fontSize')) {
        let lineSpacingRange = document.querySelector('#lineSpacingRange');
        let fontSizeRange = document.querySelector('#fontSizeRange');
        
        lineSpacingRange.value = localStorage.getItem('lineSpacing') || lineSpacingRange.getAttribute("dvalue")
        fontSizeRange.value = localStorage.getItem('fontSize') || fontSizeRange.getAttribute("dvalue")  
        
        lineSpacingRange.dispatchEvent(new Event('input'));
        fontSizeRange.dispatchEvent(new Event('input'));
    }
}

function saveRangeValues () {
    let lineSpacingRange = document.querySelector('#lineSpacingRange');
    let fontSizeRange = document.querySelector('#fontSizeRange');
    
    localStorage.setItem('lineSpacing', lineSpacingRange.value)
    localStorage.setItem('fontSize', fontSizeRange.value)
}

function assignBibleControlListeners() {
    document.querySelector('.doneControl').onclick = toggleBibleControls
    document.querySelector('.bibleControlIcon').onclick = toggleBibleControls
    document.querySelector('.bibleControlIconStickyLabel').onclick = toggleBibleControls
    document.querySelector('.resetButton').onclick = resetBibleControls

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

    assignRangeValues()
}
assignBibleControlListeners()

function focusBook(book, firstTime) {
    let sidebar = document.querySelector('.sidebar')
    let activeBookEl = document.querySelector('.bookName.active')

    if (activeBookEl && activeBookEl.classList.contains(book)) {
        return console.log("Same book:", activeBookEl)
    }

    let bookEl = document.querySelector(`.bookName[class='bookName ${book}']`)

    if (activeBookEl) activeBookEl.classList.remove('active');
    if (bookEl && bookEl.classList.contains('active') == false) bookEl.classList.add('active');

    // SCROLL
    if (firstTime == true) {
        setTimeout(() =>{
            sidebar.classList.remove('ready')
            document.querySelector('.bookName.active').scrollIntoView({block: "center", behavior: 'smooth'});
            setTimeout(() =>{
                sideBarScrollListeners()
            }, 100)
        }, 1000)
        console.warn("Scrolling to #"+book)
    } else {
        document.querySelector('.bookName.active').scrollIntoView({block: "center", behavior: 'smooth'});
    }
}


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


function sideBarScrollListeners () {
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
    this.innerHTML = "close"
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






function placeDataLists(firstTime = true) {
    if (!document.querySelector('span.bookName.active') && firstTime === true) return;

    var currentBook = document.querySelector('span.bookName.active').classList[1].replace("&", " ")
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

setTimeout(placeDataLists, 500)




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
