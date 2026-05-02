#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'Images');
const DATA_DIR = path.join(__dirname, 'data', 'collections');

// Map folder names to display titles
const COLLECTION_TITLES = {
  'spasm': 'Spasm',
  'conception': 'Conception',
  'emanation': 'Emanation',
  'inflection': 'Inflection',
  'golden age': 'Golden Age',
  'white on white': 'White on White',
  'flare': 'Flare',
};

// Map folder names to URL slugs
function folderToSlug(folder) {
  return folder.replace(/\s+/g, '-').toLowerCase();
}

// Dimensions regex: digits (optional decimal), optional space, optional apostrophe, x, digits (optional decimal), optional space, optional apostrophe
const DIM_RE = /^\d+(\.\d+)?\s*'?\s*x\s*\d+(\.\d+)?\s*'?$/i;

function isDimensions(s) {
  return DIM_RE.test(s.trim());
}

function formatDimensions(raw) {
  const trimmed = raw.trim();
  const hasFeet = trimmed.includes("'");
  // Normalize spaces around x
  let normalized = trimmed.replace(/\s*x\s*/i, ' x ');
  if (!hasFeet) {
    normalized += ' in';
  }
  return normalized;
}

// Roman numerals to preserve uppercase
const ROMAN_RE = /^(I{1,3}|IV|VI{0,3}|IX|X{1,4}|XI{1,3}|XIV|XV|XVI{1,3}|XIX|XX)$/i;

function toTitleCase(str) {
  return str.trim().split(/\s+/).map(word => {
    if (ROMAN_RE.test(word)) return word.toUpperCase();
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

function parseFilename(filename) {
  const ext = path.extname(filename);
  const base = filename.slice(0, -ext.length);
  const parts = base.split(',').map(p => p.trim());

  if (parts.length < 2) {
    return { title: toTitleCase(base), medium: '', dimensions: '', year: null };
  }

  const title = toTitleCase(parts[0]);
  const yearStr = parts[parts.length - 1].trim();
  const year = parseInt(yearStr, 10);
  const middle = parts.slice(1, -1);

  let medium = '';
  let dimensions = '';

  for (const part of middle) {
    if (isDimensions(part)) {
      dimensions = formatDimensions(part);
    } else {
      medium = medium ? medium + ', ' + part : part;
    }
  }

  return { title, medium, dimensions, year };
}

function processCollection(folderName) {
  const folderPath = path.join(IMAGES_DIR, folderName);
  const slug = folderToSlug(folderName);
  const title = COLLECTION_TITLES[folderName.toLowerCase()] || toTitleCase(folderName);

  const files = fs.readdirSync(folderPath)
    .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
    .sort();

  const paintings = files.map(filename => {
    const parsed = parseFilename(filename);
    return {
      title: parsed.title,
      image: `Images/${folderName}/${filename}`,
      medium: parsed.medium,
      dimensions: parsed.dimensions,
      year: parsed.year,
    };
  });

  const cover = paintings.length > 0 ? paintings[0].image : '';

  return {
    title,
    slug,
    description: '',
    cover,
    paintings,
  };
}

// Ensure output dir exists
fs.mkdirSync(DATA_DIR, { recursive: true });

const folders = fs.readdirSync(IMAGES_DIR).filter(f => {
  return fs.statSync(path.join(IMAGES_DIR, f)).isDirectory();
});

// Process in canonical order
const ORDER = ['spasm', 'conception', 'emanation', 'inflection', 'golden age', 'white on white', 'flare'];
const orderedFolders = [
  ...ORDER.filter(o => folders.map(f => f.toLowerCase()).includes(o)),
  ...folders.filter(f => !ORDER.includes(f.toLowerCase())),
];

const index = [];

for (const folder of orderedFolders) {
  const actualFolder = folders.find(f => f.toLowerCase() === folder.toLowerCase()) || folder;
  const collection = processCollection(actualFolder);
  const outPath = path.join(DATA_DIR, `${collection.slug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(collection, null, 2));
  console.log(`✓ ${collection.title} → data/collections/${collection.slug}.json (${collection.paintings.length} paintings)`);
  index.push({ title: collection.title, slug: collection.slug, cover: collection.cover });
}

// Write index file
fs.writeFileSync(path.join(__dirname, 'data', 'collections.json'), JSON.stringify(index, null, 2));
console.log(`✓ data/collections.json`);

// ── Parse cv/cv.md and update data/about.json ────────────────
const CV_PATH = path.join(__dirname, 'cv', 'cv.md');
const ABOUT_PATH = path.join(__dirname, 'data', 'about.json');

if (fs.existsSync(CV_PATH)) {
  const cvText = fs.readFileSync(CV_PATH, 'utf8');
  const cvSections = parseCvMarkdown(cvText);

  const about = fs.existsSync(ABOUT_PATH)
    ? JSON.parse(fs.readFileSync(ABOUT_PATH, 'utf8'))
    : {};

  about.cv = cvSections;
  fs.writeFileSync(ABOUT_PATH, JSON.stringify(about, null, 2));
  console.log(`✓ data/about.json (CV: ${cvSections.length} sections)`);
}

function parseCvMarkdown(text) {
  const lines = text.split('\n');
  const sections = [];
  let current = null;
  let pendingName = null;

  for (const raw of lines) {
    const line = raw.trim();

    // Section heading
    if (line.startsWith('## ')) {
      if (current) sections.push(current);
      current = { section: line.slice(3).trim(), entries: [] };
      pendingName = null;
      continue;
    }

    if (!current) continue;
    if (!line) continue;

    // Year line: 4-digit year or year range like "2021 - Present"
    const isYear = /^\d{4}(\s*[-–]\s*(\d{4}|Present))?$/.test(line);

    if (isYear && pendingName) {
      current.entries.push({ name: pendingName, year: line });
      pendingName = null;
    } else if (!isYear) {
      // It's a name/title line — save it, may be followed by a year
      pendingName = line;
    }
  }

  // Flush any trailing pending name without a year
  if (current) {
    if (pendingName) current.entries.push({ name: pendingName, year: '' });
    sections.push(current);
  }

  return sections;
}
