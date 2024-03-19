import * as errorHandler from '../handlers/errorHandler.js';
import * as utils from '../utils/utils.js'

import fs from 'node:fs';
import path from 'node:path';
import pr from 'node:process';
import str from 'node:stream';

import { DEFAULT_DIRECTORY } from '../config.js';

let currentDirectory;

const up = async () => {
    currentDirectory = pr.cwd();
    const targetDirectory = path.resolve(currentDirectory, '..');

    if (!utils.isTargetDirectoryOutside(DEFAULT_DIRECTORY, targetDirectory)) {
        return errorHandler.customErrorMessage('You cannot exit root directory');
    }

    try {
        pr.chdir('..');
    } catch (error) {
        errorHandler.operationFailed();
    }
}

const cd = async (args) => {
    args.shift();

    if (utils.validateArgsNumber(args, 1)) {
        errorHandler.invalidInput();
        return;
    };

    let inputPath = args[0].trim();

    currentDirectory = pr.cwd();
    const targetDirectory = path.resolve(currentDirectory, inputPath);

    try {
        const stats = await fs.promises.stat(targetDirectory);

        if (!stats.isDirectory()) {
            return errorHandler.customErrorMessage('You cannot open file');
        }

        if (!utils.isTargetDirectoryOutside(DEFAULT_DIRECTORY, targetDirectory)) {
            return errorHandler.customErrorMessage('You cannot exit root directory');
        }

        pr.chdir(inputPath);
    } catch (error) {
        errorHandler.operationFailed()
    }
}

const ls = async () => {
    currentDirectory = pr.cwd();

    let directoryContents = await fs.promises.readdir(currentDirectory, { withFileTypes: true, recursive: false });

    let files = [];
    let folders = [];

    for (const item of directoryContents) {
        let tempObj = {};
        tempObj.Name = item.name;

        if (item.isFile()) {
            tempObj.Type = 'file'
            files.push(tempObj);
        } else if (item.isDirectory()) {
            tempObj.Type = 'directory'
            folders.push(tempObj);
        }
    }

    files.sort(utils.sortArrayAsc);
    folders.sort(utils.sortArrayAsc);

    console.table([...folders, ...files], ['Name', 'Type']);
}

const cat = async (args) => {
    args.shift();

    if (utils.validateArgsNumber(args, 1)) {
        errorHandler.invalidInput();
        return;
    };

    let inputPath = args[0].trim();

    currentDirectory = pr.cwd();
    const targetFilePath = path.resolve(currentDirectory, inputPath);

    if (!utils.isTargetDirectoryOutside(DEFAULT_DIRECTORY, targetFilePath)) {
        return errorHandler.customErrorMessage('You cannot exit root directory');
    }

    try {
        let fileContents = '';

        const readStream = fs.createReadStream(targetFilePath);

        readStream
            .on('data', (chunk) => {
                fileContents += chunk.toString();
            })
            .on('end', () => {
                console.log(fileContents);
            })
            .on('error', () => {
                errorHandler.invalidInput();
            })

    } catch (error) {
        errorHandler.operationFailed()
    }
}

const add = async (args) => {
    args.shift();

    if (utils.validateArgsNumber(args, 1)) {
        errorHandler.invalidInput();
        return;
    };

    let newFileName = args[0].trim();

    currentDirectory = pr.cwd();

    try {
        const filePath = path.join(currentDirectory, newFileName);
        await fs.promises.appendFile(filePath, 'File data');
    } catch (error) {
        errorHandler.operationFailed();
    }
}

const rn = async (args) => {
    args.shift();

    if (utils.validateArgsNumber(args, 2)) {
        errorHandler.invalidInput();
        return;
    };

    let inputPath = args[0].trim();
    let newFileName = args[1].trim();

    currentDirectory = pr.cwd();

    const oldFilePath = path.resolve(currentDirectory, inputPath);

    if (!utils.isTargetDirectoryOutside(DEFAULT_DIRECTORY, oldFilePath)) {
        return errorHandler.customErrorMessage('You cannot rename files outside root directory');
    }

    const newFilePath = path.resolve(oldFilePath, `../${newFileName}`);

    try {
        await fs.promises.rename(oldFilePath, newFilePath);
    } catch (error) {
        errorHandler.operationFailed();
    }
}

const cp = async (args, isToMoveFile) => {
    args.shift();

    if (utils.validateArgsNumber(args, 2)) {
        errorHandler.invalidInput();
        return;
    };

    let pathToFile = args[0].trim();
    let pathToFileCopy = args[1].trim();

    currentDirectory = pr.cwd();

    const oldFilePath = path.resolve(currentDirectory, pathToFile);
    const newFilePath = path.resolve(currentDirectory, pathToFileCopy);

    if (!utils.isTargetDirectoryOutside(DEFAULT_DIRECTORY, oldFilePath)) {
        return errorHandler.customErrorMessage('You cannot access files out of root directory');
    }

    if (!utils.isTargetDirectoryOutside(DEFAULT_DIRECTORY, newFilePath)) {
        return errorHandler.customErrorMessage('You cannot create new files out of root directory');
    }

    try {
        const readStream = fs.createReadStream(oldFilePath);
        const writeStream = fs.createWriteStream(newFilePath);

        await str.promises.pipeline(readStream, writeStream);

        if (isToMoveFile) await fs.promises.rm(oldFilePath);
    } catch (error) {
        errorHandler.operationFailed();
    }
}

const mv = async (args) => {
    try {
        /**
         * As for task requirements, mv is the same as cp,
         * but at the end the file is removed.
         * So I decided to reuse cp in order not to make duplicated code
         * and just added one more argument for cp to accept (not necessary argument)
         * so that cp function could understand whether we're copying files or moving them
         */
        await cp(args, true);
    } catch (error) {
        errorHandler.operationFailed();
    }
}

const rm = async (args) => {
    args.shift();

    if (utils.validateArgsNumber(args, 1)) {
        errorHandler.invalidInput();
        return;
    };

    let pathToFile = args[0].trim();

    currentDirectory = pr.cwd();

    const filePath = path.resolve(currentDirectory, pathToFile);

    if (!utils.isTargetDirectoryOutside(DEFAULT_DIRECTORY, filePath)) {
        return errorHandler.customErrorMessage('You cannot access files out of root directory');
    }

    try {
        await fs.promises.rm(filePath);
    } catch (error) {
        errorHandler.operationFailed();
    }
}

export {
    up,
    cd,
    ls,
    cat,
    add,
    rn,
    cp,
    mv,
    rm
}