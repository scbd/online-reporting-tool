import { copyFile, mkdir, readFile, readdir, stat, writeFile } from 'fs/promises';
import path from 'path';
import assert, { match } from 'assert';
import * as url from 'url';
import {readJson} from 'fs-extra';

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
    const taskPromise = readJsonFile(langFilePath).then((data)=>{      
      return {
        [locale] : {...enData, ...(data||{})}
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
      console.error(e, file)
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