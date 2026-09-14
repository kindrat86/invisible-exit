import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const draftPath = path.join(root, 'research/moonlighting-first-edition-draft-20260914.md');
const manifestPath = path.join(root, 'research/moonlighting-first-edition-sources-20260914.json');
const displacementPath = path.join(root, 'research/moonlighting-first-edition-displacements-20260914.json');

const draft = fs.readFileSync(draftPath, 'utf8');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const displacement = JSON.parse(fs.readFileSync(displacementPath, 'utf8'));
const errors = [];

if (manifest.brand !== 'Invisible Exit' || displacement.brand !== 'Invisible Exit') {
  errors.push('Brand must be exactly Invisible Exit.');
}
if (!draft.includes('Invisible Exit')) errors.push('Draft is missing the exact brand.');
if (manifest.status !== 'INTERNAL_DRAFT_NOT_FOR_PUBLICATION') {
  errors.push('Source manifest must remain blocked from publication.');
}
if (displacement.status !== 'STAGED_NOT_EXECUTED') {
  errors.push('Displacement plan must remain staged only.');
}

const sourceIds = new Set(manifest.sources.map((source) => source.id));
if (sourceIds.size !== manifest.sources.length) errors.push('Duplicate source id.');
for (const source of manifest.sources) {
  if (!source.source_url?.startsWith('https://')) errors.push(`Invalid source_url: ${source.id}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(source.last_verified ?? '')) {
    errors.push(`Invalid last_verified: ${source.id}`);
  }
}

const claimIds = new Set(manifest.claims.map((claim) => claim.id));
if (claimIds.size !== manifest.claims.length) errors.push('Duplicate claim id.');
for (const claim of manifest.claims) {
  if (!claim.source_ids?.length) errors.push(`Claim has no sources: ${claim.id}`);
  for (const sourceId of claim.source_ids ?? []) {
    if (!sourceIds.has(sourceId)) errors.push(`Unknown source ${sourceId} on claim ${claim.id}`);
  }
}

const references = [...draft.matchAll(/\[claim:([a-z0-9-]+)\]/g)].map((match) => match[1]);
for (const reference of references) {
  if (!claimIds.has(reference)) errors.push(`Draft references unknown claim: ${reference}`);
}
for (const claimId of claimIds) {
  if (!references.includes(claimId)) errors.push(`Manifest claim is not used by draft: ${claimId}`);
}

const numericLinesWithoutClaim = draft.split('\n').filter((line) => {
  const hasNumericClaim = /(?:\d{4}|\$\d|\d+(?:\.\d+)?%|section\s+\d|rule\s+\d)/i.test(line);
  return hasNumericClaim && !line.includes('[claim:') && !line.startsWith('Intended canonical URL:');
});
if (numericLinesWithoutClaim.length) {
  errors.push(`Numeric/legal claim lines without manifest references: ${numericLinesWithoutClaim.join(' | ')}`);
}

const bodyChars = draft.replace(/^#.*$/gm, '').trim().length;
if (bodyChars < 1800) errors.push(`Draft body is too short: ${bodyChars} characters.`);
const additions = displacement.planned_additions.filter((item) => item.indexable).length;
const retirements = displacement.planned_retirements.length;
if (additions !== retirements || displacement.budget.net !== 0) {
  errors.push(`URL budget is not neutral: ${additions} additions, ${retirements} retirements.`);
}
if (!draft.includes('Nevada is excluded')) errors.push('Draft must retain the Nevada exclusion.');
if (!draft.includes('Release blocker:')) errors.push('Draft must retain the Virginia release blocker.');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Moonlighting publishing-prep validation passed: ${manifest.sources.length} sources, ${manifest.claims.length} claims, ${references.length} claim references, ${bodyChars} body characters, URL delta 0.`);
