# Work Notes — Veronika Bondarenko Website

## What is done
- Full portfolio website built in vanilla HTML/CSS/JS
- 7 collections parsed from Images/ folder with metadata from filenames
- Collection pages with painting grid, lightbox, zoom (3 levels) and pan
- Home page: Cormorant Garamond name, subtitle, collection list with hover preview
- Navigation: Home, Work dropdown, About, Contact
- About page: artist statement + full CV (Education + 21 Exhibitions)
- Contact page with Netlify Forms
- Netlify CMS at /admin
- Deployed to Netlify (live and working)
- `prepare-deploy.bat` automates building the deploy folder at C:\work\vbart-deploy

## To do next
- **Custom domain** — set up veronikabondarenko.com or similar instead of random Netlify URL
- **Rename Netlify site** — change to something like veronikabondarenko.netlify.app
- **Portrait photo** — add a photo of Veronika to the About page
  - Put photo in Images/ folder, then set "portrait" field in data/about.json
- **Collection descriptions** — add a short text under each collection title
  - Edit the "description" field in each data/collections/*.json file
- **Test on more devices** — check mobile layout thoroughly
- **Netlify CMS** — set up Git Gateway so Veronika can edit content herself via /admin

## How to make changes
1. Edit files in C:\work\vbart
2. If you add/rename images, run: `node build-data.js`
3. Run `prepare-deploy.bat` to build the deploy folder
4. Drag C:\work\vbart-deploy onto Netlify to redeploy
