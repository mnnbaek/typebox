import { UI } from './constants.js';
import {
    renderWords,
    handleTyping,
    restartGame,
    handleTimeOptionClick,
        toggleSound,
        getSoundState
} from './game.js';
import { initAnimations, setBackgroundSvg, showContactPage, hideContactPage, updateSoundButton } from './ui.js';

const attachEventListeners = () => {
    document.addEventListener('keydown', handleTyping);
    UI.restartButton.addEventListener('click', restartGame);
    UI.resultsRestartButton.addEventListener('click', restartGame);
    UI.timerOptions.addEventListener('click', handleTimeOptionClick);
    UI.toggleSoundButton.addEventListener('click', toggleSound);
    UI.title.addEventListener('click', showContactPage);
    UI.backToGameButton.addEventListener('click', hideContactPage);
};

const init = () => {
    initAnimations();
    renderWords();
    attachEventListeners();
    setBackgroundSvg('#9C92AC'); // Sets initial background
    updateSoundButton(getSoundState()); // Sets initial button state correctly
    UI.hiddenInput.focus();
};

window.onload = init;