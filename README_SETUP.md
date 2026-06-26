# Agent Command Center — Setup

A single-page "second brain" node-graph dashboard for the Luxor Royal Holdings
agents. It renders a glowing central **THE BRAIN** hub with each agent orbiting
around it, wired by animated energy lines, plus an action queue of things that
need you. It reads its data from a sibling `agents_status.json` file.

## Files

- `index.html` — the dashboard (self-contained: inline CSS/JS, only external
  dependency is Google Fonts).
- `agents_status.json` — the data the dashboard reads and re-fetches every 60s.
- `publish_status.py` — stdlib-only script that rewrites `agents_status.json`
  with a fresh timestamp (swap in a live scheduler pull later).
- `README_SETUP.md` — this file.

## Deploy to GitHub Pages (5 steps)

1. **Create a repo.** On GitHub, make a new repository (e.g. `agent-command-center`).
2. **Push these files** to the repo root — `index.html`, `agents_status.json`,
   and (optionally) `publish_status.py`. Keep `index.html` and
   `agents_status.json` side by side; the page fetches the JSON by that exact
   relative name.
3. **Enable Pages.** Repo → **Settings → Pages** → *Source: Deploy from a
   branch* → select your branch (`main`) and `/ (root)` → **Save**. GitHub gives
   you a URL like `https://<you>.github.io/agent-command-center/`.
4. **Change the password.** Open `index.html`, find the line near the top:

   ```js
   const DASHBOARD_PASSWORD = "CHANGEME";
   ```

   Set it to something your team will use, then push the change.
5. **Share the URL** with your team along with the password.

To update the data, edit `agents_status.json` (or run `python3 publish_status.py`)
and push — the live page picks it up within ~60s (it cache-busts each fetch).

## About the password — read this

The password is a **light UX gate, not real security.** GitHub Pages serves
`index.html` and `agents_status.json` as **public static files**. That means:

- Anyone with the URL can **View Source** and read the password right out of the
  HTML.
- Anyone can fetch `https://<you>.github.io/.../agents_status.json` **directly**,
  bypassing the gate entirely.

The gate only stops a casual passer-by from seeing the visual. It does **not**
protect the underlying data.

**This is exactly why no customer PII goes in `agents_status.json`** — no names,
emails, phone numbers, addresses, order IDs, or cart contents. Only aggregates
and summaries (counts, rates, category names). Treat everything in that file as
world-readable, because it is.

## If you need true privacy (future option)

To actually restrict access, host behind real authentication instead of public
Pages — for example:

- A static host with password/SSO protection (Netlify/Cloudflare Access,
  Vercel with auth, an S3 bucket behind Cloudflare Access).
- A tiny authenticated app that serves the JSON only to logged-in team members.

Until then, keep the keep-PII-out rule absolute.
