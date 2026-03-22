// =============================
// BHARAT MART - MAIN APP
// =============================

// ---- STATE ----
let currentFilter = { category: 'all', search: '', maxPrice: 50000 };
let currentDetailProduct = null;
let detailQty = 1;
let otpCode = '';
let otpContact = '';
let otpTimer = null;
let adminSessionRole = null;

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  applyPaymentToggle();
  setupAdminShortcut();
  
  // If user was logged in
  if (DB.currentUser) {
    enterStore();
  }
});

// ---- PARTICLES ----
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 20 + 15}s;
      animation-delay:${Math.random() * 10}s;
      opacity:${Math.random() * 0.4 + 0.1};
    `;
    container.appendChild(p);
  }
}

// ---- ADMIN SHORTCUT (CTRL+1) ----
function setupAdminShortcut() {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '1') {
      e.preventDefault();
      openAdminLogin();
    }
  });
}

// ========================
// AUTH SYSTEM
// ========================
function showAuth(mode) {
  if (mode === 'guest') {
    DB.currentUser = { id: 'guest', name: 'Guest', isGuest: true };
    enterStore();
    return;
  }
  document.getElementById('auth-modal').classList.remove('hidden');
  document.getElementById('auth-step-1').classList.remove('hidden');
  document.getElementById('auth-step-2').classList.add('hidden');
  document.getElementById('auth-step-3').classList.add('hidden');
}

function closeAuth() {
  document.getElementById('auth-modal').classList.add('hidden');
}

async function sendOTP() {
  const contact = document.getElementById('auth-contact').value.trim();
  if (!contact) { showOTPStatus('Please enter email or mobile number', 'error'); return; }
  
  // Validate
  const isEmail = contact.includes('@');
  const isMobile = /^[6-9]\d{9}$/.test(contact);
  if (!isEmail && !isMobile) { showOTPStatus('Please enter a valid email or 10-digit mobile number', 'error'); return; }

  otpContact = contact;
  otpCode = DB.generateOTP();
  
  // Show simulated OTP sending
  showOTPStatus('Sending OTP...', '');
  
  // Simulate API delay
  await delay(1200);
  
  // Simulate real OTP send (in production, use EmailJS/Firebase/Twilio)
  console.log(`[BharatMart OTP] Sending ${otpCode} to ${contact}`);
  
  // For demo: show OTP in status (in production REMOVE this)
  showOTPStatus(`✅ OTP sent! (Demo OTP: ${otpCode})`, 'success');
  
  // Actually try to send via email if it's an email (using a free service simulation)
  if (isEmail) {
    sendEmailOTP(contact, otpCode);
  }

  // Move to step 2
  setTimeout(() => {
    document.getElementById('auth-step-1').classList.add('hidden');
    document.getElementById('auth-step-2').classList.remove('hidden');
    document.getElementById('otp-sent-to').textContent = contact;
    startOTPTimer();
  }, 1500);
}

async function sendEmailOTP(email, otp) {
  // Use a real-time email API (EmailJS free tier simulation)
  try {
    const templateParams = {
      to_email: email,
      otp_code: otp,
      store_name: 'BharatMart'
    };
    // In production: emailjs.send('service_id', 'template_id', templateParams)
    console.log(`[Email OTP] Sending to ${email}: ${otp}`);
    
    // Fallback: Use mailto (demonstrates real intent)
    // For production integration, use EmailJS, SendGrid, or Firebase Auth
  } catch (err) {
    console.error('Email send failed:', err);
  }
}

function startOTPTimer() {
  let countdown = 60;
  document.getElementById('timer-count').textContent = countdown;
  document.getElementById('otp-timer').classList.remove('hidden');
  document.getElementById('resend-btn').classList.add('hidden');
  
  if (otpTimer) clearInterval(otpTimer);
  otpTimer = setInterval(() => {
    countdown--;
    document.getElementById('timer-count').textContent = countdown;
    if (countdown <= 0) {
      clearInterval(otpTimer);
      document.getElementById('otp-timer').classList.add('hidden');
      document.getElementById('resend-btn').classList.remove('hidden');
    }
  }, 1000);
}

function otpNext(input, index) {
  input.value = input.value.replace(/\D/g, '');
  if (input.value && index < 5) {
    document.querySelectorAll('.otp-digit')[index + 1].focus();
  }
}

function verifyOTP() {
  const digits = document.querySelectorAll('.otp-digit');
  const entered = Array.from(digits).map(d => d.value).join('');
  
  if (entered.length !== 6) { showToast('Please enter all 6 digits', 'error'); return; }
  
  if (entered === otpCode) {
    // Find or create user
    const user = DB.findOrCreateUser(otpContact);
    
    if (!user.name) {
      // New user — show registration step
      document.getElementById('auth-step-2').classList.add('hidden');
      document.getElementById('auth-step-3').classList.remove('hidden');
    } else {
      // Existing user — login
      loginUser(user);
    }
  } else {
    showToast('❌ Invalid OTP. Please try again.', 'error');
    document.querySelectorAll('.otp-digit').forEach(d => { d.value = ''; d.style.borderColor = '#DC2626'; });
  }
}

function completeRegistration() {
  const name = document.getElementById('reg-name').value.trim();
  const address = document.getElementById('reg-address').value.trim();
  
  if (!name) { showToast('Please enter your name', 'error'); return; }
  
  const user = DB.findOrCreateUser(otpContact);
  DB.updateUser(user.id, { name, address });
  user.name = name;
  user.address = address;
  
  loginUser(user);
}

function loginUser(user) {
  DB.currentUser = user;
  sessionStorage.setItem('bm_current_user', JSON.stringify(user));
  closeAuth();
  showToast(`🙏 Welcome, ${user.name || 'User'}!`, 'success');
  enterStore();
}

function backToStep1() {
  document.getElementById('auth-step-2').classList.add('hidden');
  document.getElementById('auth-step-1').classList.remove('hidden');
  if (otpTimer) clearInterval(otpTimer);
}

function showOTPStatus(msg, type) {
  const el = document.getElementById('otp-status');
  el.textContent = msg;
  el.className = 'otp-status ' + type;
}

function logout() {
  DB.currentUser = null;
  sessionStorage.removeItem('bm_current_user');
  showPage('landing-page');
  showToast('Logged out successfully');
}

// ========================
// STORE
// ========================
function enterStore() {
  showPage('store-page');
  const user = DB.currentUser;
  if (user) {
    document.getElementById('user-greeting').textContent = `Hello, ${user.name || 'User'}`;
  }
  renderProducts();
  updateCartCount();
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
  const page = document.getElementById(pageId);
  if (page) { page.style.display = 'block'; page.classList.add('active'); }
}

// ---- PRODUCTS ----
function renderProducts(filter) {
  const f = filter || currentFilter;
  const products = DB.getProducts(f);
  const sort = document.getElementById('sort-select')?.value || 'default';
  
  let sorted = [...products];
  if (sort === 'price-low') sorted.sort((a,b) => a.price - b.price);
  else if (sort === 'price-high') sorted.sort((a,b) => b.price - a.price);
  else if (sort === 'rating') sorted.sort((a,b) => b.rating - a.rating);
  
  const grid = document.getElementById('product-grid');
  const noProds = document.getElementById('no-products');
  
  if (!sorted.length) {
    grid.innerHTML = '';
    noProds.classList.remove('hidden');
    return;
  }
  noProds.classList.add('hidden');
  
  grid.innerHTML = sorted.map(p => `
    <div class="product-card" onclick="openDetail(${p.id})">
      <div class="product-image">
        <span>${p.emoji}</span>
        ${p.discount ? `<div class="product-badge">${p.discount}% OFF</div>` : ''}
        <button class="product-wishlist" onclick="event.stopPropagation();toggleWishlistItem(${p.id})">${DB.wishlist.includes(p.id) ? '❤️' : '🤍'}</button>
      </div>
      <div class="product-info">
        <div class="product-state">📍 ${p.state}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-rating">⭐⭐⭐⭐⭐ <span>${p.rating} (${p.reviews.toLocaleString('en-IN')})</span></div>
        <div class="product-price">
          <span class="price-main">₹${p.price.toLocaleString('en-IN')}</span>
          ${p.origPrice > p.price ? `<span class="price-orig">₹${p.origPrice.toLocaleString('en-IN')}</span>` : ''}
          ${p.discount ? `<span class="price-disc">${p.discount}% off</span>` : ''}
        </div>
        ${p.qty < 20 ? `<div style="color:#DC2626;font-size:0.75rem;margin-bottom:8px">⚡ Only ${p.qty} left!</div>` : ''}
        <div class="product-actions">
          <button class="btn-add-cart" onclick="event.stopPropagation();addToCart(${p.id})">Add to Cart</button>
          <button class="btn-buy-now" onclick="event.stopPropagation();buyNow(${p.id})">Buy Now</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterCategory(cat) {
  currentFilter.category = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  
  const title = cat === 'all' ? '🔥 All Products' : `${getCatEmoji(cat)} ${cat}`;
  document.getElementById('section-title').textContent = title;
  renderProducts();
}

function getCatEmoji(cat) {
  const map = { Agriculture:'🌾', Fashion:'🧥', Electronics:'📱', Handicrafts:'🏺', Ayurveda:'🌿', 'Food & Spices':'🍛', Jewellery:'💎', 'Home & Living':'🏠', Books:'📚', Wellness:'🧘', 'Music & Arts':'🎵', 'Auto Parts':'🚗' };
  return map[cat] || '📦';
}

function searchProducts() {
  currentFilter.search = document.getElementById('search-input').value;
  renderProducts();
}

function applyFilters() {
  currentFilter.maxPrice = parseInt(document.getElementById('price-filter').value);
  document.getElementById('price-display').textContent = currentFilter.maxPrice;
  const ratingChecks = document.querySelectorAll('.rating-filters input:checked');
  currentFilter.minRating = ratingChecks.length ? Math.max(...Array.from(ratingChecks).map(c => parseFloat(c.value))) : 0;
  currentFilter.state = document.getElementById('state-filter').value;
  renderProducts();
}

function sortProducts() { renderProducts(); }
function clearFilters() {
  currentFilter = { category: 'all', search: '', maxPrice: 50000 };
  document.getElementById('price-filter').value = 50000;
  document.getElementById('price-display').textContent = '50000';
  document.getElementById('state-filter').value = '';
  document.querySelectorAll('.rating-filters input').forEach(c => c.checked = false);
  renderProducts();
}

// ---- PRODUCT DETAIL ----
function openDetail(id) {
  currentDetailProduct = DB.products.find(p => p.id === id);
  detailQty = 1;
  if (!currentDetailProduct) return;
  
  const p = currentDetailProduct;
  const isWished = DB.wishlist.includes(p.id);
  
  document.getElementById('product-detail-content').innerHTML = `
    <div class="product-detail-layout">
      <div>
        <div class="detail-image-main">${p.emoji}</div>
        <div style="display:flex;gap:8px;margin-top:12px">
          ${[1,2,3,4].map(() => `<div style="width:70px;height:70px;border:2px solid #E5E7EB;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:pointer">${p.emoji}</div>`).join('')}
        </div>
      </div>
      <div class="detail-info">
        <div class="detail-category">${getCatEmoji(p.category)} ${p.category}</div>
        <h1 class="detail-name">${p.name}</h1>
        <div class="detail-rating">
          <span class="stars">⭐⭐⭐⭐⭐</span>
          <span>${p.rating}</span>
          <span class="review-count">${p.reviews.toLocaleString('en-IN')} reviews</span>
        </div>
        <div class="detail-price-wrap">
          <span class="detail-price">₹${p.price.toLocaleString('en-IN')}</span>
          ${p.origPrice > p.price ? `<span class="detail-orig">₹${p.origPrice.toLocaleString('en-IN')}</span>` : ''}
          ${p.discount ? `<span class="detail-disc">${p.discount}% off</span>` : ''}
        </div>
        <div class="detail-badges">
          <span class="detail-badge badge-free">🚚 Free Delivery</span>
          <span class="detail-badge badge-return">↩️ 7-day Return</span>
          <span class="detail-badge badge-fresh">✅ Authentic</span>
        </div>
        <p class="detail-desc">${p.desc}</p>
        <div class="qty-control">
          <label>Quantity:</label>
          <button class="qty-btn" onclick="changeDetailQty(-1)">−</button>
          <span class="qty-num" id="detail-qty">${detailQty}</span>
          <button class="qty-btn" onclick="changeDetailQty(1)">+</button>
          <span style="color:var(--gray-400);font-size:0.85rem">${p.qty} in stock</span>
        </div>
        <div class="detail-actions">
          <button class="btn-outline btn-lg" onclick="wishlistAndToggle(${p.id})">${isWished ? '❤️ Wishlisted' : '🤍 Wishlist'}</button>
          <button class="btn-outline btn-lg" onclick="addDetailToCart()">🛒 Add to Cart</button>
          <button class="btn-primary btn-lg" onclick="buyDetailNow()">⚡ Buy Now</button>
        </div>
        <div class="product-meta">
          <div class="meta-row"><span class="meta-label">State of Origin</span><span class="meta-value">📍 ${p.state}</span></div>
          <div class="meta-row"><span class="meta-label">Category</span><span class="meta-value">${p.category}</span></div>
          <div class="meta-row"><span class="meta-label">In Stock</span><span class="meta-value" style="color:var(--green)">${p.qty > 0 ? '✅ ' + p.qty + ' units' : '❌ Out of Stock'}</span></div>
          <div class="meta-row"><span class="meta-label">Tags</span><span class="meta-value">${p.tags}</span></div>
          <div class="meta-row"><span class="meta-label">Delivery</span><span class="meta-value">🚚 Express 2-4 hours</span></div>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('detail-cart-count').textContent = DB.cart.reduce((s,i) => s+i.qty, 0);
  showPage('product-detail');
}

function closeDetail() {
  showPage('store-page');
}

function changeDetailQty(delta) {
  const p = currentDetailProduct;
  detailQty = Math.max(1, Math.min(p.qty, detailQty + delta));
  document.getElementById('detail-qty').textContent = detailQty;
}

function addDetailToCart() {
  if (currentDetailProduct) {
    DB.addToCart(currentDetailProduct, detailQty);
    updateCartCount();
    showToast(`🛒 ${currentDetailProduct.name} added to cart!`, 'success');
    document.getElementById('detail-cart-count').textContent = DB.cart.reduce((s,i) => s+i.qty, 0);
  }
}

function buyDetailNow() {
  addDetailToCart();
  closeDetail();
  setTimeout(() => { openCart(); setTimeout(() => { closeCart(); checkout(); }, 300); }, 300);
}

// ---- CART ----
function addToCart(id) {
  const product = DB.products.find(p => p.id === id);
  if (!product) return;
  DB.addToCart(product);
  updateCartCount();
  showToast(`🛒 ${product.name} added!`, 'success');
}

function buyNow(id) {
  addToCart(id);
  openCart();
}

function updateCartCount() {
  const count = DB.cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cart-count').textContent = count;
}

function openCart() {
  renderCart();
  document.getElementById('cart-drawer').classList.remove('hidden');
}

function closeCart() {
  document.getElementById('cart-drawer').classList.add('hidden');
}

function renderCart() {
  const items = DB.cart;
  const container = document.getElementById('cart-items');
  
  if (!items.length) {
    container.innerHTML = `<div class="empty-cart"><span>🛒</span><p>Your cart is empty</p><button class="btn-primary" onclick="closeCart()">Start Shopping</button></div>`;
    document.getElementById('cart-total-amount').textContent = '₹0';
    return;
  }
  
  container.innerHTML = items.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString('en-IN')}</div>
        <div class="cart-item-controls">
          <button class="cart-qty-btn" onclick="updateCart(${item.id}, ${item.qty - 1})">−</button>
          <span>${item.qty}</span>
          <button class="cart-qty-btn" onclick="updateCart(${item.id}, ${item.qty + 1})">+</button>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑️ Remove</button>
        </div>
      </div>
    </div>
  `).join('');
  
  const total = DB.getCartTotal();
  document.getElementById('cart-total-amount').textContent = `₹${total.toLocaleString('en-IN')}`;
  
  const freeAbove = DB.settings.freeDeliveryAbove || 499;
  const progress = Math.min((total / freeAbove) * 100, 100);
  document.getElementById('free-delivery-progress').style.width = progress + '%';
}

function updateCart(id, qty) {
  DB.updateCartQty(id, qty);
  updateCartCount();
  renderCart();
}

function removeFromCart(id) {
  DB.removeFromCart(id);
  updateCartCount();
  renderCart();
}

// ---- CHECKOUT ----
function checkout() {
  if (!DB.cart.length) { showToast('Your cart is empty!', 'error'); return; }
  renderCheckout();
  showPage('checkout-page');
}

function renderCheckout() {
  const items = DB.cart;
  const total = DB.getCartTotal();
  
  // Pre-fill user data
  const user = DB.currentUser;
  if (user) {
    document.getElementById('del-name').value = user.name || '';
    document.getElementById('del-mobile').value = user.mobile || user.contact || '';
    document.getElementById('del-address').value = user.address || '';
  }
  
  document.getElementById('checkout-items').innerHTML = items.map(i => `
    <div class="checkout-item">
      <span>${i.emoji} ${i.name} ×${i.qty}</span>
      <span>₹${(i.price * i.qty).toLocaleString('en-IN')}</span>
    </div>
  `).join('');
  
  document.getElementById('subtotal').textContent = `₹${total.toLocaleString('en-IN')}`;
  document.getElementById('final-total').textContent = `₹${total.toLocaleString('en-IN')}`;
}

function closeCheckout() { openCart(); }

function applyPaymentToggle() {
  document.addEventListener('change', (e) => {
    if (e.target.name === 'payment') {
      const upiSection = document.getElementById('upi-section');
      if (upiSection) {
        upiSection.style.display = e.target.value === 'upi' ? 'block' : 'none';
      }
    }
  });
}

function selectUPI(app) {
  document.querySelectorAll('.upi-app').forEach(a => a.classList.remove('selected'));
  event.target.closest('.upi-app').classList.add('selected');
}

function placeOrder() {
  const name = document.getElementById('del-name').value.trim();
  const mobile = document.getElementById('del-mobile').value.trim();
  const address = document.getElementById('del-address').value.trim();
  const payment = document.querySelector('[name="payment"]:checked')?.value;
  
  if (!name || !mobile || !address) { showToast('Please fill all delivery details', 'error'); return; }
  
  const order = DB.addOrder({
    userName: name,
    userMobile: mobile,
    address,
    paymentMethod: payment,
    items: [...DB.cart],
    total: DB.getCartTotal(),
    userId: DB.currentUser?.id,
    deliveryBoyId: null
  });
  
  // Update user order count
  if (DB.currentUser && DB.currentUser.id !== 'guest') {
    DB.updateUser(DB.currentUser.id, { orderCount: (DB.currentUser.orderCount || 0) + 1 });
  }
  
  // Update product quantities
  DB.cart.forEach(item => {
    const prod = DB.products.find(p => p.id === item.id);
    if (prod) DB.updateProduct(prod.id, { qty: Math.max(0, prod.qty - item.qty) });
  });
  
  DB.clearCart();
  updateCartCount();
  
  // Show success
  document.getElementById('success-order-id').textContent = order.id;
  showPage('landing-page'); // temp
  document.getElementById('order-success').classList.remove('hidden');
}

function closeSuccess() {
  document.getElementById('order-success').classList.add('hidden');
  enterStore();
}

// ---- ORDERS ----
function showOrders() {
  renderOrders();
  showPage('orders-page');
}

function closeOrders() { enterStore(); }

function renderOrders() {
  const user = DB.currentUser;
  const orders = user && user.id !== 'guest'
    ? DB.orders.filter(o => o.userId === user.id)
    : [];
  
  const container = document.getElementById('orders-list');
  if (!orders.length) {
    container.innerHTML = `<div style="text-align:center;padding:60px;color:var(--gray-400)"><span style="font-size:3rem">📦</span><p style="margin-top:12px">No orders yet. Start shopping!</p></div>`;
    return;
  }
  
  container.innerHTML = orders.map(o => `
    <div class="order-card">
      <div class="order-card-header">
        <div class="order-id">${o.id}</div>
        <span class="order-status ${getStatusClass(o.status)}">${o.status}</span>
      </div>
      <div style="font-size:0.9rem;color:var(--gray-600);margin-bottom:8px">
        ${o.items?.map(i => `${i.emoji} ${i.name} ×${i.qty}`).join(' • ')}
      </div>
      <div style="display:flex;justify-content:space-between;font-size:0.85rem">
        <span>📅 ${new Date(o.createdAt).toLocaleDateString('en-IN', {day:'numeric',month:'short',year:'numeric'})}</span>
        <span style="font-weight:700;color:var(--saffron)">₹${o.total?.toLocaleString('en-IN')}</span>
      </div>
      <div style="margin-top:12px">
        <div class="tracking-steps">
          ${['Confirmed','Processing','Out for Delivery','Delivered'].map(s => `
            <div class="track-step ${isStatusReached(o.status, s) ? 'active' : ''}">${s}</div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

function getStatusClass(status) {
  const map = { 'Confirmed':'status-confirmed', 'Processing':'status-processing', 'Out for Delivery':'status-out', 'Delivered':'status-delivered', 'Cancelled':'status-cancelled' };
  return map[status] || '';
}

function isStatusReached(current, check) {
  const order = ['Confirmed','Processing','Out for Delivery','Delivered'];
  return order.indexOf(current) >= order.indexOf(check);
}

// ---- WISHLIST ----
function toggleWishlistItem(id) {
  const idx = DB.wishlist.indexOf(id);
  if (idx >= 0) DB.wishlist.splice(idx, 1);
  else DB.wishlist.push(id);
  DB.save();
  renderProducts();
}

function wishlistAndToggle(id) {
  toggleWishlistItem(id);
  const isWished = DB.wishlist.includes(id);
  event.target.textContent = isWished ? '❤️ Wishlisted' : '🤍 Wishlist';
  showToast(isWished ? '❤️ Added to wishlist!' : 'Removed from wishlist');
}

function toggleWishlist() { showToast('❤️ Wishlist feature coming soon!'); }

function goHome() { enterStore(); }

// ========================
// ADMIN PANEL
// ========================
function openAdminLogin() {
  document.getElementById('admin-login-modal').classList.remove('hidden');
  document.getElementById('admin-username').focus();
}

function closeAdminLogin() {
  document.getElementById('admin-login-modal').classList.add('hidden');
}

function adminLogin() {
  const username = document.getElementById('admin-username').value.trim();
  const password = document.getElementById('admin-password').value;
  
  const member = DB.authenticateAdmin(username, password);
  if (member) {
    DB.adminUser = member;
    adminSessionRole = member.role;
    sessionStorage.setItem('bm_admin_user', JSON.stringify(member));
    closeAdminLogin();
    document.getElementById('admin-username').value = '';
    document.getElementById('admin-password').value = '';
    openAdminPanel(member);
  } else {
    const err = document.getElementById('admin-login-error');
    err.textContent = '❌ Invalid credentials. Try again.';
    err.classList.remove('hidden');
    setTimeout(() => err.classList.add('hidden'), 3000);
  }
}

function openAdminPanel(member) {
  const perms = DB.getPermissions(member.role);
  
  // Show/hide tabs based on RBAC
  if (!perms.manageDelivery) document.getElementById('tab-delivery').style.display = 'none';
  if (!perms.manageTeam) document.getElementById('tab-team').style.display = 'none';
  if (!perms.manageSettings) document.getElementById('tab-settings').style.display = 'none';
  
  document.getElementById('admin-role-display').textContent = member.role.toUpperCase();
  
  showPage('admin-panel');
  adminTab('dashboard');
}

function adminLogout() {
  DB.adminUser = null;
  adminSessionRole = null;
  sessionStorage.removeItem('bm_admin_user');
  if (DB.currentUser) enterStore();
  else showPage('landing-page');
}

function adminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => { t.classList.remove('active'); t.classList.add('hidden'); });
  document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
  
  const tabEl = document.getElementById('tab-' + tab);
  if (tabEl) { tabEl.classList.remove('hidden'); tabEl.classList.add('active'); }
  
  const navBtn = document.querySelector(`[data-tab="${tab}"]`);
  if (navBtn) navBtn.classList.add('active');
  
  // Render tab content
  const renders = {
    dashboard: renderDashboard,
    products: renderAdminProducts,
    orders: renderAdminOrders,
    users: renderAdminUsers,
    delivery: renderAdminDelivery,
    team: renderAdminTeam,
    spreadsheet: renderSpreadsheet,
    settings: () => {}
  };
  if (renders[tab]) renders[tab]();
}

// DASHBOARD
function renderDashboard() {
  document.getElementById('dash-orders').textContent = DB.orders.length;
  document.getElementById('dash-revenue').textContent = '₹' + DB.orders.reduce((s,o) => s + (o.total || 0), 0).toLocaleString('en-IN');
  document.getElementById('dash-users').textContent = DB.users.length;
  document.getElementById('dash-products').textContent = DB.products.length;
  
  // Recent orders
  const recent = DB.orders.slice(0, 5);
  document.getElementById('recent-orders-list').innerHTML = recent.map(o => `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--gray-100);font-size:0.9rem">
      <div>
        <span style="font-weight:700">${o.id}</span><br>
        <span style="color:var(--gray-400)">${o.userName}</span>
      </div>
      <div style="text-align:right">
        <span class="order-status ${getStatusClass(o.status)}" style="font-size:0.75rem">${o.status}</span><br>
        <span style="font-weight:700;color:var(--saffron)">₹${o.total?.toLocaleString('en-IN')}</span>
      </div>
    </div>
  `).join('') || '<p style="color:var(--gray-400)">No orders yet</p>';
  
  // Status chart
  const statuses = ['Confirmed','Processing','Out for Delivery','Delivered'];
  document.getElementById('order-status-chart').innerHTML = statuses.map(s => {
    const count = DB.orders.filter(o => o.status === s).length;
    const pct = DB.orders.length ? Math.round(count / DB.orders.length * 100) : 0;
    return `
      <div style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:4px">
          <span>${s}</span><span>${count}</span>
        </div>
        <div style="height:6px;background:var(--gray-100);border-radius:3px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:var(--saffron);border-radius:3px;transition:width 1s"></div>
        </div>
      </div>
    `;
  }).join('');
}

// ADMIN PRODUCTS
function renderAdminProducts() {
  const tbody = document.getElementById('products-tbody');
  const perms = DB.getPermissions(adminSessionRole);
  
  tbody.innerHTML = DB.products.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${p.emoji} ${p.name}</td>
      <td>${p.category}</td>
      <td>₹${p.price.toLocaleString('en-IN')}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          ${perms.addQuantity ? `<button class="cart-qty-btn" onclick="adminUpdateQty(${p.id},-1)">−</button>` : ''}
          <span>${p.qty}</span>
          ${perms.addQuantity ? `<button class="cart-qty-btn" onclick="adminUpdateQty(${p.id},1)">+</button>` : ''}
        </div>
      </td>
      <td>${p.state}</td>
      <td>⭐ ${p.rating}</td>
      <td class="action-btns">
        ${perms.manageProducts ? `<button class="btn-edit" onclick="editProduct(${p.id})">✏️ Edit</button>` : ''}
        ${perms.manageProducts ? `<button class="btn-delete" onclick="deleteProduct(${p.id})">🗑️</button>` : ''}
      </td>
    </tr>
  `).join('');
}

function adminUpdateQty(id, delta) {
  const product = DB.products.find(p => p.id === id);
  if (product) {
    const newQty = Math.max(0, product.qty + delta);
    DB.updateProduct(id, { qty: newQty });
    renderAdminProducts();
    showToast(`📦 Quantity updated to ${newQty}`);
  }
}

function openAddProduct() {
  document.getElementById('product-modal-title').textContent = 'Add New Product';
  document.getElementById('edit-product-id').value = '';
  ['prod-name','prod-price','prod-orig-price','prod-qty','prod-desc','prod-emoji','prod-tags'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('add-product-modal').classList.remove('hidden');
}

function closeAddProduct() {
  document.getElementById('add-product-modal').classList.add('hidden');
}

function editProduct(id) {
  const p = DB.products.find(p => p.id === id);
  if (!p) return;
  
  document.getElementById('product-modal-title').textContent = 'Edit Product';
  document.getElementById('edit-product-id').value = id;
  document.getElementById('prod-name').value = p.name;
  document.getElementById('prod-cat').value = p.category;
  document.getElementById('prod-price').value = p.price;
  document.getElementById('prod-orig-price').value = p.origPrice;
  document.getElementById('prod-qty').value = p.qty;
  document.getElementById('prod-state').value = p.state;
  document.getElementById('prod-desc').value = p.desc;
  document.getElementById('prod-emoji').value = p.emoji;
  document.getElementById('prod-tags').value = p.tags;
  document.getElementById('add-product-modal').classList.remove('hidden');
}

function saveProduct() {
  const editId = document.getElementById('edit-product-id').value;
  const product = {
    name: document.getElementById('prod-name').value,
    category: document.getElementById('prod-cat').value,
    price: parseInt(document.getElementById('prod-price').value),
    origPrice: parseInt(document.getElementById('prod-orig-price').value) || parseInt(document.getElementById('prod-price').value),
    qty: parseInt(document.getElementById('prod-qty').value) || 0,
    state: document.getElementById('prod-state').value,
    desc: document.getElementById('prod-desc').value,
    emoji: document.getElementById('prod-emoji').value || '📦',
    tags: document.getElementById('prod-tags').value
  };
  
  if (!product.name || !product.price) { showToast('Please fill required fields', 'error'); return; }
  
  if (editId) {
    DB.updateProduct(parseInt(editId), product);
    showToast('✅ Product updated!', 'success');
  } else {
    DB.addProduct(product);
    showToast('✅ Product added!', 'success');
  }
  
  closeAddProduct();
  renderAdminProducts();
}

function deleteProduct(id) {
  if (confirm('Delete this product?')) {
    DB.deleteProduct(id);
    renderAdminProducts();
    showToast('🗑️ Product deleted');
  }
}

// ADMIN ORDERS
function renderAdminOrders() {
  const perms = DB.getPermissions(adminSessionRole);
  const filterStatus = document.getElementById('order-status-filter')?.value || '';
  
  let orders = [...DB.orders];
  if (filterStatus) orders = orders.filter(o => o.status === filterStatus);
  
  document.getElementById('orders-tbody').innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.userName}<br><small style="color:var(--gray-400)">${o.userMobile}</small></td>
      <td>${o.items?.length || 0} items</td>
      <td>₹${o.total?.toLocaleString('en-IN')}</td>
      <td><span style="text-transform:uppercase;font-size:0.8rem">${o.paymentMethod}</span></td>
      <td><span class="status-badge ${getStatusClass(o.status)}">${o.status}</span></td>
      <td class="action-btns">
        ${perms.manageOrders ? `
          <select onchange="updateOrderStatus('${o.id}', this.value)" style="padding:4px;border-radius:6px;border:1px solid #E5E7EB;font-size:0.8rem">
            ${['Confirmed','Processing','Out for Delivery','Delivered','Cancelled'].map(s => `<option ${o.status===s?'selected':''}>${s}</option>`).join('')}
          </select>
        ` : o.status}
        <button class="btn-view" onclick="viewOrderDetails('${o.id}')">👁️</button>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--gray-400);padding:20px">No orders found</td></tr>';
}

function updateOrderStatus(orderId, status) {
  DB.updateOrderStatus(orderId, status);
  showToast(`✅ Order ${orderId} → ${status}`);
  renderAdminOrders();
}

function viewOrderDetails(orderId) {
  const order = DB.orders.find(o => o.id === orderId);
  if (!order) return;
  
  const details = `
Order ID: ${order.id}
Customer: ${order.userName}
Mobile: ${order.userMobile}
Address: ${order.address}
Payment: ${order.paymentMethod}
Status: ${order.status}
Items:
${order.items?.map(i => `  - ${i.emoji} ${i.name} x${i.qty} = ₹${(i.price*i.qty).toLocaleString('en-IN')}`).join('\n')}
Total: ₹${order.total?.toLocaleString('en-IN')}
Date: ${new Date(order.createdAt).toLocaleString('en-IN')}
  `;
  alert(details);
}

function filterOrders() { renderAdminOrders(); }

// ADMIN USERS
function renderAdminUsers() {
  document.getElementById('users-tbody').innerHTML = DB.users.map(u => `
    <tr>
      <td>${u.id}</td>
      <td>${u.name || '-'}</td>
      <td>${u.contact}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis">${u.address || '-'}</td>
      <td>${u.orderCount || 0}</td>
      <td>${new Date(u.joinedAt).toLocaleDateString('en-IN')}</td>
    </tr>
  `).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--gray-400);padding:20px">No users yet</td></tr>';
}

// ADMIN DELIVERY
function renderAdminDelivery() {
  const perms = DB.getPermissions(adminSessionRole);
  
  document.getElementById('delivery-tbody').innerHTML = DB.deliveryBoys.map(d => `
    <tr>
      <td>${d.id}</td>
      <td>${d.name}</td>
      <td>${d.mobile}</td>
      <td>${d.zone}</td>
      <td>${d.activeOrders}</td>
      <td><span class="status-badge ${d.status === 'Available' ? 'status-delivered' : 'status-out'}">${d.status}</span></td>
      <td class="action-btns">
        ${perms.manageDelivery ? `<button class="btn-delete" onclick="removeDeliveryBoy('${d.id}')">🗑️</button>` : ''}
      </td>
    </tr>
  `).join('') || '<tr><td colspan="7" style="text-align:center;color:var(--gray-400);padding:20px">No delivery boys yet</td></tr>';
  
  // Assign delivery section
  const unassigned = DB.orders.filter(o => !o.deliveryBoyId && o.status === 'Processing');
  document.getElementById('assign-delivery-section').innerHTML = unassigned.map(o => `
    <div class="assign-card">
      <div>
        <strong>${o.id}</strong>
        <div style="font-size:0.85rem;color:var(--gray-400)">${o.userName} — ${o.address?.substring(0,40)}...</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <select id="assign-${o.id}" style="padding:6px;border-radius:6px;border:1px solid #E5E7EB">
          <option value="">Select Delivery Boy</option>
          ${DB.deliveryBoys.filter(d => d.status === 'Available').map(d => `<option value="${d.id}">${d.name} (${d.zone})</option>`).join('')}
        </select>
        <button class="btn-primary btn-sm" onclick="assignDelivery('${o.id}')">Assign</button>
      </div>
    </div>
  `).join('') || '<p style="color:var(--gray-400);text-align:center">No orders pending assignment</p>';
}

function assignDelivery(orderId) {
  const boyId = document.getElementById('assign-' + orderId).value;
  if (!boyId) { showToast('Please select a delivery boy', 'error'); return; }
  
  DB.updateOrderStatus(orderId, 'Out for Delivery', boyId);
  const boy = DB.deliveryBoys.find(d => d.id === boyId);
  if (boy) { boy.activeOrders++; boy.status = 'Busy'; DB.save(); }
  
  showToast(`✅ Order assigned to ${boy?.name}!`, 'success');
  renderAdminDelivery();
}

function openAddDelivery() { document.getElementById('add-delivery-modal').classList.remove('hidden'); }
function closeAddDelivery() { document.getElementById('add-delivery-modal').classList.add('hidden'); }

function saveDeliveryBoy() {
  const boy = {
    name: document.getElementById('del-boy-name').value,
    mobile: document.getElementById('del-boy-mobile').value,
    zone: document.getElementById('del-boy-zone').value,
    vehicle: document.getElementById('del-boy-vehicle').value
  };
  if (!boy.name || !boy.mobile) { showToast('Please fill all fields', 'error'); return; }
  DB.addDeliveryBoy(boy);
  closeAddDelivery();
  renderAdminDelivery();
  showToast('✅ Delivery boy added!', 'success');
}

function removeDeliveryBoy(id) {
  if (confirm('Remove this delivery boy?')) {
    DB.deliveryBoys = DB.deliveryBoys.filter(d => d.id !== id);
    DB.save();
    renderAdminDelivery();
    showToast('Delivery boy removed');
  }
}

// ADMIN TEAM
function renderAdminTeam() {
  const admins = DB.team.filter(m => m.role === 'admin' || m.role === 'admin2');
  const leaders = DB.team.filter(m => m.role === 'leader');
  
  document.getElementById('admin-list').innerHTML = admins.map(m => `
    <div class="team-member">
      <div class="member-info">
        <div class="member-avatar">${m.name[0]}</div>
        <div>
          <div class="member-name">${m.name}</div>
          <div class="member-role">@${m.username} • ${m.role.toUpperCase()}</div>
        </div>
      </div>
      ${m.id > 2 ? `<button class="btn-delete" onclick="removeTeamMember(${m.id})">🗑️</button>` : '<span style="color:var(--green);font-size:0.75rem">● Active</span>'}
    </div>
  `).join('') || '<p style="color:var(--gray-400)">No admins</p>';
  
  document.getElementById('leader-list').innerHTML = leaders.map(m => `
    <div class="team-member">
      <div class="member-info">
        <div class="member-avatar" style="background:linear-gradient(135deg,var(--green),#0a6600)">${m.name[0]}</div>
        <div>
          <div class="member-name">${m.name}</div>
          <div class="member-role">@${m.username} • LEADER</div>
        </div>
      </div>
      <button class="btn-delete" onclick="removeTeamMember(${m.id})">🗑️</button>
    </div>
  `).join('') || '<p style="color:var(--gray-400)">No leaders</p>';
  
  renderRBAC();
}

function renderRBAC() {
  const roles = [
    { role: 'admin', label: '👑 Admin', cls: 'rbac-admin-header' },
    { role: 'admin2', label: '🔵 Admin 2', cls: 'rbac-admin2-header' },
    { role: 'leader', label: '🟢 Leader', cls: 'rbac-leader-header' },
    { role: 'delivery', label: '🛵 Delivery', cls: 'rbac-delivery-header' }
  ];
  
  const permLabels = {
    viewDashboard: 'View Dashboard', manageProducts: 'Manage Products',
    manageOrders: 'Manage Orders', manageUsers: 'View Users',
    manageDelivery: 'Manage Delivery', manageTeam: 'Manage Team',
    changePasswords: 'Change Passwords', manageSettings: 'Store Settings',
    viewSpreadsheet: 'View Spreadsheet', exportData: 'Export Data',
    addQuantity: 'Update Quantities'
  };
  
  document.getElementById('rbac-grid').innerHTML = roles.map(r => {
    const perms = DB.getPermissions(r.role);
    return `
      <div class="rbac-card">
        <div class="rbac-card-header ${r.cls}">${r.label}</div>
        ${Object.entries(permLabels).map(([k,v]) => `
          <div class="rbac-perm">
            <span class="${perms[k] ? 'perm-yes' : 'perm-no'}">${perms[k] ? '✅' : '❌'}</span>
            <span>${v}</span>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
}

function openAddAdmin() {
  document.getElementById('team-modal-title').textContent = 'Add Admin';
  document.getElementById('team-role').value = 'admin2';
  document.getElementById('add-team-modal').classList.remove('hidden');
}

function openAddLeader() {
  document.getElementById('team-modal-title').textContent = 'Add Leader';
  document.getElementById('team-role').value = 'leader';
  document.getElementById('add-team-modal').classList.remove('hidden');
}

function closeAddTeam() { document.getElementById('add-team-modal').classList.add('hidden'); }

function saveTeamMember() {
  const member = {
    name: document.getElementById('team-name').value,
    username: document.getElementById('team-username').value,
    password: document.getElementById('team-password').value,
    role: document.getElementById('team-role').value
  };
  if (!member.name || !member.username || !member.password) { showToast('Please fill all fields', 'error'); return; }
  if (DB.team.find(m => m.username === member.username)) { showToast('Username already exists!', 'error'); return; }
  
  DB.addTeamMember(member);
  closeAddTeam();
  renderAdminTeam();
  showToast(`✅ ${member.role.toUpperCase()} added!`, 'success');
}

function removeTeamMember(id) {
  if (confirm('Remove this team member?')) {
    DB.deleteTeamMember(id);
    renderAdminTeam();
    showToast('Team member removed');
  }
}

// SETTINGS
function changeAdminPass() {
  const username = document.getElementById('set-admin-user').value.trim();
  const newPass = document.getElementById('set-new-pass').value;
  const confirmPass = document.getElementById('set-confirm-pass').value;
  
  if (!username || !newPass) { showToast('Please fill all fields', 'error'); return; }
  if (newPass !== confirmPass) { showToast('Passwords do not match', 'error'); return; }
  if (newPass.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
  
  const result = DB.updateTeamPassword(username, newPass);
  if (result) showToast('✅ Password updated!', 'success');
  else showToast('User not found', 'error');
}

function saveSettings() {
  DB.settings.storeName = document.getElementById('set-store-name').value;
  DB.settings.deliveryFee = parseInt(document.getElementById('set-delivery-fee').value) || 0;
  DB.settings.minOrder = parseInt(document.getElementById('set-min-order').value) || 99;
  DB.save();
  showToast('✅ Settings saved!', 'success');
}

// SPREADSHEET
function renderSpreadsheet() {
  const preview = document.getElementById('spreadsheet-preview');
  const products = DB.products.slice(0, 10);
  
  preview.innerHTML = `
    <h3 style="margin-bottom:16px">📦 Products (Preview — first 10)</h3>
    <table class="admin-table" style="width:100%">
      <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Qty</th><th>State</th><th>Rating</th></tr></thead>
      <tbody>
        ${products.map(p => `
          <tr>
            <td>${p.id}</td><td>${p.emoji} ${p.name}</td><td>${p.category}</td>
            <td>₹${p.price}</td><td>${p.qty}</td><td>${p.state}</td><td>⭐ ${p.rating}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p style="color:var(--gray-400);margin-top:12px;font-size:0.85rem">Showing first 10 of ${DB.products.length} products. Export to view all.</p>
    
    <h3 style="margin-top:24px;margin-bottom:16px">📦 Orders (Preview — first 5)</h3>
    <table class="admin-table" style="width:100%">
      <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead>
      <tbody>
        ${DB.orders.slice(0,5).map(o => `
          <tr>
            <td>${o.id}</td><td>${o.userName}</td><td>₹${o.total?.toLocaleString('en-IN')}</td>
            <td>${o.paymentMethod}</td>
            <td><span class="status-badge ${getStatusClass(o.status)}">${o.status}</span></td>
            <td>${new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
          </tr>
        `).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--gray-400)">No orders</td></tr>'}
      </tbody>
    </table>
  `;
}

function exportToExcel(type) {
  try {
    DB.exportSheet(type);
    showToast('✅ Exported to Excel!', 'success');
  } catch (e) {
    showToast('Export failed: ' + e.message, 'error');
  }
}

function importFromExcel(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const wb = XLSX.read(e.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      showToast(`✅ Imported ${data.length} rows from ${wb.SheetNames[0]}!`, 'success');
      renderSpreadsheet();
    } catch (err) {
      showToast('Import failed', 'error');
    }
  };
  reader.readAsBinaryString(file);
}

// ========================
// UTILITIES
// ========================
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast ' + type;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// Handle Enter key in admin login
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const adminModal = document.getElementById('admin-login-modal');
    if (adminModal && !adminModal.classList.contains('hidden')) {
      adminLogin();
    }
  }
});
