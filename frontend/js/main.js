const API_BASE = 'http://localhost:3000/api';

// Get JWT Token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Check if user is logged in
function checkAuth() {
  const token = getToken();
  const authBtn = document.getElementById('auth-btn');
  
  if (token) {
    authBtn.textContent = 'Logout';
    authBtn.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    };
  } else {
    authBtn.textContent = 'Login';
    authBtn.onclick = (e) => {
      e.preventDefault();
      showAuthModal();
    };
  }
}

// Show Auth Modal
function showAuthModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'auth-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>Login / Register</h2>
      <div id="auth-tabs">
        <button class="tab-btn active" data-tab="login">Login</button>
        <button class="tab-btn" data-tab="register">Register</button>
      </div>
      <form id="login-form" class="auth-form active">
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Password" required>
        <button type="submit" class="btn btn-primary btn-full">Login</button>
      </form>
      <form id="register-form" class="auth-form">
        <input type="text" placeholder="Full Name" required>
        <input type="email" placeholder="Email" required>
        <input type="password" placeholder="Password" required>
        <button type="submit" class="btn btn-primary btn-full">Register</button>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
      e.target.classList.add('active');
      document.getElementById(e.target.dataset.tab + '-form').classList.add('active');
    });
  });
  
  // Login
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      alert('Login successful!');
      modal.remove();
      window.location.reload();
    } else {
      alert(data.message);
    }
  });
  
  // Register
  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    if (response.ok) {
      alert('Registration successful! Please login.');
      document.getElementById('register-form').reset();
      document.querySelectorAll('.tab-btn')[0].click();
    } else {
      alert(data.message);
    }
  });
  
  // Close modal
  document.querySelector('.close').onclick = () => modal.remove();
  window.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
}

// Load Products
async function loadProducts(page = 'featured') {
  try {
    const response = await fetch(`${API_BASE}/products`);
    const products = await response.json();
    
    const container = document.getElementById(page === 'featured' ? 'featured-products' : 'products-grid');
    if (!container) return;
    
    const displayProducts = page === 'featured' ? products.slice(0, 3) : products;
    
    container.innerHTML = displayProducts.map(product => `
      <div class="product-card">
        <div class="product-image">🍰</div>
        <div class="product-info">
          <h4>${product.name}</h4>
          <p>${product.description || ''}</p>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <div class="product-actions">
            <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Add to Cart
async function addToCart(productId) {
  const token = getToken();
  if (!token) {
    alert('Please login first');
    return;
  }
  
  const response = await fetch(`${API_BASE}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ product_id: productId, quantity: 1 })
  });
  
  if (response.ok) {
    alert('Added to cart!');
    updateCartCount();
  } else {
    alert('Error adding to cart');
  }
}

// Update Cart Count
async function updateCartCount() {
  const token = getToken();
  if (!token) return;
  
  const response = await fetch(`${API_BASE}/cart`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.ok) {
    const cart = await response.json();
    document.getElementById('cart-count').textContent = cart.length;
  }
}

// Initialize
checkAuth();
loadProducts('featured');
updateCartCount();
