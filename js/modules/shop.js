// Emergency products data
const products = [
    {
        id: 1,
        name: 'Fire Blankets',
        description: 'Fire-resistant emergency blankets for fire safety.',
        category: 'Safety',
        image: 'https://placehold.co/300x200'
    },
    {
        id: 2,
        name: 'Camping Tarps',
        description: 'Durable camping tarps for emergency shelter and protection.',
        category: 'Shelter',
        image: 'https://placehold.co/300x200'
    },
    {
        id: 3,
        name: 'Sleeping Bags',
        description: 'Compact, insulated, and durable sleeping bags for emergency situations.',
        category: 'Shelter',
        image: 'https://placehold.co/300x200'
    },
    {
        id: 4,
        name: 'Foam Sleeping Pads',
        description: 'Lightweight foam sleeping pads for comfortable emergency sleeping.',
        category: 'Shelter',
        image: 'https://placehold.co/300x200'
    },
    {
        id: 5,
        name: 'Inflatable Mattress',
        description: 'Portable inflatable mattress for emergency sleeping arrangements.',
        category: 'Shelter',
        image: 'https://placehold.co/300x200'
    },
    {
        id: 6,
        name: 'Emergency Sleeping Bags',
        description: 'Compact and warm emergency sleeping bags for survival situations.',
        category: 'Shelter',
        image: 'https://placehold.co/300x200'
    },
    {
        id: 7,
        name: 'Portable Solar Power Bank',
        description: 'High-capacity solar-powered power bank for charging devices during emergencies.',
        category: 'Electronics',
        image: 'https://placehold.co/300x200'
    },
    {
        id: 8,
        name: 'Emergency Blankets',
        description: 'Mylar thermal emergency blankets for maintaining body heat in cold conditions.',
        category: 'Safety',
        image: 'https://placehold.co/300x200'
    },
    {
        id: 9,
        name: 'LED Flashlights',
        description: 'Bright LED flashlights with extra batteries or rechargeable options.',
        category: 'Lighting',
        image: 'https://placehold.co/300x200'
    },
    {
        id: 10,
        name: 'Solar-Powered Lanterns',
        description: 'Portable solar-powered lanterns for emergency lighting.',
        category: 'Lighting',
        image: 'https://placehold.co/300x200'
    },
    {
        id: 11,
        name: 'Battery-Powered Light Sticks',
        description: 'Long-lasting battery-powered light sticks for emergency lighting.',
        category: 'Lighting',
        image: 'https://placehold.co/300x200'
    },
    {
        id: 12,
        name: 'Portable Generators',
        description: 'Compact portable generators for emergency power supply.',
        category: 'Power',
        image: 'https://placehold.co/300x200'
    },
    {
        id: 13,
        name: 'Portable Tents',
        description: 'Easy-to-assemble portable tents for emergency shelter.',
        category: 'Shelter',
        image: 'https://placehold.co/300x200'
    },
    {
        id: 14,
        name: 'Heavy-Duty Rain Gear',
        description: 'Waterproof jackets, pants, and ponchos for protection against harsh weather.',
        category: 'Clothing',
        image: 'https://placehold.co/300x200'
    },
    {
        id: 15,
        name: 'Complete Emergency Survival Kit',
        description: 'Comprehensive survival kit containing essential items including water, food rations, first aid supplies, emergency blankets, and basic tools.',
        category: 'Kits',
        image: 'https://placehold.co/300x200'
    },
    {
        id: 16,
        name: 'First Aid Kit',
        description: 'Professional-grade first aid kit with bandages, antiseptics, medical tools, and emergency medications.',
        category: 'Medical',
        image: 'https://placehold.co/300x200'
    }
];

let cart = [];

export function renderShopPage() {
    const content = `
        <div class="shop-container">
            <div class="shop-header">
                <h1>Emergency Disaster Products</h1>
                <p class="subtitle">Essential supplies for emergency preparedness</p>
            </div>
            <div class="products-grid">
                ${renderProducts(products)}
            </div>
        </div>
    `;

    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = content;

    // Initialize event listeners
    initializeShopEventListeners();
}

function renderProducts(productsToRender) {
    return productsToRender.map(product => `
        <div class="product-card">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="shop-buttons">
                <a href="#" class="amazon-btn" onclick="window.open('https://www.amazon.in/s?k=${encodeURIComponent(product.name)}', '_blank')">
                    <i class="fab fa-amazon"></i>
                    Amazon
                </a>
                <a href="#" class="flipkart-btn" onclick="window.open('https://www.flipkart.com/search?q=${encodeURIComponent(product.name)}', '_blank')">
                    <i class="fas fa-shopping-cart"></i>
                    Flipkart
                </a>
            </div>
        </div>
    `).join('');
}

function initializeShopEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-products');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
        document.getElementById('products-container').innerHTML = renderProducts(filteredProducts);
    });

    // Category filter
    const categorySelect = document.getElementById('category-select');
    categorySelect.addEventListener('change', (e) => {
        const category = e.target.value;
        const filteredProducts = category === 'all' 
            ? products 
            : products.filter(product => product.category === category);
        document.getElementById('products-container').innerHTML = renderProducts(filteredProducts);
    });

    // Add global functions for cart operations
    window.toggleCart = function() {
        const cartSidebar = document.getElementById('cart-sidebar');
        cartSidebar.classList.toggle('active');
    };

    window.addToCart = function(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCart();
        }
    };

    window.removeFromCart = function(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCart();
    };

    window.updateQuantity = function(productId, change) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, item.quantity + change);
            updateCart();
        }
    };

    window.checkout = function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Thank you for your order! This is a demo checkout.');
        cart = [];
        updateCart();
        toggleCart();
    };
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cart-total-amount');

    // Update cart count
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

    // Update cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
} 