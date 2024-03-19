import * as errorHandler from '../handlers/errorHandler.js';

const initiateExit = () => {
    process.exit();
}

const findArgumentValue = (args, searchString, required = false) => {
    if (!args.length) {
        errorHandler.customErrorMessage('No arguments were retrieved from CLI!');
        initiateExit();
    }

    const argValue = args.find(el =>
        el.startsWith(searchString)
    )

    if (!argValue) {
        if (required) {
            errorHandler.customErrorMessage(`Required argument '${searchString}' was not found!`);
            initiateExit();
        } else {
            errorHandler.customErrorMessage(`Argument '${searchString}' was not found!`);
        }
    }

    return argValue.split('=').pop();
}

/**
 * The following function prevents user from exiting the root folder (in which index.js was launched)
 * as stated in the task for "up" functionality
 * (when you are in the root folder this operation shouldn't change working directory)
 */
const isTargetDirectoryOutside = (rootDirectoryPath, targetDirectoryPath) => {
    return targetDirectoryPath.includes(rootDirectoryPath);
}

const sortArrayAsc = (a, b) => {
    return a.Name.toLowerCase().localeCompare(b.Name.toLowerCase());
}

const validateArgsNumber = (args, argsNumber) => {
    return !args.length || args.length != argsNumber;
}

export {
    findArgumentValue,
    initiateExit,
    isTargetDirectoryOutside,
    sortArrayAsc,
    validateArgsNumber
}