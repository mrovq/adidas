/**
 * adidas OUTLET - Shopping Cart, Wishlist & Product System
 * Developed by MzRofiqiAz
 */

// 1. Inisialisasi Data & Elemen
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
const noWA = "6283134464664"; // GANTI NOMOR WHATSAPP KAMU

// Data produk (ditambahkan lebih banyak untuk pengembangan)
const products = [
  { id: 1, name: "Adidas Ultra 5 Strung", category: "sepatu", price: 4700000, originalPrice: 5500000, image: "img/menu/1.jpg", description: "Sepatu basket premium dengan teknologi terdepan untuk performa maksimal." },
  { id: 2, name: "Adidas Duramo SL 2", category: "sepatu", price: 900000, originalPrice: 1200000, image: "img/menu/2.jpg", description: "Sepatu running ringan dan nyaman untuk aktivitas sehari-hari." },
  { id: 3, name: "Adidas Galaxy 7", category: "sepatu", price: 900000, originalPrice: 1100000, image: "img/menu/3.jpg", description: "Sepatu lifestyle dengan desain modern dan bahan berkualitas." },
  { id: 4, name: "Adidas T-Shirt Classic", category: "pakaian", price: 300000, originalPrice: 400000, image: "img/menu/12.jpeg", description: "Kaos klasik Adidas dengan bahan katun yang breathable." },
  { id: 5, name: "Adidas Hoodie", category: "pakaian", price: 600000, originalPrice: 800000, image: "img/menu/9.jpeg", description: "Hoodie hangat untuk gaya kasual dan olahraga." },
  { id: 6, name: "Adidas Shorts", category: "pakaian", price: 250000, originalPrice: 350000, image: "img/menu/10.jpeg", description: "Celana pendek ringan untuk latihan intensif." },
  { id: 7, name: "Adidas Backpack", category: "aksesoris", price: 400000, originalPrice: 500000, image: "img/menu/7.jpeg", description: "Tas ransel multifungsi dengan kapasitas besar." },
  { id: 8, name: "Adidas Cap", category: "aksesoris", price: 150000, originalPrice: 200000, image: "img/menu/8.jpeg", description: "Topi baseball Adidas untuk melengkapi gaya Anda." },
  { id: 9, name: "Adidas Socks Pack", category: "aksesoris", price: 100000, originalPrice: 150000, image: "img/menu/11.jpeg", description: "Paket kaos kaki Adidas dengan desain ergonomis." }
];

const cartSidebar = document.querySelector('.shopping-cart');
const wishlistSidebar = document.querySelector('.wishlist');
const cartContainer = document.querySelector('#cart-items-container');
const wishlistContainer = document.querySelector('#wishlist-items-container');
const totalPriceDisplay = document.querySelector('#total-price-display');
const cartBtn = document.querySelector('#shopping-cart-button');
const wishlistBtn = document.querySelector('#wishlist-button');
const closeCartBtn = document.querySelector('#close-cart');
const closeWishlistBtn = document.querySelector('#close-wishlist');
const checkoutBtn = document.querySelector('#checkout-whatsapp');
const searchBtn = document.querySelector('#search-button');
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');
const filterBtns = document.querySelectorAll('.filter-btn');
const productList = document.querySelector('#product-list');
const modal = document.querySelector('#product-modal');
const modalImage = document.querySelector('#modal-image');
const modalName = document.querySelector('#modal-name');
const modalDescription = document.querySelector('#modal-description');
const modalPrice = document.querySelector('#modal-price');
const modalOriginalPrice = document.querySelector('#modal-original-price');
const modalAddToCart = document.querySelector('#modal-add-to-cart');
const hamburgerMenu = document.querySelector('#hamburger-menu');
const navbarNav = document.querySelector('.navbar-nav');

// 2. Fungsi Render Produk
function renderProducts(filter = 'all', search = '') {
  productList.innerHTML = '';
  const filteredProducts = products.filter(product => {
    const matchesFilter = filter === 'all' || product.category === filter;
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  filteredProducts.forEach(product => {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    productList.innerHTML += `
      <div class="product-card" data-category="${product.category}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" onclick="openModal(${product.id})">
        </div>
        <div class="product-content">
          <h3>${product.name}</h3>
          <div class="product-price">IDR ${product.price.toLocaleString('id-ID')} <span>IDR ${product.originalPrice.toLocaleString('id-ID')}</span></div>
          <a class="add-to-cart-btn" data-id="${product.id}">
            <i data-feather="shopping-cart"></i> Tambah Keranjang
          </a>
          <a class="add-to-wishlist-btn ${isInWishlist ? 'active' : ''}" data-id="${product.id}">
            <i data-feather="heart"></i> ${isInWishlist ? 'Hapus Wishlist' : 'Tambah Wishlist'}
          </a>
        </div>
      </div>
    `;
  });
  feather.replace();
}

// 3. Fungsi Render Keranjang
function renderCart() {
  if (cart.length === 0) {
    cartContainer.innerHTML = '<p style="text-align:center; color:#333; margin-top:2rem;">Keranjang masih kosong</p>';
    totalPriceDisplay.innerText = 'IDR 0';
    return;
  }

  cartContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    cartContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-detail">
          <h3>${item.name}</h3>
          <div class="item-price">${item.quantity} x IDR ${item.price.toLocaleString('id-ID')}</div>
          <div class="quantity-controls">
            <button onclick="changeQuantity(${index}, -1)">-</button>
            <span>${item.quantity}</span>
            <button onclick="changeQuantity(${index}, 1)">+</button>
          </div>
        </div>
        <i data-feather="trash-2" class="remove-item" onclick="removeItem(${index})"></i>
      </div>
    `;
  });

  totalPriceDisplay.innerText = `IDR ${total.toLocaleString('id-ID')}`;
  feather.replace();
  localStorage.setItem('cart', JSON.stringify(cart));
}

// 4. Fungsi Render Wishlist
function renderWishlist() {
  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = '<p style="text-align:center; color:#333; margin-top:2rem;">Wishlist masih kosong</p>';
    return;
  }

  wishlistContainer.innerHTML = '';
  wishlist.forEach((item, index) => {
    wishlistContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-detail">
          <h3>${item.name}</h3>
          <div class="item-price">IDR ${item.price.toLocaleString('id-ID')}</div>
        </div>
        <i data-feather="trash-2" class="remove-item" onclick="removeWishlistItem(${index})"></i>
      </div>
    `;
  });
  feather.replace();
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// 5. Fungsi Tambah ke Keranjang
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  renderCart();
  showToast(`${product.name} berhasil ditambahkan ke keranjang!`);
}

// 6. Fungsi Tambah/Hapus Wishlist
function toggleWishlist(productId) {
  const product = products.find(p => p.id === productId);
  const index = wishlist.findIndex(item => item.id === productId);
  
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast(`${product.name} dihapus dari wishlist!`);
  } else {
    wishlist.push(product);
    showToast(`${product.name} ditambahkan ke wishlist!`);
  }
  
  renderWishlist();
  renderProducts(); // Update tombol wishlist di produk
}

// 7. Fungsi Ubah Quantity Keranjang
function changeQuantity(index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  renderCart();
}

// 8. Fungsi Hapus Item Keranjang
function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

// 9. Fungsi Hapus Item Wishlist
function removeWishlistItem(index) {
  wishlist.splice(index, 1);
  renderWishlist();
  renderProducts();
}

// 10. Fungsi Modal Detail Produk
function openModal(productId) {
  const product = products.find(p => p.id === productId);
  modalImage.src = product.image;
  modalName.textContent = product.name;
  modalDescription.textContent = product.description;
  modalPrice.textContent = product.price.toLocaleString('id-ID');
  modalOriginalPrice.textContent = `IDR ${product.originalPrice.toLocaleString('id-ID')}`;
  modalAddToCart.setAttribute('data-id', productId);
  modal.style.display = 'block';
}

// 11. Fungsi Tutup Modal
function closeModal() {
  modal.style.display = 'none';
}

// 12. Fungsi Toast Notification
function showToast(message) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.classList.add('toast');
  
  toast.innerHTML = `
    <i data-feather="check-circle"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  feather.replace();
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// 13. Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCart();
  renderWishlist();

  // Filter produk
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.getAttribute('data-filter'), searchBox.value);
    });
  });

  // Pencarian
  searchBox.addEventListener('input', () => {
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    renderProducts(activeFilter, searchBox.value);
  });

  // Tambah ke keranjang dari produk
  productList.addEventListener('click', (e) => {
    if (e.target.closest('.add-to-cart-btn')) {
      e.preventDefault();
      const productId = parseInt(e.target.closest('.add-to-cart-btn').getAttribute('data-id'));
      addToCart(productId);
    }
    if (e.target.closest('.add-to-wishlist-btn')) {
      e.preventDefault();
      const productId = parseInt(e.target.closest('.add-to-wishlist-btn').getAttribute('data-id'));
      toggleWishlist(productId);
    }
  });

  // Tambah ke keranjang dari modal
  modalAddToCart.addEventListener('click', () => {
    const productId = parseInt(modalAddToCart.getAttribute('data-id'));
    addToCart(productId);
    closeModal();
  });

  // Kontrol sidebar
  cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.toggle('active');
    wishlistSidebar.classList.remove('active');
  });

  wishlistBtn.addEventListener('click', (e) => {
    e.preventDefault();
    wishlistSidebar.classList.toggle('active');
    cartSidebar.classList.remove('active');
  });

  closeCartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    cartSidebar.classList.remove('active');
  });

  closeWishlistBtn.addEventListener('click', (e) => {
    e.preventDefault();
    wishlistSidebar.classList.remove('active');
  });

  // Search form
  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchForm.classList.toggle('active');
  });

  // Hamburger menu
  hamburgerMenu.addEventListener('click', (e) => {
    e.preventDefault();
    navbarNav.classList.toggle('active');
  });

  // Tutup modal
  document.querySelector('.close-modal').addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Tutup sidebar jika klik di luar
  document.addEventListener('click', (e) => {
    if (!cartBtn.contains(e.target) && !cartSidebar.contains(e.target)) {
      cartSidebar.classList.remove('active');
    }
    if (!wishlistBtn.contains(e.target) && !wishlistSidebar.contains(e.target)) {
      wishlistSidebar.classList.remove('active');
    }
  });

  // Checkout WhatsApp
  checkoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      alert('Keranjang anda masih kosong! Silakan pilih produk terlebih dahulu.');
      return;
    }
    
    let pesan = "Halo Admin *adidas OUTLET*, saya ingin memesan:\n\n";
    let totalBelanja = 0;

    cart.forEach((item, i) => {
      const subtotal = item.price * item.quantity;
      pesan += `*${i + 1}. ${item.name}*\n`;
      pesan += `   Jumlah: ${item.quantity} pcs\n`;
      pesan += `   Harga: IDR ${subtotal.toLocaleString('id-ID')}\n\n`;
      totalBelanja += subtotal;
    });

    pesan += `--------------------------\n`;
    pesan += `*Total Pembayaran: IDR ${totalBelanja.toLocaleString('id-ID')}*\n`;
    pesan += `--------------------------\n\n`;
    pesan += `Mohon dibantu untuk proses pembayaran dan pengiriman. Terima kasih!`;

    const whatsappURL = `https://wa.me/${noWA}?text=${encodeURIComponent(pesan)}`;
    window.open(whatsappURL, '_blank');
  });

  // Scroll reveal
  window.addEventListener('scroll', () => {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(r => {
      const windowHeight = window.innerHeight;
      const revealTop = r.getBoundingClientRect().top;
      if (revealTop < windowHeight - 150) {
        r.classList.add('active');
      }
    });
  });

  feather.replace();
});