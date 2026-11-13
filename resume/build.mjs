// Renders resume/resume.html to public/Austin-Croucher-Resume.pdf with headless Chrome or Edge.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const browsers = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
];
const browser = browsers.find(existsSync);
if (!browser) throw new Error('No Chrome or Edge found. Open resume/resume.html and print to PDF instead.');

const out = path.join(here, '..', 'public', 'Austin-Croucher-Resume.pdf');
execFileSync(browser, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--virtual-time-budget=8000',
  `--print-to-pdf=${out}`,
  pathToFileURL(path.join(here, 'resume.html')).href,
]);
console.log('Wrote', out);
