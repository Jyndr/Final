const products = [
    {
        name: "Complete Emergency Survival Kit",
        description: "Comprehensive survival kit containing essential items including water, food rations, first aid supplies, emergency blankets, and basic tools.",
        amazonLink: "https://www.amazon.com/s?k=complete+emergency+survival+kit",
        flipkartLink: "https://www.flipkart.com/search?q=complete+emergency+survival+kit"
    },
    {
        name: "First Aid Kit",
        description: "Professional-grade first aid kit with bandages, antiseptics, medical tools, and emergency medications.",
        amazonLink: "https://www.amazon.com/s?k=first+aid+kit+emergency",
        flipkartLink: "https://www.flipkart.com/search?q=first+aid+kit+emergency"
    },
    {
        name: "Personal Emergency Kit",
        description: "Compact personal emergency kit with essential survival items for one person.",
        amazonLink: "https://www.amazon.com/s?k=personal+emergency+kit",
        flipkartLink: "https://www.flipkart.com/search?q=personal+emergency+kit"
    },
    {
        name: "Water Purification Systems",
        description: "Portable water filters and purification tablets for safe drinking water in emergencies.",
        amazonLink: "https://www.amazon.com/s?k=water+purification+system+emergency",
        flipkartLink: "https://www.flipkart.com/search?q=water+purification+system+emergency"
    },
    {
        name: "Portable Solar Power Bank",
        description: "High-capacity solar-powered power bank for charging devices during emergencies.",
        amazonLink: "https://www.amazon.com/s?k=solar+power+bank+emergency",
        flipkartLink: "https://www.flipkart.com/search?q=solar+power+bank+emergency"
    },
    {
        name: "Emergency Blankets",
        description: "Mylar thermal emergency blankets for maintaining body heat in cold conditions.",
        amazonLink: "https://www.amazon.com/s?k=emergency+blanket+mylar",
        flipkartLink: "https://www.flipkart.com/search?q=emergency+blanket+mylar"
    },
    {
        name: "LED Flashlights",
        description: "Bright LED flashlights with extra batteries or rechargeable options.",
        amazonLink: "https://www.amazon.com/s?k=led+flashlight+emergency",
        flipkartLink: "https://www.flipkart.com/search?q=led+flashlight+emergency"
    },
    {
        name: "Solar-Powered Lanterns",
        description: "Portable solar-powered lanterns for emergency lighting.",
        amazonLink: "https://www.amazon.com/s?k=solar+lantern+emergency",
        flipkartLink: "https://www.flipkart.com/search?q=solar+lantern+emergency"
    },
    {
        name: "Battery-Powered Light Sticks",
        description: "Long-lasting battery-powered light sticks for emergency lighting.",
        amazonLink: "https://www.amazon.com/s?k=battery+powered+light+sticks",
        flipkartLink: "https://www.flipkart.com/search?q=battery+powered+light+sticks"
    },
    {
        name: "Portable Generators",
        description: "Compact portable generators for emergency power supply.",
        amazonLink: "https://www.amazon.com/s?k=portable+generator+emergency",
        flipkartLink: "https://www.flipkart.com/search?q=portable+generator+emergency"
    },
    {
        name: "Portable Tents",
        description: "Easy-to-assemble portable tents for emergency shelter.",
        amazonLink: "https://www.amazon.com/s?k=portable+tent+emergency",
        flipkartLink: "https://www.flipkart.com/search?q=portable+tent+emergency"
    },
    {
        name: "Heavy-Duty Rain Gear",
        description: "Waterproof jackets, pants, and ponchos for protection against harsh weather.",
        amazonLink: "https://www.amazon.com/s?k=heavy+duty+rain+gear",
        flipkartLink: "https://www.flipkart.com/search?q=heavy+duty+rain+gear"
    },
    {
        name: "Fire Blankets",
        description: "Fire-resistant emergency blankets for fire safety.",
        amazonLink: "https://www.amazon.com/s?k=fire+blanket+emergency",
        flipkartLink: "https://www.flipkart.com/search?q=fire+blanket+emergency"
    },
    {
        name: "Camping Tarps",
        description: "Durable camping tarps for emergency shelter and protection.",
        amazonLink: "https://www.amazon.com/s?k=camping+tarp+emergency",
        flipkartLink: "https://www.flipkart.com/search?q=camping+tarp+emergency"
    },
    {
        name: "Sleeping Bags",
        description: "Compact, insulated, and durable sleeping bags for emergency situations.",
        amazonLink: "https://www.amazon.com/s?k=emergency+sleeping+bag",
        flipkartLink: "https://www.flipkart.com/search?q=emergency+sleeping+bag"
    },
    {
        name: "Foam Sleeping Pads",
        description: "Lightweight foam sleeping pads for comfortable emergency sleeping.",
        amazonLink: "https://www.amazon.com/s?k=foam+sleeping+pad+emergency",
        flipkartLink: "https://www.flipkart.com/search?q=foam+sleeping+pad+emergency"
    },
    {
        name: "Inflatable Mattress",
        description: "Portable inflatable mattress for emergency sleeping arrangements.",
        amazonLink: "https://www.amazon.com/s?k=inflatable+mattress+emergency",
        flipkartLink: "https://www.flipkart.com/search?q=inflatable+mattress+emergency"
    },
    {
        name: "Emergency Sleeping Bags",
        description: "Compact and warm emergency sleeping bags for survival situations.",
        amazonLink: "https://www.amazon.com/s?k=emergency+sleeping+bag+compact",
        flipkartLink: "https://www.flipkart.com/search?q=emergency+sleeping+bag+compact"
    }
];

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <div class="product-links">
            <a href="${product.amazonLink}" target="_blank" class="amazon-link">
                <i class="fab fa-amazon"></i> Amazon
            </a>
            <a href="${product.flipkartLink}" target="_blank" class="flipkart-link">
                <i class="fas fa-shopping-cart"></i> Flipkart
            </a>
        </div>
    `;
    
    return card;
}

function initializeProductGrid() {
    const productGrid = document.querySelector('.product-grid');
    products.forEach(product => {
        const card = createProductCard(product);
        productGrid.appendChild(card);
    });
}

// Initialize the product grid when the page loads
document.addEventListener('DOMContentLoaded', initializeProductGrid); 