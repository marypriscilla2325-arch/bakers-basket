# Bakers Basket - Ecommerce Website 🍰

A complete, production-ready ecommerce website for a bakery business built with simple, easy-to-understand technologies.

## Features

✅ **User Authentication** - Register, login, and manage profiles
✅ **Product Catalog** - Browse, search, and filter bakery items
✅ **Shopping Cart** - Add/remove items, update quantities
✅ **Checkout & Payment** - Secure Stripe payment integration
✅ **Order Management** - Track order history
✅ **Admin Dashboard** - Manage products, orders, and view analytics

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express.js
- **Database**: SQLite3
- **Payment**: Stripe API
- **Authentication**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/marypriscilla2325-arch/bakers-basket.git
cd bakers-basket
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure your environment variables** in `.env`:
```
PORT=3000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
JWT_SECRET=your_jwt_secret_key
```

5. **Start the server**
```bash
npm start
```

The website will be available at `http://localhost:3000`

## Project Structure

```
bakers-basket/
├── backend/
│   ├── routes/
│   │   ├── auth.js          # Authentication endpoints
│   │   ├── products.js      # Product catalog endpoints
│   │   ├── cart.js          # Shopping cart endpoints
│   │   ├── orders.js        # Order processing
│   │   └── admin.js         # Admin dashboard endpoints
│   ├── server.js            # Express server
│   └── database.js          # SQLite setup
├── frontend/
│   ├── index.html           # Home page
│   ├── products.html        # Product listing
│   ├── cart.html            # Shopping cart
│   ├── checkout.html        # Payment page
│   ├── dashboard.html       # Admin panel
│   ├── css/
│   │   ├── style.css        # Main styles
│   │   └── dashboard.css    # Admin styles
│   └── js/
│       ├── main.js          # Main functionality
│       ├── cart.js          # Cart logic
│       ├── checkout.js      # Payment processing
│       └── dashboard.js     # Admin panel logic
├── database.sqlite          # SQLite database (auto-generated)
├── package.json             # Node dependencies
└── README.md                # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search/:keyword` - Search products
- `GET /api/products/category/:category` - Filter by category

### Shopping Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:item_id` - Update quantity
- `DELETE /api/cart/remove/:item_id` - Remove item

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders/create` - Create new order

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `POST /api/admin/products/add` - Add product
- `PUT /api/admin/products/:id` - Edit product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - View all orders

## Sample Products

The database comes pre-populated with 6 sample bakery items:
- Chocolate Cake
- Croissants (Pack of 6)
- Strawberry Cheesecake
- Sourdough Bread
- Macarons (Assorted)
- Carrot Cake

## Testing the Application

### 1. Register a New User
- Click "Login" button
- Click "Register" tab
- Fill in name, email, password
- Submit

### 2. Browse Products
- Click "Shop" in navigation
- Search or filter products
- Click "Add to Cart"

### 3. Complete Purchase
- Go to cart
- Review items and total
- Click "Proceed to Checkout"
- Use Stripe test card: `4242 4242 4242 4242`

### 4. View Admin Dashboard
- Create admin account (manually set role in database)
- Access `/dashboard.html`
- View stats, manage products, and orders

## Stripe Test Cards

For testing payments:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

Use any future date for expiration and any 3-digit CVC.

## Security Notes

⚠️ **Important for Production**:
- Change JWT_SECRET in .env
- Store sensitive keys in environment variables
- Use HTTPS in production
- Validate all inputs server-side
- Implement rate limiting
- Add CORS restrictions
- Keep dependencies updated

## Development

For development with auto-reload:
```bash
npm run dev
```

This requires nodemon to be installed.

## Troubleshooting

**Port already in use?**
```bash
# Change PORT in .env file or:
lsof -ti:3000 | xargs kill -9
```

**Database errors?**
Delete `database.sqlite` and restart the server to recreate it.

**Stripe not working?**
Ensure you have valid test keys from https://dashboard.stripe.com

## Contributing

Feel free to fork and submit pull requests!

## License

ISC License - feel free to use for your project

## Support

For issues or questions, please open a GitHub issue.

---

**Made with ❤️ for Bakers Basket Bakery**
