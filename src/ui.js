import { UI, CSS_CLASSES, SVG_TEMPLATE } from './constants.js';

let chartInstance = null;
const backgroundColorState = { color: '#9C92AC' };

export const showGameScreen = () => {
    gsap.to(UI.resultsArea, { duration: 0.3, opacity: 0, scale: 0.95, display: 'none' });
    gsap.to("#typing-area", { duration: 0.5, opacity: 1, display: 'block' });
    gsap.to("#controls-container", { duration: 0.5, opacity: 1, display: 'flex' });
};

export const showResultsScreen = () => {
    gsap.to("#typing-area", { duration: 0.3, opacity: 0, display: 'none' });
    gsap.to("#controls-container", { duration: 0.3, opacity: 0, display: 'none' });
    gsap.fromTo(UI.resultsArea, { opacity: 0, scale: 0.95, display: 'hidden' }, { duration: 0.5, opacity: 1, scale: 1, display: 'block', ease: "back.out(1.7)" });
};

export const pageTransition = (showElement, hideElement, onComplete) => {
    const tl = gsap.timeline({ onComplete });
    tl.to('.wave-overlay', { y: '0%', stagger: 0.1, ease: 'power2.inOut' })
      .set(hideElement, { display: 'none' })
      .set(showElement, { display: 'flex' })
      .to('.wave-overlay', { y: '100%', stagger: 0.1, ease: 'power2.inOut', delay: 0.2 })
      .set('.wave-overlay', { y: '-101%' });
};

export const showContactPage = () => pageTransition(UI.contactSection, UI.mainContent);
export const hideContactPage = () => pageTransition(UI.mainContent, UI.contactSection, () => UI.hiddenInput.focus());

export const renderResultsChart = (wpm, errors, consistency) => {
    if (chartInstance) chartInstance.destroy();

    const ctx = UI.resultsChart.getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['WPM', 'Fouten', 'Consistentie'],
            datasets: [{
                label: 'Jouw Resultaten',
                data: [wpm, errors, consistency],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: { y: { beginAtZero: true, ticks: { color: '#f3f4f6' } }, x: { ticks: { color: '#f3f4f6' } } },
            responsive: true,
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Prestatie Overzicht', color: '#f3f4f6', font: { size: 18 } }
            }
        }
    });
};

export const updateSoundButton = (isSoundEnabled) => {
    if (isSoundEnabled) {
        UI.toggleSoundButton.textContent = 'Sounds Key On';
        UI.toggleSoundButton.classList.remove(CSS_CLASSES.soundOff);
        UI.toggleSoundButton.classList.add(CSS_CLASSES.soundOn);
    } else {
        UI.toggleSoundButton.textContent = 'Sounds Key Off';
        UI.toggleSoundButton.classList.remove(CSS_CLASSES.soundOn);
        UI.toggleSoundButton.classList.add(CSS_CLASSES.soundOff);
    }
};
export const setBackgroundSvg = (hexColor) => {
    const encodedColor = hexColor.replace('#', '%23');
    const newBackgroundUrl = SVG_TEMPLATE.replace('COLOR_PLACEHOLDER', encodedColor);
    document.body.style.backgroundImage = `url("${newBackgroundUrl}")`;
};

export const transitionBackgroundSvgColor = (newHexColor) => {
    gsap.to(backgroundColorState, {
        color: newHexColor,
        duration: 1.5,
        onUpdate: () => setBackgroundSvg(backgroundColorState.color)
    });
};

export const initAnimations = () => {
    gsap.to("#title", { duration: 1, y: 0, opacity: 1, ease: "power2.out" });
    gsap.to("#subtitle", { duration: 1, y: 0, opacity: 1, ease: "power2.out", delay: 0.2 });
    gsap.to("#typing-area", { duration: 0.8, opacity: 1, delay: 0.5 });
    gsap.to("#controls-container", { duration: 0.8, opacity: 1, display: 'flex', delay: 0.8 });

    const wiggleTl = gsap.timeline({ delay: 2, repeat: -1, repeatDelay: 4 });
    wiggleTl.to("#title", { duration: 0.1, rotation: -2, ease: "power1.inOut" })
            .to("#title", { duration: 0.1, rotation: 2, ease: "power1.inOut" })
            .to("#title", { duration: 0.1, rotation: -2, ease: "power1.inOut" })
            .to("#title", { duration: 0.1, rotation: 0, ease: "power1.inOut" });
};
