//@ts-nocheck

import _        from 'lodash';
import path     from 'path';
import readline from 'readline';
import finder   from 'fs-finder';
import fs       from 'fs/promises';

const supportedLanguages = ['ar', 'ru', 'zh', 'fr', 'es'] 
const destination = process.cwd() + '/i18n'

async function beginImport(){

    console.info(destination);
    
    let source = await askUser('Enter source location: ')
    source = source.replace(/'/g, '')
    const dirStat = await fs.stat(source);
    if(!dirStat.isDirectory()){
        console.error(`Invalid source path`)
        return beginImport();
    }

    await copyFiles(source, destination);
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

async function copyFiles(source, destination){
        var directories = await fs.readdir(source);
        
        const exportFolderFormat = ['ru-RU', 'ar-SA', 'fr-FR','es-ES', 'zh-CN'];

        console.info(directories);
        for (let i = 0; i < directories.length; i++) {
            const directory = directories[i];

            const dirStats = await fs.stat(`${source}/${directory}`)
            if(!dirStats.isDirectory())
                continue;
                
            if(!exportFolderFormat.includes(directory)){
                await copyFiles(`${source}/${directory}`, destination);
                continue;
            }

            var lang = directory.split('-');
            if(lang && lang.length > 1){
                if(supportedLanguages.includes(lang[0])){
                    var language = lang[0];
                    console.info(source + '/' + directory)
                    await copyFolderFiles(source + '/' + directory, source + '/' + directory, language, destination)
                }
                else{
                    console.error(`Invalid langues folder ${lang[0]}, skipping...`)
                }
            }
        };
}

async function copyFolderFiles(sourceRootPath, source, lang, destination){
    var paths = finder.in(source).find();	
    // console.log(paths)

    for (let i = 0; i < paths.length; i++) {
        const filepath = paths[i];
        
        const stats = await fs.stat(filepath)
            
        if(stats.isFile()){
            const destinationFileName = `${destination}/${lang}${filepath.replace(sourceRootPath, '').replace('/online-reporting-tool/i18n/en', '')}`
            console.info(destinationFileName)

            const dirName = path.dirname(destinationFileName);
            const destStats = await fs.stat(filepath);
            if(!destStats.isDirectory()){
                await fs.mkdir(dirName, {recursive:true});
            }

            if(path.extname(filepath) == '.json'){
                let jsonFileKeys = (await import(filepath, { with: { type: 'json' }})).default;
                let existingKeys = {}
                
                if(await fileExists(destinationFileName)){
                    existingKeys = (await import(destinationFileName, { with: { type: 'json' }})).default; 
                }
                jsonFileKeys = removeEmpty(jsonFileKeys, existingKeys);

                await fs.writeFile(`${destinationFileName}`, JSON.stringify({...jsonFileKeys}, undefined, 2));
            }
            else
                await fs.copyFile(filepath, destinationFileName);
        }
        else if(stats.isDirectory()){
            await copyFolderFiles(sourceRootPath, filepath, lang, destination);
        }
    }
}

async function fileExists(filepath){
    try{
        const stats = await fs.stat(filepath);

        return stats.isFile();
    }
    catch(e){
        return false;
    }
}

const removeEmpty = (obj, existingKeys)=> {

    return function remove(current) {
      _.forOwn(current, function (value, key) {
        if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
          (_.isString(value) && _.isEmpty(value?.trim())) ||
          (_.isObject(value) && _.isEmpty(remove(value, existingKeys[key])))) {
        
            if(existingKeys[key])
                current[key] = existingKeys[key];
            else
                delete current[key];
        }
      });

      if (_.isArray(current)) _.pull(current, undefined);
  
      return current;
  
    }(_.cloneDeep(obj));
}

beginImport();