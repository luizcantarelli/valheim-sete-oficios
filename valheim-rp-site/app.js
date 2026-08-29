const { professions, catalogs } = window.VALHEIM_GUIDE;
const roleList = document.querySelector("#role-list");
const panel = document.querySelector("#profession-panel");
let activeId = professions[0].id;
const patronArtFiles = {
  "mestre-da-madeira": "mestre-da-madeira-v2.jpg",
  "bruxo-do-caldeirao": "bruxo-do-caldeirao-v2.jpg"
};

function bullets(items) {
  return `<ul>${items.map(item => `<li>${item}</li>`).join("")}</ul>`;
}

function catalogMarkup(id, query = "") {
  const term = query.trim().toLocaleLowerCase("pt-BR");
  let count = 0;
  const groups = catalogs[id].map(([label, items]) => {
    const found = term ? items.filter(item => item.toLocaleLowerCase("pt-BR").includes(term)) : items;
    count += found.length;
    return found.length ? `<section class="catalog-group"><h3>${label}<span>${found.length}</span></h3>${bullets(found)}</section>` : "";
  }).join("");
  return `<div class="result-count">${count} ITENS / SERVIÇOS</div>${groups || `<p class="no-result">Nada encontrado neste monopólio.</p>`}`;
}

function renderRail() {
  roleList.innerHTML = professions.map((role, index) => `
    <button class="role-button ${role.id === activeId ? "active" : ""}" data-role="${role.id}">
      <img src="assets/symbols/${role.id}.png" alt="">
      <span><small>0${index + 1} · ${role.patron}</small>${role.name}</span>
    </button>`).join("");
}

function renderProfession() {
  const role = professions.find(item => item.id === activeId);
  const patronArt = patronArtFiles[role.id] || `${role.id}.jpg`;
  panel.innerHTML = `
    <header class="role-header" data-role="${role.id}" style="--accent:${role.accent};--patron-art:url('assets/gods/${patronArt}')">
      <img src="assets/symbols/${role.id}.png" alt="Símbolo de ${role.name}">
      <div><p>PATRONO DO OFÍCIO</p><h1>${role.name}<small>${role.patron}</small></h1><span>${role.fantasy}</span></div>
      <a href="../fichas-personagens/${role.id}.pdf">FICHA A4 →</a>
    </header>
    <div class="mandate-grid">
      <article class="good"><h2>PODE FAZER</h2>${bullets(role.can)}</article>
      <article class="sell"><h2>PODE VENDER</h2>${bullets(role.sell)}</article>
      <article class="buy"><h2>PRECISA COMPRAR</h2>${bullets(role.buy)}</article>
      <article class="stop"><h2>NÃO PODE</h2>${bullets(role.cannot)}</article>
    </div>
    <section class="catalog-panel">
      <div class="catalog-tools"><div><p>INVENTÁRIO DO MONOPÓLIO</p><h2>CATÁLOGO COMPLETO</h2></div><label>BUSCAR ITEM<input id="item-search" type="search" placeholder="iron, portal, fish..." autocomplete="off"></label></div>
      <div id="catalog-results" class="catalog-grid">${catalogMarkup(role.id)}</div>
    </section>`;
  const search = document.querySelector("#item-search");
  search.addEventListener("input", () => {
    document.querySelector("#catalog-results").innerHTML = catalogMarkup(role.id, search.value);
  });
}

roleList.addEventListener("click", event => {
  const button = event.target.closest("[data-role]");
  if (!button) return;
  activeId = button.dataset.role;
  renderRail();
  renderProfession();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderRail();
renderProfession();
