import $ from 'jquery'
export default defineNuxtPlugin( () => {
    window.jQuery = window.$ = $
} )