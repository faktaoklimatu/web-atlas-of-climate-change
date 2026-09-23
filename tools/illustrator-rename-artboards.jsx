/*
 * Renames artboards to the names the website uses.
 * Run: Illustrator → File → Scripts → Other Script… → pick this file.
 *
 * Exports nothing. After renaming, use File → Export → Export for Screens,
 * which names files after the artboards — so you get exactly the filenames
 * that live in public/images/atlas/.
 *
 * Names are not derived, they are hard-coded below. The order is the Atlas
 * order (chapter → position in chapter), i.e. the page order of the PDF:
 * the Nth artboard gets the Nth name in the list.
 *
 * English edition, 21 infographics — print pp. 5-45 (odd pages only).
 */

#target illustrator

// ─── Settings ─────────────────────────────────────────────────────────
var OFFSET = 0;   // how many artboards to skip at the start (cover, contents…)
// ──────────────────────────────────────────────────────────────────────

var NAMES = [
  'causes-and-effects-of-climate-change',            // 1.1 Introduction   p.5
  'century-of-climate-science',                      // 1.2                p.7
  'co2-concentrations-at-an-800000-year-high',       // 2.1 The Science    p.9
  'the-changing-balance-of-atmospheric-co2-and-o2',  // 2.2                p.11
  'how-much-is-the-planet-warming',                  // 2.3                p.13
  'global-map-of-temperature-changes',               // 2.4                p.15
  'warming-from-last-glacial-period-to-present',     // 2.5                p.17
  'the-direct-link-between-co2-and-temperature',     // 2.6                p.19
  'the-greenhouse-effect-and-energy-imbalance',      // 2.7                p.21
  'accelerating-sea-level-rise',                     // 3.1 The Impacts    p.23
  'extreme-weather-is-growing-more-severe',          // 3.2                p.25
  'map-of-climate-tipping-points',                   // 3.3                p.27
  'the-thresholds-of-climate-tipping-risks',         // 3.4                p.29
  'which-greenhouse-gases-matter-most',              // 4.1 The Trajectory p.31
  'global-emissions-continue-to-grow',               // 4.2                p.33
  'the-carbon-budget-how-much-remains',              // 4.3                p.35
  'projections-of-warming-in-2100',                  // 4.4                p.37
  'the-history-of-international-climate-agreements', // 5.1 The Solutions  p.39
  'climate-solutions-across-sectors',                // 5.2                p.41
  'the-steady-decline-of-eu-emissions',              // 5.3                p.43
  'who-drives-change-state-business-and-people'      // 5.4                p.45
];

function main() {
  if (app.documents.length === 0) {
    alert('Open a document first.');
    return;
  }
  var doc = app.activeDocument;

  // Names are assigned by position, so a matching artboard count is the only
  // safeguard against the whole list shifting by one and every artboard
  // getting somebody else's name.
  if (doc.artboards.length - OFFSET !== NAMES.length) {
    alert(
      'Careful: the document has ' + doc.artboards.length + ' artboards' +
      (OFFSET ? ' (' + OFFSET + ' of them skipped)' : '') +
      ', but there are ' + NAMES.length + ' names.\n\n' +
      'Adjust OFFSET at the top of the script, or the NAMES list.'
    );
    return;
  }

  // Preview before writing — so all 21 artboards don't get renamed wrongly.
  var preview = [];
  for (var p = 0; p < 3; p++) {
    preview.push('artboard ' + (p + 1 + OFFSET) + ' ("' + doc.artboards[p + OFFSET].name + '")  →  ' + NAMES[p]);
  }
  preview.push('…');
  preview.push('artboard ' + doc.artboards.length + ' ("' + doc.artboards[doc.artboards.length - 1].name + '")  →  ' + NAMES[NAMES.length - 1]);
  if (!confirm('Is the order right?\n\n' + preview.join('\n') + '\n\nRename?')) return;

  for (var i = 0; i < NAMES.length; i++) {
    doc.artboards[i + OFFSET].name = NAMES[i];
  }

  alert(
    'Renamed: ' + NAMES.length + ' artboards.\n\n' +
    'Now File → Export → Export for Screens, format PNG.'
  );
}

main();
