/**
 * FLINT Store Architecture Data & State Module
 */
const FlintStore = {
    products: [
        {
            id: 'prod-1',
            title: 'Minimal Wool Overcoat',
            category: 'outerwear',
            price: 380,
            rating: 5,
            image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80',
            description: 'Architectural silhouette engineered from 100% heavy recycled wool with unlined interior bound seams.',
            colors: [
                { name: 'Charcoal', hex: '#2B2E36', img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80' },
                { name: 'Warm Sand', hex: '#D4A373', img: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80' }
            ]
        },
        {
            id: 'prod-2',
            title: 'Boxy Heavyweight Tee',
            category: 'tops',
            price: 85,
            rating: 5,
            image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
            description: '300 GSM organic Egyptian combed cotton tee with reinforced drop shoulder and double-needle collar.',
            colors: [
                { name: 'Off White', hex: '#F8F8F6', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' },
                { name: 'Pitch Black', hex: '#121316', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80' }
            ]
        },
        {
            id: 'prod-3',
            title: 'Fluid Wide Trousers',
            category: 'trousers',
            price: 210,
            rating: 4,
            image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80',
            description: 'Single-pleated wide-leg trouser cut from Italian virgin wool stretch blend with concealed side adjusters.',
            colors: [
                { name: 'Slate Gray', hex: '#3F444E', img: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80' }
            ]
        },
        {
            id: 'prod-4',
            title: 'Cashmere Ribbed Knit',
            category: 'tops',
            price: 290,
            rating: 5,
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
            description: 'Grade-A Mongolian cashmere 7-gauge knit featuring raglan sleeves and substantial ribbed cuffs.',
            colors: [
                { name: 'Oatmeal', hex: '#E6DFD5', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80' }
            ]
        }
    ],
    cart: [],
    
    // Add Item to Cart
    addToCart(productId, selectedSize = 'M') {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingIndex = this.cart.findIndex(item => item.id === productId && item.size === selectedSize);
        if (existingIndex > -1) {
            this.cart[existingIndex].quantity += 1;
        } else {
            this.cart.push({
                ...product,
                size: selectedSize,
                quantity: 1
            });
        }
        this.updateCartUI();
    },

    // Remove Item from Cart
    removeFromCart(productId, size) {
        this.cart = this.cart.filter(item => !(item.id === productId && item.size === size));
        this.updateCartUI();
    },

    // Adjust quantity
    updateQuantity(productId, size, change) {
        const item = this.cart.find(i => i.id === productId && i.size === size);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId, size);
            } else {
                this.updateCartUI();
            }
        }
    },

    // Calculate Subtotal
    getSubtotal() {
        return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    // Total Items Count
    getTotalCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    },

    // Update UI State
    updateCartUI() {
        const count = this.getTotalCount();
        const subtotal = this.getSubtotal();

        // Update Badges
        document.getElementById('cart-badge-count').textContent = count;
        document.getElementById('cart-count-title').textContent = `(${count})`;

        // Update Subtotal and Total
        document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('cart-total').textContent = `$${subtotal.toFixed(2)}`;

        // Update Free Shipping Progress Bar ($150 target)
        const freeShippingTarget = 150;
        const progress = Math.min((subtotal / freeShippingTarget) * 100, 100);
        document.getElementById('shipping-progress-bar').style.width = `${progress}%`;
        document.getElementById('shipping-progress-percent').textContent = `${Math.round(progress)}%`;

        const progressText = document.getElementById('shipping-progress-text');
        if (subtotal >= freeShippingTarget) {
            progressText.textContent = "🎉 You unlocked Free Express Shipping!";
            progressText.classList.add('text-flint-amber', 'font-bold');
        } else {
            const remaining = (freeShippingTarget - subtotal).toFixed(2);
            progressText.textContent = `Add $${remaining} for Free Express Shipping`;
            progressText.classList.remove('text-flint-amber', 'font-bold');
        }

        // Render Cart Items
        const container = document.getElementById('cart-items-container');
        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 text-zinc-500">
                    <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                    <p class="text-sm">Your shopping bag is empty.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.cart.map(item => `
            <div class="flex gap-4 p-3 bg-flint-charcoal/60 rounded-xl border border-white/5 items-center">
                <img src="${item.image}" alt="${item.title}" class="w-16 h-20 object-cover rounded-lg">
                <div class="flex-1 min-w-0">
                    <h4 class="text-xs font-semibold text-white truncate">${item.title}</h4>
                    <p class="text-[11px] text-zinc-400 font-mono mt-0.5">Size: ${item.size}</p>
                    <p class="text-xs font-mono text-flint-sand font-bold mt-1">$${item.price.toFixed(2)}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <button onclick="FlintStore.updateQuantity('${item.id}', '${item.size}', -1)" class="w-5 h-5 bg-flint-dark border border-white/10 rounded flex items-center justify-center text-xs text-white hover:border-flint-amber">-</button>
                        <span class="text-xs font-mono text-white px-1">${item.quantity}</span>
                        <button onclick="FlintStore.updateQuantity('${item.id}', '${item.size}', 1)" class="w-5 h-5 bg-flint-dark border border-white/10 rounded flex items-center justify-center text-xs text-white hover:border-flint-amber">+</button>
                    </div>
                </div>
                <button onclick="FlintStore.removeFromCart('${item.id}', '${item.size}')" aria-label="Remove item" class="text-zinc-500 hover:text-red-400 p-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            </div>
        `).join('');
    }
};

/**
 * Render Products in Grid
 */
function renderProducts(filter = 'all') {
    const grid = document.getElementById('product-grid');
    const items = filter === 'all' 
        ? FlintStore.products 
        : FlintStore.products.filter(p => p.category === filter);

    grid.innerHTML = items.map(product => `
        <div class="group bg-flint-dark rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-300 flex flex-col justify-between">
            <div class="relative h-80 overflow-hidden bg-flint-charcoal">
                <img id="img-${product.id}" src="${product.image}" alt="${product.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                
                <!-- Quick View Hover Overlay -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onclick="openQuickView('${product.id}')" class="px-4 py-2.5 bg-white/90 hover:bg-white text-flint-dark text-xs font-bold uppercase tracking-wider rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                        Quick View
                    </button>
                </div>
            </div>

            <div class="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <!-- Color Swatches -->
                    <div class="flex items-center gap-2 mb-3">
                        ${product.colors.map((color, idx) => `
                            <button 
                                onclick="changeProductColor('${product.id}', '${color.img}')"
                                aria-label="Color option ${color.name}"
                                class="w-3.5 h-3.5 rounded-full border border-white/20 hover:scale-125 transition-transform"
                                style="background-color: ${color.hex}">
                            </button>
                        `).join('')}
                    </div>

                    <span class="text-[10px] uppercase font-mono tracking-widest text-flint-amber">${product.category}</span>
                    <h3 class="font-display font-semibold text-white text-base mt-1 group-hover:text-flint-sand transition-colors">${product.title}</h3>
                </div>

                <div class="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span class="font-mono text-sm text-flint-sand font-bold">$${product.price.toFixed(2)}</span>
                    <button onclick="FlintStore.addToCart('${product.id}'); openCartDrawer();" class="px-3 py-1.5 bg-flint-charcoal hover:bg-flint-amber hover:text-flint-dark text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
                        <span>+ Add</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Swatches Handler
function changeProductColor(productId, imgUrl) {
    const imgEl = document.getElementById(`img-${productId}`);
    if (imgEl) imgEl.src = imgUrl;
}

// Cart Drawer Handlers
function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-drawer-backdrop');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    drawer.classList.remove('translate-x-full');
}

function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-drawer-backdrop');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    drawer.classList.add('translate-x-full');
}

// Quick View Modal
let activeQvProduct = null;
function openQuickView(productId) {
    const product = FlintStore.products.find(p => p.id === productId);
    if (!product) return;
    activeQvProduct = product;

    document.getElementById('qv-image').src = product.image;
    document.getElementById('qv-category').textContent = product.category;
    document.getElementById('qv-title').textContent = product.title;
    document.getElementById('qv-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('qv-description').textContent = product.description;

    const modal = document.getElementById('quickview-modal');
    const backdrop = document.getElementById('quickview-modal-backdrop');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.remove('scale-95');
}

function closeQuickView() {
    const modal = document.getElementById('quickview-modal');
    const backdrop = document.getElementById('quickview-modal-backdrop');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    modal.classList.add('scale-95');
}

// DOM Event Listeners Initializer
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    // Header Scroll Backdrop Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('bg-flint-dark/90', 'backdrop-blur-nav', 'border-white/10');
        } else {
            header.classList.remove('bg-flint-dark/90', 'backdrop-blur-nav', 'border-white/10');
        }
    });

    // Cart Triggers
    document.getElementById('cart-drawer-trigger').addEventListener('click', openCartDrawer);
    document.getElementById('cart-drawer-close').addEventListener('click', closeCartDrawer);
    document.getElementById('cart-drawer-backdrop').addEventListener('click', (e) => {
        if (e.target === document.getElementById('cart-drawer-backdrop')) closeCartDrawer();
    });

    // Quick View Close Trigger
    document.getElementById('quickview-close').addEventListener('click', closeQuickView);
    document.getElementById('quickview-modal-backdrop').addEventListener('click', (e) => {
        if (e.target === document.getElementById('quickview-modal-backdrop')) closeQuickView();
    });

    // Quick View Add To Cart
    document.getElementById('qv-add-to-cart').addEventListener('click', () => {
        if (activeQvProduct) {
            FlintStore.addToCart(activeQvProduct.id);
            closeQuickView();
            openCartDrawer();
        }
    });

    // Size Guide Trigger
    const sgBackdrop = document.getElementById('sizeguide-modal-backdrop');
    const openSg = () => sgBackdrop.classList.remove('opacity-0', 'pointer-events-none');
    const closeSg = () => sgBackdrop.classList.add('opacity-0', 'pointer-events-none');
    
    document.getElementById('trigger-size-guide').addEventListener('click', openSg);
    document.getElementById('qv-size-guide-trigger').addEventListener('click', openSg);
    document.getElementById('sizeguide-close').addEventListener('click', closeSg);

    // Filter Tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-tab').forEach(t => {
                t.classList.remove('active', 'bg-flint-slate', 'text-white');
                t.classList.add('text-zinc-400');
            });
            e.target.classList.add('active', 'bg-flint-slate', 'text-white');
            e.target.classList.remove('text-zinc-400');
            renderProducts(e.target.dataset.filter);
        });
    });

    // Mobile Menu Toggle
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    const mobileDrawer = document.getElementById('mobile-menu-drawer');
    const openMobileMenu = () => {
        mobileOverlay.classList.remove('opacity-0', 'pointer-events-none');
        mobileDrawer.classList.remove('-translate-x-full');
    };
    const closeMobileMenu = () => {
        mobileOverlay.classList.add('opacity-0', 'pointer-events-none');
        mobileDrawer.classList.add('-translate-x-full');
    };

    document.getElementById('mobile-menu-btn').addEventListener('click', openMobileMenu);
    document.getElementById('mobile-menu-close').addEventListener('click', closeMobileMenu);
    document.querySelectorAll('.mobile-nav-link').forEach(link => link.addEventListener('click', closeMobileMenu));

    // Newsletter Form Handler
    document.getElementById('newsletter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const feedback = document.getElementById('newsletter-feedback');
        feedback.textContent = "Thank you for subscribing. Check your inbox for your 10% welcome code.";
        feedback.classList.remove('hidden');
        document.getElementById('newsletter-email').value = '';
    });

    // Checkout Button Action
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (FlintStore.cart.length === 0) {
            alert('Your bag is currently empty.');
            return;
        }
        alert('Proceeding to secure checkout platform...');
    });
});