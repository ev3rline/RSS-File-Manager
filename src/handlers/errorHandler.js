import { displayErrorMessage } from '../utils/uiUtils.js';
import { initiateExit } from '../utils/utils.js';

const invalidInput = () => {
    displayErrorMessage('Invalid input');
}

const operationFailed = () => {
    displayErrorMessage('Operation failed');
}

const customErrorMessage = (errorMsg, exitOnError = false) => {
    displayErrorMessage(errorMsg);

    if (exitOnError) {
        initiateExit();
    }
}

// const

export {
    invalidInput,
    operationFailed,
    customErrorMessage
}