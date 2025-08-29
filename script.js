const CSV_URL = "datos.csv";
let data = [];
let currentView = "list";

document.addEventListener("DOMContentLoaded", () => {
  loadCSV();
  document.getElementById("search").addEventListener("input", filterCatalog);
  applyFilterFromURL(); // para soportar QR con ?ubicacion=
});

function loadCSV() {
  fetch(CSV_URL)
    .then(response => response.text())
    .then(text => {
      const rows = text.split("\n").map(r => r.split(","));
      const headers = rows[0];
      data = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => obj[h.trim()] = row[i] ? row[i].trim() : "");
        return obj;
      });
      renderCatalog();
    });
}

function renderCatalog() {
  const catalog = document.getElementById("catalog");
  catalog.className = currentView;
  catalog.innerHTML = "";

  const term = document.getElementById("search").value.toLowerCase();

  const filtered = data.filter(item =>
    item.CODIGO?.toLowerCase().includes(term) ||
    item.DESCRIPCION?.toLowerCase().includes(term) ||
    item.UBICACION?.toLowerCase().includes(term)
  );

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.IMAGEN}" alt="${item.DESCRIPCION}" loading="lazy" onclick="window.open('${item['WEB SITE']}', '_blank')">
      <h3>${item.CODIGO}</h3>
      <p>${item.DESCRIPCION}</p>
      <p><strong>Ubicación:</strong> ${item.UBICACION}</p>
    `;
    catalog.appendChild(card);
  });
}

function setView(view) {
  currentView = view;
  renderCatalog();
}

function filterCatalog() {
  renderCatalog();
}

function applyFilterFromURL() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("ubicacion")) {
    const ubicacion = params.get("ubicacion");
    document.getElementById("search").value = ubicacion;
  }
}
