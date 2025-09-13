let products = [];
let compareList = [];

// Load products.json
fetch("products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    renderProducts(products);
  })
  .catch(err => console.error("Error loading products.json:", err));

// Render products on page
function renderProducts(items) {
  const container = document.getElementById("product-list");
  container.innerHTML = "";

  if (items.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  items.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <p><strong>Price:</strong> ₹${p.price}</p>
      <button onclick="toggleCompare('${p.id}')">
        ${compareList.includes(p.id) ? "Remove from Compare" : "Add to Compare"}
      </button>
    `;
    container.appendChild(card);
  });
}

// Search products
document.getElementById("searchInput").addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.description.toLowerCase().includes(term)
  );
  renderProducts(filtered);
});

// Compare feature
function toggleCompare(id) {
  if (compareList.includes(id)) {
    compareList = compareList.filter(pid => pid !== id);
  } else {
    compareList.push(id);
  }
  renderProducts(products);
  renderComparison();
}

function renderComparison() {
  const table = document.getElementById("comparison-table");
  table.innerHTML = "";

  if (compareList.length === 0) {
    table.innerHTML = "<p>No products selected for comparison.</p>";
    return;
  }

  const selected = products.filter(p => compareList.includes(p.id));

  let header = "<tr><th>Name</th><th>Price</th><th>Stock</th><th>Rating</th></tr>";
  let rows = selected.map(p =>
    `<tr>
       <td>${p.name}</td>
       <td>₹${p.price}</td>
       <td>${p.stock}</td>
       <td>${p.rating}</td>
     </tr>`
  ).join("");

  table.innerHTML = header + rows;
}

function clearComparison() {
  compareList = [];
  renderProducts(products);
  renderComparison();
}
