// Regelbasierte Textsegmentierung

const BRACKET_OPEN = "§@";
const BRACKET_CLOSE = "@§";

function optionChecked(id) {
  return Boolean(document.getElementById(id)?.checked);
}

function protectAbbreviations(text) {
  if (typeof getAbbreviations !== "function") return { text, replacements: [] };

  const replacements = [];
  let protectedText = text;
  const abbreviations = getAbbreviations()
    .filter((value) => value.includes("."))
    .sort((a, b) => b.length - a.length);

  abbreviations.forEach((abbr, index) => {
    if (!protectedText.includes(abbr)) return;
    const token = `__ABK_${index}_${Math.random().toString(36).slice(2)}__`;
    const safe = abbr.replaceAll(".", "__DOT__");
    protectedText = protectedText.split(abbr).join(token);
    replacements.push([token, safe]);
  });

  return { text: protectedText, replacements };
}

function restoreAbbreviations(text, replacements) {
  let restored = text;
  for (const [token, safe] of replacements) {
    restored = restored.split(token).join(safe.replaceAll("__DOT__", "."));
  }
  return restored;
}

function normalizeSegmentedText(text) {
  return text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function segmentieren(textInput) {
  const field = document.getElementById("textfield");
  const supplied = typeof textInput === "string";
  let text = supplied ? textInput : (field?.value ?? "");

  text = String(text).replace(/\r\n?|\n/g, " ");

  const splitAtSentenceEnd = optionChecked("punkt");
  const splitAtComma = optionChecked("komma");
  const splitAtAnd = optionChecked("und");
  const splitAtOr = optionChecked("oder");
  const splitAtColon = optionChecked("dpunkt");
  const splitBrackets = optionChecked("klammer");
  const splitAbbreviations = optionChecked("abkz");

  let replacements = [];
  if (splitAtSentenceEnd && !splitAbbreviations) {
    const protectedResult = protectAbbreviations(text);
    text = protectedResult.text;
    replacements = protectedResult.replacements;
  }

  if (splitAtSentenceEnd) {
    text = text
      .replace(/\.\s+/g, ".\n")
      .replace(/\?\s*/g, "?\n")
      .replace(/!\s*/g, "!\n");
  }

  if (splitAtComma) {
    text = text.replace(/,\s*/g, ",\n");
  }

  if (splitAtAnd) {
    text = text.replace(/\s+(und|Und)\s+/g, "\n$1 ");
  }

  if (splitAtOr) {
    text = text.replace(/\s+(oder|Oder)\s+/g, "\n$1 ");
  }

  if (splitAtColon) {
    text = text.replace(/:\s*/g, ":\n");
  }

  text = restoreAbbreviations(text, replacements);

  if (splitBrackets) {
    if (testBrackets(text)) {
      text = segBrackets(text, 0);
    } else {
      showPopup?.("myPopupKlammer", 3200);
      const proceed = window.confirm(
        "Die Klammerung dieses Textes ist nicht korrekt. Soll die Klammersegmentierung trotzdem versucht werden? Das Ergebnis kann fehlerhaft sein."
      );
      if (proceed) text = segBrackets(text, 0);
    }
  }

  text = normalizeSegmentedText(text);

  if (!supplied && field) {
    field.value = text;
  }

  return text;
}

// Klammerausdrücke werden aus dem Segment herausgelöst, an ihrer Position durch []
// markiert und direkt nach dem zugehörigen Segment als [(...)] eingefügt.
function segBrackets(str, start, stack = []) {
  for (let i = start; i <= str.length; i += 1) {
    if (str[i] === "(") stack.push(["(", i]);

    if (str[i] === ")") {
      const open = stack.pop();
      let reduced = str;
      if (open !== undefined) reduced = cut(str, open[1], i);

      let result = segBrackets(reduced, i, stack);
      result = result.replace(BRACKET_OPEN, "[(");
      result = result.replace(BRACKET_CLOSE, ")]");
      return result;
    }
  }
  return str;
}

function cut(str, start, end) {
  const beginning = str.slice(0, start);
  const rest = str.slice(end + 1);
  let copy = str.slice(start, end + 1);
  copy = copy.replace("(", BRACKET_OPEN).replace(")", BRACKET_CLOSE);

  const reduced = `${beginning}${rest}`;
  const nextLineBreak = reduced.indexOf("\n", Math.max(0, start + 1));

  if (nextLineBreak !== -1) {
    let output = `${reduced.slice(0, nextLineBreak)}\n${copy}${reduced.slice(nextLineBreak)}`;
    output = `${output.slice(0, start)}[]${output.slice(start)}`;
    return output;
  }

  // Im ursprünglichen Code entstand hier bei Texten ohne nachfolgenden Zeilenumbruch
  // die Fehlermeldung "Da ist was schiefgegangen.". Stattdessen wird der
  // Klammerausdruck nun korrekt ans Ende des zugehörigen Segments gehängt.
  return `${reduced.slice(0, start)}[]${reduced.slice(start)}\n${copy}`;
}

function testBrackets(str) {
  let checksum = 0;
  for (const char of str) {
    if (char === "(") checksum += 1;
    if (char === ")") checksum -= 1;
    if (checksum < 0) return false;
  }
  return checksum === 0;
}
