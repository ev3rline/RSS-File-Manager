import * as errorHandler from '../services/errorService.js';
import * as utils from '../utils/utils.js'

import fs from 'node:fs';
import path from 'node:path';
import pr from 'node:process';
import str from 'node:stream';

const rootDirectory = path.resolve(pr.cwd(), '..');
let currentDirectory;

const up = async () => {
    currentDirectory = pr.cwd();
    const targetDirectory = path.resolve(currentDirectory, '..');

    let preventExitingRootDirectory = utils.preventFromExitingRootDirectory(rootDirectory, targetDirectory);
    if (preventExitingRootDirectory) {
        console.log('*** You cannot exit root directory! ***');
        return;
    };

    try {
        pr.chdir('..');
    } catch (error) {
        errorHandler.operationFailed();
    }
}

const cd = async (args) => {
    args.shift();

    if (utils.validateArgsAmount(args, 1)) return;

    let inputPath = args[0].trim();

    currentDirectory = pr.cwd();
    const targetDirectory = path.resolve(currentDirectory, inputPath);

    try {
        const stats = await fs.promises.stat(targetDirectory);

        if (stats.isDirectory()) {
            let preventExitingRootDirectory = utils.preventFromExitingRootDirectory(rootDirectory, targetDirectory);

            if (preventExitingRootDirectory) {
                return console.log('*** You cannot exit root directory ***');
            };

            pr.chdir(inputPath);
        }
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

    if (utils.validateArgsAmount(args, 1)) return;

    let inputPath = args[0].trim();

    currentDirectory = pr.cwd();
    const targetFilePath = path.resolve(currentDirectory, inputPath);

    let preventExitingRootDirectory = utils.preventFromExitingRootDirectory(rootDirectory, targetFilePath);
    if (preventExitingRootDirectory) {
        console.log('*** You cannot read files outside root directory! ***');
        return;
    };

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

    if (utils.validateArgsAmount(args, 1)) return;

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

    if (utils.validateArgsAmount(args, 2)) return;

    let inputPath = args[0].trim();
    let newFileName = args[1].trim();

    currentDirectory = pr.cwd();

    const oldFilePath = path.resolve(currentDirectory, inputPath);

    let preventExitingRootDirectory = utils.preventFromExitingRootDirectory(rootDirectory, oldFilePath);
    if (preventExitingRootDirectory) {
        console.log('*** You cannot rename files outside root directory! ***');
        return;
    };

    const newFilePath = path.resolve(oldFilePath, `../${newFileName}`);

    try {
        await fs.promises.rename(oldFilePath, newFilePath);
    } catch (error) {
        errorHandler.operationFailed();
    }
}

const cp = async (args, isToMoveFile) => {
    args.shift();

    if (utils.validateArgsAmount(args, 2)) return;

    let pathToFile = args[0].trim();
    let pathToFileCopy = args[1].trim();

    currentDirectory = pr.cwd();

    const oldFilePath = path.resolve(currentDirectory, pathToFile);
    const newFilePath = path.resolve(currentDirectory, pathToFileCopy);

    let preventExitingRootDirectory = utils.preventFromExitingRootDirectory(rootDirectory, oldFilePath);
    if (preventExitingRootDirectory) {
        console.log('*** You cannot access files out of root directory! ***');
        return;
    };

    let preventExitingRootDirectoryOnCopy = utils.preventFromExitingRootDirectory(rootDirectory, newFilePath);
    if (preventExitingRootDirectoryOnCopy) {
        console.log('*** You cannot create files outside root directory! ***');
        return;
    };

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

    if (utils.validateArgsAmount(args, 1)) return;

    let pathToFile = args[0].trim();

    currentDirectory = pr.cwd();

    const filePath = path.resolve(currentDirectory, pathToFile);

    let preventExitingRootDirectory = utils.preventFromExitingRootDirectory(rootDirectory, filePath);
    if (preventExitingRootDirectory) {
        console.log('*** You cannot access files out of root directory! ***');
        return;
    };

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