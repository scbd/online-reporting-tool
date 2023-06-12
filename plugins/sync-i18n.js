import { copyFile, mkdir, readFile, readdir, stat, writeFile } from 'fs/promises';
import path from 'path';
import assert from 'assert';
import * as url from 'url';
const __dirname = url.fileURLToPath(new url.URL('.', import.meta.url));
const __rootDirname =  url.fileURLToPath(new url.URL('../', import.meta.url));
class i18nFileSync {

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {

    compiler.hooks.done.tap('i18nFileSync', () => {
      console.log(this.options.message || 'i18nFileSync done!');
    });
    compiler.hooks.beforeCompile.tapAsync('i18nFileSync', (params, callback) => {
      return syncLocaleFiles().then(callback);
    });

    async function syncLocaleFiles(matchedFiles) {
      const enFolder = 'i18n/en'
      const otherLocales = ['ar', 'es', 'fr', 'ru', 'zh']//
      let enFiles = [];

      if (!matchedFiles) {
        enFiles = await getAllDirectoryFiles(enFolder)
      }

      const filePromises = []
      const enFileData = {};     
              
      for (let j = 0; j < enFiles.length; j++) {
        const enFile = enFiles[j];
        filePromises.push(createLocaleFile(enFile));
      }
      
      await Promise.all(filePromises);

    }

    async function createLocaleFile(enFile){

      const locales = ['en', 'ar', 'es', 'fr', 'ru', 'zh'];
      const localeFilePromises = []
      for (let i = 0; i < locales.length; i++) {
        const locale = locales[i];

        const langFilePath = enFile.replace(/\/en\//, `/${locale}/`);
        const taskPromise = readJsonFile(langFilePath).then((data)=>{
          return {
            [locale] : data || {}
          }
        });
        
        localeFilePromises.push(taskPromise);

      }
      
      const localeData = await Promise.all(localeFilePromises);
      const distFilePath = enFile.replace(/\/en\//, `/dist/`);
      const flatData = localeData.reduce((a,b)=>{return { ...(a), ...(b||{})}});

      try{
          const existingData = await readJsonFile(distFilePath);
          //assert.deepEqual throws error when object are not equal
          assert.deepEqual(flatData, existingData)
      }
      catch(e){
        await  mkdir(path.dirname(`${__rootDirname}${distFilePath}`), { recursive: true });
        await writeFile(`${__rootDirname}${distFilePath}`, JSON.stringify(flatData, null, 4), {encoding:"utf8"})
      }
      
    }

    async function readJsonFile(filePath){
      try{
        const fileStat = await stat(filePath);
        if(fileStat && fileStat.size > 0){

          const fileData = await readFile(`${__rootDirname}${filePath}`, {encoding:"utf8"})
          return JSON.parse(fileData);

        }
      }
      catch(e){
        console.debug('error reading json file', e)
        //locale file does not exists, ignore 
      }

      return {};

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
          console.log(e, file)
        }
      }))
      return fileList;

    }
  }
}


export default i18nFileSync;