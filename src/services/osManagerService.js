import os from 'node:os';

const getEOL = () => {
    const currentEOLValue = os.EOL;
    console.log(JSON.stringify(currentEOLValue));
}

const getCPUs = () => {
    const currentCPUs = os.cpus();
    const arr = [];

    for (const cpu of currentCPUs) {
        let tempObj = {};
        tempObj.Model = cpu.model;
        tempObj.Speed = cpu.speed;

        arr.push(tempObj);
    }

    console.table([...arr], ['Model', 'Speed']);
}

const getUsername = () => {
    const currentUsername = os.userInfo().username;
    console.log(currentUsername)
}

const getArchitecture = () => {
    const currentCPUArchitecture = os.arch();
    console.log(currentCPUArchitecture)
}

export {
    getEOL,
    getCPUs,
    getUsername,
    getArchitecture
}