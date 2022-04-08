const fs = require('fs');
const os = require('os');

var pathToSave = os.homedir()+"/stocks/"

async function save(data, additionalDirectory = ''){

    if(additionalDirectory !== '')
        pathToSave = pathToSave + additionalDirectory+'/'

    if(!fs.existsSync(pathToSave)){
        fs.mkdirSync(pathToSave)
    }
    
    fs.writeFile(pathToSave+data.stockId, JSON.stringify(data), error => {
        if (error) {
        console.error(error)
        return
        }
    })
}

module.exports = {save};