import { DEFAULT_DIRECTORY } from './config.js';
import { displayUserMessage, colorizeMessage } from './utils/uiUtils.js';
import { getUsername } from './services/userService.js';
import { inputHandler } from './services/inputService.js';

import pr from 'node:process';

pr.chdir(DEFAULT_DIRECTORY);

async function App() {
    const userName = getUsername();

    displayUserMessage(userName, 'welcome');

    inputHandler();

    pr.on('exit', () => {
        displayUserMessage(userName, 'goodbye');
        /* let a = '123 123 123';
        console.log(colorizeMessage(a, 'red'));
        console.log(colorizeMessage(a, 'green'));
        console.log(colorizeMessage(a, 'yellow'));
        console.log(colorizeMessage(a, 'blue'));
        console.log(colorizeMessage(a, 'purple'));
        console.log(colorizeMessage(a, 'cyan')); */
    })
}

App()