// Minimal DOM shims so browser-only libraries that touch DOM globals at
// import time (vue3-loading-overlay prop types, the custom CKEditor build's
// customElements registration) can be evaluated in the server bundle.
// They are never actually rendered server-side (client-only routes /
// <ClientOnly> wrappers) — the shims only need to satisfy module evaluation.
export default defineNitroPlugin(() => {
    const g = globalThis as any;

    if (!g.HTMLElement)
        g.HTMLElement = class HTMLElement {};

    if (!g.customElements)
        g.customElements = { define: () => {}, get: () => undefined, whenDefined: () => new Promise(() => {}) };
});
