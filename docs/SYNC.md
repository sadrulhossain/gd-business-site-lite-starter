# Sync with the template

Template: https://github.com/sadrulhossain/gd-business-site-boilerplate (git remote `upstream`, push disabled).

Policy: sync only theme tokens and shared components, by copying the files by hand. No merges, no rebases and no
cherry-picks from `upstream`. Everything else (API, admin, Docker services, docs) is out of scope on purpose.

| What | Lite path | Template path |
|------|-----------|---------------|
| Theme tokens | `src/styles/base.css`, `src/styles/portal.css` | `packages/tokens/base.css`, `packages/tokens/portal.css` |
| Shared components | `src/components/*` | `web/portal/components/*` |

## Record
| Date | Template tag | Template commit | Note |
|------|--------------|-----------------|------|
| 2026-11-14 | v1.0.0 | 617ce9d12c779d1cdfdcd11a065021eedf1d965a | Initial clone, phase L0 |
| 2026-11-14 | main (b7dd103) | b7dd103849040ae11c17e1c414fb980fbac79750 | Green portal theme: tokens, Header (+MobileNav, NavDropdown), Footer, SiteLogo, SocialIcon, LanguageSwitcher, HoursList, sections, icon. Pricing module and the Powered-by line not copied |
