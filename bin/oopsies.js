#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const templatesRoot = path.join(repoRoot, 'templates');

function fail(message) {
  console.error(`OOPSIES CLI error: ${message}`);
  process.exit(1);
}

function usage() {
  console.log(`Usage:
  oopsies create <project-name> [--template landing-page|docs-site|simple-dashboard]
`);
}

function copyDirectory(source, target, projectName) {
  fs.mkdirSync(target, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name.replace(/__PROJECT_NAME__/g, projectName));

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath, projectName);
      continue;
    }

    const raw = fs.readFileSync(sourcePath, 'utf8');
    fs.writeFileSync(targetPath, raw.replace(/__PROJECT_NAME__/g, projectName), 'utf8');
  }
}

function parseArgs(argv) {
  const [command, maybeName, ...rest] = argv;

  if (!command || command === '--help' || command === '-h') {
    usage();
    process.exit(0);
  }

  if (command !== 'create') {
    fail(`unknown command "${command}"`);
  }

  if (!maybeName) {
    fail('missing project name');
  }

  let template = 'landing-page';

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];

    if (token === '--template') {
      template = rest[index + 1] ?? '';
      index += 1;
      continue;
    }

    if (token.startsWith('--template=')) {
      template = token.split('=')[1] ?? '';
      continue;
    }

    fail(`unknown option "${token}"`);
  }

  return {
    projectName: maybeName,
    template,
  };
}

const { projectName, template } = parseArgs(process.argv.slice(2));
const sourceTemplate = path.join(templatesRoot, template);

if (!fs.existsSync(sourceTemplate)) {
  fail(`template "${template}" does not exist`);
}

const targetDirectory = path.resolve(process.cwd(), projectName);

if (fs.existsSync(targetDirectory)) {
  fail(`target directory "${projectName}" already exists`);
}

copyDirectory(sourceTemplate, targetDirectory, projectName);

console.log(`Created ${projectName} from the ${template} template.`);
