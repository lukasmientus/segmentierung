// Lokale Dateiverarbeitung für die Mehrfachsegmentierung

const input = document.getElementById("file");
const userFiles = [];
const exportFiles = [];

input?.addEventListener("change", addToInputList);

function isTextFile(file) {
  return file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt");
}

function addToInputList() {
  const currentFiles = input?.files || [];
  for (const file of currentFiles) {
    if (isTextFile(file) && !checkIfExists(file.name, userFiles)) {
      userFiles.push(file);
      addVisualInputListElement(file);
    }
  }
  if (input) input.value = "";
  updateEmptyStates();
}

function dropHandler(event) {
  event.preventDefault();
  document.getElementById("inputArea")?.classList.remove("dragAndDropHover");

  for (const file of event.dataTransfer?.files || []) {
    if (isTextFile(file) && !checkIfExists(file.name, userFiles)) {
      userFiles.push(file);
      addVisualInputListElement(file);
    }
  }
  updateEmptyStates();
}

function checkIfExists(name, list) {
  return list.some((file) => file.name === name);
}

function createFileNameElement(file) {
  const paragraph = document.createElement("p");
  paragraph.textContent = file.name;
  paragraph.title = file.name;
  return paragraph;
}

function addVisualInputListElement(file) {
  const list = document.getElementById("listeInput");
  if (!list) return;

  const item = document.createElement("li");
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "secondary small";
  removeButton.textContent = "Entfernen";
  removeButton.addEventListener("click", () => deleteListElement(item, file, userFiles));

  item.append(createFileNameElement(file), removeButton);
  list.appendChild(item);
}

function addVisualExportListElement(file) {
  const list = document.getElementById("listeOutput");
  if (!list) return;

  const item = document.createElement("li");
  const removeButton = document.createElement("button");
  const txtButton = document.createElement("button");
  const csvButton = document.createElement("button");

  removeButton.type = txtButton.type = csvButton.type = "button";
  removeButton.className = "secondary small";
  txtButton.className = "secondary small";
  csvButton.className = "secondary small";
  removeButton.textContent = "Entfernen";
  txtButton.textContent = "TXT";
  csvButton.textContent = "CSV";

  removeButton.addEventListener("click", () => deleteListElement(item, file, exportFiles));
  txtButton.addEventListener("click", () => download("txt", file));
  csvButton.addEventListener("click", () => download("csv", file));

  item.append(createFileNameElement(file), txtButton, csvButton, removeButton);
  list.appendChild(item);
  updateEmptyStates();
}

function deleteListElement(item, file, list) {
  const index = list.indexOf(file);
  if (index !== -1) list.splice(index, 1);
  item.remove();
  updateEmptyStates();
}

function dragOverHandler(event) {
  event.preventDefault();
  document.getElementById("inputArea")?.classList.add("dragAndDropHover");
}

function dragLeaveHandler() {
  document.getElementById("inputArea")?.classList.remove("dragAndDropHover");
}

function reader(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader);
    fileReader.onerror = () => reject(fileReader.error || new Error("Datei konnte nicht gelesen werden."));
    fileReader.readAsText(file);
  });
}

function updateEmptyStates() {
  const inputState = document.getElementById("inputEmptyState");
  const outputState = document.getElementById("outputEmptyState");
  if (inputState) inputState.hidden = userFiles.length > 0;
  if (outputState) outputState.hidden = exportFiles.length > 0;
}

updateEmptyStates();
