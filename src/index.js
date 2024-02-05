import * as utils from './utils/utils.js';
import { getUsername } from './services/userService.js';
import { inputHandler } from './services/inputService.js';

import pr from 'node:process';

async function App() {
    const userName = getUsername();

    utils.welcomeMessage(userName);

    inputHandler();

    pr.on('exit', () => {
        utils.goodbyeMessage(userName);
    })
}

App()