import { findArgumentValue } from '../utils/utils.js';

import pr from 'node:process';

const getUsername = () => {
    const args = pr.argv.slice(2);

    const userNameArgValue = findArgumentValue(args, '--username', true);

    return userNameArgValue;
}

export {
    getUsername
}