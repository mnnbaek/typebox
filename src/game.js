import { UI, CONFIG, CSS_CLASSES, DUTCH_WORDS, INITIAL_GAME_STATE } from './constants.js';
import { renderResultsChart, showResultsScreen, showGameScreen, transitionBackgroundSvgColor, updateSoundButton } from './ui.js';

let state = { ...INITIAL_GAME_STATE };
let chartInstance = null;
let isSoundEnabled = true;

const keyboardSound = new Howl({
    src: ['../assets/sounds/spacebar-click-keyboard-199448.mp3'],
    volume: 0.2,
});

export const renderWords = () => {
    state.words = [...DUTCH_WORDS].sort(() => 0.5 - Math.random()).slice(0, CONFIG.wordsToLoad);
    UI.wordsContainer.innerHTML = '';

    const fragment = document.createDocumentFragment();
    state.words.forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word inline-block relative rounded';

        word.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.textContent = char;
            charSpan.className = 'char';
            wordDiv.appendChild(charSpan);
        });

        const spaceSpan = document.createElement('span');
        spaceSpan.textContent = ' ';
        spaceSpan.className = 'char';
        wordDiv.appendChild(spaceSpan);

        fragment.appendChild(wordDiv);
    });

    UI.wordsContainer.appendChild(fragment);
};

export const startTimer = () => {
    state.isGameStarted = true;
    state.timer = setInterval(() => {
        state.timeLeft--;
        UI.timerDisplay.textContent = state.timeLeft;

        if (state.timeLeft <= 15) {
            transitionBackgroundSvgColor('#d9534f');
        } else if (state.timeLeft <= 30 && state.selectedTime > 30) {
            transitionBackgroundSvgColor('#f0ad4e');
        }

        if (state.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
};

export const endGame = () => {
    clearInterval(state.timer);
    document.removeEventListener('keydown', handleTyping);

    const typedWords = state.correctlyTypedChars / CONFIG.wpmFactor;
    const wpm = Math.round((typedWords / state.selectedTime) * 60);
    const consistency = state.totalTypedChars > 0 ? Math.round((state.correctlyTypedChars / state.totalTypedChars) * 100) : 0;

    UI.wpmValue.textContent = wpm;
    UI.errorsValue.textContent = state.errors;
    UI.consistencyValue.textContent = `${consistency}%`;

    renderResultsChart(wpm, state.errors, consistency);
    showResultsScreen();
};

export const restartGame = () => {
    clearInterval(state.timer);
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    state = { ...INITIAL_GAME_STATE, selectedTime: state.selectedTime, timeLeft: state.selectedTime };

    UI.timerDisplay.textContent = state.selectedTime;

    document.removeEventListener('keydown', handleTyping);
    document.addEventListener('keydown', handleTyping);

    showGameScreen();
    transitionBackgroundSvgColor('#9C92AC');
    renderWords();
    UI.hiddenInput.focus();
};

export const handleTyping = (event) => {
    const { key } = event;

    if (key.length > 1 && key !== 'Backspace') return;
    if (!state.isGameStarted && key === ' ') return;

    if (isSoundEnabled) keyboardSound.play();
    if (!state.isGameStarted) startTimer();

    switch (key) {
        case 'Backspace':
            handleBackspace();
            break;
        case ' ':
            handleSpacebar();
            break;
        default:
            handleCharacter(key);
            break;
    }
};

const handleCharacter = (typedChar) => {
    const { currentWordIndex, currentCharIndex, words } = state;
    const currentWord = words[currentWordIndex];

    if (currentCharIndex < currentWord.length) {
        state.totalTypedChars++;
        const expectedChar = currentWord[currentCharIndex];
        const charSpan = UI.wordsContainer.children[currentWordIndex].children[currentCharIndex];

        if (typedChar === expectedChar) {
            charSpan.classList.add(CSS_CLASSES.correct);
            state.correctlyTypedChars++;
        } else {
            charSpan.classList.add(CSS_CLASSES.incorrect);
            state.errors++;
        }
        state.currentCharIndex++;
    }
};

const handleSpacebar = () => {
    const { currentWordIndex, currentCharIndex, words } = state;
    const currentWordEl = UI.wordsContainer.children[currentWordIndex];
    const currentWord = words[currentWordIndex];

    if (currentCharIndex < currentWord.length) {
        state.errors += currentWord.length - currentCharIndex;
        for (let i = currentCharIndex; i < currentWord.length; i++) {
            currentWordEl.children[i].classList.add(CSS_CLASSES.incorrect);
        }
    }

    currentWordEl.classList.add(CSS_CLASSES.activeWord);
    state.currentWordIndex++;
    state.currentCharIndex = 0;

    if (state.currentWordIndex >= UI.wordsContainer.children.length) {
        endGame();
    }
};

const handleBackspace = () => {
    if (state.currentCharIndex > 0) {
        state.currentCharIndex--;
        const { currentWordIndex, currentCharIndex } = state;
        const charSpan = UI.wordsContainer.children[currentWordIndex].children[currentCharIndex];
        charSpan.classList.remove(CSS_CLASSES.correct, CSS_CLASSES.incorrect);
    }
};

export const handleTimeOptionClick = (event) => {
    const target = event.target.closest('.timer-option');
    if (!target) return;

    state.selectedTime = parseInt(target.dataset.time, 10);

    document.querySelectorAll('.timer-option').forEach(btn => btn.classList.remove(CSS_CLASSES.activeTimer));
    target.classList.add(CSS_CLASSES.activeTimer);

    restartGame();
};

export const toggleSound = () => {
    isSoundEnabled = !isSoundEnabled;
    updateSoundButton(isSoundEnabled);
    UI.hiddenInput.focus();
};

export const getSoundState = () => {
    return isSoundEnabled;
};