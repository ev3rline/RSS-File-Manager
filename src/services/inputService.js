import * as errorHandler from '../handlers/errorHandler.js';
import * as utils from '../utils/utils.js';
import { displayCurrentLocation } from '../utils/uiUtils.js';
import * as fmOperations from '../services/fileManagerService.js';
import * as osOperations from '../services/osManagerService.js';
import * as hashOperations from '../services/hashManagerService.js';
import * as zlibOperations from '../services/zlibManagerService.js';

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export const inputHandler = () => {
    const rl = readline.createInterface({
        input,
        output,
        prompt: ''
    });

    try {
        rl.on('SIGINT', () => {
            utils.initiateExit();
        })

        rl.on('line', async input => {
            const inputValue = input.split(" ");

            switch (inputValue[0]) {
                case '111': // TODO remove before release
                    console.log(process.cwd());
                    break;
                case '.exit':
                    utils.initiateExit();
                    break;
                case 'up':
                    await fmOperations.up();
                    break;
                case 'cd':
                    await fmOperations.cd(inputValue);
                    break;
                case 'ls':
                    await fmOperations.ls();
                    break;
                case 'cat':
                    await fmOperations.cat(inputValue);
                    break;
                case 'add':
                    await fmOperations.add(inputValue);
                    break;
                case 'rn':
                    await fmOperations.rn(inputValue);
                    break;
                case 'cp':
                    await fmOperations.cp(inputValue);
                    break;
                case 'mv':
                    await fmOperations.mv(inputValue);
                    break;
                case 'rm':
                    await fmOperations.rm(inputValue);
                    break;
                case 'os':
                    {
                        switch (inputValue[1]) {
                            case '--EOL':
                                osOperations.getEOL();
                                break;
                            case '--cpus':
                                osOperations.getCPUs();
                                break;
                            case '--homedir':
                                osOperations.getHomeDirectory();
                                break;
                            case '--username':
                                osOperations.getUsername();
                                break;
                            case '--architecture':
                                osOperations.getArchitecture();
                                break;
                        }
                    }
                    break;
                case 'hash':
                    hashOperations.hash(inputValue);
                    break;
                case 'compress':
                    zlibOperations.compress(inputValue);
                    break;
                case 'decompress':
                    zlibOperations.decompress(inputValue);
                    break;
                default:
                    errorHandler.invalidInput();
                    break;
            }

            displayCurrentLocation('You are currently in', process.cwd());
        })
    } catch (err) {
        throw new Error(err);
    } finally {
        displayCurrentLocation('You are currently in', process.cwd());
    }
}