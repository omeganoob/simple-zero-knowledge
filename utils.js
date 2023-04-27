import * as fs from 'fs';

const exportFile = (content) => {
    const filename = 'knowledge_verifier.sol';

    fs.writeFile(filename, content, (err) => {
        if (err) throw err;
        console.log(`The file '${filename}' has been saved!`);
    });
}

export {exportFile}