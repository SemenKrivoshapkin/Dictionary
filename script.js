const body = document.querySelector("body")
const container = document.querySelector(".container")
const checkbox = document.querySelector("#checkbox")
const themeIconBtn = document.querySelector(".theme-icon")
const input = document.querySelector("#input")
const button = document.querySelector("#button")
const select = document.querySelector("#selector")

themeIconBtn.innerHTML = `<img src="./icon-sun.svg"></img>`

checkbox.addEventListener("change", () => {
    if (localStorage.getItem('theme') === 'dark') {
        localStorage.removeItem('theme');
    } else {
        localStorage.setItem('theme', 'dark')
    }
    addDarkClassToHTML()
})

function addDarkClassToHTML() {
    try {
        if (localStorage.getItem('theme') === 'dark') {
            document.querySelector('html').classList.add('dark');
            themeIconBtn.innerHTML = `<img src="./icon-sun.svg"></img>`
        } else {
            document.querySelector('html').classList.remove('dark');
            themeIconBtn.innerHTML = `<img src="./icon-moon.svg"></img>`
        }
    } catch (err) {}
}

button.addEventListener("click", (e) => {
    e.preventDefault()
    const inputValue = input.value
    getWords(inputValue)
    input.value = ""
})

input.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        const inputValue = input.value
        getWords(inputValue)
        input.value = ""
    }
})

select.addEventListener("change", (event) => {
    let fontStyle = event.target.value
    body.style.fontFamily = fontStyle
})

async function getWords(word) {
    const data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    const results = await data.json()
    console.log(results)
    if (Array.isArray(results)){
        displayWord(results)
    } else {
        container.innerHTML = 
        `
        <div class="no-definitions-found">${results.message}</div>
        `
    }
}

function displayWord(results) {
    container.innerHTML = ""
    const {
        word,
        meanings,
        phonetics,
        sourceUrls: {
            0: sourceUrl
        }
    } = results[0]

    container.innerHTML +=
    `
        <div class="title">
            <h2>${word}</h2>
        </div>
    
    `

    if (phonetics.length){
        const {
            phonetics: {
                0: {
                    text: textUK,
                    audio: audioUK
                }
            }
        } = results[0]

        container.innerHTML +=
        `
        <div class="phonetic phoneticUK">
                <img src="united-kingdom.png">
                <div class="phonetic-UK"></div>
        </div>
            <div class="phonetic phoneticUS"></div>
        `

        const phoneticTextUK = document.querySelector(".phoneticUK")
        
        if(textUK) {
            phoneticTextUK.innerHTML +=
            `<p>${textUK}</p>`
        }

        if(audioUK) {
            phoneticTextUK.innerHTML +=
            `
            <audio controls>
                    <source src="${audioUK}" type="audio/mpeg">
                </audio>
            `
        }
         

        const phoneticUS = document.querySelector(".phoneticUS")
        if(phonetics[1]){
            const {
                phonetics: {
                    1: {
                        text: textUS,
                        audio: audioUS
                    },
                }
            } = results[0]


                if(textUS){
                phoneticUS.innerHTML +=
                    `
                <img src="united-states-of-america.png">
                <p>${textUS}</p>
                
                `
            }
            
            if(audioUS) {
            phoneticUS.innerHTML +=
            `
            <audio controls>
                <source src="${audioUS}" type="audio/mpeg">
            </audio>
            `
        }
        }
    }


    for (let i = 0; i < meanings.length; i++) {
        const {
            partOfSpeech,
            definitions,
            synonyms,
            antonyms
        } = meanings[i];        

        container.innerHTML +=
            `
            <div class="part-of-speech-title">
                <h3>${partOfSpeech}</h3>
                <hr class="part-of-speech-hr" />
            </div>
            <h4>Meaning</h4>
            `
            
        for (let i = 0; i < definitions.length; i++) {
            const {
                definition
            } = definitions[i];
           
            container.innerHTML +=
                `
                <li>${definition}</li>
                `
        }

        if (synonyms.length){
            container.innerHTML +=
                `
            <div id="${i+10}" class="synonyms-container">
                <p>Synomys: </p>
            </div>
            `
            const synonymsContainer = document.querySelectorAll(".synonyms-container")

            synonyms.forEach((item) => {
                document.getElementById(i+10).innerHTML +=
                    `
                    <button data-id="${item}" class="word-link">${item}</button>
                    `
            })
        }

        if (antonyms.length){
            container.innerHTML +=
                `
            <div id="${i}" class="antonyms-container">
                <p>Antonyms: </p>
            </div>
            `
            const antonymsContainer = document.querySelectorAll(".antonyms-container")
            
            antonyms.forEach((item) => {
                
                document.getElementById(i).innerHTML +=
                    `
                    <button data-id="${item}" class="word-link" >${item}</button>
                    `
            })
        }
    }

    container.innerHTML += 
        `
        <p class="source-link">Sourse <a href="${sourceUrl}">${sourceUrl}<a/></p>
        `
    const wordLinks = document.querySelectorAll(".word-link")
        
    for (let i = 0; i < wordLinks.length; i++) {
        const wordLink = wordLinks[i];
        
        wordLink.addEventListener('click', () => {
            getWords(wordLink.dataset.id)
        })
    }
}

getWords("keyboard")

