import './style.css';
import './app.css';

import { WindowSetTitle } from '../wailsjs/runtime/runtime';

import buttonSoundSrc from '/src/assets/sounds/button-sound.mp3'
const buttonSound = new Audio(buttonSoundSrc);
import workStartSoundSrc from '/src/assets/sounds/workStart.mp3'
const workStartSound = new Audio(workStartSoundSrc);
import shortBreakSoundSrc from '/src/assets/sounds/shortBreakStart.mp3'
const shortBreakSound = new Audio(shortBreakSoundSrc);
import longBreakSoundSrc from '/src/assets/sounds/longBreakStart.mp3'
const longBreakSound = new Audio(longBreakSoundSrc);

// JS for the timer functionality
const timer = {
    // A traditional pomodoro session is 25 minutes
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    // A long break (15 minutes) is activated after four consecutive pomodoro sessions
    longBreakInterval: 4,
    sessions: 0,
}

// const buttonSound = new Audio('/src/assets/sounds/button-sound.mp3')
// const workStartSound = new Audio('/src/assets/sounds/workStart.mp3')
// const shortBreakSound = new Audio('/src/assets/sounds/shortBreakStart.mp3')
// const longBreakSound = new Audio('/src/assets/sounds/longBreakStart.mp3')


// The 3 buttons: gomodoro, shortbreak, longbreak
const modeButtons = document.querySelector('#js-mode-buttons')
modeButtons.addEventListener('click', handleMode);

function updateClock() {
    // this extracts the remainingtime from the timer object
    const { remainingTime } = timer;
    // pads them with zeros where necessary so that the number always has a width of two. For example, 8 seconds will become 08 seconds
    const minutes = `${remainingTime.minutes}`.padStart(2, '0')
    const seconds = `${remainingTime.seconds}`.padStart(2, '0')

    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;

    // Reflect the countdown in the title for browsers
    const text = timer.mode === 'pomodoro' ? 'Get back to work!' : 'Take a break!';
    document.title = `${minutes}:${seconds} — ${text}`;
    WindowSetTitle(`${minutes}:${seconds} — ${text}`);

    const progress = document.getElementById('js-progress');
    // Calculate the current position in progress by calculating the theoretical total minus the remainingtime total
    // Setting this value will show the progress on screen
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
}

function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0,
    };

    // remove the active class on all buttons with the data-mode property
    document.querySelectorAll('button[data-mode]').forEach(e => e.classList.remove('active'));
    // add to the clicked button the active class
    document.querySelector(`[data-mode=${mode}]`).classList.add('active');
    // change the background color to the color associated with the clicked mode
    document.body.style.backgroundColor = `var(--${mode})`;

    // set the max attribute of the progress bar to the current timer modes total
    document.getElementById('js-progress').setAttribute('max', timer.remainingTime.total);

    updateClock();
}

function handleMode(event) {
    // get the data-mode from the target that was clicked
    const { mode } = event.target.dataset;

    if (!mode) return;

    switchMode(mode);
    // make sure the timer is stopped when selecting a different mode
    stopTimer();
}

let interval;

function getRemainingTime(endTime) {
    // get the current time stamp and calculate the diference with the endTime
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;

    // This difference gets parsed into the total number of seconds left in total
    // For example total=230s => minutes=3m and seconds=50s
    const total = Number.parseInt(difference / 1000, 10);
    // Minutes left, if any
    const minutes = Number.parseInt((total / 60) % 60, 10);
    // Seconds left, if any
    const seconds = Number.parseInt((total % 60), 10);

    return {
        total,
        minutes,
        seconds,
    };
}

function startTimer() {
    // Before we can start the timer we need to get the exact time in the future when the timer will end
    // We do this by getting the timestamp of the current moment with 'Date.parse(new Date()) in ms, so we convert it to seconds with * 1000
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;

    // When starting a new pomodoro, the amount of sessions is incremented by 1
    if (timer.mode === 'pomodoro') timer.sessions++;

    // Change the button text to stop
    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');

    // The inteerval variable is set to the setInterval method that will execute it's callback function every second
    interval = setInterval(function () {
        timer.remainingTime = getRemainingTime(endTime);
        updateClock();

        total = timer.remainingTime.total;
        // If total <= 0 this means the current mode is finished
        if (total <= 0) {
            clearInterval(interval);

            // This auto switches to the next mode that should be done following the pomodoro rules
            switch (timer.mode) {
                case 'pomodoro':
                    // Whenever we completed 4 pomodoro sessions we get a long break
                    if (timer.sessions % timer.longBreakInterval === 0) {
                        switchMode('longBreak');
                        longBreakSound.play();
                    } else {
                        switchMode('shortBreak');
                        shortBreakSound.play();
                    }
                    break;
                default:
                    switchMode('pomodoro');
                    workStartSound.play();
            }



            // Reset the timers button to Start
            stopTimer()

            // Uncommenting this would auto start the next sessions timer, but I prefer manually starting it
            // startTimer();
        }
    }, 1000);
}

function stopTimer() {
    // clearInterval stops the running setInterval function running that was started in the startTimer function
    clearInterval(interval);

    // Reset the button text to start
    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');
}

// Call the startTimer function once the start button is clicked
const mainButton = document.getElementById('js-btn');
mainButton.addEventListener('click', () => {
    buttonSound.play();
    // extract the current action of the button clicked, can be start or stop
    const { action } = mainButton.dataset;

    if (action === 'start') {
        startTimer();
    } else if (action === 'stop') {
        stopTimer();
    }
});

// On page load, set the default mode to pomodoro
document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro')
})