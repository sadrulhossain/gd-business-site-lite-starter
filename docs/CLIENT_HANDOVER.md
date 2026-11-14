# Client handover

**Site:** _client name_ · **Live address:** _https://..._ · **Handed over:** _date_

## What you have
A fast website with no admin login, no database and nothing to patch on the server. It is a set of files on your host.
Text and pictures change by editing a few content files and uploading the result.

## Changing things
| To change | Edit | Then |
|-----------|------|------|
| Name, phone, hours, address, socials | `src/data/settings.js` | rebuild and upload |
| Page text, hide a section | `src/data/sections.js` | rebuild and upload |
| Services, FAQ, testimonials, gallery | the matching file in `src/data/` | rebuild and upload |
| Pictures | `content/images/` (jpg or png) | rebuild and upload |
| Colours | `src/styles/portal.css` | rebuild and upload |

Rebuild: `make build`. Upload the contents of the `out` folder to the host (see DEPLOY.md). A mistake in the content
files stops the build with a message saying which file and field, so nothing broken is published.

## Accounts and access (fill in)
- Domain registrar / DNS: _..._
- Hosting: _..._
- Source repository: _..._
- Search Console / analytics: _..._

## What this site does not do
No contact form, no online orders or bookings, no blog, no login. Contact is by phone, WhatsApp, email and the map link.
If you need editing without code, a form or a blog, ask about moving to the full edition (UPGRADE.md).

## Care
- Renew the domain and hosting yearly.
- Once a quarter: rebuild with `make build` (picks up security fixes) and run `make check`.
- Keep original photos; the site makes its own web sizes.

## Support
_Contact for changes and questions._
