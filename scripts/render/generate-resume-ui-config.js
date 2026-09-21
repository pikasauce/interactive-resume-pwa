#!/usr/bin/env node
// Regenerates apps/resume-ui/config.js from the API_BASE_URL environment
// variable at build time. Used as the Render Static Site build command for
// resume-ui, so the deployed page knows the URL of the separately-deployed
// resume-api service. Falls back to the localhost default when the env var
// isn't set, so a plain `node` run (or a local build) is harmless.
const fs = require('fs');
const path = require('path');

const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
const target = path.join(__dirname, '..', '..', 'apps', 'resume-ui', 'config.js');

fs.writeFileSync(target, `window.API_BASE_URL = ${JSON.stringify(apiBaseUrl)};\n`);
console.log(`[render] wrote ${target} with API_BASE_URL=${apiBaseUrl}`);
