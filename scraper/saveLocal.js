const fs = require('fs');
const os = require('os');

const pathToSave = os.homedir()+"/stocks/"

async function save(data){

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