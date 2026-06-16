
const sentences = JSON.parse(document.getElementById('data').value);

shuffleArray(sentences);



const ui = {

    ru: {
        title: "Тренажёр немецких предложений",
        modeTranslate: "🇷🇺 Русский → Немецкий",
        modeAudio: "🎧 Аудирование → Немецкий",
        placeholder: "Введите предложение на немецком",
        check: "Проверить",
        show: "Показать ответ",
        repeat: "Повторить озвучку",
        audio: "Прослушать",
        next: "Следующее",
        listen: "🎧 Прослушайте предложение",
        correct: "Правильно",
        wrong: "Ошибок",
        success: "✅ Правильно",
        error: "❌ Неверно",
        answer: "Ответ",
        yourMistakes: "Ваши ошибки",
        translation: "Перевод",
	    pronunciation: "Произношение (IPA)",
	    grammar: "Грамматика",
	    back: "← Назад"
    },

    en: {
        title: "German Sentence Trainer",
        modeTranslate: "🇷🇺 Russian → German",
        modeAudio: "🎧 Listening → German",
        placeholder: "Enter German sentence",
        check: "Check",
        show: "Show Answer",
        repeat: "Repeat Audio",
        audio: "Listen",
        next: "Next",
        listen: "🎧 Listen to the sentence",
        correct: "Correct",
        wrong: "Wrong",
        success: "✅ Correct",
        error: "❌ Incorrect",
        answer: "Answer",
        yourMistakes: "Your mistakes",
        translation: "Translation",
	    pronunciation: "Pronunciation (IPA)",
	    grammar: "Grammar",
	    back: "← Back"
    },

    de: {
        title: "Trainer für deutsche Sätze",
        modeTranslate: "🇷🇺 Russisch → Deutsch",
        modeAudio: "🎧 Hören → Deutsch",
        placeholder: "Deutschen Satz eingeben",
        check: "Prüfen",
        show: "Antwort zeigen",
        repeat: "Audio wiederholen",
        audio: "Anhören",
        next: "Weiter",
        listen: "🎧 Satz anhören",
        correct: "Richtig",
        wrong: "Fehler",
        success: "✅ Richtig",
        error: "❌ Falsch",
        answer: "Antwort",
        yourMistakes: "Deine Fehler",
        translation: "Übersetzung",
	    pronunciation: "Aussprache (IPA)",
	    grammar: "Grammatik",
	    back: "← Zurück"
    }

};

let currentLanguage = "ru";

function applyLanguage() {

    currentLanguage =
        document.getElementById("uiLanguage").value;

    const t = ui[currentLanguage];

    document.title = t.title;

    document.getElementById("title").textContent =
        t.title +' ('+currentIndex+'/'+sentences.length+')';

    document.title =
        t.title;

    document.getElementById("btnBack")
    .textContent = t.back;

    document.getElementById("btnCheck").textContent =
        t.check;

    document.getElementById("btnShow").textContent =
        t.show;

    document.getElementById("btnRepeat").textContent =
        t.repeat;

    document.getElementById("btnRepeat2").textContent =
        t.repeat;

    document.getElementById("btnNext").textContent =
        t.next;

    document.getElementById("correctLabel").textContent =
        t.correct;

    document.getElementById("wrongLabel").textContent =
        t.wrong;

    document.getElementById("answer").placeholder =
        t.placeholder;

    document.querySelector(
        '#mode option[value="translate"]'
    ).textContent = t.modeTranslate;

    document.querySelector(
        '#mode option[value="audio"]'
    ).textContent = t.modeAudio;

    updateQuestion();
}

function updateQuestion() {

    const t = ui[currentLanguage];

    if (!current) return;

    if (
        document.getElementById("mode").value
        === "translate"
    ) {

        document.getElementById("question")
            .textContent =
            current.ru;

    } else {

        document.getElementById("question")
            .textContent =
            t.listen;
    }
}

let current = null;

let currentIndex = 0;

let correct = 0;
let wrong = 0;

function shuffleArray(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [array[i], array[j]] =
            [array[j], array[i]];
    }

    return array;
}

function normalize(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(/[.,!?]/g, "")
        .replace(/\s+/g, " ");
}

function goBack() {

    window.location.href =
        "index.html";
}

function speak(text, base64) {

    /*speechSynthesis.cancel();

    const utterance =
        new SpeechSynthesisUtterance(text);

    utterance.lang = "de-DE";
    utterance.rate = 0.9;

    speechSynthesis.speak(utterance);*/

    const audio = new Audio("data:audio/mp3;base64," + base64);
    audio.play();
}

function nextCard() {

    /*current =
        sentences[
            Math.floor(
                Math.random() * sentences.length
            )
        ];*/

	if(currentIndex >= sentences.length) {

        shuffleArray(sentences);
        currentIndex = 0;
    }

    current = sentences[currentIndex];
    currentIndex++;

    document.getElementById("title").textContent =
        ui[currentLanguage].title +' ('+currentIndex+'/'+sentences.length+')';

    document.getElementById("answer").value = "";

    document.getElementById("result").innerHTML = "";

    updateQuestion();

    if (
	    document.getElementById("mode").value
	    === "audio"
	) {
	    speak(current.de, current.audio);
	}
}

function highlightDifferences(userText, correctText) {

    const user =
        userText.trim().split(/\s+/);

    const correct =
        correctText.trim().split(/\s+/);

    const m = correct.length;
    const n = user.length;

    const dp =
        Array(m + 1)
        .fill()
        .map(() => Array(n + 1).fill(0));

    for(let i = 1; i <= m; i++) {

        for(let j = 1; j <= n; j++) {

            if(correct[i - 1] === user[j - 1]) {

                dp[i][j] =
                    dp[i - 1][j - 1] + 1;

            } else {

                dp[i][j] =
                    Math.max(
                        dp[i - 1][j],
                        dp[i][j - 1]
                    );
            }
        }
    }

    let i = m;
    let j = n;

    const result = [];

    while(i > 0 && j > 0) {

        if(correct[i - 1] === user[j - 1]) {

            result.unshift({
                type: "correct",
                word: correct[i - 1]
            });

            i--;
            j--;

        }
        else if(
            dp[i - 1][j] >= dp[i][j - 1]
        ) {

            result.unshift({
                type: "missing",
                word: correct[i - 1]
            });

            i--;

        }
        else {

            result.unshift({
                type: "extra",
                word: user[j - 1]
            });

            j--;
        }
    }

    while(i > 0) {

        result.unshift({
            type: "missing",
            word: correct[i - 1]
        });

        i--;
    }

    while(j > 0) {

        result.unshift({
            type: "extra",
            word: user[j - 1]
        });

        j--;
    }

    return result.map(item => {

        switch(item.type) {

            case "correct":

                return `
                <span style="
                    color:#22c55e;
                    font-weight:bold;
                ">
                    ${item.word}
                </span>`;

            case "missing":

                return `
                <span style="
                    color:#ef4444;
                    text-decoration:underline;
                    font-weight:bold;
                ">
                    ${item.word}
                </span>`;

            case "extra":

                return `
                <span style="
                    color:#f59e0b;
                    font-weight:bold;
                ">
                    ${item.word}
                </span>`;
        }

    }).join(" ");
}

function checkAnswer() {

    const user =
        normalize(
            document.getElementById("answer").value
        );

    const correctAnswer =
        normalize(current.de);

    const result =
        document.getElementById("result");

    const t = ui[currentLanguage];

    if (user === correctAnswer) {

        correct++;

        document.getElementById("correct")
            .textContent = correct;

        result.innerHTML =
		    '<span class="good">' +
		    t.success +
		    '</span>';

        setTimeout(() => {
            nextCard();
        }, 1000);

    } else {

        wrong++;

        document.getElementById("wrong")
            .textContent = wrong;

        const diff =
    highlightDifferences(
        document.getElementById("answer").value,
        current.de
    );

	result.innerHTML =
	    `
	    <div class="bad">`+
			t.error +
		`</div>

	    <br>

	    <div>
	        <b>`+t.yourMistakes+`:</b>
	    </div>

	    <div style="
	        margin-top:8px;
	        font-size:20px;
	        line-height:1.8;
	    ">
	        ${diff}
	    </div>

	    <br>

	    <div>
            <b>${t.answer}:</b>
        </div>

        <div style="
            color:#38bdf8;
            font-size:22px;
            margin-top:6px;
        ">
            ${current.de}

            <br>
            <button onclick="repeatAudio()">${t.audio}</button>
            <button onclick="repeatAudioWebTTS()">${t.audio}</button>
        </div>

        <br>

        <div>
            <b>${t.translation}:</b>
        </div>

        <div>
            ${current.ru}
        </div>

        <br>

        <div>
            <b>${t.pronunciation}:</b>
        </div>

        <div style="
            color:#94a3b8;
            font-family:monospace;
        ">
            ${current.ipa || "-"}
        </div>

        <br>`;

        /*<div>
            <b>${t.grammar}:</b>
        </div>

        <ul>
            ${current.grammar}
        </ul>
	    `;*/
    }
}

function showAnswer() {

    const t = ui[currentLanguage];

    document.getElementById("result").innerHTML =
    `
    <div style="line-height:1.8">

        <div>
            <b>${t.answer}:</b>
        </div>

        <div style="
            color:#38bdf8;
            font-size:22px;
            margin-top:6px;
        ">
            ${current.de}

            <br>
            <button onclick="repeatAudio()">${t.audio}</button>
            <button onclick="repeatAudioWebTTS()">${t.audio}</button>
        </div>

        <br>

        <div>
            <b>${t.translation}:</b>
        </div>

        <div>
            ${current.ru}
        </div>

        <br>

        <div>
            <b>${t.pronunciation}:</b>
        </div>

        <div style="
            color:#94a3b8;
            font-family:monospace;
        ">
            ${current.ipa || "-"}
        </div>

        <br>

    </div>
    `;
}

function repeatAudio() {

    if (
        document.getElementById("mode").value
        === "audio" || true
    ) {
        speak(current.de, current.audio);
    }
}

function repeatAudioWebTTS() {

    if (
        document.getElementById("mode").value
        === "audio" || true
    ) {
        speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(current.de);

        utterance.lang = "de-DE";
        utterance.rate = 0.9;

        speechSynthesis.speak(utterance);
    }
}

document
.getElementById("uiLanguage")
.addEventListener(
    "change",
    applyLanguage
);

document
.getElementById("mode")
.addEventListener(
    "change",
    nextCard
);

document
.getElementById("answer")
.addEventListener(
    "keydown",
    function(e) {

        if (e.key === "Enter") {
            checkAnswer();
        }
    }
);

applyLanguage();
nextCard();