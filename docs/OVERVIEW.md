# Overview: what this site is and what you get

A fast, simple website for a small local business (the sample is a bakery, "Riverside Bakery"). It has no admin login,
no database and no server to look after: it is a set of ready-made pages you put on any web host.

## Built with
Next.js and React for the pages, Tailwind CSS for styling, TypeScript, and Docker for building and previewing.
The site is exported as plain static files, so it loads quickly and is cheap and safe to host.

## What a client gets
- A professional, mobile-friendly website in **English plus one optional second language** (Bengali in the sample;
  can be switched to one language only).
- Your **business details in one place**: name, tagline, logo, phone, WhatsApp, email, address, opening hours, social links, map link.
- **Contact by call, WhatsApp, email and map**. Each method can be switched on or off.
- **Good search visibility**: page titles and descriptions, social share image, sitemap, robots file, language links
  and local-business information for Google.
- **Fast, accessible pages**: pictures are resized automatically, and the site is tested for speed and accessibility.
- **Your look**: colours, logo and favicon follow your brand.
- **Safe publishing**: a mistake in the content stops the build with a clear message, so nothing broken goes live.
- **Handover pack**: guides for editing, deploying, upgrading and caring for the site.

## Sections and pages
| Section | What it shows | Own page |
|---------|---------------|----------|
| Hero | Headline, short text and a big picture | Home |
| About | Your story with a picture | Yes |
| Services | What you offer, one page per service | Yes, plus `/services/<name>/` |
| Pricing | Plans and prices per service, with a featured plan | Yes, plus a block on each service page |
| Testimonials | Customer quotes | Yes |
| Gallery | Photo grid with a full-size viewer | Yes |
| FAQ | Questions and answers that open and close | Yes |
| Team | Staff or owners (hidden in the sample) | Yes, when shown |
| Contact | Hours, address, phone, WhatsApp, email, map | Yes |

Every section can be **shown, hidden or reordered**. A hidden section disappears from the home page, menu and sitemap.
The site also has a header with menu and language switcher, a footer with contact details and legal links
(privacy policy, terms of use), and a "Page not found" page.

## What the client can change themselves
Text, prices, services, FAQs, testimonials, gallery, team, hours, contact details and pictures are edited in simple
content files, then the site is rebuilt and uploaded. Colours live in one style file.
See [CUSTOMIZE](CUSTOMIZE.md) and [CLIENT_HANDOVER](CLIENT_HANDOVER.md).

## What it does not include
No contact form, online orders or bookings, blog, user login or editing screen. If the client needs these, the full
edition is the upgrade path ([UPGRADE](UPGRADE.md)).

## Where it can be hosted
Any static host (shared hosting, Netlify, GitHub Pages, S3 and similar). See [DEPLOY](DEPLOY.md).
