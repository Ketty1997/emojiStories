// FASE DI PREPARAZIONE
//raccogliamo gli elementi di interesse
const mainSection = document.querySelector('main');
const nameField = document.querySelector('input');
const emojiElements = document.querySelectorAll('.emoji');
const generateButton = document.querySelector('#generate');

const storyTitle = document.querySelector('.story-title');
const storyText = document.querySelector('.story-text');
const homeButton = document.querySelector('#home');
const continueButton = document.querySelector('#continue');

const endpoint = 'https://';
const apikey = '';

//preparo variabile per la lista delle emojiii scelte
const selectedEmoji = [];

//preparo variabile per lista messaggi
const chatMessages = [];
//funzione che colora le emojii selezionate
function colorSelectedEmojis() {
    for (const element of emojiElements) {
        const emoji = element.innerText;

        if (selectedEmoji.includes(emoji)) {
            element.classList.add('selected');
        } else {
            element.classList.remove('selected');
        }
    }
}

//funzione che chiede a gpt di creare una storia
async function createStory(prompt) {
    //lo aggiungo alla lista dei messaggi
    chatMessages.push(prompt);

    //mostra schermata caricamento
    mainSection.className = 'loading';

    //SIAMO PRONTI A CHIAMARE GPT
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apikey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            messages: chatMessages

        })
    });

    //elaboriamo la risposta
    const data = await response.json();

    //recuperiamo la storia
    const story = JSON.parse(data.choices[0].message.content);

    //mettiamo la risposta nella lista dei messaggi
    chatMessages.push({
        role: 'assistant',
        content: JSON.stringify(story)
    })

    //inseriamo la storia all'interno della pagina
    storyTitle.innerText = story.title;
    storyText.innerText = story.text;

    //mostra la schermata result
    mainSection.className = 'result';
}

//FASE GESTIONE EVENTI
//per ogni elemento per degli elementi emojii...
for (const element of emojiElements) {
    //stai attento se qualcuno clicca l'elemento
    element.addEventListener('click', function () {
        //recupera emojii
        const clickedEmoji = element.innerText;
        //controllo se c'e gia
        if (selectedEmoji.includes(clickedEmoji)) {
            return;
        }
        //inserisci nella lista
        selectedEmoji.push(clickedEmoji);

        //se ci sono piu di tre emoji togli la piu vecchia
        if (selectedEmoji.length > 3) {
            selectedEmoji.shift();

        }

        //colora gli elementi le cui gli elementi sono in lista
        colorSelectedEmojis();

    })
}

//al click del bottone GENERA
generateButton.addEventListener('click', async function () {
    //recupero il nome del protagonista
    const name = nameField.value;

    //controllo se manca qualcosa
    if (selectedEmoji.length < 3 || name.length < 2) {
        window.alert('Devi selezionare 3 emoji e inserire un nome');
        return;
    }
    //preparo il messaggio iniziale
    const prompt = {
        role: 'user',
        content: `Crea una storia a partire da queste emoji: ${selectedEmoji}. Il protagonista della storia si chiama ${name}. La storia deve essere breve e avere un titolo, anche questo molto breve. Le tue risposte sono solo in formato JSON come questo esempio:
        
        {
            "title": "Incontro intergalattico"
            "text": "Durante un'esplorazione notturna Albero e Angela si imbattono in una astronave aliena atterrata a Roma. Gli extstraterrestri cercano aiuto contro un'orda di gatti robotici. Angela li aiuta e in cambio gli alieni le regalano un'astronave."
        }
        
        Assicurati che le chiavi del JSON siano "title" e "text", con virgolette.
        `
    }
    //crea storia
    createStory(prompt);
})

//al click sul bottone avanti
continueButton.addEventListener('click', function () {
    //prepariamo un nuovo prompt
    const prompt = {
        role: 'user',
        content: 'Continua la storia da qui. Scrivi un breve paragrafo che prosegua la storia precedente. Le tue risposte sono solo in formato JSON con lo stesso formato delle tue risposte precedenti. Mantieni lo stesso valore per "title". Cambia solo il valore di "text" '
    }

    //crea storia
    createStory(prompt);
})

//al click sul bottone home
homeButton.addEventListener('click', function () {
    //ricarica la pagina
    window.location.reload();
})