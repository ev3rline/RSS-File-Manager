import * as errorHandler from '../handlers/errorHandler.js';
import * as utils from '../utils/utils.js'

import fs from 'node:fs';
import path from 'node:path';
import pr from 'node:process';
import str from 'node:stream';
import zlib from 'node:zlib';

const rootDirectory = path.resolve(pr.cwd(), '..');
let currentDirectory;

const compress = async (args) => {
    args.shift();

    if (utils.validateArgsAmount(args, 2)) return;

    let pathToFile = args[0].trim();
    let pathToFileCompressed = args[1].trim();

    currentDirectory = pr.cwd();

    const oldFilePath = path.resolve(currentDirectory, pathToFile);
    const newFilePath = path.resolve(currentDirectory, pathToFileCompressed);

    let preventExitingRootDirectory = utils.preventFromExitingRootDirectory(rootDirectory, oldFilePath);
    if (preventExitingRootDirectory) {
        console.log('*** You cannot access files out of root directory! ***');
        return;
    };

    let preventExitingRootDirectoryOnCompress = utils.preventFromExitingRootDirectory(rootDirectory, newFilePath);
    if (preventExitingRootDirectoryOnCompress) {
        console.log('*** You cannot create files outside root directory! ***');
        return;
    };

    const sourceStream = fs.createReadStream(oldFilePath);
    const targetStream = fs.createWriteStream(newFilePath);

    const brotliCompress = zlib.createBrotliCompress();

    await str.promises.pipeline(sourceStream, brotliCompress, targetStream);
};

const decompress = async (args) => {
    args.shift();

    if (utils.validateArgsAmount(args, 2)) return;

    let pathToFile = args[0].trim();
    let pathToFileDecompressed = args[1].trim();

    currentDirectory = pr.cwd();

    const oldFilePath = path.resolve(currentDirectory, pathToFile);
    const newFilePath = path.resolve(currentDirectory, pathToFileDecompressed);

    let preventExitingRootDirectory = utils.preventFromExitingRootDirectory(rootDirectory, oldFilePath);
    if (preventExitingRootDirectory) {
        console.log('*** You cannot access files out of root directory! ***');
        return;
    };

    let preventExitingRootDirectoryOnDecompress = utils.preventFromExitingRootDirectory(rootDirectory, newFilePath);
    if (preventExitingRootDirectoryOnDecompress) {
        console.log('*** You cannot create files outside root directory! ***');
        return;
    };

    const sourceStream = fs.createReadStream(oldFilePath);
    const targetStream = fs.createWriteStream(newFilePath);

    const brotliDecompress = zlib.createBrotliDecompress();

    await str.promises.pipeline(sourceStream, brotliDecompress, targetStream);
};

export {
    compress,
    decompress
}