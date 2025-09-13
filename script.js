// Global state
let products = [];
let categories = [];
let selectedCategory = '';
let compareList = new Set();

const categoriesNav = document.getElementById('categoriesNav');
const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');
const compareTable = document.getElementById('compareTable');
const clearCompareBtn = document.getElementById('clearCompareBtn');

// Fetch products and initialize
async function init() {
    try {
        const res = await fetch('products.json');
        products = await res.json();

        categories = [...new Set(products.map(p => p.category))];
        if (categories.length > 0) selectedCategory = categories[0];

        renderCategories();
        renderProducts();
        renderCompareTable();
    } catch (error) {
        console.error('Failed to load products:', error);
        productsContainer.innerHTML = '<p style="text-align:center;color:#cc0000;">Failed to load products.</p>';
    }
}

// Render categories navigation buttons
function renderCategories() {
    categoriesNav.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.classList.toggle('active', cat === selectedCategory);
        btn.setAttribute('aria-pressed', cat === selectedCategory);
        btn.addEventListener('click', () => {
            selectedCategory = cat;
            renderCategories();
            renderProducts();
            clearCompare();
            searchInput.value = '';
        });
        categoriesNav.appendChild(btn);
    });
}

// Render product cards based on filters
function renderProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let filtered = products.filter(p => p.category === selectedCategory);

    if (searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    // Clear container
    productsContainer.innerHTML = '';

    if (filtered.length === 0) {
        productsContainer.innerHTML = '<p style="text-align:center;color:#777;">No products found.</p>';
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.tabIndex = 0;
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" />
            <div class="product-content">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">₹${product.price.toLocaleString('en-IN')}</p>
                <p class="product-description">${product.description}</p>
                <p class="product-rating">${renderStars(product.rating)}</p>
                <button class="compare-btn" aria-pressed="false" aria-label="Add ${product.name} to compare" data-id="${product.id}">
                    Add to Compare
                </button>
            </div>
        `;
        const compareBtn = card.querySelector('.compare-btn');
        compareBtn.addEventListener('click', () => toggleCompare(product.id, compareBtn));
        productsContainer.appendChild(card);
    });
}

// Generate star rating string
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let stars = '★'.repeat(fullStars);
    if (halfStar) stars += '☆'; // Using hollow star for half (no partial star symbol in plain text)
    stars += '☆'.repeat(emptyStars);
    return stars;
}

// Toggle product in compare list
function toggleCompare(productId, button) {
    if (compareList.has(productId)) {
        compareList.delete(productId);
        button.textContent = 'Add to Compare';
        button.setAttribute('aria-pressed', 'false');
    } else {
        compareList.add(productId);
        button.textContent = 'Added';
        button.setAttribute('aria-pressed', 'true');
    }
    renderCompareTable();
}

// Render the comparison table
function renderCompareTable() {
    if (compareList.size === 0) {
        compareTable.innerHTML = `<tr><td style="text-align:center;padding:1rem;" colspan="5">No products selected for comparison.</td></tr>`;
        return;
    }

    const compareProducts = [...compareList].map(id => products.find(p => p.id === id));

    const headers = ['Name', 'Price (₹)', 'Stock', 'Rating'];
    let html = '<thead><tr><th>Feature</th>';
    compareProducts.forEach(p => {
        html += `<th>${escapeHtml(p.name)}</th>`;
    });
    html += '</tr></thead><tbody>';

    headers.forEach(feature => {
        html += `<tr><td><strong>${feature}</strong></td>`;
        compareProducts.forEach(p => {
            let val = '';
            switch (feature) {
                case 'Name':
                    val = escapeHtml(p.name);
                    break;
                case 'Price (₹)':
                    val = p.price.toLocaleString('en-IN');
                    break;
                case 'Stock':
                    val = p.stock != null ? p.stock : 'N/A';
                    break;
                case 'Rating':
                    val = renderStars(p.rating);
                    break;
            }
            html += `<td>${val}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody>';
    compareTable.innerHTML = html;
}

// Clear comparison list and update UI
function clearCompare() {
    compareList.clear();
    renderCompareTable();

    // Reset all "Add to Compare" buttons text & aria-pressed
    document.querySelectorAll('.compare-btn').forEach(btn => {
        btn.textContent = 'Add to Compare';
        btn.setAttribute('aria-pressed', 'false');
    });
}

// Utility: Escape HTML for safety
function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function (m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[m];
    });
}

// Event listeners
searchInput.addEventListener('input', () => {
    renderProducts();
    clearCompare();
});

clearCompareBtn.addEventListener('click', () => {
    clearCompare();
});

// Initialize on DOM loaded
document.addEventListener('DOMContentLoaded', init);