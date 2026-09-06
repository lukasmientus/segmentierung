// UI-Helfer und Abkürzungsliste

function showPopup(elementOrId, duration = 2200) {
  const popup = typeof elementOrId === "string" ? document.getElementById(elementOrId) : elementOrId;
  if (!popup) return;
  popup.classList.add("is-visible");
  window.setTimeout(() => popup.classList.remove("is-visible"), duration);
}

function getAbbreviations() {
  const list = document.getElementById("liste");
  if (!list) return [];
  return Array.from(list.children).map((item) => item.dataset.value || item.textContent.trim());
}

function addList(input = document.getElementById("input")?.value) {
  const list = document.getElementById("liste");
  if (!list) return;

  const value = String(input ?? "").trim();
  if (!value) return;

  const exists = getAbbreviations().some((entry) => entry === value);
  if (exists) {
    showPopup("myPopupAdd");
    return;
  }

  const li = document.createElement("li");
  li.dataset.value = value;
  li.textContent = value;
  list.appendChild(li);
}

function deleteList() {
  const list = document.getElementById("liste");
  const field = document.getElementById("input");
  if (!list || !field) return;

  const value = field.value.trim();
  const item = Array.from(list.children).find((child) => (child.dataset.value || child.textContent.trim()) === value);

  if (!item) {
    showPopup("myPopupDel");
    return;
  }

  item.remove();
}

function presentCount(total, entries) {
  const panel = document.getElementById("wordCount");
  const body = document.getElementById("countTableBody");
  if (!panel || !body) return;

  body.replaceChildren();

  const totalRow = document.createElement("tr");
  const totalLabel = document.createElement("td");
  const totalValue = document.createElement("td");
  totalLabel.textContent = "Gesamt";
  totalValue.textContent = String(total);
  totalRow.append(totalLabel, totalValue);
  body.appendChild(totalRow);

  for (const [word, count] of entries) {
    const row = document.createElement("tr");
    const wordCell = document.createElement("td");
    const countCell = document.createElement("td");
    wordCell.textContent = word;
    countCell.textContent = String(count);
    row.append(wordCell, countCell);
    body.appendChild(row);
  }

  panel.classList.add("is-visible");
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideCount() {
  document.getElementById("wordCount")?.classList.remove("is-visible");
}

function clearText() {
  const field = document.getElementById("textfield");
  if (!field) return;
  field.value = "";
  field.focus();
  hideCount();
}
