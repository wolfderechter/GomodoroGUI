import './style.css';
import './app.css';

import logo from './assets/images/logo-universal.png';
import { Greet } from '../wailsjs/go/main/App';

// document.querySelector('#app').innerHTML = `
//     <img id="logo" class="logo">
//       <div class="result" id="result">Please enter your name below 👇</div>
//       <div class="input-box" id="input">
//         <input class="input" id="name" type="text" autocomplete="off" />
//         <button class="btn" onclick="greet()">Greet</button>
//       </div>
//     </div>
// `;
// document.getElementById('logo').src = logo;

// let nameElement = document.getElementById("name");
// nameElement.focus();
// let resultElement = document.getElementById("result");

// Setup the greet function
// window.greet = function () {
//     // Get name
//     let name = nameElement.value;

//     // Check if the input is empty
//     if (name === "") return;

//     // Call App.Greet(name)
//     try {
//         Greet(name)
//             .then((result) => {
//                 // Update result with data back from App.Greet()
//                 resultElement.innerText = result;
//             })
//             .catch((err) => {
//                 console.error(err);
//             });
//     } catch (err) {
//         console.error(err);
//     }
// };

// JS for the timer functionality
const timer = {
    // A traditional pomodoro session is 25 minutes
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    // A long break (15 minutes) is activated after four consecutive pomodoro sessions
    longBreakInterval: 4
}

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

    updateClock();
}

function handleMode(event) {
    // get the data-mode from the target that was clicked
    const { mode } = event.target.dataset;

    if (!mode) return;

    switchMode(mode);
}

