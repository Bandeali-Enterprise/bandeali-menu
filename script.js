// Product Rendering
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
  productList.forEach((prod) => {
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
        <button class="compare-btn" aria-pressed="${isCompared}" aria-label="${isCompared ? 'Remove from Compare' : 'Add to Compare'}">
          ${isCompared ? 'Remove from Compare' : 'Add to Compare'}
        </button>
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

// Render Horizontal Rows per Category
function renderAllCategoriesHorizontal() {
  productsContainer.innerHTML = "";
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(category => {
    const heading = document.createElement("h2");
    heading.textContent = category;
    heading.style.margin = "1em 0 0.5em 0";
    heading.style.fontSize = "1.2rem";
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
          <button class="compare-btn" aria-pressed="${isCompared}" aria-label="${isCompared ? 'Remove from Compare' : 'Add to Compare'}">
            ${isCompared ? 'Remove from Compare' : 'Add to Compare'}
          </button>
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

// Newsletter Popup
document.querySelector("#newsletterForm")?.addEventListener("submit", function(e) {
  e.preventDefault();
  const contactInput = document.querySelector("#contactInput");
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
  const modal = document.querySelector("#customModal");
  const msg = document.querySelector("#customModalMsg");
  msg.innerHTML = `You have successfully subscribed with your <b>${type}</b>:<br>${value}`;
  modal.style.display = "flex";
}

document.querySelector("#closeModalBtn").addEventListener("click", () => {
  document.querySelector("#customModal").style.display = "none";
});

window.addEventListener("click", (e) => {
  const modal = document.querySelector("#customModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
