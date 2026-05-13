const API_BASE = 'http://localhost:3000/api';
const STRIPE_PUBLIC_KEY = 'pk_test_your_public_key'; // Replace with your Stripe key

let stripe, elements, cardElement;

async function initStripe() {
  stripe = Stripe(STRIPE_PUBLIC_KEY);
  elements = stripe.elements();
  cardElement = elements.create('card');
  cardElement.mount('#card-element');
}

function getToken() {
  return localStorage.getItem('token');
}

async function loadCheckoutSummary() {
  const token = getToken();
  if (!token) {
    window.location.href = 'index.html';
    return;
  }
  
  const response = await fetch(`${API_BASE}/cart`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.ok) {
    const cart = await response.json();
    displayCheckoutSummary(cart);
  }
}

function displayCheckoutSummary(cart) {
  const container = document.getElementById('order-items');
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.1;
  
  container.innerHTML = cart.map(item => `
    <div class="summary-row">
      <span>${item.name} x${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');
  
  document.getElementById('checkout-total').textContent = '$' + total.toFixed(2);
}

document.getElementById('payment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const token = getToken();
  
  // Create token from card element
  const { token: stripeToken } = await stripe.createToken(cardElement);
  
  if (stripeToken) {
    const total = parseFloat(document.getElementById('checkout-total').textContent.replace('$', ''));
    
    const response = await fetch(`${API_BASE}/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        stripeToken: stripeToken.id,
        amount: total
      })
    });
    
    if (response.ok) {
      alert('Order placed successfully!');
      window.location.href = 'index.html';
    } else {
      alert('Payment failed');
    }
  }
});

initStripe();
loadCheckoutSummary();
