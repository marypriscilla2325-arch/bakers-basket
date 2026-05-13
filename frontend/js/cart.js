const API_BASE = 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function loadCart() {
  const token = getToken();
  if (!token) {
    document.getElementById('cart-items').innerHTML = '<p>Please login to view cart</p>';
    return;
  }
  
  const response = await fetch(`${API_BASE}/cart`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.ok) {
    const cart = await response.json();
    displayCart(cart);
  }
}

function displayCart(cart) {
  const container = document.getElementById('cart-items');
  
  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty</p>';
    updateCartSummary([]);
    return;
  }
  
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-image">🍰</div>
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)} each</p>
        <div class="cart-item-quantity">
          <button onclick="updateQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <div style="text-align: right;">
        <p>$${(item.price * item.quantity).toFixed(2)}</p>
        <button class="btn" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');
  
  updateCartSummary(cart);
}

function updateCartSummary(cart) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  
  document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
  document.getElementById('tax').textContent = '$' + tax.toFixed(2);
  document.getElementById('total').textContent = '$' + total.toFixed(2);
}

async function updateQuantity(itemId, change) {
  const token = getToken();
  const cartItems = document.querySelectorAll('.cart-item');
  let currentQty = 1;
  
  cartItems.forEach(item => {
    if (item.querySelector(`button[onclick*="${itemId}"]`)) {
      const qtySpan = item.querySelector('.cart-item-quantity span');
      currentQty = parseInt(qtySpan.textContent) + change;
    }
  });
  
  if (currentQty < 1) return;
  
  const response = await fetch(`${API_BASE}/cart/update/${itemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ quantity: currentQty })
  });
  
  if (response.ok) {
    loadCart();
  }
}

async function removeFromCart(itemId) {
  const token = getToken();
  const response = await fetch(`${API_BASE}/cart/remove/${itemId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.ok) {
    loadCart();
  }
}

loadCart();
