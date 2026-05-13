const API_BASE = 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!user.role || user.role !== 'admin') {
  alert('Admin access only');
  window.location.href = 'index.html';
}

// Tab Navigation
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    const tabId = e.target.getAttribute('href').substring(1);
    document.getElementById(tabId).classList.add('active');
    e.target.classList.add('active');
  });
});

// Load Dashboard Stats
async function loadStats() {
  const response = await fetch(`${API_BASE}/admin/stats`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  
  if (response.ok) {
    const stats = await response.json();
    document.getElementById('total-users').textContent = stats.totalUsers;
    document.getElementById('total-products').textContent = stats.totalProducts;
    document.getElementById('total-orders').textContent = stats.totalOrders;
    document.getElementById('total-revenue').textContent = '$' + stats.totalRevenue.toFixed(2);
  }
}

// Load Products
async function loadProducts() {
  const response = await fetch(`${API_BASE}/products`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  
  if (response.ok) {
    const products = await response.json();
    const tbody = document.querySelector('#products-table tbody');
    tbody.innerHTML = products.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>$${p.price.toFixed(2)}</td>
        <td>${p.stock}</td>
        <td>
          <button class="btn-edit" onclick="editProduct(${p.id})">Edit</button>
          <button class="btn-delete" onclick="deleteProduct(${p.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  }
}

// Load Orders
async function loadOrders() {
  const response = await fetch(`${API_BASE}/admin/orders`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  
  if (response.ok) {
    const orders = await response.json();
    const tbody = document.querySelector('#orders-table tbody');
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td>${o.id}</td>
        <td>${o.user_id}</td>
        <td>$${o.total_price.toFixed(2)}</td>
        <td>${o.status}</td>
        <td>${new Date(o.created_at).toLocaleDateString()}</td>
      </tr>
    `).join('');
  }
}

// Delete Product
async function deleteProduct(id) {
  if (confirm('Delete this product?')) {
    const response = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    
    if (response.ok) {
      loadProducts();
    }
  }
}

// Initialize
loadStats();
loadProducts();
loadOrders();

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
});
