const unorderedList = document.querySelector("body main ul");
const buttonInsertText = document.querySelector(".insert-text");
const divSearchBox = document.querySelector(".search-box");
const closeBoxButton = document.querySelector(".close-box");
const selectELement = document.querySelector("main select");
const searchBoxButton = document.querySelector(".search-box-button");
const searchBoxTextarea = document.querySelector(".search-box-textarea");

const humanExpressions = [{
        img: "./images/angry.jpg",
        text: "Estou com raiva"
    },
    {
        img: "./images/drink.jpg",
        text: "Estou com sede"
    },
    {
        img: "./images/food.jpg",
        text: "Estou com fome"
    },
    {
        img: "./images/tired.jpg",
        text: "Estou cansado"
    },
    {
        img: "./images/hurt.jpg",
        text: "Estou machucado"
    },
    {
        img: "./images/happy.jpg",
        text: "Estou feliz"
    },
    {
        img: "./images/sad.jpg",
        text: "Estou triste"
    },
    {
        img: "./images/scared.jpg",
        text: "Estou assustado"
    },
    {
        img: "./images/outside.jpg",
        text: "Quero ir lá fora"
    },
    {
        img: "./images/home.jpg",
        text: "Quero ir para casa"
    },
    {
        img: "./images/school.jpg",
        text: "Quero ir para a escola"
    },
    {
        img: "./images/grandma.jpg",
        text: "Quero ver a vovó"
    }
]

const utterance = new SpeechSynthesisUtterance();

const insertOptionsElementsIntoDOM = voices => {
    selectELement.innerHTML = voices.reduce((accumulator, { name, lang }) => {
        accumulator += `<option value="${name}">${lang} | ${name}</option>`;
        return accumulator;
    
    }, "");
}

const setUtteranceVoice = voice => {
    utterance.voice = voice;
    
    const voiceOptionElement = selectELement
        .querySelector(`[value="${voice.name}"]`);
        
    voiceOptionElement.selected = true;
}

const setPTBRVoices = voice => {
    const portugueseVoice = voices.find(voice => voice.name === "ortuguese_(Brazil)")
    const englishVoice = voices.find(voice => voice.name === "English_(America)");

    if (portugueseVoice) {

        setUtteranceVoice(portugueseVoice);
    
    } else if (englishVoice) {

        setUtteranceVoice(englishVoice);

    }
}

let voices = speechSynthesis.getVoices();


const setTextMessage = text => {
    utterance.text = text;
}

const speakText = () => {
    speechSynthesis.speak(utterance);
}

const setVoice = (event) => {
    const selectedVoice = voices.find(voice => voice.name === event.target.value);

    utterance.voice = selectedVoice;

}

const waitSynthesisSpeechLoad = () => {
    return new Promise(
        function (resolve, reject) {
            let synth = window.speechSynthesis;
            let id;

            id = setInterval(() => {
                if (synth.getVoices().length !== 0) {
                    resolve(synth.getVoices());
                    clearInterval(id);
                }
            }, 10);
        }
    )
}

const addExpressionBoxesIntoDOM = () => {

    unorderedList.innerHTML = humanExpressions.map(({
            img,
            text
        }) =>
        `<li data-js="${text}">
            <figure>
                <img src="${img}" alt="${text}" data-js="${text}"/>
                <figcaption data-js="${text}">${text}</figcaption>
            </figure>
        </li>`
    ).join("");

};

addExpressionBoxesIntoDOM();

const setStyleOfClickedItem = dataValue => {
    const listItem = document.querySelector(`[data-js="${dataValue}"]`);

    listItem.classList.add("active");
    setTimeout(() => {
        listItem.classList.remove("active");
    }, 1000);
}

unorderedList.addEventListener("click", (event) => {

    const clickedElement = event.target;
    const clickedELementText = clickedElement.dataset.js;
    const clickedElementTextMustBeSpoken = ["IMG", "FIGCAPTION"].some(elementName => 
        elementName.toLowerCase() === clickedElement.tagName.toLowerCase());

    if (clickedElementTextMustBeSpoken) {

        setTextMessage(clickedELementText);
        speakText();
        setStyleOfClickedItem(clickedELementText)

    }

});

const generateOptions = ({
    name,
    lang
}) => {

    const option = document.createElement("option");
    option.value = name;

    if (portugueseVoice && option.value === portugueseVoice.name) {

        utterance.voice = portugueseVoice;
        option.selected = true;

    } else if (englishVoice && option.value === englishVoice.name) {

        utterance.voice = englishVoice;
        option.selected = true;

    }

    option.textContent = `${lang} | ${name}`;
    selectELement.appendChild(option);
}

insertOptionsElementsIntoDOM(voices);
setPTBRVoices(voices);

buttonInsertText.addEventListener("click", () => {
    divSearchBox.classList.add("enabled");
});

closeBoxButton.addEventListener("click", () => {
    divSearchBox.classList.remove("enabled");
});

speechSynthesis.addEventListener("voiceschanged", () => {
    voices = speechSynthesis.getVoices();
});

selectELement.addEventListener("change", setVoice);

searchBoxButton.addEventListener("click", () => {
    setTextMessage(searchBoxTextarea.value);
    speakText();
});