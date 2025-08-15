// Use a self-contained function to prevent global scope pollution
(function () {
    const titleElement = document.getElementById('title');
    const wordsContainer = document.getElementById('words-container');
    const timerDisplayElement = document.getElementById('timer-display');
    const restartButton = document.getElementById('restart-button');
    const resultsArea = document.getElementById('results-area');
    const resultsRestartButton = document.getElementById('results-restart-button');
    const hiddenInput = document.getElementById('hidden-input');
    const timerOptionsContainer = document.getElementById('timer-options');
    const resultsChartCanvas = document.getElementById('results-chart');
    const toggleSoundButton = document.getElementById('toggle-sound-button');
    const mainContent = document.querySelector('main');
    const contactSection = document.getElementById('contact-section');
    const backToGameButton = document.getElementById('back-to-game-button');

    let resultsChartInstance = null; // Store chart instance to destroy it later

    // Initialize the Howl object for the keyboard sound
    const keyboardSound = new Howl({
        src: ['./sounds/spacebar-click-keyboard-199448.mp3'],
        volume: 0.2,
    });

    // Store the SVG template to easily change its color
    const svgTemplate = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='192' viewBox='0 0 192 192'%3E%3Cpath fill='COLOR_PLACEHOLDER' fill-opacity='0.08' d='M192 15v2a11 11 0 0 0-11 11c0 1.94 1.16 4.75 2.53 6.11l2.36 2.36a6.93 6.93 0 0 1 1.22 7.56l-.43.84a8.08 8.08 0 0 1-6.66 4.13H145v35.02a6.1 6.1 0 0 0 3.03 4.87l.84.43c1.58.79 4 .4 5.24-.85l2.36-2.36a12.04 12.04 0 0 1 7.51-3.11 13 13 0 1 1 .02 26 12 12 0 0 1-7.53-3.11l-2.36-2.36a4.93 4.93 0 0 0-5.24-.85l-.84.43a6.1 6.1 0 0 0-3.03 4.87V143h35.02a8.08 8.08 0 0 1 6.66 4.13l.43.84a6.91 6.91 0 0 1-1.22 7.56l-2.36 2.36A10.06 10.06 0 0 0 181 164a11 11 0 0 0 11 11v2a13 13 0 0 1-13-13 12 12 0 0 1 3.11-7.53l2.36-2.36a4.93 4.93 0 0 0 .85-5.24l-.43-.84a6.1 6.1 0 0 0-4.87-3.03H145v35.02a8.08 8.08 0 0 1-4.13 6.66l-.84.43a6.91 6.91 0 0 1-7.56-1.22l-2.36-2.36A10.06 10.06 0 0 0 124 181a11 11 0 0 0-11 11h-2a13 13 0 0 1 13-13c2.47 0 5.79 1.37 7.53 3.11l2.36 2.36a4.94 4.94 0 0 0 5.24.85l.84-.43a6.1 6.1 0 0 0 3.03-4.87V145h-35.02a8.08 8.08 0 0 1-6.66-4.13l-.43-.84a6.91 6.91 0 0 1 1.22-7.56l2.36-2.36A10.06 10.06 0 0 0 107 124a11 11 0 0 0-22 0c0 1.94 1.16 4.75 2.53 6.11l2.36 2.36a6.93 6.93 0 0 1 1.22 7.56l-.43.84a8.08 8.08 0 0 1-6.66 4.13H49v35.02a6.1 6.1 0 0 0 3.03 4.87l.84.43c1.58.79 4 .4 5.24-.85l2.36-2.36a12.04 12.04 0 0 1 7.51-3.11A13 13 0 0 1 81 192h-2a11 11 0 0 0-11-11c-1.94 0-4.75 1.16-6.11 2.53l-2.36 2.36a6.93 6.93 0 0 1-7.56 1.22l-.84-.43a8.08 8.08 0 0 1-4.13-6.66V145H11.98a6.1 6.1 0 0 0-4.87 3.03l-.43.84c-.79 1.58-.4 4 .85 5.24l2.36 2.36a12.04 12.04 0 0 1 3.11 7.51A13 13 0 0 1 0 177v-2a11 11 0 0 0 11-11c0-1.94-1.16-4.75-2.53-6.11l-2.36-2.36a6.93 6.93 0 0 1-1.22-7.56l.43-.84a8.08 8.08 0 0 1 6.66-4.13H47v-35.02a6.1 6.1 0 0 0-3.03-4.87l-.84-.43c-1.59-.8-4-.4-5.24.85l-2.36 2.36A12 12 0 0 1 28 109a13 13 0 1 1 0-26c2.47 0 5.79 1.37 7.53 3.11l2.36 2.36a4.94 4.94 0 0 0 5.24.85l.84-.43A6.1 6.1 0 0 0 47 84.02V49H11.98a8.08 8.08 0 0 1-6.66-4.13l-.43-.84a6.91 6.91 0 0 1 1.22-7.56l2.36-2.36A10.06 10.06 0 0 0 11 28 11 11 0 0 0 0 17v-2a13 13 0 0 1 13 13c0 2.47-1.37 5.79-3.11 7.53l-2.36 2.36a4.94 4.94 0 0 0-.85 5.24l.43.84A6.1 6.1 0 0 0 11.98 47H47V11.98a8.08 8.08 0 0 1 4.13-6.66l.84-.43a6.91 6.91 0 0 1 7.56 1.22l2.36 2.36A10.06 10.06 0 0 0 68 11 11 11 0 0 0 79 0h2a13 13 0 0 1-13 13 12 12 0 0 1-7.53-3.11l-2.36-2.36a4.93 4.93 0 0 0-5.24-.85l-.84.43A6.1 6.1 0 0 0 49 11.98V47h35.02a8.08 8.08 0 0 1 6.66 4.13l.43.84a6.91 6.91 0 0 1-1.22 7.56l-2.36 2.36A10.06 10.06 0 0 0 85 68a11 11 0 0 0 22 0c0-1.94-1.16-4.75-2.53-6.11l-2.36-2.36a6.93 6.93 0 0 1-1.22-7.56l.43-.84a8.08 8.08 0 0 1 6.66-4.13H143V11.98a6.1 6.1 0 0 0-3.03-4.87l-.84-.43c-1.59-.8-4-.4-5.24.85l-2.36 2.36A12 12 0 0 1 124 13a13 13 0 0 1-13-13h2a11 11 0 0 0 11 11c1.94 0 4.75-1.16 6.11-2.53l2.36-2.36a6.93 6.93 0 0 1 7.56-1.22l.84.43a8.08 8.08 0 0 1 4.13 6.66V47h35.02a6.1 6.1 0 0 0 4.87-3.03l.43-.84c.8-1.59.4-4-.85-5.24l-2.36-2.36A12 12 0 0 1 179 28a13 13 0 0 1 13-13zM84.02 143a6.1 6.1 0 0 0 4.87-3.03l.43-.84c.8-1.59.4-4-.85-5.24l-2.36-2.36A12 12 0 0 1 83 124a13 13 0 1 1 26 0c0 2.47-1.37 5.79-3.11 7.53l-2.36 2.36a4.94 4.94 0 0 0-.85 5.24l.43.84a6.1 6.1 0 0 0 4.87 3.03H143v-35.02a8.08 8.08 0 0 1 4.13-6.66l.84-.43a6.91 6.91 0 0 1 7.56 1.22l2.36 2.36A10.06 10.06 0 0 0 164 107a11 11 0 0 0 0-22c-1.94 0-4.75 1.16-6.11 2.53l-2.36 2.36a6.93 6.93 0 0 1-7.56 1.22l-.84-.43a8.08 8.08 0 0 1-4.13-6.66V49h-35.02a6.1 6.1 0 0 0-4.87 3.03l-.43.84c-.79 1.58-.4 4 .85 5.24l2.36 2.36a12.04 12.04 0 0 1 3.11 7.51A13 13 0 1 1 83 68a12 12 0 0 1 3.11-7.53l2.36-2.36a4.93 4.93 0 0 0 .85-5.24l-.43-.84A6.1 6.1 0 0 0 84.02 49H49v35.02a8.08 8.08 0 0 1-4.13 6.66l-.84.43a6.91 6.91 0 0 1-7.56-1.22l-2.36-2.36A10.06 10.06 0 0 0 28 85a11 11 0 0 0 0 22c1.94 0 4.75-1.16 6.11-2.53l2.36-2.36a6.93 6.93 0 0 1 7.56-1.22l.84.43a8.08 8.08 0 0 1 4.13 6.66V143h35.02z'%3E%3C/path%3E%3C/svg%3E";

    const dutchWords = [
        "De", "het", "een", "ik", "ben", "jij", "bent", "hij",
        "zij", "wij", "zijn", "u", "hebt", "heeft", "hebben",
        "had", "hadden", "worden", "wordt", "is", "was", "waren",
        "van", "naar", "met", "door", "voor", "op", "in", "uit",
        "aan", "onder", "boven", "achter", "tussen", "langs", "naast",
        "omdat", "als", "of", "maar", "en", "tot", "rond", "over", "veel", 
        "weinig", "niet", "nooit", "altijd", "soms", "vaak", "hier", "daar",
        "waar", "nu", "dan", "straks", "gisteren", "vandaag", "morgen", "goed",
        "beter", "best", "slecht", "mooi", "lelijk", "groot", "klein", "lang",
        "kort", "snel", "langzaam", "dik", "dun", "hoog", "laag", "diep", "ondiep",
        "nieuw", "oud", "jong", "vol", "leeg", "licht", "donker", "warm", "koud",
        "heet", "koel", "nat", "droog", "sterk", "zwak", "rijk", "arm", "hard",
        "zacht", "stil", "luid", "rustig", "druk", "blij", "boos", "bang", "moe",
        "ziek", "gezond", "vrij", "bezet", "open", "dicht", "eerste", "laatste", "elke",
        "iedere", "enkele", "sommige", "alle", "beide", "elk", "ieder", "andere", "zonder",
        "binnen", "buiten", "bij", "tegen", "volgens", "tijdens", "gedurende", "behalve",
        "buiten", "sinds", "sinds", "reeds", "daarom", "daardoor", "daarbij",
        "daarvoor", "erover", "hierin", "hierop", "hieruit", "hiermee", "hierbij"
    ];

    let gameData = {
        words: [],
        timer: null,
        timeLeft: 30, // Default time
        selectedTime: 30, // New variable to store selected time
        isGameStarted: false,
        currentWordIndex: 0,
        currentCharIndex: 0,
        errors: 0,
        totalTypedChars: 0,
        correctlyTypedChars: 0,
        startTime: 0,
    };

    // State object for smooth background color transitions with GSAP
    const backgroundColorState = { color: '#9C92AC' };

    let isSoundEnabled = true;

    // GSAP animations for initial load
    const initAnimations = () => {
        gsap.to("#title", { duration: 1, y: 0, opacity: 1, ease: "power2.out" });
        gsap.to("#subtitle", { duration: 1, y: 0, opacity: 1, ease: "power2.out", delay: 0.2 });
        gsap.to("#typing-area", { duration: 0.8, opacity: 1, delay: 0.5 });
        gsap.to("#controls-container", { duration: 0.8, opacity: 1, display: 'flex', delay: 0.8 });

        // Add a repeating "wiggle" animation to the title to indicate it's clickable
        const wiggleTl = gsap.timeline({
            delay: 2, // Start after the initial animations
            repeat: -1, // Repeat indefinitely
            repeatDelay: 4 // Wait 4 seconds between each wiggle
        });

        wiggleTl.to("#title", { duration: 0.1, rotation: -2, ease: "power1.inOut" })
                .to("#title", { duration: 0.1, rotation: 2, ease: "power1.inOut" })
                .to("#title", { duration: 0.1, rotation: -2, ease: "power1.inOut" })
                .to("#title", { duration: 0.1, rotation: 0, ease: "power1.inOut" });
    };

    // Render words on the screen
    const renderWords = () => {
        const shuffledWords = [...dutchWords].sort(() => Math.random() - 0.5).slice(0, 50);
        gameData.words = shuffledWords;
        wordsContainer.innerHTML = '';

        gameData.words.forEach((word, wordIndex) => {
            const wordDiv = document.createElement('div');
            wordDiv.classList.add('word', 'inline-block', 'relative', 'rounded');

            word.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.classList.add('char');
                wordDiv.appendChild(charSpan);
            });

            const spaceSpan = document.createElement('span');
            spaceSpan.textContent = ' ';
            spaceSpan.classList.add('char');
            wordDiv.appendChild(spaceSpan);

            wordsContainer.appendChild(wordDiv);
        });

        // updateCursorPosition(); // No cursor element
    };

    const handleTyping = (event) => {
        // Sai mais cedo para teclas especiais que não devem iniciar o jogo ou ser processadas como digitação.
        if (event.key.length > 1 && event.key !== 'Backspace') {
            return;
        }

        // Lida com o backspace separadamente, não deve iniciar o jogo.
        if (event.key === 'Backspace') {
            handleBackspace();
            return;
        }

        // Não deixa o usuário iniciar o teste pressionando espaço.
        if (!gameData.isGameStarted && event.key === ' ') {
            return;
        }

        // Se todas as verificações passarem, temos um caractere válido. Agora podemos iniciar o jogo e tocar sons.
        if (isSoundEnabled) {
            keyboardSound.play();
        }

        if (!gameData.isGameStarted) {
            gameData.isGameStarted = true;
            gameData.startTime = new Date().getTime();
            startTimer();
        }

        const typedChar = event.key;
        const currentWordEl = wordsContainer.children[gameData.currentWordIndex];

        if (typedChar === ' ') {
            handleSpacebar();
            return;
        }

        // Check if there are more characters to type in the current word
        if (gameData.currentCharIndex < gameData.words[gameData.currentWordIndex].length) {
            gameData.totalTypedChars++;

            const expectedChar = gameData.words[gameData.currentWordIndex][gameData.currentCharIndex];
            const charSpan = currentWordEl.children[gameData.currentCharIndex];

            if (typedChar === expectedChar) {
                charSpan.classList.add('correct');
                gameData.correctlyTypedChars++;
            } else {
                charSpan.classList.add('incorrect');
                gameData.errors++;
            }
            gameData.currentCharIndex++;
        }
    };

    const handleSpacebar = () => {
        const currentWordEl = wordsContainer.children[gameData.currentWordIndex];

        // If the user presses space before finishing the word, mark the rest as errors
        if (gameData.currentCharIndex < gameData.words[gameData.currentWordIndex].length) {
            gameData.errors += gameData.words[gameData.currentWordIndex].length - gameData.currentCharIndex;
            for (let i = gameData.currentCharIndex; i < gameData.words[gameData.currentWordIndex].length; i++) {
                currentWordEl.children[i].classList.add('incorrect');
            }
        }

        currentWordEl.classList.add('word-active');
        gameData.currentWordIndex++;
        gameData.currentCharIndex = 0;

        if (gameData.currentWordIndex >= wordsContainer.children.length) {
            endGame();
        }
    };

    const handleBackspace = () => {
        if (gameData.currentCharIndex > 0) {
            gameData.currentCharIndex--;
            const currentWordEl = wordsContainer.children[gameData.currentWordIndex];
            const charSpan = currentWordEl.children[gameData.currentCharIndex];
            charSpan.classList.remove('correct', 'incorrect');
        }
    };

    const startTimer = () => {
        gameData.timer = setInterval(() => {
            gameData.timeLeft--;

            // Update background color based on time left
            if (gameData.timeLeft <= 15) {
                transitionBackgroundSvgColor('#d9534f'); // Red for urgency
            } else if (gameData.timeLeft <= 30 && gameData.selectedTime > 30) {
                transitionBackgroundSvgColor('#f0ad4e'); // Amber for warning
            }

            timerDisplayElement.textContent = gameData.timeLeft;
            if (gameData.timeLeft <= 0) {
                clearInterval(gameData.timer);
                endGame();
            }
        }, 1000);
    };

    const endGame = () => {
        clearInterval(gameData.timer);
        document.removeEventListener('keydown', handleTyping);

        // Calculate WPM based on the selected time
        const typedWords = gameData.correctlyTypedChars / 5;
        const wpm = Math.round((typedWords / gameData.selectedTime) * 60);
        const consistency = gameData.totalTypedChars > 0 ? Math.round((gameData.correctlyTypedChars / gameData.totalTypedChars) * 100) : 0;

        document.getElementById('wpm-value').textContent = wpm;
        document.getElementById('errors-value').textContent = gameData.errors;
        document.getElementById('consistency-value').textContent = `${consistency}%`;

        // Render the chart
        renderResultsChart(wpm, gameData.errors, consistency);

        // Animate to show results
        gsap.to("#typing-area", { duration: 0.3, opacity: 0, display: 'none' });
        gsap.to("#controls-container", { duration: 0.3, opacity: 0, display: 'none' });
        gsap.fromTo("#results-area", { opacity: 0, scale: 0.95, display: 'hidden' }, { duration: 0.5, opacity: 1, scale: 1, display: 'block', ease: "back.out(1.7)" });
    };

    const renderResultsChart = (wpm, errors, consistency) => {
        // Destroy old chart instance if it exists
        if (resultsChartInstance) {
            resultsChartInstance.destroy();
        }

        const data = {
            labels: ['WPM', 'Fouten', 'Consistentie'],
            datasets: [{
                label: 'Jouw Resultaten',
                data: [wpm, errors, consistency],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)', // WPM
                    'rgba(255, 99, 132, 0.6)', // Fouten
                    'rgba(54, 162, 235, 0.6)'  // Consistentie
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Prestatie Overzicht',
                        color: '#f3f4f6',
                        font: {
                            size: 18
                        }
                    }
                }
            }
        };

        const ctx = resultsChartCanvas.getContext('2d');
        resultsChartInstance = new Chart(ctx, config);
    };

    const restartGame = () => {
        clearInterval(gameData.timer);

        Object.assign(gameData, {
            words: [],
            timer: null,
            timeLeft: gameData.selectedTime,
            isGameStarted: false,
            currentWordIndex: 0,
            currentCharIndex: 0,
            errors: 0,
            totalTypedChars: 0,
            correctlyTypedChars: 0,
            startTime: 0,
        });

        timerDisplayElement.textContent = gameData.selectedTime;

        if (resultsChartInstance) {
            resultsChartInstance.destroy();
            resultsChartInstance = null;
        }

        // Always re-attach listener in case DOM changed
        timerOptionsContainer.removeEventListener('click', handleTimeOptionClick);
        timerOptionsContainer.addEventListener('click', handleTimeOptionClick);
        // FIX: The keydown event listener was being removed but not re-attached.
        // Re-attach the keydown listener to allow the user to type again.
        document.removeEventListener('keydown', handleTyping); // Ensure no duplicate listeners
        document.addEventListener('keydown', handleTyping);

        document.querySelectorAll('.timer-option').forEach(button => {
            if (parseInt(button.dataset.time) === gameData.selectedTime) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });

        gsap.to("#results-area", { duration: 0.3, opacity: 0, scale: 0.95, display: 'none' });
        gsap.to("#typing-area", { duration: 0.5, opacity: 1, display: 'block' });
        gsap.to("#controls-container", { duration: 0.5, opacity: 1, display: 'flex' });

        // Reset background color to default
        transitionBackgroundSvgColor('#9C92AC');

        renderWords();
        hiddenInput.focus();
    };

    // Handle the click on timer option buttons
    const handleTimeOptionClick = (event) => {
        const target = event.target.closest('.timer-option');
        if (!target) return; // Ignore clicks outside buttons

        const newTime = parseInt(target.dataset.time);
        gameData.selectedTime = newTime;

        // Update active button class
        document.querySelectorAll('.timer-option').forEach(button => {
            button.classList.remove('active');
        });
        target.classList.add('active');

        // Restart the game with the new time
        restartGame();
    };

    const setBackgroundSvg = (hexColor) => {
        // URL-encode the '#' character to '%23' for the data URL
        const encodedColor = hexColor.replace('#', '%23');
        const newBackgroundUrl = svgTemplate.replace('COLOR_PLACEHOLDER', encodedColor);
        document.body.style.backgroundImage = `url("${newBackgroundUrl}")`;
    };

    const transitionBackgroundSvgColor = (newHexColor) => {
        gsap.to(backgroundColorState, {
            color: newHexColor,
            duration: 1.5, // Duration of the color transition in seconds
            onUpdate: () => setBackgroundSvg(backgroundColorState.color)
        });
    };

    const updateSoundButton = () => {
        if (isSoundEnabled) {
            toggleSoundButton.textContent = 'Sounds Key On';
            toggleSoundButton.classList.remove('sound-off');
            toggleSoundButton.classList.add('sound-on');
        } else {
            toggleSoundButton.textContent = 'Sounds Key Off';
            toggleSoundButton.classList.remove('sound-on');
            toggleSoundButton.classList.add('sound-off');
        }
    };

    const toggleSound = () => {
        isSoundEnabled = !isSoundEnabled;
        updateSoundButton();
        hiddenInput.focus();
    };

    const showContactPage = () => {
        const tl = gsap.timeline();
        tl.to('.wave-overlay', {
            y: '0%',
            stagger: 0.1,
            ease: 'power2.inOut'
        })
        .set(mainContent, { display: 'none' })
        .set(contactSection, { display: 'flex' })
        .to('.wave-overlay', {
            y: '100%',
            stagger: 0.1,
            ease: 'power2.inOut',
            delay: 0.2
        })
        .set('.wave-overlay', { y: '-101%' }); // Reset for next time
    };

    const hideContactPage = () => {
        const tl = gsap.timeline();
        tl.to('.wave-overlay', {
            y: '0%',
            stagger: 0.1,
            ease: 'power2.inOut'
        })
        .set(contactSection, { display: 'none' })
        .set(mainContent, { display: 'flex' })
        .to('.wave-overlay', {
            y: '100%',
            stagger: 0.1,
            ease: 'power2.inOut',
            delay: 0.2
        })
        .set('.wave-overlay', { y: '-101%' }) // Reset for next time
        .call(() => hiddenInput.focus()); // Re-focus the input to resume typing
    };

    const attachEventListeners = () => {
        document.addEventListener('keydown', handleTyping);
        restartButton.addEventListener('click', restartGame);
        resultsRestartButton.addEventListener('click', restartGame);
        timerOptionsContainer.addEventListener('click', handleTimeOptionClick);
        toggleSoundButton.addEventListener('click', toggleSound);
        titleElement.addEventListener('click', showContactPage);
        backToGameButton.addEventListener('click', hideContactPage);
    };

    window.onload = () => {
        initAnimations();
        renderWords();
        attachEventListeners();
        hiddenInput.focus();
        setBackgroundSvg('#9C92AC'); // Set initial background color without transition
        updateSoundButton();
    };
})();
