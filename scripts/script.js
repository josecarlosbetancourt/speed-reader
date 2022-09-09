/**
 * General overview of the code:
 * Displays words from a quote from Ron Swason 
 * as fast as the user sets the speed range of WPM
 */

"use strict";
let globals = {}; // Array for global variables.

/**
 * This is the setup() function, it initializes most global variables and sets the
 * EventListeners, it also checks the localStorage for any past wpm speeds saved and
 * sets it, if there is.
 * 
 */
function setup() {
    document.querySelector("#btn").addEventListener('click', startStop);
    globals.para = document.querySelector("#para");
    globals.QUOTEAPI = "https://ron-swanson-quotes.herokuapp.com/v2/quotes";
    const wpmMeter = document.querySelector("#wpm");
    let wpmSpeed = localStorage.getItem('wpmSpeed')

    //checks if the local storage contains a word-per-minute speed and saves as a variable. If
    //not, set it to 100. If it does, update the input tag to reflect the speed
    if (wpmSpeed != 100) {
        globals.speed = wpmSpeed;
        wpmMeter.textContent = globals.speed;
        document.querySelector("#speed").value = globals.speed;
    } else if (wpmSpeed == 100 || wpmSpeed == null) {
        wpmMeter.textContent = 100;
        globals.speed = 100;
        document.querySelector("#speed").value = globals.speed;
    }

    document.querySelector("#speed").addEventListener('input', () => {
        globals.speed = document.querySelector("#speed").value;
        wpmMeter.textContent = globals.speed;
        localStorage.setItem('wpmSpeed', globals.speed);
    });

    globals.btnText = document.querySelector("#btn");
    globals.btnText.textContent = "Start";
}

document.addEventListener("DOMContentLoaded", setup);

/**
 * @author Jose Carlos Betancourt
 */
function startStop() {
    if (globals.btnText.textContent == "Start") {
        getNext();
        globals.btnText.textContent = "Stop";
    } else if (globals.btnText.textContent == "Stop") {
        stopNext();
        globals.btnText.textContent = "Start";
    }
}

/**
 * This function fetches a random quote from the Ron Swanson Quote API, then sends it to be split.
 * It displays an error message if an error occurs when getting the first response or any other 
 * errors.
 * 
 * @author Danilo Zhu
 */
function getNext() {
    fetch(globals.QUOTEAPI)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                globals.para.textContent = "Error: Please try again, Response code: " + response.status;
            }
        })
        .then(data => {
            data = JSON.stringify(data);
            data = data.substring(2, data.length - 2)
            strSplitter(data);
        })
        .catch(error => {
            globals.para.textContent = `Error: ${error.message} please try again.`;
        })
}

/**
 * @author Jose Carlos Betancourt
 */
function stopNext() {
    clearInterval(globals.interval);
}

/**
 * This function takes a String quote as a parameter and splits it into an array of Strings, 
 * with each String representing a word in the original quote.
 * 
 * @author Danilo Zhu
 * @param {String} quote 
 */
function strSplitter(quote) {
    let splitQuote = quote.split(" ");
    displayQuote(splitQuote);
}

/**
 * @author Jose Carlos Betancourt
 * @param {Array} splitQuote 
 */
function displayQuote(splitQuote) {
    globals.wordCount = 0;
    globals.interval = setInterval(() => {
        displayWord(splitQuote)
    }, 60000 / globals.speed);
}

/**
 * @author Jose Carlos Betancourt
 * @param {Array} splitQuote 
 */
function displayWord(splitQuote) {
    globals.splitWord = splitQuote[globals.wordCount];
    globals.befFocus = document.querySelector("#befFocus");
    globals.focus = document.querySelector("#focus");
    globals.aftFocus = document.querySelector("#aftFocus");

    if (globals.splitWord.length == 1) {
        globals.befFocus.textContent = "____";
        globals.focus.textContent = globals.splitWord;
        globals.aftFocus.textContent = "";
    } else if (globals.splitWord.length >= 2 && globals.splitWord.length <= 5) {
        globals.befFocus.textContent = "___" + globals.splitWord.substring(0, 1);
        globals.focus.textContent = globals.splitWord.substring(1, 2);
        globals.aftFocus.textContent = globals.splitWord.substring(2);
    } else if (globals.splitWord.length >= 6 && globals.splitWord.length <= 9) {
        globals.befFocus.textContent = "__" + globals.splitWord.substring(0, 2);
        globals.focus.textContent = globals.splitWord.substring(2, 3);
        globals.aftFocus.textContent = globals.splitWord.substring(3);
    } else if (globals.splitWord.length >= 10 && globals.splitWord.length <= 13) {
        globals.befFocus.textContent = "_" + globals.splitWord.substring(0, 3);
        globals.focus.textContent = globals.splitWord.substring(3, 4);
        globals.aftFocus.textContent = globals.splitWord.substring(4);
    } else if (globals.splitWord.length > 13) {
        globals.befFocus.textContent = globals.splitWord.substring(0, 4);
        globals.focus.textContent = globals.splitWord.substring(4, 5);
        globals.aftFocus.textContent = globals.splitWord.substring(5);
    } else {
        globals.para.textContent = globals.splitWord;
    }

    if (globals.wordCount < splitQuote.length - 1) {
        globals.wordCount++;
    } else {
        clearInterval(globals.interval);
        if (globals.btnText.textContent == "Stop") {
            getNext();
        }
    }
}