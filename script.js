document.addEventListener("DOMContentLoaded", () => {
  const catalog = document.getElementById("catalog");
  const searchInput = document.getElementById("search");

  const listBtn = document.getElementById("listView");
  const gridBtn = document.getElementById("gridView");
  const galleryBtn = document.getElementById("galleryView");

  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  const modalCodigo = document.getElementById("modal-codigo");
  const modalDesc = document.getElementById("modal-desc");
  const modalUbicacion = document.getElementById("modal-ubicacion");
  const modalProveedor = document.getElementById("modal-proveedor");
  const modalLink = document.getElementById("modal-link");
  const modalClose = document.querySelector(".close");

  let data = [];
  let viewMode = "list";

  // Cargar CSV
  fetch("datos.csv")
    .then(res => res.text())
    .then(text => {
      data = parseCSV(text);
      applyURLFilter();
      render();
    });

  function parseCSV(text) {
    const rows = text.trim().split("\n").map(r => r.split(","));
    const headers = rows[0];
    return rows.slice(1).map(row => {
      let obj = {};
      headers.forEach((h, i) => obj[h.trim()] = row[i]);
      return obj;
    });
  }

  function render() {
    catalog.className = "";
    catalog.classList.add(viewMode + "-view");
    catalog.innerHTML = "";

    const query = searchInput.value.toLowerCase();

    const filtered = data.filter(item => {
      return (
        item["CODIGO"].toLowerCase().includes(query) ||
        item["DESCRIPCION"].toLowerCase().includes(query) ||
        item["UBICACION"].toLowerCase().includes(query)
      );
    });

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      const img = document.createElement("img");
      img.src = item["IMAGEN"];
      img.alt = item["DESCRIPCION"];
      img.loading = "lazy";

      if (viewMode === "gallery") {
        img.addEventListener("click", () => openModal(item));
        card.appendChild(img);
      } else {
        const title = document.createElement("h3");
        title.textContent = item["DESCRIPCION"];

        const ubic = document.createElement("p");
        ubic.textContent = "Ubicación: " + item["UBICACION"];

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(ubic);
      }
      catalog.appendChild(card);
    });
  }

  function openModal(item) {
    modal.style.display = "block";
    modalImg.src = item["IMAGEN"];
    modalCodigo.textContent = item["CODIGO"];
    modalDesc.textContent = item["DESCRIPCION"];
    modalUbicacion.textContent = item["UBICACION"];
    modalProveedor.textContent = item["PROVEEDOR"];
    modalLink.href = item["WEB SITE"];
  }

  modalClose.onclick = () => (modal.style.display = "none");
  window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

  // Cambiar vistas
  listBtn.onclick = () => { viewMode = "list"; render(); };
  gridBtn.onclick = () => { viewMode = "grid"; render(); };
  galleryBtn.onclick = () => { viewMode = "gallery"; render(); };

  searchInput.addEventListener("input", render);

  // QR filtro URL
  function applyURLFilter() {
    const params = new URLSearchParams(window.location.search);
    const ubicacion = params.get("ubicacion");
    if (ubicacion) {
      searchInput.value = ubicacion;
    }
  }
});