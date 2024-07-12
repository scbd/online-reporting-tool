import $ from 'jquery'
export default defineNuxtPlugin( () => {
    // window = window || {};
    window.jQuery = window.$ = $
} )