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
    })
}

App()