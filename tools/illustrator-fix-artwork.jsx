/*
 * Fixes the language/typography leftovers found in the English artwork.
 * Run: Illustrator → File → Scripts → Other Script… → pick this file.
 *
 * Shows a preview of every hit and does nothing until you confirm.
 *
 * WHY IT EDITS CHARACTERS, NOT `contents`
 * Assigning textFrame.contents = "..." rewrites the whole frame and flattens
 * per-character formatting. Several of these strings are half-bold (e.g.
 * "931 Mt CO2eq" bold + " v roce 2024" regular), so that would destroy the
 * design. Instead each match is replaced in place: the first character of the
 * match takes the replacement text (inheriting its own style) and the leftover
 * characters are removed. Everything around it keeps its formatting.
 *
 * Non-ASCII is written as \u escapes so the file survives whatever encoding
 * Illustrator reads it with.
 *
 * NOT fixed here (needs a human):
 *   p.41 Climate Solutions Across Sectors — the artwork carries a stale,
 *   garbled subtitle text object behind the live one. Delete the old object;
 *   the correct subtitle is:
 *     "Stopping greenhouse gas emissions requires distinct strategies for
 *      different sectors. In most cases, deep decarbonization relies on a
 *      combination of several solutions rather than a single fix."
 */

#target illustrator

// ─── Settings ─────────────────────────────────────────────────────────
var FIX_DECIMAL_COMMAS = true;  // "5,6 °C" → "5.6 °C" (leaves "1,000 Gt" alone)
var FIX_ORDINAL_SIGN   = true;  // "1.47 ºC" → "1.47 °C"  (U+00BA → U+00B0)
// ──────────────────────────────────────────────────────────────────────

// Literal replacements, applied in order. Longest/most specific first.
var REPLACEMENTS = [
  // Czech left in the English edition
  ['Nedostatečná data', 'Insufficient data'],  // p.15 map legend
  ['Madagaskar',                  'Madagascar'],         // p.15 label
  ['v roce 2024',                 'in 2024'],            // p.43 callout
  ['Kyotu',                       'Kyoto'],              // p.39 COP 3
  // Typos
  ['emissionsand',                'emissions and'],      // p.39
  ['atmosfphere',                 'atmosphere'],         // p.7
  ['approximatel ',               'approximately ']      // p.11
];

var ORDINAL = 'º';  // º masculine ordinal indicator — never correct here
var DEGREE  = '°';  // ° degree sign

function isDigit(ch) { return ch >= '0' && ch <= '9'; }

/*
 * Replace every occurrence of `find` inside one text frame, preserving the
 * formatting of the surrounding text. Returns the number of replacements.
 */
function replaceInFrame(tf, find, repl) {
  var hits = 0;
  var guard = 0;
  while (guard++ < 500) {
    var at = tf.contents.indexOf(find);
    if (at < 0) break;
    // The first character of the match becomes the whole replacement, so the
    // new text inherits that character's style.
    tf.characters[at].contents = repl;
    // Drop what's left of the old string, now sitting after the replacement.
    for (var k = 0; k < find.length - 1; k++) {
      tf.characters[at + repl.length].remove();
    }
    hits++;
  }
  return hits;
}

/* Single-character swaps are always style-safe (1 char → 1 char). */
function swapChars(tf, test) {
  var hits = 0;
  var s = tf.contents;
  for (var i = 0; i < s.length; i++) {
    var to = test(s, i);
    if (to) { tf.characters[i].contents = to; hits++; }
  }
  return hits;
}

function main() {
  if (app.documents.length === 0) { alert('Open a document first.'); return; }
  var doc = app.activeDocument;
  var frames = doc.textFrames;

  // ── Pass 1: find everything, change nothing ──────────────────────────
  var found = [];   // [label, count]
  var total = 0;

  for (var r = 0; r < REPLACEMENTS.length; r++) {
    var find = REPLACEMENTS[r][0], n = 0;
    for (var f = 0; f < frames.length; f++) {
      var s = frames[f].contents, at = -1;
      while ((at = s.indexOf(find, at + 1)) >= 0) n++;
    }
    if (n) { found.push('"' + find + '" → "' + REPLACEMENTS[r][1] + '"   ×' + n); total += n; }
  }

  var ordN = 0, comN = 0;
  for (var f2 = 0; f2 < frames.length; f2++) {
    var t = frames[f2].contents;
    for (var i = 0; i < t.length; i++) {
      if (FIX_ORDINAL_SIGN && t.charAt(i) === ORDINAL) ordN++;
      if (FIX_DECIMAL_COMMAS && t.charAt(i) === ',' &&
          i > 0 && isDigit(t.charAt(i - 1)) &&
          i + 1 < t.length && isDigit(t.charAt(i + 1)) &&
          !(i + 2 < t.length && isDigit(t.charAt(i + 2)))) comN++;
    }
  }
  if (ordN) { found.push('"' + ORDINAL + 'C" → "' + DEGREE + 'C"   ×' + ordN); total += ordN; }
  if (comN) { found.push('decimal comma → point (e.g. 5,6 → 5.6)   ×' + comN); total += comN; }

  if (total === 0) { alert('Nothing to fix on this document. ✓'); return; }
  if (!confirm('Found ' + total + ' item(s) across ' + frames.length +
               ' text frames:\n\n' + found.join('\n') + '\n\nApply?')) return;

  // ── Pass 2: apply ────────────────────────────────────────────────────
  var done = 0;
  for (var f3 = 0; f3 < frames.length; f3++) {
    var tf = frames[f3];
    for (var r2 = 0; r2 < REPLACEMENTS.length; r2++) {
      done += replaceInFrame(tf, REPLACEMENTS[r2][0], REPLACEMENTS[r2][1]);
    }
    if (FIX_ORDINAL_SIGN) {
      done += swapChars(tf, function (s, i) {
        return s.charAt(i) === ORDINAL ? DEGREE : null;
      });
    }
    if (FIX_DECIMAL_COMMAS) {
      // One digit after the comma and no digit after that → decimal separator.
      // "1,000" / "800,000" have three and are left alone.
      done += swapChars(tf, function (s, i) {
        return (s.charAt(i) === ',' &&
                i > 0 && isDigit(s.charAt(i - 1)) &&
                i + 1 < s.length && isDigit(s.charAt(i + 1)) &&
                !(i + 2 < s.length && isDigit(s.charAt(i + 2)))) ? '.' : null;
      });
    }
  }

  alert('Fixed ' + done + ' item(s).\n\n' +
        'Still to do by hand: p.41 stale subtitle text object (see header of this script).');
}

main();
