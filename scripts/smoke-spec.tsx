import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SpecView } from '../src/components/views/SpecView';
import { COMPANIONS, RARITIES } from '../src/data/specV3';
import { SpecSectionId } from '../src/types';

/**
 * Smoke test de la vue « Pré-production v3 ».
 * Rend chaque section côté serveur pour détecter les erreurs de données/JSX
 * sans avoir besoin d'un navigateur.
 */

const CASES: [SpecSectionId, string][] = [
  ['vision', 'positionnement APAC'],
  ['boucle', 'Boucle courte de 2 minutes'],
  ['vehicules', 'Mode Esprit du Dragon'],
  ['compagnons', 'Système de Pity'],
  ['raids', 'Raids sans perte définitive'],
  ['monetisation', 'Regional Pricing'],
  ['technique', 'Architecture mobile'],
  ['onboarding', '60 premières secondes'],
  ['kpis', 'Indicateurs de réussite'],
  ['roadmap', 'Semaines 1 à 4'],
];

let failures = 0;

for (const [section, marker] of CASES) {
  const html = renderToStaticMarkup(React.createElement(SpecView, { initialSection: section }));
  const ok = html.includes(marker);
  console.log(`${ok ? '✓' : '✗'} ${section.padEnd(13)} ${html.length} chars`);
  if (!ok) {
    failures += 1;
    console.error(`  marqueur introuvable : "${marker}"`);
  }
}

// Cohérence des données du document : 15 compagnons, 3 par rareté, 3 œufs.
const rarityCounts = RARITIES.map(
  (tier) => `${tier.label}=${COMPANIONS.filter((c) => c.rarity === tier.id).length}`
);
const chances = RARITIES.reduce((sum, tier) => sum + tier.chance, 0);
const dataOk =
  COMPANIONS.length === 15 &&
  RARITIES.every((tier) => COMPANIONS.filter((c) => c.rarity === tier.id).length === 3) &&
  Math.abs(chances - 100) < 0.001;

console.log(`${dataOk ? '✓' : '✗'} données     15 compagnons · ${rarityCounts.join(' · ')}`);
console.log(`  total des probabilités : ${chances} %`);

if (!dataOk) failures += 1;

if (failures > 0) {
  console.error(`\n${failures} vérification(s) en échec.`);
  process.exit(1);
}

console.log('\nToutes les vérifications sont passées.');
