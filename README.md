# RATS WARS - Official Website

![RATS WARS Logo](https://img.shields.io/badge/RATS-WARS-FFD700?style=for-the-badge)

An epic space opera saga featuring heroic rodents battling across the galaxy! This is the official website for RATS WARS, featuring a professional 1970s-80s retro space opera aesthetic inspired by classic sci-fi films.

## 🚀 Live Website

Visit the live site at: [Your GitHub Pages URL will be here]

## ✨ Features

### 🎭 Authentic Retro Design
- **1970s-80s Space Opera Aesthetic**: Inspired by classic Star Wars original trilogy posters
- **Film Grain Effect**: Authentic vintage film feel
- **Animated Starfield**: Dynamic twinkling stars background
- **Scanline Overlay**: CRT monitor effect for that retro vibe
- **Glowing Text Effects**: Neon-style typography with golden and cyan highlights

### 📖 Content Sections

1. **About/Saga**: Learn about the RATS WARS universe
2. **Characters**: Meet the heroes of the rebellion (12 unique characters)
3. **Merchandise Shop**: Browse and purchase official RATS WARS gear
4. **Fan Fiction Gallery**: Read community-created stories
5. **Story Submission**: Submit your own RATS WARS tales

### 🛍️ Merchandise Features
- Category filtering (Apparel, Accessories, Collectibles)
- Shopping cart functionality
- 8+ unique products
- Ready for e-commerce integration

### ✍️ Fan Fiction System
- Story submission form with validation
- Word count and character limit tracking
- Genre categorization
- Tag system for easy discovery
- Sortable story list (by date, popularity, title)
- Full-screen story reading modal

### 🎨 Interactive Elements
- Smooth scrolling navigation
- Hover effects on cards and buttons
- Animated section transitions
- Character card overlays
- Modal windows for story reading
- Real-time form validation
- Custom notification system

### 🎮 Easter Eggs
- Konami Code activation (↑↑↓↓←→←→BA)
- Special effects and surprises
- Console messages for developers

## 🛠️ Technology Stack

- **HTML5**: Semantic, accessible markup
- **CSS3**: Modern styling with animations and effects
- **Vanilla JavaScript**: No dependencies, pure JS
- **Google Fonts**: Bebas Neue, Orbitron, Rajdhani
- **Responsive Design**: Mobile-first approach

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🚀 Getting Started

### GitHub Pages Setup

This website is configured to work with GitHub Pages automatically:

1. Push the code to your GitHub repository
2. Go to Settings > Pages
3. Select the branch (usually `main` or `master`)
4. Your site will be live at `https://[username].github.io/[repository-name]`

### Local Development

To run locally:

1. Clone the repository
```bash
git clone https://github.com/[username]/ratswars.git
cd ratswars
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
```

3. Visit `http://localhost:8000`

## 🔧 Customization

### Colors
The color scheme uses CSS custom properties defined in `styles.css`:
- Gold: `#FFD700`
- Orange: `#FF6B00`
- Cyan: `#00FFFF`
- Navy/Black backgrounds

### Fonts
- **Display/Headings**: Bebas Neue, Orbitron
- **Body Text**: Rajdhani

### Adding Merchandise
Edit the merchandise section in `index.html` to add new products:

```html
<div class="merch-item" data-category="apparel">
    <div class="merch-image">
        <div class="placeholder-image">
            <div class="placeholder-text">YOUR<br>PRODUCT</div>
        </div>
    </div>
    <div class="merch-info">
        <h3>Product Name</h3>
        <p class="merch-desc">Description</p>
        <div class="merch-footer">
            <span class="merch-price">$XX.XX</span>
            <button class="btn btn-small" onclick="addToCart('Product Name', XX.XX)">ADD TO CART</button>
        </div>
    </div>
</div>
```

### Adding Characters
Add new character cards to the characters section with images and descriptions.

## 🛒 E-Commerce Integration

The current cart system is a demo. To accept real payments, integrate with:

- **Shopify**: Full e-commerce platform
- **WooCommerce**: WordPress integration
- **Stripe**: Payment processing
- **Square**: Point of sale and online payments
- **Gumroad**: Digital products

### Example Stripe Integration
Add to your JavaScript:

```javascript
function checkout() {
    // Redirect to Stripe Checkout
    stripe.redirectToCheckout({
        lineItems: cart.items,
        mode: 'payment',
        successUrl: 'https://yourdomain.com/success',
        cancelUrl: 'https://yourdomain.com/cancel',
    });
}
```

## 📝 Fan Fiction Backend

The story submission form is currently frontend-only. To store submissions, integrate with:

### Option 1: Firebase
```javascript
import { getFirestore, addDoc, collection } from 'firebase/firestore';

async function handleFanficSubmit(formData) {
    const db = getFirestore();
    await addDoc(collection(db, 'stories'), formData);
}
```

### Option 2: Supabase
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function handleFanficSubmit(formData) {
    const { data, error } = await supabase
        .from('stories')
        .insert([formData]);
}
```

### Option 3: Custom Backend
Create an API endpoint to receive form submissions:

```javascript
async function handleFanficSubmit(formData) {
    const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
}
```

## 📄 File Structure

```
ratswars/
├── index.html          # Main HTML file
├── styles.css          # All CSS styling
├── script.js           # Interactive functionality
├── README.md           # This file
└── images/            # Image assets (optional)
```

## 🎯 Future Enhancements

- [ ] User authentication system
- [ ] Comment system for fan fiction
- [ ] Like/rating system for stories
- [ ] User profiles
- [ ] Email newsletter signup
- [ ] Blog/news section
- [ ] Gallery/artwork section
- [ ] Forum/discussion boards
- [ ] Real merchandise images
- [ ] Video content section

## 📜 License

© 2026 RATS WARS. All Rights Reserved.

## 🧀 May the Cheese be with you!

---

**Questions or Issues?**
Open an issue on GitHub or contact the development team.

**Contributing**
Contributions are welcome! Please fork the repository and submit a pull request.
