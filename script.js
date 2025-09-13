let products = [];
let selectedCategory = "All";
let compareList = new Set();

const productsContainer = document.getElementById("productsContainer");
const compareTable = document.getElementById("compareTable");
const clearCompareBtn = document.getElementById("clearCompareBtn");
const searchInput = document.getElementById("searchInput");

// Fetch products.json
fetch("products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    renderCategories();
    filterProducts();
  });

// Render categories
function renderCategories() {
  const categoriesNav = document.querySelector(".categories-nav");
  const categories = ["All", ...new Set(products.map(p => p.category))];
  categoriesNav.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.className = cat === selectedCategory ? "active" : "";
    btn.addEventListener("click", () => {
      selectedCategory = cat;
      document.querySelectorAll(".categories-nav button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      filterProducts();
    });
    categoriesNav.appendChild(btn);
  });
}

// Render product grid
function renderProducts(productList) {
  productsContainer.innerHTML = "";

  if (productList.length === 0) {
    productsContainer.innerHTML = '<p style="text-align:center;color:#777;">No products found.</p>';
    return;
  }

  productList.forEach(prod => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}" class="product-image" loading="lazy" />
      <div class="product-content">
        <h3 class="product-name">${prod.name}</h3>
        <p class="product-price">₹${prod.price.toLocaleString()}</p>
        <p class="product-description">${prod.description}</p>
        <p class="product-rating">Rating: ${prod.rating} ★</p>
        <button class="compare-btn">${compareList.has(prod.id) ? "Remove from Compare" : "Add to Compare"}</button>
      </div>
    `;

    // Compare button
    const btn = card.querySelector(".compare-btn");
    btn.addEventListener("click", () => {
      if (compareList.has(prod.id)) {
        compareList.delete(prod.id);
        btn.textContent = "Add to Compare";
      } else {
        if (compareList.size >= 3) {
          alert("You can only compare up to 3 products.");
          return;
        }
        compareList.add(prod.id);
        btn.textContent = "Remove from Compare";
      }
      renderCompareTable();
    });

    productsContainer.appendChild(card);
  });
}

// Filter products
function filterProducts() {
  let list = products;

  if (selectedCategory !== "All") {
    list = list.filter(p => p.category === selectedCategory);
  }

  if (searchInput.value.trim()) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(searchInput.value.toLowerCase())
    );
  }

  renderProducts(list);
}

searchInput.addEventListener("input", filterProducts);

// Render compare table
function renderCompareTable() {
  compareTable.innerHTML = "";
  if (compareList.size === 0) return;

  const selectedProducts = products.filter(p => compareList.has(p.id));
  const headers = ["Feature", ...selectedProducts.map(p => p.name)];

  // Header row
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  compareTable.appendChild(thead);

  // Body rows
  const tbody = document.createElement("tbody");
  const fields = ["Price", "Description", "Rating"];
  fields.forEach(field => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${field}</td>` +
      selectedProducts.map(p => {
        if (field === "Price") return `<td>₹${p.price.toLocaleString()}</td>`;
        if (field === "Description") return `<td>${p.description}</td>`;
        if (field === "Rating") return `<td>${p.rating} ★</td>`;
      }).join("");
    tbody.appendChild(row);
  });
  compareTable.appendChild(tbody);
}

// Clear compare
clearCompareBtn.addEventListener("click", () => {
  compareList.clear();
  renderCompareTable();
  document.querySelectorAll(".compare-btn").forEach(btn => btn.textContent = "Add to Compare");
});
