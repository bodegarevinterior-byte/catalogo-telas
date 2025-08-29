const CSV_URL = "datos.csv"; // archivo local

let data = [];
let currentView = "list";

async function loadCSV() {
  const response = await fetch(CSV_URL);
  const text = await response.text();
  const rows = text.trim().split("\n").map(r => r.split(","));

  const headers = rows[0];
  data = rows.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h.trim()] = row[i] || "");
    return obj;
  });

  render();
}

function render() {
  const catalogo = document.getElementById("catalogo");
  const search = document.getElementById("search").value.toLowerCase();
  catalogo.className = currentView + "-view";

  catalogo.innerHTML = "";

  data.filter(item => 
    item.DESCRIPCION.toLowerCase().includes(search) ||
    item.CODIGO.toLowerCase().includes(search) ||
    item.PROVEEDOR.toLowerCase().includes(search)
  ).forEach(item => {
    if (currentView === "gallery") {
      const card = document.createElement("div");
      card.className = "card";
      const img = document.createElement("img");
      img.src = item.IMAGEN;
      img.loading = "lazy";
      img.alt = item.DESCRIPCION;
      img.onclick = () => openModal(item);
      card.appendChild(img);
      catalogo.appendChild(card);
    } else {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${item.IMAGEN}" alt="${item.DESCRIPCION}" loading="lazy">
        <h3>${item.DESCRIPCION}</h3>
        <p><strong>Código:</strong> ${item.CODIGO}</p>
        <p><strong>Ubicación:</strong> ${item.UBICACION}</p>
        <p><strong>Proveedor:</strong> ${item.PROVEEDOR}</p>
        <a href="${item["WEB SITE"]}" target="_blank">Ver en sitio web</a>
      `;
      catalogo.appendChild(card);
    }
  });
}

function setView(view) {
  currentView = view;
  render();
}

function openModal(item) {
  document.getElementById("modal-img").src = item.IMAGEN;
  document.getElementById("modal-desc").textContent = item.DESCRIPCION;
  document.getElementById("modal-codigo").textContent = item.CODIGO;
  document.getElementById("modal-ubicacion").textContent = item.UBICACION;
  document.getElementById("modal-proveedor").textContent = item.PROVEEDOR;
  document.getElementById("modal-link").href = item["WEB SITE"];
  document.getElementById("modal").style.display = "flex";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

document.getElementById("search").addEventListener("input", render);

loadCSV();
