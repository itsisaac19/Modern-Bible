var firebaseConfig = {
    apiKey: "AIzaSyBTQiM-464VTkriWKagu-wXYfYTG9vB7Cg",
    authDomain: "modernbibleapp.firebaseapp.com",
    projectId: "modernbibleapp",
    storageBucket: "modernbibleapp.appspot.com",
    messagingSenderId: "995363243066",
    appId: "1:995363243066:web:fa939b2ad21a09b4d8e103",
    measurementId: "G-G0E68MSNHN"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

function cleanText(txt) {
    var clean = txt;

    // Trim
    clean = clean.trim()

    // Line Breaks
    clean = clean.replaceAll("<br>", "")

    // &nbsp;
    clean = clean.replace(/&nbsp;/gi, '').replace(/\u00a0/g, "");

    return clean;
}

class verseNumber {
    constructor(txt) {
        this.txt = txt;
    }
    parseHTML() {
        return parseHTMLFromString(`<versenumber>&nbsp;&nbsp;${this.txt}&nbsp;</versenumber>`);
    }
}

function parseHTMLFromString (string) {
    let wrapper = document.createElement('div');
    wrapper.innerHTML = string;
    return wrapper.children[0]
}

function sliceBeginning (HTML) {
    let indexOfFirstVerse = HTML.indexOf('<versenumber>')
    let sliced = HTML.substring(indexOfFirstVerse, HTML.length)

    return sliced;
}

function filter (div) {
    let filteredDiv = ''
    let count = 0;
    let isVerse = false;

    div.querySelectorAll('span').forEach(span => {
        let text = cleanText(span.textContent)
        // Book Name 
        if (books.includes(text) == true) {
            console.log(text, '-BOOK')
            filteredDiv += text
            return;
        }
        // Verse Numbers
        if (span.style.color == 'rgb(204, 0, 0)' || span.style.color == 'rgb(51, 102, 204)') {
            verseObject = new verseNumber(text)
            filteredDiv = verseObject.parseHTML()
            isVerse = true;
            return console.log(text, '-VERSE NUMBER')
        } 
        // Regular passage text
        if (text.length > 3) {
            console.log(text)
            console.log('COUNT = ',count)
            if (count > 0) {
                console.log('GREATER THAN 1', filteredDiv)
                if (filteredDiv.textContent) {
                    filteredDiv = filteredDiv.textContent + text
                } else {
                    filteredDiv = filteredDiv + text
                }
            } else {
                filteredDiv = text
            }
            
            count += 1;
            return console.log(span.textContent, '-regular')
        }

        return filteredDiv = div;
    })



    var wrapper;
    if (isVerse == false) {
        wrapper = document.createTextNode(cleanText(filteredDiv.textContent || filteredDiv))
    } else {
        console.log(filteredDiv)
        wrapper = filteredDiv;
    }
    
    console.log(wrapper)
    return wrapper;
}

function execute (HTML) {
    var content = HTML;
    var wrapper = document.createElement('div');
    var alternateWrapper = document.createElement('div');

    content.querySelectorAll('.ie_fix > *').forEach(node => {
        wrapper.appendChild(filter(node))
    })

    wrapper = sliceBeginning(wrapper.innerHTML)

    console.log("FINAL", wrapper)

    return logResult(content)  
}

async function getLocalHTML () {
    let localResult = await fetch('NIV.html').then(response => response.text());
    execute(parseHTMLFromString(localResult))
    document.body.innerHTML = parseHTMLFromString(localResult).querySelectorAll('div.text_layer')[0].outerHTML
}
getLocalHTML()


function logResult (text) {
    console.log(text);
}

function postData (book, chapter,content) {
    firebase.database().ref(`${book}/${chapter}`).set({
        content
    }, (err) => {
        if (err) {
            console.warn('Data was not saved')
        } else {
            console.log('Data saved successfully')
        }
    })
}
