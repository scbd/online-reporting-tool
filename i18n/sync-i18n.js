import { copyFile, mkdir, readFile, readdir, stat, writeFile } from 'fs/promises';
import path from 'path';
import assert, { match } from 'assert';
import * as url from 'url';
import {readJson} from 'fs-extra';
import crypto       from 'crypto';

const __dirname = url.fileURLToPath(new url.URL('.', import.meta.url));
const __rootDirname =  url.fileURLToPath(new url.URL('../', import.meta.url));

const i18nFolder = 'i18n'
const enFolder = `${i18nFolder}/en`
const otherLocales = ['ar', 'es', 'fr', 'ru', 'zh'];

async function syncLocaleFiles(matchedFiles) {
  
  let enFiles = matchedFiles || [];
  if (!enFiles?.length) {
    enFiles = await getAllDirectoryFiles(enFolder)
  }

  const filePromises = []
  const enFileData = {};     
          
  for (let j = 0; j < enFiles.length; j++) {
    const enFile = enFiles[j];
    filePromises.push(createLocaleFile(enFile));
  }
  
  const flatData = await Promise.all(filePromises);

  return flatData;

}

async function createLocaleFile(enFile){

  const locales = ['ar', 'es', 'fr', 'ru', 'zh'];
  const localeFilePromises = []

  //TODO check wny i18n fallback is not working, temp copy en props to lang objects
  let enData = await readJsonFile(enFile);

  for (let i = 0; i < locales.length; i++) {
    const locale = locales[i];

    const langFilePath = enFile.replace(/\/en\//, `/${locale}/`);
    const taskPromise = readJsonFile(langFilePath)
          .then((data)=>{ 
            // console.log(langFilePath)
            const hashData = compareKeyHashes(enData, data||{})
            return {
              [locale] : { ...hashData } //{ ...(data||{}), ...hashData}
            }
          });
    
    localeFilePromises.push(taskPromise);

  }
  
  const localeData = await Promise.all(localeFilePromises);
  localeData.unshift({en:enData});

  const distFilePath = enFile.replace(/\/en\//, `/dist/`); //path is i18n/dist/
  const flatData = localeData.reduce((a,b)=>{return { ...(a), ...(b||{})}});

  try{
      // const existingData = await readJsonFile(distFilePath);
      // //assert.deepEqual throws error when object are not equal
      // assert.deepEqual(flatData, existingData)
      await  mkdir(path.dirname(`${__rootDirname}${distFilePath}`), { recursive: true });
      await writeFile(`${__rootDirname}${distFilePath}`, JSON.stringify(flatData, null, 4), {encoding:"utf8"})
  }
  catch(e){
  }
  
  return JSON.parse(JSON.stringify(flatData));
}

async function createLocaleEnFile(enVueFile){
    const jsonFileName = `${__rootDirname}${enFolder}/${enVueFile.replace(/\.vue$/, '.json')}`
    try{
        const fileStat = await stat(jsonFileName);
    }
    catch(e){
        try{
            console.log(`********** Creating locale file for vue file ${enVueFile} ***********`)
            await  mkdir(path.dirname(jsonFileName), { recursive: true });
            await writeFile(jsonFileName, JSON.stringify({}))
        }
        catch(e){
            console.log(e)
        }
    }
}

async function readJsonFile(filePath){
  try{
    const fileStat = await stat(filePath);
    if(fileStat && fileStat.size > 0){
        const parsedData = await readJson(`${__rootDirname}${filePath}`, {encoding:"utf8"})
        return parsedData;
    }
  }
  catch(e){
    // if(e?.message?.indexOf('ENOENT')>=0)
    //     console.warn('error reading json file', e)
    //locale file does not exists, ignore 
  }

}
function remove_linebreaks(str) {
    return str.replace(/[\r\n]+/gm, " ");
}

// Remove from existing & valid keys in the localizedVersion from the base version; 
function compareKeyHashes(baseMessages, localizedMessages) {

  baseMessages = { ...baseMessages }; // copy

  const meta = localizedMessages['#meta']
  if(meta?.hashes){
    delete localizedMessages['#meta'];

    Object.entries(localizedMessages).filter(([, value]) => !!value)
      .forEach(([key]) => {
        
          //if the key has hash only then continue with locale else use english
          if(baseMessages[key] && meta.hashes[key]){
            let enHash;
            const enText = baseMessages[key];
            
            if(meta.algorithm =='md5'){
              enHash = crypto.createHash('md5').update(enText).digest("hex");
            }

            //if locale hash matches the english text has then use locale text else english
            if(enHash?.length && meta.hashes[key] == enHash){
              delete baseMessages[key];
            }
            else{
              delete localizedMessages[key];
            }
          }
      });
  }

  Object.entries(localizedMessages).filter(([, value]) => !!value).forEach(([key]) => {
    delete baseMessages[key];
  });
  return localizedMessages;
  // return baseMessages;
}

async function getAllDirectoryFiles(dir, options) {
  options = options || {};

  let fileList = [];
  const files = await readdir(dir)

  await Promise.all(files.map(async file => {
    try {
      const filePath = path.join(dir, file);
      const info = await stat(filePath)
      if (info.isDirectory()) {
        const subDirFiles = await getAllDirectoryFiles(filePath, options);
        fileList = [...fileList, ...subDirFiles];
      } else if (filePath) {
        fileList.push(filePath)
      }
    } catch (e) {
      useLogger().error(e, file)
    }
  }))
  return fileList;

}

export function viteSyncI18nFiles(options) {
  let isBuildRunning = false;
  return {
    name: 'vite-plugin-sync-i18n-files',
    async buildStart(a,b){
      console.debug('Syncing i18n files')
      
      isBuildRunning = true;
      await syncLocaleFiles();
      isBuildRunning = false;
      
      console.debug('Syncing i18n files finished')
    },    
    handleHotUpdate: async function handleHotUpdate(_ref) {

      // if(isBuildRunning)
      //   return;
      var file = _ref.file.replace(__rootDirname, ''),
      server = _ref.server;
      if(file.split(".").pop() === "vue"){
        await createLocaleEnFile(file);
      };

      if (!file.includes(enFolder) || file.split(".").pop() !== "json") return;

      const messages = await syncLocaleFiles([file]);      
      server.ws.send({
        type: "custom",
        event: "locales-update",
        data: messages
      });
    }
  }
}