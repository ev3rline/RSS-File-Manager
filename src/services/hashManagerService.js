import * as errorHandler from '../services/errorService.js';
import * as utils from '../utils/utils.js'

import fs from 'node:fs';
import path from 'node:path';
import pr from 'node:process';
import cr from 'node:crypto';

const rootDirectory = path.resolve(pr.cwd(), '..');
let currentDirectory;

const hash = async (args) => {
    args.shift();

    if (utils.validateArgsAmount(args, 1)) return;

    let inputPath = args[0].trim();

    currentDirectory = pr.cwd();
    const targetFilePath = path.resolve(currentDirectory, inputPath);

    let preventExitingRootDirectory = utils.preventFromExitingRootDirectory(rootDirectory, targetFilePath);
    if (preventExitingRootDirectory) {
        console.log('*** You cannot access files outside root directory! ***');
        return;
    };

    try {
        const readStream = fs.createReadStream(targetFilePath);
        let hash = cr.createHash('sha256');
        hash.setEncoding('hex');

        readStream
            .on('data', (chunk) => {
                hash.update(chunk);
            })
            .on('end', () => {
                let finalHash = hash.digest('hex');

                console.log(finalHash);
            })
            .on('error', () => {
                errorHandler.invalidInput();
            })
    } catch (error) {
        errorHandler.operationFailed();
    }
}

export {
    hash
}