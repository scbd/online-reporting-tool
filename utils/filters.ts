//@ts-nocheck
import moment from 'moment';
import { useI18n } from 'vue-i18n'

export function formatDate(datetime, format, local) {
    if (format === undefined)
        format = 'DD MMM YYYY  HH:mm';

    if(!local)
      return formatMomentDate(datetime, 'format',format);

    return formatMomentLocalDate(datetime, 'format', format)
}
export function formatMomentDate(datetime, method, arg1, arg2, arg3) {
    if(datetime)
        return moment.utc(datetime)[method](arg1, arg2, arg3);    
}

export function formatMomentLocalDate(datetime, method, arg1, arg2, arg3) {
    if(datetime){
        return moment(datetime).local()[method](arg1, arg2, arg3);
    }
}
export function lstring(ltext, locale) {
  
    if(Number.isInteger(ltext)) //is number to handle generic implementation of NR
      return ltext;
  
      if (!ltext)
      return "";

    if (typeof(ltext) === 'string')
        return ltext;
    
    locale = locale || lstringLocale(ltext, locale);
    let sText="";
    if (!sText && locale)
      sText = ltext[locale];
    if (!sText)
      sText = ltext.en;
    if (!sText) {
      var normalized = normalizeText(ltext)
      if(normalized[locale])
        return normalized[locale];

      for (var key in ltext) {
        sText = ltext[key];
        if (sText)
          break;
      }
    }
    return sText || "";
}

export const lstringLocale = (ltext, locale)=> {

    const { locale:defaultLocale } = useI18n();

    if(locale && Array.isArray(locale))
        locale = defaultLocale.value;

    locale = locale || defaultLocale.value;

    if(!ltext)
    return locale;

    if(typeof(ltext) == 'string')
    return locale;

    if(ltext[locale])
    return locale;

    if(ltext[defaultLocale.value])
            return defaultLocale.value;

    if(ltext.en)
        return 'en';
    
    if(ltext.fr) return 'fr';
    if(ltext.es) return 'es';
    if(ltext.ru) return 'ru';
    if(ltext.ar) return 'ar';
    if(ltext.zh) return 'zh';

    for(var key in ltext) {
    if(ltext[key])
        return key;
    }

    return locale;
}

export const direction = (text, locale)=>{

    locale = lstringLocale(text, locale);

    return localeDirection(locale);
};

export const localeDirection = (locale)=> {
    const {locale : defaultLocale}  = useI18n();

    return (locale||defaultLocale) == 'ar' ? 'rtl' : 'ltr';
};

function normalizeText(text) {
  if(!text) return null;

  var entry = { ar: text.ar, en: text.en, es: text.es, fr: text.fr, ru: text.ru, zh: text.zh };

  if(!entry.en) entry.en = entry.fr;
  if(!entry.en) entry.en = entry.es;
  if(!entry.en) entry.en = entry.ru;
  if(!entry.en) entry.en = entry.ar;
  if(!entry.en) entry.en = entry.zh;

  if(!entry.fr) entry.fr = entry.en;
  if(!entry.es) entry.es = entry.en;
  if(!entry.ru) entry.ru = entry.en;
  if(!entry.ar) entry.ar = entry.en;
  if(!entry.zh) entry.zh = entry.en;
  return entry;
}


export const customLabel = (option, locale)=>{        
  return lstring(option?.title, locale);
}

export const customShortLabel = (option, locale)=>{        
  return lstring(option?.shortTitle, locale);
}

export const customSelectedItem = (item)=>{
  return { identifier : item };
}