// Product data array
const products = [
    {
        id: 1,
        category: 'New Mobiles',
        name: 'Redmi Note 12',
        price: 13999,
        description: 'Latest Redmi Note with AMOLED display',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=240&q=80'
    },
    {
        id: 2,
        category: 'New Mobiles',
        name: 'Samsung Galaxy S23',
        price: 69999,
        description: 'Flagship Galaxy with powerful camera',
        image: 'https://images.unsplash.com/photo-1510552776732-01acc6fd7066?auto=format&fit=crop&w=240&q=80'
    },
    {
        id: 3,
        category: 'Second Hand Mobiles',
        name: 'iPhone 11',
        price: 25000,
        description: 'Certified refurbished iPhone 11',
        image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=240&q=80'
    },
    {
        id: 4,
        category: 'Second Hand Mobiles',
        name: 'OnePlus 7T',
        price: 18000,
        description: 'Used OnePlus 7T in good condition',
        image: 'https://images.unsplash.com/photo-1565372917277-0b038ca8044d?auto=format&fit=crop&w=240&q=80'
    },
    {
        id: 5,
        category: 'Covers',
        name: 'Silicone Cover for Redmi',
        price: 499,
        description: 'Shockproof silicone cover',
        image: 'https://images.unsplash.com/photo-1585386959984-a4155221ef73?auto=format&fit=crop&w=240&q=80'
    },
    {
        id: 6,
        category: 'Accessories',
        name: 'USB Type-C Cable',
        price: 299,
        description: 'Fast charging cable',
        image: 'https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=240&q=80'
    },
    {
        id: 7,
        category: 'Accessories',
        name: 'Wireless Earbuds',
        price: 1299,
        description: 'Bluetooth earbuds with good sound',
        image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=240&q=80'
    },
    {
        id: 8,
        category: 'Coming Soon',
        name: 'Samsung Galaxy Z Flip 5',
        price: 120000,
        description: 'Foldable phone, available soon',
        image: 'https://images.unsplash.com/photo-1616432921143-9f7e3090c3d8?auto=format&fit=crop&w=240&q=80'
    }
];

const categories = ['New Mobiles', 'Second Hand Mobiles', 'Covers', 'Accessories', 'Coming Soon'];

let selectedCategory = 'New Mobiles';
let compareList = [];

// DOM elements
const productListEl = document.getElementById('productList');
const categoriesEl = document.getElementById('categories');
const searchInputEl = document.getElementById('searchInput');
const compareTableEl = document.getElementById('compareTable');
const clearCompareBtn = document.getElementById('clearCompare');

// Initialize category buttons
function renderCategories() {
    categoriesEl.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.classList.toggle('active', cat === selectedCategory);
        btn.addEventListener('click', () => {
            selectedCategory = cat;
            renderCategories();
            renderProducts();
            resetCompare();
        });
        categoriesEl.appendChild(btn);
    });
}

// Render product cards according to selected category and search
function renderProducts() {
    let searchTerm = searchInputEl.value.toLowerCase();
    productListEl.innerHTML = '';
    let filteredProducts = products.filter(p =>
        p.category === selectedCategory && p.name.toLowerCase().includes(searchTerm)
    );

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">₹${product.price.toLocaleString('en-IN')}</p>
                <p class="description">${product.description}</p>
                <button data-id="${product.id}">Add to Compare</button>
            </div>
        `;

        const btn = card.querySelector('button');
        btn.addEventListener('click', () => {
            addToCompare(product.id);
        });

        productListEl.appendChild(card);
    });
}

// Add product to compare list
function addToCompare(productId) {
    if (!compareList.includes(productId)) {
        compareList.push(productId);
        renderCompareTable();
    }
}

// Render the comparison table
function renderCompareTable() {
    if (compareList.length === 0) {
        compareTableEl.innerHTML = '<tr><td>No products selected for comparison.</td></tr>';
        return;
    }

    // Get product objects
    const compareProducts = compareList.map(id => products.find(p => p.id === id));

    let html = '<thead><tr><th>Feature</th>';
    compareProducts.forEach(p => {
        html += `<th>${p.name}</th>`;
    });
    html += '</tr></thead><tbody>';

    // Features: Image, Price, Description
    html += '<tr><td>Image</td>';
    compareProducts.forEach(p => {
        html += `<td><img src="${p.image}" alt="${p.name}" style="max-width:100px;" /></td>`;
    });
    html += '</tr>';

    html += '<tr><td>Price</td>';
    compareProducts.forEach(p => {
        html += `<td>₹${p.price.toLocaleString('en-IN')}</td>`;
    });
    html += '</tr>';

    html += '<tr><td>Description</td>';
    compareProducts.forEach(p => {
        html += `<td>${p.description}</td>`;
    });
    html += '</tr>';

    html += '</tbody>';

    compareTableEl.innerHTML = html;
}

// Clear comparison
function resetCompare() {
    compareList = [];
    renderCompareTable();
}

// Event listeners
searchInputEl.addEventListener('input', () => {
    renderProducts();
    resetCompare();
});

clearCompareBtn.addEventListener('click', () => {
    resetCompare();
});

// Initial load
renderCategories();
renderProducts();
renderCompareTable();
