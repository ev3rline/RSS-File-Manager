const RESET_COLOR = '\u001b[0m';
const RED_COLOR = '\u001b[1;31m';
const GREEN_COLOR = '\u001b[1;32m';
const YELLOW_COLOR = '\u001b[1;33m';
const BLUE_COLOR = '\u001b[1;34m';
const PURPLE_COLOR = '\u001b[1;35m';
const CYAN_COLOR = '\u001b[1;36m';

const colorizeMessage = (message, colorName) => {
    let colorString;

    switch(colorName) {
        case 'red':
            colorString = RED_COLOR;
            break;
        case 'green':
            colorString = GREEN_COLOR;
            break;
        case 'yellow':
            colorString = YELLOW_COLOR;
            break;
        case 'blue':
            colorString = BLUE_COLOR;
            break;
        case 'purple':
            colorString = PURPLE_COLOR;
            break;
        case 'cyan':
            colorString = CYAN_COLOR;
            break;
    }

    let colorizedString = `${colorString}${message}${RESET_COLOR}`;

    return colorizedString;
}

const displayUserMessage = (username, messageType) => {
    let welcomeMessage = `Welcome to the File Manager, ${username}!`;
    let goodbyeMessage = `Thank you for using File Manager, ${username}, goodbye!`;

    let userMsg;

    switch(messageType) {
        case('welcome'):
            userMsg = colorizeMessage(welcomeMessage, 'cyan');
            break;
        case('goodbye'):
            userMsg = colorizeMessage(goodbyeMessage, 'blue');
            break;
    }

    console.log(userMsg);
}

const displayErrorMessage = (msg) => {
    let errorMsg = `Error: ${msg}`;

    errorMsg = colorizeMessage(errorMsg, 'red');

    console.log(errorMsg);
}

const displayCurrentLocation = (msg, locationStr) => {
    let currentLocationString = colorizeMessage(msg, 'green');
    currentLocationString = currentLocationString.concat(' ', locationStr);

    console.log(`\n${currentLocationString}\n`);
}

export {
    colorizeMessage,
    displayUserMessage,
    displayCurrentLocation,
    displayErrorMessage
}