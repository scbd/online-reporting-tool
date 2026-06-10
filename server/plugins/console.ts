import { consola } from 'consola'

export default defineNitroPlugin(() => {
  const vars = [
    'NUXT_PUBLIC_ACCOUNTS_HOST_URL',
    'NUXT_PUBLIC_API_URL',
    'NUXT_PUBLIC_API_DIRECT_URL',
    'NUXT_PUBLIC_REALM_CONF_HOST',
    'NUXT_PUBLIC_GTAG_ID',
    'NUXT_PUBLIC_CAPTCHA_V2_BADGE_KEY',
    'NUXT_PUBLIC_SITE_ALERT',
    'NUXT_PUBLIC_SITE_ALERT_LEVEL',
  ]

const pad = Math.max(...vars.map(k => k.length))

  const output = vars
    .map(key => `${key.padEnd(pad)} : ${process.env[key] ?? '(unset)'}`)
    .join('\n')

  consola.box(output)
})