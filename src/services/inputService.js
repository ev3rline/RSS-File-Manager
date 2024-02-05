import * as errorHandler from '../services/errorService.js'
import * as utils from '../utils/utils.js';
import * as fmOperations from '../services/fileManagerService.js';
import * as osOperations from '../services/osManagerService.js';
import * as hashOperations from '../services/hashManagerService.js';

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export const inputHandler = () => {
    const rl = readline.createInterface({ input, output });

    try {
        rl.on('SIGINT', () => {
            utils.initiateExit();
        })

        rl.on('line', async input => {
            const inputValue = input.split(" ");

            switch (inputValue[0]) {
                case '111':
                    console.log(process.cwd());
                    break;
                case '.exit':
                    utils.initiateExit();
                    break;
                case 'up':
                    await fmOperations.up();
                    break;
                case "cd":
                    await fmOperations.cd(inputValue);
                    break;
                case "ls":
                    await fmOperations.ls();
                    break;
                case "cat":
                    await fmOperations.cat(inputValue);
                    break;
                case "add":
                    await fmOperations.add(inputValue);
                    break;
                case "rn":
                    await fmOperations.rn(inputValue);
                    break;
                case "cp":
                    await fmOperations.cp(inputValue);
                    break;
                case "mv":
                    await fmOperations.mv(inputValue);
                    break;
                case "rm":
                    await fmOperations.rm(inputValue);
                    break;
                case "os":
                    {
                        switch (inputValue[1]) {
                            case "--EOL":
                                osOperations.getEOL();
                                break;
                            case "--cpus":
                                osOperations.getCPUs();
                                break;
                            case "--username":
                                osOperations.getUsername();
                                break;
                            case "--architecture":
                                osOperations.getArchitecture();
                                break;
                        }
                    }
                    break;
                case "hash":
                    hashOperations.hash(inputValue);
                    break;
                /* case "compress":
                    compressFile(inputValue); // 2
                    break;
                case "decompress":
                    decompressFile(inputValue); // 2
                    break; */
                default:
                    errorHandler.invalidInput();
                    break;
            }

            console.log(`You are currently in ${process.cwd()}`);
        })
    } catch (err) {
        throw new Error(err);
    } finally {
        console.log(`You are currently in ${process.cwd()}`);
    }
}