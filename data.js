// =============================
// BHARAT MART - DATABASE (Spreadsheet-based)
// =============================

// ---- PRODUCT DATABASE ----
const defaultProducts = [
  // Agriculture
  { id: 1, name: "Basmati Rice Premium 5kg", category: "Agriculture", price: 599, origPrice: 799, qty: 250, state: "Punjab", emoji: "🌾", rating: 4.7, reviews: 1289, desc: "Aged premium basmati rice from the fields of Punjab. Long grain, aromatic, perfect for biryani.", tags: "rice, organic, basmati", discount: 25 },
  { id: 2, name: "Darjeeling First Flush Tea 500g", category: "Agriculture", price: 1299, origPrice: 1799, qty: 80, state: "West Bengal", emoji: "🍃", rating: 4.9, reviews: 876, desc: "The champagne of teas — hand-picked first flush from Darjeeling's finest gardens.", tags: "tea, darjeeling, organic", discount: 28 },
  { id: 3, name: "Cold-Pressed Mustard Oil 1L", category: "Agriculture", price: 299, origPrice: 399, qty: 320, state: "Rajasthan", emoji: "🫙", rating: 4.5, reviews: 2100, desc: "Traditional kachi ghani mustard oil. Zero chemical processing, maximum nutrition.", tags: "oil, mustard, kachi ghani", discount: 25 },
  { id: 4, name: "Organic Turmeric Powder 500g", category: "Agriculture", price: 199, origPrice: 349, qty: 500, state: "Tamil Nadu", emoji: "🟡", rating: 4.8, reviews: 3400, desc: "Naturally grown turmeric with high curcumin content. No additives, no preservatives.", tags: "haldi, organic, spice", discount: 43 },
  { id: 5, name: "Alphonso Mango (Dozen)", category: "Agriculture", price: 899, origPrice: 1299, qty: 60, state: "Maharashtra", emoji: "🥭", rating: 5.0, reviews: 5600, desc: "The king of mangoes — GI-tagged Ratnagiri Alphonso, soft, sweet, perfectly ripened.", tags: "mango, alphonso, fruit", discount: 31 },

  // Fashion
  { id: 6, name: "Handloom Khadi Kurta", category: "Fashion", price: 899, origPrice: 1499, qty: 120, state: "Gujarat", emoji: "👕", rating: 4.6, reviews: 567, desc: "Authentic handspun khadi kurta. Lightweight, breathable, crafted by local weavers.", tags: "khadi, kurta, handloom", discount: 40 },
  { id: 7, name: "Banarasi Silk Saree", category: "Fashion", price: 4999, origPrice: 8999, qty: 35, state: "Uttar Pradesh", emoji: "👘", rating: 4.8, reviews: 234, desc: "GI-tagged Banarasi silk saree with real zari work. A timeless heirloom piece.", tags: "saree, banarasi, silk", discount: 44 },
  { id: 8, name: "Rajasthani Mojari Shoes", category: "Fashion", price: 799, origPrice: 1299, qty: 90, state: "Rajasthan", emoji: "👡", rating: 4.4, reviews: 412, desc: "Hand-embroidered mojari crafted by Rajasthan's finest artisans. Genuine leather.", tags: "mojari, shoes, rajasthani", discount: 38 },
  { id: 9, name: "Phulkari Dupatta", category: "Fashion", price: 699, origPrice: 999, qty: 75, state: "Punjab", emoji: "🧣", rating: 4.7, reviews: 891, desc: "Vibrant hand-embroidered phulkari dupatta from Punjab. Each piece uniquely crafted.", tags: "phulkari, dupatta, punjabi", discount: 30 },

  // Electronics
  { id: 10, name: "Desi AI Speaker (BharatVaani)", category: "Electronics", price: 2499, origPrice: 3999, qty: 50, state: "Karnataka", emoji: "📱", rating: 4.3, reviews: 1567, desc: "India's own AI smart speaker. Speaks Hindi, Bengali, Tamil & more. Made in Bengaluru.", tags: "speaker, ai, made in india", discount: 38 },
  { id: 11, name: "Solar Lantern Portable", category: "Electronics", price: 599, origPrice: 999, qty: 200, state: "Gujarat", emoji: "🔦", rating: 4.6, reviews: 3400, desc: "Solar-powered portable lantern. 8 hrs battery, IP65 waterproof. Made for rural India.", tags: "solar, lantern, sustainable", discount: 40 },
  { id: 12, name: "Indian Gaming Keyboard RGB", category: "Electronics", price: 1999, origPrice: 3499, qty: 30, state: "Maharashtra", emoji: "⌨️", rating: 4.4, reviews: 789, desc: "Mechanical gaming keyboard with Indian language support. RGB backlit, Cherry MX keys.", tags: "keyboard, gaming, rgb", discount: 43 },

  // Handicrafts
  { id: 13, name: "Madhubani Painting (Original)", category: "Handicrafts", price: 2500, origPrice: 4000, qty: 15, state: "Bihar", emoji: "🎨", rating: 4.9, reviews: 156, desc: "Original Madhubani painting by certified Bihar artists. Certificate of authenticity included.", tags: "madhubani, art, original", discount: 38 },
  { id: 14, name: "Brass Ganesha Idol 8-inch", category: "Handicrafts", price: 1499, origPrice: 2499, qty: 40, state: "Rajasthan", emoji: "🪆", rating: 4.8, reviews: 892, desc: "Handcrafted pure brass Ganesha. Dhokra-inspired craft, antique gold finish.", tags: "ganesha, brass, idol", discount: 40 },
  { id: 15, name: "Kashmiri Pashmina Shawl", category: "Handicrafts", price: 3999, origPrice: 8999, qty: 20, state: "Jammu & Kashmir", emoji: "🧤", rating: 4.9, reviews: 312, desc: "GI-tagged pure Pashmina from Kashmir. 70g weight, 100% handwoven. The finest wool.", tags: "pashmina, kashmiri, shawl", discount: 56 },
  { id: 16, name: "Blue Pottery Vase Set", category: "Handicrafts", price: 1299, origPrice: 1999, qty: 55, state: "Rajasthan", emoji: "🏺", rating: 4.7, reviews: 678, desc: "Iconic Jaipur blue pottery, set of 3 vases. Handpainted, lead-free glazed finish.", tags: "blue pottery, jaipur, vase", discount: 35 },

  // Ayurveda
  { id: 17, name: "Ashwagandha Gold Capsules 60ct", category: "Ayurveda", price: 699, origPrice: 999, qty: 300, state: "Madhya Pradesh", emoji: "🌿", rating: 4.7, reviews: 4500, desc: "Pure KSM-66 ashwagandha root extract. Stress relief, energy & immunity. No fillers.", tags: "ashwagandha, ayurveda, supplement", discount: 30 },
  { id: 18, name: "Neem & Tulsi Face Wash 150ml", category: "Ayurveda", price: 299, origPrice: 499, qty: 400, state: "Kerala", emoji: "🧴", rating: 4.5, reviews: 2300, desc: "100% natural face wash with neem, tulsi and aloe vera. Suits all skin types.", tags: "neem, tulsi, skincare", discount: 40 },
  { id: 19, name: "Triphala Churna 250g", category: "Ayurveda", price: 199, origPrice: 299, qty: 500, state: "Rajasthan", emoji: "🌱", rating: 4.6, reviews: 1800, desc: "Ancient triphala blend for digestion and immunity. Certified organic, GMP compliant.", tags: "triphala, ayurveda, digestion", discount: 33 },
  { id: 20, name: "Coconut Oil Cold-Pressed 1L", category: "Ayurveda", price: 399, origPrice: 599, qty: 200, state: "Kerala", emoji: "🥥", rating: 4.8, reviews: 5600, desc: "Virgin cold-pressed coconut oil from Kerala. For hair, skin, cooking — multipurpose.", tags: "coconut oil, kerala, virgin", discount: 33 },

  // Food & Spices
  { id: 21, name: "Garam Masala Blend 200g", category: "Food & Spices", price: 249, origPrice: 399, qty: 600, state: "Rajasthan", emoji: "🌶️", rating: 4.8, reviews: 7800, desc: "16-spice secret blend garam masala. Stone-ground, no preservatives, chef-approved.", tags: "garam masala, spices, cooking", discount: 38 },
  { id: 22, name: "Himalayan Pink Salt 1kg", category: "Food & Spices", price: 299, origPrice: 499, qty: 400, state: "Himachal Pradesh", emoji: "🧂", rating: 4.6, reviews: 3200, desc: "Pure Himalayan pink rock salt. 84 minerals, unrefined, sustainably mined.", tags: "salt, himalayan, mineral", discount: 40 },
  { id: 23, name: "Wild Forest Honey 500g", category: "Food & Spices", price: 599, origPrice: 899, qty: 150, state: "Uttarakhand", emoji: "🍯", rating: 4.9, reviews: 2100, desc: "Raw wild forest honey from Uttarakhand. Unprocessed, unheated, NMR tested.", tags: "honey, wild, organic", discount: 33 },
  { id: 24, name: "Organic Jaggery Blocks 1kg", category: "Food & Spices", price: 199, origPrice: 299, qty: 500, state: "Maharashtra", emoji: "🫓", rating: 4.7, reviews: 4100, desc: "Traditional sugarcane jaggery. Chemical-free, mineral-rich. Made in Maharashtra.", tags: "jaggery, organic, sugar", discount: 33 },

  // Jewellery
  { id: 25, name: "Kundan Polki Necklace Set", category: "Jewellery", price: 3499, origPrice: 5999, qty: 25, state: "Rajasthan", emoji: "💎", rating: 4.8, reviews: 234, desc: "Handcrafted kundan polki necklace with earrings. 22K gold-plated, meenakari work.", tags: "kundan, necklace, jewellery", discount: 42 },
  { id: 26, name: "Temple Jewellery Bangles Set", category: "Jewellery", price: 1299, origPrice: 2499, qty: 60, state: "Tamil Nadu", emoji: "📿", rating: 4.7, reviews: 567, desc: "South Indian temple jewellery bangles. Gold-plated brass, antique finish, set of 4.", tags: "bangles, temple, south indian", discount: 48 },
  { id: 27, name: "Silver Oxidised Earrings", category: "Jewellery", price: 499, origPrice: 799, qty: 120, state: "Rajasthan", emoji: "🪙", rating: 4.6, reviews: 1234, desc: "Handmade oxidised silver earrings with traditional motifs. 92.5% pure silver.", tags: "earrings, silver, oxidised", discount: 38 },

  // Home & Living
  { id: 28, name: "Handwoven Bamboo Basket Set", category: "Home & Living", price: 599, origPrice: 999, qty: 80, state: "Assam", emoji: "🧺", rating: 4.5, reviews: 445, desc: "Set of 3 handwoven bamboo baskets from Assam. Eco-friendly, durable, multi-use.", tags: "bamboo, basket, eco", discount: 40 },
  { id: 29, name: "Copper Water Pitcher 1.5L", category: "Home & Living", price: 899, origPrice: 1499, qty: 100, state: "Rajasthan", emoji: "🫗", rating: 4.8, reviews: 2300, desc: "Hand-hammered pure copper pitcher. Ayurvedic copper-charged water for health.", tags: "copper, pitcher, ayurveda", discount: 40 },
  { id: 30, name: "Khadi Quilted Bedsheet Set", category: "Home & Living", price: 1799, origPrice: 2999, qty: 45, state: "Gujarat", emoji: "🛏️", rating: 4.6, reviews: 789, desc: "100% khadi cotton double bedsheet with 2 pillow covers. Handwoven, naturally dyed.", tags: "bedsheet, khadi, cotton", discount: 40 },

  // Books
  { id: 31, name: "Complete Ramayana Illustrated", category: "Books", price: 699, origPrice: 999, qty: 200, state: "Uttar Pradesh", emoji: "📚", rating: 4.9, reviews: 3400, desc: "Full illustrated Ramayana with Valmiki's original text and modern commentary.", tags: "ramayana, books, spiritual", discount: 30 },
  { id: 32, name: "Indian Classical Recipes Book", category: "Books", price: 899, origPrice: 1299, qty: 150, state: "Maharashtra", emoji: "📖", rating: 4.7, reviews: 1200, desc: "500 authentic recipes from 28 states. From street food to royal kitchens.", tags: "cookbook, recipes, indian", discount: 31 },

  // Wellness
  { id: 33, name: "Yoga Mat Premium Eco 6mm", category: "Wellness", price: 1299, origPrice: 2499, qty: 75, state: "Karnataka", emoji: "🧘", rating: 4.7, reviews: 1800, desc: "Natural rubber yoga mat. Non-slip, sweat-resistant, 6mm thick. Made in India.", tags: "yoga mat, wellness, exercise", discount: 48 },
  { id: 34, name: "Amla & Bhringraj Hair Oil 250ml", category: "Wellness", price: 349, origPrice: 599, qty: 300, state: "Kerala", emoji: "💆", rating: 4.8, reviews: 5600, desc: "Ayurvedic hair oil with amla, bhringraj, hibiscus. Reduces hair fall, adds shine.", tags: "hair oil, amla, ayurvedic", discount: 42 },

  // Music & Arts
  { id: 35, name: "Handmade Sitar (Student Grade)", category: "Music & Arts", price: 8999, origPrice: 14999, qty: 10, state: "West Bengal", emoji: "🎵", rating: 4.8, reviews: 89, desc: "Authentic Kolkata-made sitar for students. Teak wood, 17 strings, with gig bag.", tags: "sitar, music, classical", discount: 40 }
];

// ---- SPREADSHEET DATABASE CLASS ----
class SpreadsheetDB {
  constructor() {
    this.load();
  }

  load() {
    this.products = JSON.parse(localStorage.getItem('bm_products') || 'null') || [...defaultProducts];
    this.orders = JSON.parse(localStorage.getItem('bm_orders') || '[]');
    this.users = JSON.parse(localStorage.getItem('bm_users') || '[]');
    this.deliveryBoys = JSON.parse(localStorage.getItem('bm_delivery') || '[]');
    this.team = JSON.parse(localStorage.getItem('bm_team') || JSON.stringify([
      { id: 1, name: "Super Admin", username: "admin", password: "admin123", role: "admin", createdAt: new Date().toISOString() },
      { id: 2, name: "Admin 2", username: "admin2", password: "admin123", role: "admin2", createdAt: new Date().toISOString() }
    ]));
    this.settings = JSON.parse(localStorage.getItem('bm_settings') || JSON.stringify({
      storeName: "BharatMart",
      deliveryFee: 0,
      minOrder: 99,
      freeDeliveryAbove: 499
    }));
    this.cart = JSON.parse(localStorage.getItem('bm_cart') || '[]');
    this.wishlist = JSON.parse(localStorage.getItem('bm_wishlist') || '[]');
    this.currentUser = JSON.parse(sessionStorage.getItem('bm_current_user') || 'null');
    this.adminUser = JSON.parse(sessionStorage.getItem('bm_admin_user') || 'null');
    this.nextProductId = Math.max(...this.products.map(p => p.id), 0) + 1;
    this.nextOrderId = this.orders.length + 1;
  }

  save() {
    localStorage.setItem('bm_products', JSON.stringify(this.products));
    localStorage.setItem('bm_orders', JSON.stringify(this.orders));
    localStorage.setItem('bm_users', JSON.stringify(this.users));
    localStorage.setItem('bm_delivery', JSON.stringify(this.deliveryBoys));
    localStorage.setItem('bm_team', JSON.stringify(this.team));
    localStorage.setItem('bm_settings', JSON.stringify(this.settings));
    localStorage.setItem('bm_cart', JSON.stringify(this.cart));
    localStorage.setItem('bm_wishlist', JSON.stringify(this.wishlist));
  }

  // PRODUCTS
  getProducts(filter = {}) {
    let prods = [...this.products];
    if (filter.category && filter.category !== 'all') prods = prods.filter(p => p.category === filter.category);
    if (filter.search) {
      const q = filter.search.toLowerCase();
      prods = prods.filter(p => p.name.toLowerCase().includes(q) || p.tags.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (filter.maxPrice) prods = prods.filter(p => p.price <= filter.maxPrice);
    if (filter.minRating) prods = prods.filter(p => p.rating >= filter.minRating);
    if (filter.state) prods = prods.filter(p => p.state === filter.state);
    return prods;
  }

  addProduct(product) {
    product.id = this.nextProductId++;
    product.rating = product.rating || 4.5;
    product.reviews = product.reviews || 0;
    product.discount = product.origPrice > product.price ? Math.round((1 - product.price / product.origPrice) * 100) : 0;
    this.products.push(product);
    this.save();
    return product;
  }

  updateProduct(id, updates) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.products[idx] = { ...this.products[idx], ...updates };
      if (this.products[idx].origPrice > this.products[idx].price) {
        this.products[idx].discount = Math.round((1 - this.products[idx].price / this.products[idx].origPrice) * 100);
      }
      this.save();
      return this.products[idx];
    }
  }

  deleteProduct(id) {
    this.products = this.products.filter(p => p.id !== id);
    this.save();
  }

  // ORDERS
  addOrder(order) {
    order.id = 'BM' + String(this.nextOrderId++).padStart(6, '0');
    order.createdAt = new Date().toISOString();
    order.status = 'Confirmed';
    order.statusHistory = [{ status: 'Confirmed', time: order.createdAt }];
    this.orders.unshift(order);
    this.save();
    return order;
  }

  updateOrderStatus(orderId, status, deliveryBoyId) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.statusHistory = order.statusHistory || [];
      order.statusHistory.push({ status, time: new Date().toISOString() });
      if (deliveryBoyId) order.deliveryBoyId = deliveryBoyId;
      this.save();
    }
  }

  // USERS
  findOrCreateUser(contact) {
    let user = this.users.find(u => u.email === contact || u.mobile === contact);
    if (!user) {
      user = {
        id: this.users.length + 1,
        contact,
        email: contact.includes('@') ? contact : '',
        mobile: contact.includes('@') ? '' : contact,
        name: '',
        address: '',
        joinedAt: new Date().toISOString(),
        orderCount: 0
      };
      this.users.push(user);
      this.save();
    }
    return user;
  }

  updateUser(id, updates) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) { this.users[idx] = { ...this.users[idx], ...updates }; this.save(); }
  }

  // CART
  addToCart(product, qty = 1) {
    const existing = this.cart.find(i => i.id === product.id);
    if (existing) { existing.qty += qty; }
    else { this.cart.push({ ...product, qty }); }
    this.save();
  }

  updateCartQty(id, qty) {
    const item = this.cart.find(i => i.id === id);
    if (item) { item.qty = qty; if (item.qty <= 0) this.cart = this.cart.filter(i => i.id !== id); }
    this.save();
  }

  removeFromCart(id) { this.cart = this.cart.filter(i => i.id !== id); this.save(); }
  clearCart() { this.cart = []; this.save(); }

  getCartTotal() { return this.cart.reduce((sum, i) => sum + i.price * i.qty, 0); }

  // DELIVERY BOYS
  addDeliveryBoy(boy) {
    boy.id = 'DB' + String(this.deliveryBoys.length + 1).padStart(3, '0');
    boy.status = 'Available';
    boy.activeOrders = 0;
    boy.joinedAt = new Date().toISOString();
    this.deliveryBoys.push(boy);
    this.save();
    return boy;
  }

  // TEAM
  authenticateAdmin(username, password) {
    return this.team.find(m => m.username === username && m.password === password && (m.role === 'admin' || m.role === 'admin2' || m.role === 'leader'));
  }

  addTeamMember(member) {
    member.id = this.team.length + 1;
    member.createdAt = new Date().toISOString();
    this.team.push(member);
    this.save();
    return member;
  }

  updateTeamPassword(username, newPass) {
    const member = this.team.find(m => m.username === username);
    if (member) { member.password = newPass; this.save(); return true; }
    return false;
  }

  deleteTeamMember(id) {
    this.team = this.team.filter(m => m.id !== id);
    this.save();
  }

  // OTP (simulated — in production use real API)
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // RBAC PERMISSIONS
  getPermissions(role) {
    const perms = {
      admin: {
        viewDashboard: true, manageProducts: true, manageOrders: true,
        manageUsers: true, manageDelivery: true, manageTeam: true,
        changePasswords: true, manageSettings: true, viewSpreadsheet: true,
        exportData: true, addQuantity: true
      },
      admin2: {
        viewDashboard: true, manageProducts: true, manageOrders: true,
        manageUsers: true, manageDelivery: true, manageTeam: false,
        changePasswords: false, manageSettings: false, viewSpreadsheet: true,
        exportData: true, addQuantity: true
      },
      leader: {
        viewDashboard: true, manageProducts: false, manageOrders: true,
        manageUsers: true, manageDelivery: true, manageTeam: false,
        changePasswords: false, manageSettings: false, viewSpreadsheet: false,
        exportData: false, addQuantity: true
      },
      delivery: {
        viewDashboard: false, manageProducts: false, manageOrders: true,
        manageUsers: false, manageDelivery: false, manageTeam: false,
        changePasswords: false, manageSettings: false, viewSpreadsheet: false,
        exportData: false, addQuantity: false
      }
    };
    return perms[role] || {};
  }

  // EXPORT TO EXCEL
  exportSheet(type) {
    const wb = XLSX.utils.book_new();
    
    if (type === 'all' || type === 'products') {
      const ws = XLSX.utils.json_to_sheet(this.products);
      XLSX.utils.book_append_sheet(wb, ws, "Products");
    }
    if (type === 'all' || type === 'orders') {
      const ordersData = this.orders.map(o => ({
        'Order ID': o.id, 'Customer': o.userName, 'Mobile': o.userMobile,
        'Address': o.address, 'Items': o.items?.map(i => `${i.name} x${i.qty}`).join(', '),
        'Total': o.total, 'Payment': o.paymentMethod, 'Status': o.status,
        'Date': new Date(o.createdAt).toLocaleString('en-IN')
      }));
      const ws = XLSX.utils.json_to_sheet(ordersData);
      XLSX.utils.book_append_sheet(wb, ws, "Orders");
    }
    if (type === 'all' || type === 'users') {
      const ws = XLSX.utils.json_to_sheet(this.users);
      XLSX.utils.book_append_sheet(wb, ws, "Users");
    }
    if (type === 'all') {
      const ws = XLSX.utils.json_to_sheet(this.deliveryBoys);
      XLSX.utils.book_append_sheet(wb, ws, "Delivery Boys");
    }

    XLSX.writeFile(wb, `BharatMart_Export_${new Date().toISOString().slice(0,10)}.xlsx`);
  }
}

// Initialize DB
const DB = new SpreadsheetDB();
