const resetColor = '\u001b[0m';
const redColor = '\u001b[1;31m';
const greenColor = '\u001b[1;32m';
const yellowColor = '\u001b[1;33m';
const blueColor = '\u001b[1;34m';
const purpleColor = '\u001b[1;35m';
const cyanColor = '\u001b[1;36m';

const colorizeMessage = (message, colorName) => {
    let colorString;

    switch(colorName) {
        case 'red':
            colorString = redColor;
            break;
        case 'green':
            colorString = greenColor;
            break;
        case 'yellow':
            colorString = yellowColor;
            break;
        case 'blue':
            colorString = blueColor;
            break;
        case 'purple':
            colorString = purpleColor;
            break;
        case 'cyan':
            colorString = cyanColor;
            break;
    }

    let colorizedString = `${colorString}${message}${resetColor}`;

    return colorizedString;
}

export {
    colorizeMessage
}