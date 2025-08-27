// @ts-ignore
import $ from 'jquery'
export default defineNuxtPlugin( () => {
    if (process.client) {
        window.jQuery = window.$ = $
    }
} )