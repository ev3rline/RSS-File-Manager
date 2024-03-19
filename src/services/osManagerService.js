 import os from 'node:os';

const getEOL = () => {
    const currentEOLValue = os.EOL;
    console.log(JSON.stringify(currentEOLValue));
}

const getCPUs = () => {
    const currentCPUs = os.cpus();

    const columns = {
        model: 'Model',
        speed: 'Speed (GHz)'
    }

    const transformedData = currentCPUs.map(obj => {
        let newObj = {};
        for (let key in obj) {
            if (key in columns) {
                newObj[columns[key]] = typeof obj[key] === 'string' ? obj[key].trim() : obj[key];
            }
        }

        return newObj;
    })

    console.table(transformedData);
    console.log(`Overall number of CPUs: ${transformedData.length}`);
}

const getHomeDirectory = () => {
    const homeDir = os.homedir();
    console.log(homeDir);
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
    getHomeDirectory,
    getUsername,
    getArchitecture
}