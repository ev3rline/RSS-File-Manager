import * as errorHandler from '../services/errorService.js';

const findArgumentValue = (args, searchString) => {
    if (!args.length) {
        throw Error('No arguments were retrieved from CLI!');
    }

    const argValue = args.find(el =>
        el.startsWith(searchString)
    )

    if (!argValue) {
        throw Error(`Required argument '${searchString}' was not found!`);
    }

    return argValue.split('=').pop();
}

const welcomeMessage = (username) => {
    console.log(`Welcome to the File Manager, ${username}!`);
}

const goodbyeMessage = (username) => {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
}

const initiateExit = () => {
    process.exit();
}

/**
 * The following function prevents user from exiting the root folder (in which index.js was launched)
 * as stated in the task for "up" functionality
 * (when you are in the root folder this operation shouldn't change working directory)
 */
const preventFromExitingRootDirectory = (rootDirectoryPath, targetDirectoryPath) => {
    let preventFromExiting = false;

    if (!targetDirectoryPath.includes(rootDirectoryPath)) {
        preventFromExiting = true;
    }

    return preventFromExiting;
}

const sortArrayAsc = (a, b) => {
    return a.Name.toLowerCase().localeCompare(b.Name.toLowerCase());
}

const validateArgsAmount = (args, argsAmount) => {
    if (!args.length || args.length != argsAmount) {
        errorHandler.invalidInput();
        return true;
    }
}

export {
    findArgumentValue,
    welcomeMessage,
    goodbyeMessage,
    initiateExit,
    preventFromExitingRootDirectory,
    sortArrayAsc,
    validateArgsAmount
}