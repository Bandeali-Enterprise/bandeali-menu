// Global state
let products = [];
let selectedCategory = "All";
let compareList = new Set();

// Elements
const categoriesNav = document.querySelector(".categories-nav");
const productsContainer = document.getElementById("productsContainer");
const searchInput = document.getElementById("searchInput");
const compareTable = document.getElementById("compareTable");
const clearCompareBtn = document.getElementById("clearCompareBtn");

// Load products and initialize
async function loadProducts() {
  try {
    const res = await fetch("products.json");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    products = await res.json();
    initCategories();
    renderProducts(filterProducts());
    renderCompareTable();
  } catch (err) {
    console.error("Failed to load products.json:", err);
    productsContainer.innerHTML = '<p style="text-align:center;color:#cc0000;">Failed to load products.</p>';
  }
}

// Initialize categories navigation
function initCategories() {
  categoriesNav.innerHTML = "";
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.classList.toggle("active", cat === selectedCategory);
    btn.setAttribute("aria-pressed", cat === selectedCategory);
    btn.addEventListener("click", () => {
      selectedCategory = cat;
      updateCategoryActive();
      renderProducts(filterProducts());
      clearCompare();
      searchInput.value = "";
    });
    categoriesNav.appendChild(btn);
  });
}

// Update active category UI
function updateCategoryActive() {
  document.querySelectorAll(".categories-nav button").forEach(btn => {
    btn.classList.toggle("active", btn.textContent === selectedCategory);
  });
}

// Filter products by category and search term
function filterProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  let filtered = selectedCategory === "All" ? products : products.filter(p => p.category === selectedCategory);
  if (searchTerm) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
  }
  return filtered;
}

// Render horizontal scroll rows for "All"
function renderAllCategoriesHorizontal() {
  productsContainer.innerHTML = "";
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(category => {
    const heading = document.createElement("h2");
    heading.textContent = category;
    heading.style.margin = "1em 0 0.25em 0";
    heading.style.fontSize = "1.17em";
    heading.style.fontWeight = "600";
    productsContainer.appendChild(heading);

    const row = document.createElement("div");
    row.className = "horizontal-scroll-row";

    products.filter(p => p.category === category).forEach(prod => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.tabIndex = 0;
      card.style.minWidth = "240px";
      card.style.maxWidth = "240px";

      const isCompared = compareList.has(prod.id);
      card.innerHTML = `
        <img src="${prod.image}" alt="${prod.name}" class="product-image" loading="lazy" />
        <div class="product-content">
          <h3 class="product-name">${prod.name}</h3>
          <p class="product-price">₹${prod.price.toLocaleString()}</p>
          <p class="product-description">${prod.description}</p>
          <p class="product-rating">Rating: ${prod.rating} ★</p>
          <button class="compare-btn" aria-pressed="${isCompared}" aria-label="${isCompared ? 'Remove from Compare' : 'Add to Compare'}">${isCompared ? "Remove from Compare" : "Add to Compare"}</button>
        </div>
      `;

      const btn = card.querySelector(".compare-btn");
      btn.addEventListener("click", () => {
        if (compareList.has(prod.id)) {
          compareList.delete(prod.id);
          btn.textContent = "Add to Compare";
          btn.setAttribute("aria-pressed", "false");
          btn.setAttribute("aria-label", "Add to Compare");
        } else {
          if (compareList.size >= 3) {
            alert("You can only compare up to 3 products.");
            return;
          }
          compareList.add(prod.id);
          btn.textContent = "Remove from Compare";
          btn.setAttribute("aria-pressed", "true");
          btn.setAttribute("aria-label", "Remove from Compare");
        }
        renderCompareTable();
      });
      row.appendChild(card);
    });
    productsContainer.appendChild(row);
  });
}

// Render final product list or horizontal scroll
function renderProducts(productList) {
  if (selectedCategory === "All" && !searchInput.value.trim()) {
    renderAllCategoriesHorizontal();
    return;
  }
  productsContainer.innerHTML = "";
  if (productList.length === 0) {
    productsContainer.innerHTML = '<p style="text-align:center;color:#777;">No products found.</p>';
    return;
  }
  productList.forEach(prod => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.tabIndex = 0;
    const isCompared = compareList.has(prod.id);
    card.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}" class="product-image" loading="lazy" />
      <div class="product-content">
        <h3 class="product-name">${prod.name}</h3>
        <p class="product-price">₹${prod.price.toLocaleString()}</p>
        <p class="product-description">${prod.description}</p>
        <p class="product-rating">Rating: ${prod.rating} ★</p>
        <button class="compare-btn" aria-pressed="${isCompared}" aria-label="${isCompared ? 'Remove from Compare' : 'Add to Compare'}">${isCompared ? "Remove from Compare" : "Add to Compare"}</button>
      </div>
    `;
    const btn = card.querySelector(".compare-btn");
    btn.addEventListener("click", () => {
      if (compareList.has(prod.id)) {
        compareList.delete(prod.id);
        btn.textContent = "Add to Compare";
        btn.setAttribute("aria-pressed", "false");
        btn.setAttribute("aria-label", "Add to Compare");
      } else {
        if (compareList.size >= 3) {
          alert("You can only compare up to 3 products.");
          return;
        }
        compareList.add(prod.id);
        btn.textContent = "Remove from Compare";
        btn.setAttribute("aria-pressed", "true");
        btn.setAttribute("aria-label", "Remove from Compare");
      }
      renderCompareTable();
    });
    productsContainer.appendChild(card);
  });
}

function renderCompareTable() {
  compareTable.innerHTML = "";
  if (compareList.size === 0) {
    compareTable.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:1rem;">No products selected for comparison.</td></tr>';
    clearCompareBtn.style.display = "none";
    return;
  }
  clearCompareBtn.style.display = "inline-block";
  let headers = "<tr><th>Attribute</th>";
  compareList.forEach(id => {
    const p = products.find(prod => prod.id === id);
    headers += `<th>${p.name}</th>`;
  });
  headers += "</tr>";

  let imagesRow = "<tr><td>Image</td>";
  let priceRow = "<tr><td>Price</td>";
  let descRow = "<tr><td>Description</td>";
  let ratingRow = "<tr><td>Rating</td>";
  let stockRow = "<tr><td>Stock</td>";
  let categoryRow = "<tr><td>Category</td>";

  compareList.forEach(id => {
    const p = products.find(prod => prod.id === id);
    imagesRow += `<td><img src="${p.image}" alt="${p.name}" style="width:80px;"/></td>`;
    priceRow += `<td>₹${p.price.toLocaleString()}</td>`;
    descRow += `<td>${p.description}</td>`;
    ratingRow += `<td>${p.rating} ★</td>`;
    stockRow += `<td>${p.stock !== undefined ? p.stock : "—"}</td>`;
    categoryRow += `<td>${p.category}</td>`;
  });

  imagesRow += "</tr>";
  priceRow += "</tr>";
  descRow += "</tr>";
  ratingRow += "</tr>";
  stockRow += "</tr>";
  categoryRow += "</tr>";

  compareTable.innerHTML = headers + imagesRow + priceRow + descRow + ratingRow + stockRow + categoryRow;
}

function clearCompare() {
  compareList.clear();
  renderProducts(filterProducts());
  renderCompareTable();
}
clearCompareBtn.onclick = clearCompare;

searchInput.addEventListener("input", () => {
  renderProducts(filterProducts());
  clearCompare();
});

// Newsletter subscription popup logic
document.getElementById("newsletterForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const contactInput = document.getElementById("contactInput");
  const value = contactInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[6-9]\d{9}$/;
  if (emailRegex.test(value)) {
    showPopup(value, "email");
  } else if (mobileRegex.test(value)) {
    showPopup(value, "mobile number");
  } else {
    alert("Please enter a valid email or 10 digit mobile number.");
    contactInput.focus();
    return;
  }
  this.reset();
});

function showPopup(value, type) {
  const modal = document.getElementById("customModal");
  const msg = document.getElementById("customModalMsg");
  msg.innerHTML = `You have successfully subscribed with your <b>${type}</b>:<br>${value}`;
  modal.style.display = "flex";
}

document.getElementById("closeModalBtn").onclick = function () {
  document.getElementById("customModal").style.display = "none";
};

window.onclick = function (e) {
  const modal = document.getElementById("customModal");
  if (e.target === modal) modal.style.display = "none";
};

window.addEventListener("DOMContentLoaded", loadProducts);
