# Deploy

The site is the folder `./out`. Build it with `make build` (or `STATIC_EXPORT=1 pnpm build`) and upload its contents.

Before building for production, set in `.env` (or the host's build settings):
- `SITE_URL=https://www.example.com` (canonical URLs, sitemap, social cards; no trailing slash)
- `LOCALE_DEFAULT` and `LOCALE_SUPPORTED` (see CUSTOMIZE.md)

Every host needs the same four things, which the files in `public/` already provide: clean URLs (`/about/` serves
`about/index.html`), the exported `404.html` for unknown paths, security headers, and long caching for `/_next/static/`.

## Shared hosting (Apache, cPanel)
1. `make build`. `out/.htaccess` is included (clean URLs, 404, compression, headers).
2. Upload the contents of `out/` (not the folder itself) to the web root, `public_html` for example.
3. Needs `mod_headers`, `mod_deflate`, `mod_expires` and `AllowOverride All` (default on most hosts). Visit `/about` (no slash): it should redirect to `/about/`.

## Netlify
- Drag `out/` into Netlify Drop, or connect the repo with build command `STATIC_EXPORT=1 pnpm build`, publish directory `out`, Node 24.
- `out/_headers` carries the headers. Add the env vars above under Site configuration.

## Cloudflare Pages
- Connect the repo: build command `STATIC_EXPORT=1 pnpm build`, output directory `out`, `NODE_VERSION=24`. Or `wrangler pages deploy out`.
- `out/_headers` is read as is. Add the env vars above.

## Automatic deploy (GitHub Actions)
 builds the export on every push to  (and on a manual run) and publishes it to each target that is switched on.
A target is on when its repository variable is  (Settings > Secrets and variables > Actions); with none set, it only builds.

| Target | Variable to switch on | Also needed |
|--------|----------------------|-------------|
| GitHub Pages |  | Settings > Pages > Source: GitHub Actions. Needs a custom domain or a user site: the site uses root-relative paths, so a project URL () will not load its CSS or images |
| Cloudflare Pages |  | Variable ; secrets  (Pages edit) and  |
| Netlify |  | Secrets  and  |

Set the variable  to the live address (canonical URLs, sitemap) and, if different from the defaults,  / .

## GitHub release
Pushing a tag `v*` runs `.github/workflows/release.yml`, which builds the site and attaches `site-<tag>.zip` (the contents of `out/`).
`check.yml` runs the data, type, audit and build checks on every push.

## nginx
`docker/nginx/templates/default.conf.template` is a working server block for `out/` (clean URLs, 404, headers, caching).

## After going live
Open `/`, `/<second-code>/`, `/sitemap.xml` and `/robots.txt`; submit the sitemap in Google Search Console; check a social share of the home page.
