// Wortzählung

function normalizeText(text) {
  return String(text)
    .toLocaleLowerCase("de-DE")
    .replace(/[.,()\[\]{}:;!?…„“”"'’]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function counting(text = document.getElementById("textfield")?.value ?? "") {
  const normalized = normalizeText(text);
  if (!normalized) return [0, []];

  const words = normalized.split(" ").filter(Boolean);
  const counts = new Map();

  for (const word of words) {
    counts.set(word, (counts.get(word) || 0) + 1);
  }

  const entries = Array.from(counts.entries()).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return a[0].localeCompare(b[0], "de");
  });

  return [words.length, entries];
}

function countWords() {
  const [total, entries] = counting();
  presentCount(total, entries);
}
