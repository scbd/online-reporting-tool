import fs from 'fs/promises';
import path from 'path';
import * as url from 'url';
import readline from 'readline';

const __dirname = url.fileURLToPath(new url.URL('.', import.meta.url));

const i18nDir = 'i18n';
const locales = ['ar', 'en', 'es', 'fr', 'ru', 'zh'];

async function main(){

    let confirmation = await askUser('!!!!!!!!!!!!! Please confirm the project is not running dev script (y/n) !!!!!!!!!!!!!!:   ')
    if(confirmation!= 'y')
        return main();

    let source = await askUser('Enter file path:   ')
    source = source.replace(/'/g, '')
    const dirStat = await fs.stat(source);
    if(!dirStat.isFile()){
        console.error(`Invalid file path`)
        return main();
    }

    let newFileName = await askUser('Enter new file name:   ')

    await renameFile(newFileName, source);

}

async function renameFile(newFileName, source) {
    const parsedFile = path.parse(source);
    const localFilePath = source.replace(__dirname, '');
    const sourceBaseFolder = path.dirname(localFilePath);
    const oldFileName = path.basename(source);

    const newFilePath = source.replace(oldFileName, `${newFileName}${parsedFile.ext}`);

    // Rename the file
    await fs.rename(source, newFilePath);

    //update the old file reference in .vue file
    if (parsedFile.ext == '.vue') {
        let fileContent = await fs.readFile(newFilePath);
        fileContent = fileContent.toString().replace(`${sourceBaseFolder}/${parsedFile.name}.json`, `${sourceBaseFolder}/${newFileName}.json`);
        await fs.writeFile(newFilePath, fileContent);
    }
    // rename the files in locale folder
    for (let i = 0; i < locales.length; i++) {
        const locale = locales[i];
        const oldLocaleFileName = `${parsedFile.name}.json`;
        const localeFileFolder = `${__dirname}${i18nDir}/${locale}/${sourceBaseFolder}`;
        const oldLocaleFilepath = `${localeFileFolder}/${oldLocaleFileName}`;
        const newLocaleFilePath = `${localeFileFolder}/${newFileName}.json`;

        try {
            const localeStat = await fs.stat(oldLocaleFilepath);
            if (localeStat.isFile())
                await fs.rename(oldLocaleFilepath, newLocaleFilePath);
        }
        catch (e) { }

    }
    console.log('File renaming successful!!!!!!');
}

function askUser(question){

    const promise = new Promise((resolve)=>{

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer)
        });
    });

    return promise;
}

main();