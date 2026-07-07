# SSR Migration Plan — Hybrid Rendering for Public Routes

## Goal

Enable server-side rendering (SSR) for the public, SEO-relevant pages of the
Online Reporting Tool while keeping all authenticated/editing surfaces as
client-rendered SPA routes. Blanket SSR is explicitly **not** the goal: the
app is often embedded in an authenticated iframe where SSR buys nothing, and
the iframe `postMessage` auth handshake cannot run on a server.

## Current state (before this migration)

- Nuxt 3 app with `ssr: false` — a pure SPA.
- Auth: iframe/`postMessage` scheme (`auth/scbdIframe`), token lives client-side.
- Data fetching: imperative `$fetch` via API service classes
  (`api/*.ts`, registered in `plugins/register-apis.ts`), mostly from
  `onMounted` — not SSR-aware.
- ~90 files touch `window`/`document`/`localStorage`; browser-only libs in
  use: jQuery (global plugin), masonry-layout, print-this, CKEditor 5,
  socket.io-client, CoreUI/Bootstrap JS.
- All 6 Pinia stores persist via `@pinia-plugin-persistedstate/nuxt`
  `persistedState.localStorage/sessionStorage` helpers (SSR-safe no-ops on
  the server).

## Rendering split

**SSR (public, SEO-relevant):**

| Route tree | Notes |
|---|---|
| `/` | Landing page |
| `/knowledge-base/**` | Articles, tags |
| `/taxonomy/**` | GBF goals/targets/indicators |
| `/national-reports`, `/national-reports/nr7`, `/national-reports/nr7/:id` | Public lists and report views |
| `/national-targets`, `/nbsaps` | Public lists |
| `/stakeholders`, `/stakeholders/commitments(/:id)`, `/stakeholders/credentials/:id` | Public views |
| `/database/:id` | Public record view |

All of the above also apply under the locale prefixes
(`/ar`, `/en`, `/fr`, `/es`, `/ru`, `/zh` — i18n strategy is
`prefix_and_default`).

**Client-only (stays SPA, `ssr: false`):**

- Everything under `my-country`, `my-commitments`, `my-credentials`,
  `my-country-reviews` (authenticated editing/review flows)
- `/dashboard`, `/users/**`, `/workflows/**`
- `/search/**` (query-driven, no SEO value), analyzers
- Error pages

## Phases

### Phase 1 — boot with `ssr: true` without behavior change ✅ (this branch)

1. `ssr: true` in `nuxt.config.ts` with `routeRules` defaulting **all**
   routes to `{ ssr: false }`, then opting the public trees back in.
2. Client-only plugins renamed to `.client.ts`:
   `plugins/jquery.ts`, `plugins/reCaptcha.ts`,
   `auth/scbdIframe/plugins/0.auth.ts`.
3. Guard `window` access that can run during server-side execution
   (`plugins/fetchConf.ts`, `composables/utils.ts`).
4. Verify: `nuxt build` succeeds and `node .output/server/index.mjs`
   serves every route without a 500; SSR routes return rendered HTML.

### Phase 2 — make SSR pages actually render content

Per public page, in priority order (knowledge-base articles → taxonomy →
report views):

1. Move initial data loading from `onMounted` into
   `useAsyncData(() => $api.….query(…))` so the server fetches and the
   payload transfers to the client (the API service classes stay; they are
   just called inside `useAsyncData`).
2. Wrap browser-only widgets in `<ClientOnly>`: CKEditor, masonry grids,
   print sections, toasts/overlays, anything jQuery-driven.
3. Add `useSeoMeta`/`useHead` (title, description, og tags) — the reason
   SSR is wanted.
4. Verify per route: `curl` returns meaningful HTML; no hydration-mismatch
   warnings in the browser console.

### Phase 3 — deployment

`ssr: false` produced a static bundle; hybrid output needs the Nitro node
server (`node .output/server/index.mjs`). Update `Dockerfile`, health
checks, and `deploy-dev.sh`. Runtime config env vars are read at server
start (build-once, configure-per-env).

### Out of scope (deliberate)

- SSR of authenticated content. Would require mirroring the iframe token
  into an httpOnly cookie via a Nitro route and reading it with
  `useRequestHeaders` — invasive, and the authenticated surfaces have no
  SEO requirement.
- Replacing jQuery-driven components — tracked separately; they are kept
  working via the client-only plugin and `<ClientOnly>` wrappers.

## Status — 2026-07-07 (branch `ssr-v2`)

Measured against the phases above; architectural context in
`docs/architecture-review-2026-07-07.html`.

### Phase 1 — done ✅

`ssr: true` + `routeRules` split is live (14 public trees in, 8
authenticated subtrees out, ×6 locale prefixes), client-only plugins
renamed, `window` guards in place.

### Phase 3 — mostly done ✅

Dockerfile already runs `node .output/server/index.mjs` with
`NUXT_HOST`/`NUXT_PORT`. Remaining:

- [ ] container health check
- [ ] confirm swarm service port mapping in `deploy-dev.sh`

### Phase 2 — not started (the remaining bulk)

- [ ] **`useAsyncData` conversion: 0 of the public pages done.** Every SSR
      route still fetches in `onMounted`, so the server renders dataless
      shells and the SEO goal is unmet. Priority per this plan:
      knowledge-base → taxonomy → national-report views → lists →
      stakeholders → `/database/:id`.
- [ ] **`<ClientOnly>` wrapping: 0 usages** in pages/components (only
      CKEditor is safe, via its `.client.vue` suffix). Masonry, print
      sections, toasts, jQuery widgets on public pages are unwrapped.
- [ ] **SEO meta: ~30%.** 10 pages have `useHead`/`useSeoMeta`, but
      concentrated in taxonomy and search (search is not even an SSR
      route). Missing: knowledge-base, national-report views,
      stakeholders, `/database/:id`, landing page.
- [ ] Per-route verification (curl returns meaningful HTML, no hydration
      warnings) — blocked on the above.

### Blockers found since the plan was written

These bite exactly when Phase 2 starts; details and file:line in the
architecture review's fix-now section:

- `plugins/fetchConf.ts` overwrites `globalThis.$fetch` per request —
  cross-request contamination once the server starts fetching.
- `server/plugins/cache.ts` forces `no-cache` on every response — replace
  with per-route `swr`/cache rules once pages render real content.
- `useAuth()` SSR stub returns `loggedIn: false`; ~11 query-building
  sites read `user.government` → hydration mismatches on public pages.
- Persisted store caches (sessionStorage/localStorage) rehydrate with
  different data than the server rendered.
- `routeRules` fragility: new authenticated subtrees under public
  prefixes silently SSR unless added to `clientOnlyOverrides`.

**Shortest path to a first crawlable page:** fix `fetchConf`, convert the
knowledge-base article page to `useAsyncData` + `useSeoMeta`, curl it.

## Risks / gotchas

- **Hydration mismatches** on pages whose markup depends on locale
  direction, dates (`moment`), or persisted store state. Fix case by case;
  persisted state rehydrates client-side by design.
- **`routeRules` and locale prefixes**: every rule must exist for the bare
  path *and* each locale prefix; the config generates these
  programmatically — keep using the helper when adding routes.
- **`spa-loading-template`**: client-only routes now render an empty shell
  server-side; check that embed/iframe consumers are unaffected.
