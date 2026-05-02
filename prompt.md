Build a portfolio website for Veronika Bondarenko, a serious contemporary
abstract painter based in Toronto. She works large-format in oil, acrylic,
egg tempera, and mixed media on canvas, wood, and paper.
Her collection names: Spasm, Conception, Emanation, Inflection,
Golden Age, White on White, Flare.

The site must feel like a high-end art publication — editorial, confident,
with genuine personality. Not a generic portfolio template. Every design
decision should serve the paintings.

## Tech stack
- Vanilla HTML/CSS/JS only, no frameworks
- Netlify CMS for /admin content management
- Host-ready for Netlify with netlify.toml in root

## Fonts
Load both fonts from Fontshare via their CDN:

  <link rel="preconnect" href="https://api.fontshare.com">
  <link href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400
  &f[]=cormorant-garamond@400&display=swap" rel="stylesheet">

Font usage rules — follow these exactly:

1. Veronika's name on the home page only:
   font-family: 'Cormorant Garamond', serif;
   font-weight: 400;
   font-style: normal;
   letter-spacing: 0.04em;
   — This is the only place Cormorant Garamond appears on the site.
   — The contrast between this classical serif and Satoshi everywhere
     else is intentional and is the signature typographic detail.

2. Collection names — all instances (home page list, collection titles):
   font-family: 'Satoshi', sans-serif;
   font-weight: 500;
   font-style: italic;
   letter-spacing: 0.10em;
   text-transform: none;

3. Navigation, labels, captions, metadata, button text:
   font-family: 'Satoshi', sans-serif;
   font-weight: 400;
   letter-spacing: 0.06em;
   text-transform: uppercase;
   font-size: clamp(11px, 1.2vw, 13px);

4. Body text (artist statement, descriptions, form fields):
   font-family: 'Satoshi', sans-serif;
   font-weight: 400;
   letter-spacing: 0;
   font-size: clamp(15px, 1.5vw, 17px);
   line-height: 1.8;

Font sizes:
- Artist name (home): clamp(48px, 8vw, 110px)
- Collection names (home list): clamp(28px, 4vw, 54px)
- Collection page title: clamp(36px, 6vw, 76px)
- Body: clamp(15px, 1.5vw, 17px)
- Captions / metadata: clamp(11px, 1.2vw, 13px)

## Palette
- Page background: #F7F5F2 (warm light grey, not stark white)
- Card background: #FFFFFF
- Card border: 1px solid #DEDAD5 (thin, warm light grey)
- Text primary: #1A1A1A
- Text secondary: #6B6560 (warm mid-grey for metadata, captions)
- Accent: #C4622D (burnt sienna / terracotta)
  — used only for: hover states on collection names, active nav
    indicator, card hover border, submit button, focus states
- No gradients. No shadows. No rounded corners anywhere.

## Image and data source — IMPORTANT
All painting images already exist on disk in the following structure:

  /images/spasm/
  /images/conception/
  /images/emanation/
  /images/inflection/
  /images/golden-age/
  /images/white-on-white/
  /images/flare/

DO NOT use placeholder images. DO NOT generate dummy data.
Instead, write a Node.js build script called build-data.js that:

1. Reads every image file from each collection folder
2. Parses the filename to extract painting metadata
3. Writes one JSON file per collection into /data/collections/

### Filename format
Filenames follow this pattern (comma-separated, extension .jpeg or .jpg):
  Title, [Dimensions or Medium], [Medium or Dimensions], Year

Rules for parsing:
- Strip the file extension to get the raw string
- Split on comma — trim whitespace from each part
- The TITLE is always the first part. Capitalize the first letter
  of each word (title case), preserve Roman numerals (I, II, III etc.)
- The YEAR is always the last part (4-digit number)
- To distinguish DIMENSIONS from MEDIUM in the middle parts:
  — DIMENSIONS match this pattern: digits, optional spaces,
    optional apostrophe, "x", digits, optional spaces, optional
    apostrophe. Examples: 15x20, 20 x 28, 2'x3', 3'x4'
  — MEDIUM is everything else (text description)
  — There may be 1 or 2 middle parts. If 2, one will be dimensions
    and one will be medium. If only 1 middle part, determine which
    it is by the same rule.
- If dimensions are in feet (contain apostrophe), label them as-is
- If dimensions are in inches (pure numbers), append " in" to clarify
  e.g. "20 x 28" becomes "20 x 28 in"
- If no dimensions found in filename, set dimensions to ""

### Example parses:
  "conception, 15x20, egg tempera on wood, 2024.jpeg"
  → title: "Conception", dimensions: "15 x 20 in",
    medium: "egg tempera on wood", year: 2024

  "Golden Age I, graphite and charcoal on paper, 20 x 28, 2024.jpeg"
  → title: "Golden Age I", dimensions: "20 x 28 in",
    medium: "graphite and charcoal on paper", year: 2024

  "Scratch, 2'x3', acrylic and oil on canvas, 2024.jpeg"
  → title: "Scratch", dimensions: "2' x 3'",
    medium: "acrylic and oil on canvas", year: 2024

  "bed, 3'x4',oil on canvas, 2025.jpeg"
  → title: "Bed", dimensions: "3' x 4'",
    medium: "oil on canvas", year: 2025

  "Yellow Emanation, 24x30, acrylic and oil on canvas, 2024.jpeg"
  → title: "Yellow Emanation", dimensions: "24 x 30 in",
    medium: "acrylic and oil on canvas", year: 2024

### Output JSON format per collection:
  {
    "title": "Spasm",
    "slug": "spasm",
    "description": "",
    "cover": "images/spasm/[first image filename]",
    "paintings": [
      {
        "title": "Over",
        "image": "images/spasm/over.jpeg",
        "medium": "oil on canvas",
        "dimensions": "3' x 4'",
        "year": 2025
      }
    ]
  }

Run build-data.js once after setup to generate all collection JSON files.
The site reads from these JSON files at runtime — no hardcoded data anywhere.

## Home page
- Background: #F7F5F2
- Centered layout, generous vertical padding top and bottom
- Artist name "Veronika Bondarenko":
  — Cormorant Garamond Regular (the only use of this font)
  — clamp(48px, 8vw, 110px), centered, color: #1A1A1A
- One line below in Satoshi uppercase tracked:
  "Abstract Painter  ·  Toronto"
  — color: #6B6560, font-size: clamp(11px, 1.2vw, 13px)
- Below: a clean vertical list of all 7 collection names
  — Satoshi Medium Italic, letter-spacing: 0.10em
  — Size: clamp(28px, 4vw, 54px)
  — Each is a link to that collection's page
  — Default color: #1A1A1A
  — Hover: color shifts to #C4622D, transition 200ms ease
  — On desktop: on hover, the collection cover image fades in
    to the right of the list (position: absolute, opacity 0 to 1,
    transition 250ms ease, pointer-events: none,
    max-width: 340px, border: 1px solid #DEDAD5)
  — On mobile: no hover image, color change only
- Generous spacing between each collection name (line-height 1.6)
- Below the list: thin horizontal rule in #DEDAD5, then footer
- No hero image. No thumbnail grid. The list of names IS the statement.

## Navigation
- Fixed top bar, full width, background: #F7F5F2
- Thin bottom border: 1px solid #DEDAD5
- Left: "VB" monogram in Satoshi medium — links to home
- Right: "Work" dropdown, About, Contact
  — Satoshi uppercase, font-size: clamp(11px, 1.2vw, 13px)
- "Work" dropdown lists all 7 collection names on hover
  — background: #F7F5F2, border: 1px solid #DEDAD5
  — no border-radius, no shadow
- Active page: small terracotta dot or underline indicator
- On mobile: hamburger opens full-height overlay nav
  — background: #F7F5F2, collection names listed large
  — fade in 150ms, no slide animation

## Collection pages
- Background: #F7F5F2
- Collection name as page title:
  — Satoshi Medium Italic, letter-spacing: 0.10em
  — clamp(36px, 6vw, 76px), generous padding below nav
- Optional short description: Satoshi Regular, color #6B6560,
  max-width 560px, below title
- Paintings in a responsive card grid:
  — Desktop: 3 columns
  — Tablet: 2 columns
  — Mobile: 1 column
  — Grid gap: 24px
- Each card:
  — Background: #FFFFFF
  — Border: 1px solid #DEDAD5
  — No border-radius anywhere
  — Image fills the top of the card, object-fit: cover,
    aspect-ratio: 4/3, width: 100%
  — Below image: padding 16px
    · Painting title: Satoshi Medium, #1A1A1A, 14px
    · Medium, dimensions, year on one line:
      Satoshi Regular, #6B6560, 12px uppercase tracked
  — On hover: border changes to 1px solid #C4622D,
    image scales to transform: scale(1.02), overflow: hidden,
    transition 250ms ease
  — Clicking anywhere on the card opens the lightbox

## Lightbox
- Overlay: rgba(12, 12, 12, 0.96)
- Painting centered, max 90vw / 85vh, preserves aspect ratio
- Below painting:
  — Title: Satoshi Medium Italic, color #E8E2D9, 18px
  — Medium / dimensions / year: Satoshi Regular uppercase,
    color #9A9490, 12px tracked
- Prev arrow left edge, next arrow right edge — minimal SVG chevrons
- Close button top right "×", Satoshi, color #E8E2D9
- Keyboard: left/right arrows to navigate, Escape to close
- Opens and closes with opacity fade 200ms

## About page
- Background: #F7F5F2
- Desktop: two-column layout
  — Left (60%): artist statement + CV
  — Right (40%): portrait photo if provided, no border, top-aligned
- Mobile: portrait photo full-width above text
- Artist statement: Satoshi Regular, line-height 1.8,
  max-width 620px, font-size clamp(15px, 1.5vw, 17px)
- Thin #DEDAD5 rule between statement and CV section
- CV heading: Satoshi uppercase tracked, #6B6560, 12px
- CV body: Satoshi Regular, #6B6560, 14px
- About page content loaded from /data/about.json

## Contact page
- Background: #F7F5F2
- Centered form, max-width 520px, generous top padding
- Heading "Get in Touch": Satoshi Medium Italic,
  letter-spacing: 0.10em, clamp(28px, 4vw, 48px)
- Fields: Name, Email, Message (textarea min 5 rows)
- Input style:
  — Background: #FFFFFF
  — Border: 1px solid #DEDAD5
  — No border-radius
  — Padding: 12px 16px
  — On focus: border 1px solid #C4622D, outline: none
  — Font: Satoshi Regular, #1A1A1A
- Submit button:
  — Background: #C4622D, color: #FFFFFF
  — No border-radius
  — Satoshi uppercase tracked, 13px
  — Padding: 14px 36px
  — Hover: background #A8501F, transition 200ms
- Netlify Forms: add name="contact" data-netlify="true"
  to the form tag

## Footer
- Thin top border: 1px solid #DEDAD5
- Left: "© 2025 Veronika Bondarenko"
  — Satoshi Regular, #6B6560, 12px
- Right: Instagram SVG icon, 18px, color #6B6560,
  hover: #C4622D
  — links to https://instagram.com/_veronikabondarenko
- Padding: 24px 0

## Transitions and interactions
- All hover transitions: 200ms ease
- Lightbox: 200ms opacity fade
- Nav dropdown: 150ms opacity fade
- Mobile nav overlay: 150ms opacity fade
- NO scroll animations
- NO parallax
- NO entrance animations
- NO loading spinners

## Netlify CMS — /admin

Create /admin/index.html:

<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Veronika Bondarenko — Admin</title>
</head>
<body>
  <script src="https://unpkg.com/netlify-cms@^2.0.0/dist/netlify-cms.js">
  </script>
</body>
</html>

Create /ad