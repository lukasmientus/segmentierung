// Downloads und übergreifende Button-Funktionen

function safeFilename(name) {
  return String(name || "datei")
    .replace(/\.[^.]+$/, "")
    .replace(/[\\/:*?"<>|]+/g, "_")
    .trim() || "datei";
}

function downloadBlob(content, filename, mime = "text/plain;charset=utf-8") {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvCell(value) {
  const normalized = String(value ?? "").replace(/\r\n?/g, "\n");
  return `"${normalized.replaceAll('"', '""')}"`;
}

function segmentedTextToCSV(text) {
  const rows = String(text).split(/\r?\n/);
  return `\uFEFF${rows.map((row) => csvCell(row)).join("\n")}`;
}

function segmentCSV() {
  const text = document.getElementById("textfield")?.value ?? "";
  downloadBlob(segmentedTextToCSV(text), "segmentiert.csv", "text/csv;charset=utf-8");
}

function segmentTXT() {
  const text = document.getElementById("textfield")?.value ?? "";
  downloadBlob(text, "segmentiert.txt", "text/plain;charset=utf-8");
}

function countCSV() {
  if (typeof counting !== "function") return;
  const [total, entries] = counting();
  const lines = [["Wort", "Anzahl"], ["Gesamt", total], ...entries];
  const csv = `\uFEFF${lines.map((row) => row.map(csvCell).join(";")).join("\n")}`;
  downloadBlob(csv, "wortzaehlung.csv", "text/csv;charset=utf-8");
}

function download(type, file) {
  const extension = type.toLowerCase();
  const base = safeFilename(file.name);

  if (extension === "csv") {
    file.text().then((text) => downloadBlob(segmentedTextToCSV(text), `${base}.csv`, "text/csv;charset=utf-8"));
    return;
  }

  downloadBlob(file, `${base}.${extension}`, file.type || "text/plain;charset=utf-8");
}

async function segmentAll() {
  if (typeof userFiles === "undefined" || typeof exportFiles === "undefined") return;
  if (userFiles.length === 0) {
    window.alert("Bitte wählen Sie zuerst mindestens eine TXT-Datei aus.");
    return;
  }

  exportFiles.splice(0, exportFiles.length);
  document.getElementById("listeOutput")?.replaceChildren();
  updateEmptyStates?.();

  const results = await Promise.allSettled(userFiles.map((file) => reader(file)));

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      const text = segmentieren(result.value.result);
      const filename = `${safeFilename(userFiles[index].name)}_segmentiert`;
      const file = new File([text], filename, { type: "text/plain;charset=utf-8" });
      exportFiles.push(file);
      addVisualExportListElement(file);
    } else {
      window.alert(`${userFiles[index].name} konnte nicht verarbeitet werden: ${result.reason}`);
    }
  });

  updateEmptyStates?.();
}

function downloadAllTXT() {
  if (typeof exportFiles === "undefined" || exportFiles.length === 0) {
    window.alert("Es sind noch keine segmentierten Dateien vorhanden.");
    return;
  }
  exportFiles.forEach((file) => download("txt", file));
}

function downloadAllCSV() {
  if (typeof exportFiles === "undefined" || exportFiles.length === 0) {
    window.alert("Es sind noch keine segmentierten Dateien vorhanden.");
    return;
  }
  exportFiles.forEach((file) => download("csv", file));
}
