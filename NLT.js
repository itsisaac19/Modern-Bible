function NLTparser (HTML) {
    console.log(HTML)

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
            console.log(bWrap);
            
            let comments = bWrap.querySelectorAll('span.tn');

            if (comments) {
                comments.forEach(comment => {
                    console.log(comment, bWrap);
                    bWrap.remove()
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
            console.log(tempWrap);
            return tempWrap;
        },
        formatVerseNumbers: function () {
            let HTML = this.convToObject(); 
            let verseNumberEls = HTML.querySelectorAll('span.vn')

            verseNumberEls.forEach(v => {
                let num = `(${v.innerHTML})`;
                let newVerseNumber = document.createElement('versenumber');
                newVerseNumber.innerHTML = num;

                HTML.replaceChild(newVerseNumber, v)
            })

            console.log(HTML)
        }
    }

    allVerses.forEach(function(v, index) {
        let allText = v.querySelectorAll('p');
        allText.forEach(t => {
            if (t.classList.length == 0) return; 
            if (t.classList[0].includes('poet') == false && t.classList[0].includes('body') == false) return console.log('p Element does not contain poet: ', t)
            pushAllText.content += t.textContent;
        })
    })

    pushAllText.formatVerseNumbers()
}

