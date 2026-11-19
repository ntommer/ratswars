/* ===================================
   RATS WARS - Interactive Features
   =================================== */

// === INITIALIZE ON PAGE LOAD ===
document.addEventListener('DOMContentLoaded', function() {
    generateStarfield();
    initSmoothScrolling();
    initFormHandlers();
    initMerchandise();
    initCharacterAnimations();
    initVisitorCounter();
    initGalleryLayout();
});

// === STARFIELD GENERATION ===
function generateStarfield() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;

    const starCount = 300;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // Random positioning
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';

        // Random size (1-3px)
        const size = Math.random() * 2 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        // Random animation delay for twinkling effect
        star.style.animationDelay = Math.random() * 4 + 's';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';

        starsContainer.appendChild(star);
    }
}

// === SMOOTH SCROLLING ===
function initSmoothScrolling() {
    const ctaLinks = document.querySelectorAll('.cta-buttons a[href^="#"]');

    ctaLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// === MERCHANDISE FEATURES ===
let cart = {
    items: [],
    total: 0
};

function initMerchandise() {
    // Category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            categoryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter items
            const category = this.getAttribute('data-category');
            filterMerchandise(category);
        });
    });

    updateCartDisplay();
}

function filterMerchandise(category) {
    const merchItems = document.querySelectorAll('.merch-item');

    merchItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (category === 'all' || itemCategory === category) {
            item.style.display = 'flex';
            // Add fade-in animation
            item.style.animation = 'fadeIn 0.5s ease-out';
        } else {
            item.style.display = 'none';
        }
    });
}

function addToCart(itemName, price) {
    // Add item to cart
    cart.items.push({
        name: itemName,
        price: price
    });

    // Update total
    cart.total += price;

    // Update display
    updateCartDisplay();

    // Show notification
    showNotification(`${itemName} added to cart!`, 'success');
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    if (cartCount) cartCount.textContent = cart.items.length;
    if (cartTotal) cartTotal.textContent = cart.total.toFixed(2);
}

function checkout() {
    if (cart.items.length === 0) {
        showNotification('Your cart is empty!', 'warning');
        return;
    }

    // In a real implementation, this would redirect to a payment processor
    showNotification(
        `Checkout with ${cart.items.length} items (Total: $${cart.total.toFixed(2)})\n\n` +
        'For a real store, integrate with Shopify, WooCommerce, or Stripe.\n\n' +
        'Cart has been cleared for demo purposes.',
        'info'
    );

    // Clear cart
    cart = { items: [], total: 0 };
    updateCartDisplay();
}

// === FORM HANDLERS ===
function initFormHandlers() {
    const fanficForm = document.getElementById('fanficForm');
    if (fanficForm) {
        fanficForm.addEventListener('submit', handleFanficSubmit);
    }

    // Word and character counters
    const storyContent = document.getElementById('storyContent');
    const storySummary = document.getElementById('storySummary');

    if (storyContent) {
        storyContent.addEventListener('input', function() {
            const wordCount = this.value.trim().split(/\s+/).filter(word => word.length > 0).length;
            const counter = document.getElementById('wordCount');
            if (counter) {
                counter.textContent = `${wordCount} words`;

                // Color code based on requirement
                if (wordCount < 500) {
                    counter.style.color = '#ff6b00'; // Orange - needs more
                } else if (wordCount > 10000) {
                    counter.style.color = '#d32f2f'; // Red - too many
                } else {
                    counter.style.color = '#00ffff'; // Cyan - good
                }
            }
        });
    }

    if (storySummary) {
        storySummary.addEventListener('input', function() {
            const charCount = this.value.length;
            const counter = document.getElementById('summaryCount');
            if (counter) {
                counter.textContent = `${charCount} / 200 characters`;

                // Color code
                if (charCount > 200) {
                    counter.style.color = '#d32f2f'; // Red - too many
                    this.value = this.value.substring(0, 200); // Limit
                } else if (charCount > 180) {
                    counter.style.color = '#ff6b00'; // Orange - getting close
                } else {
                    counter.style.color = '#00ffff'; // Cyan - good
                }
            }
        });
    }
}

function handleFanficSubmit(e) {
    e.preventDefault();

    const formData = {
        authorName: document.getElementById('authorName').value,
        authorEmail: document.getElementById('authorEmail').value,
        storyTitle: document.getElementById('storyTitle').value,
        storyGenre: document.getElementById('storyGenre').value,
        storyTags: document.getElementById('storyTags').value,
        storySummary: document.getElementById('storySummary').value,
        storyContent: document.getElementById('storyContent').value
    };

    // Validation
    const wordCount = formData.storyContent.trim().split(/\s+/).filter(word => word.length > 0).length;

    if (wordCount < 500) {
        showNotification('Story must be at least 500 words!', 'error');
        return;
    }

    if (wordCount > 10000) {
        showNotification('Story must be no more than 10,000 words!', 'error');
        return;
    }

    // Send submission via Formspree email service
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '📡 TRANSMITTING...';

    const emailData = {
        _subject: `RATS WARS Fan Fiction Submission: ${formData.storyTitle}`,
        authorName: formData.authorName,
        authorEmail: formData.authorEmail,
        storyTitle: formData.storyTitle,
        storyGenre: formData.storyGenre,
        storyTags: formData.storyTags || 'None',
        storySummary: formData.storySummary,
        wordCount: wordCount,
        storyContent: formData.storyContent
    };

    fetch('https://formspree.io/f/maqjvvyq', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(emailData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok');
    })
    .then(data => {
        showNotification(
            `🚀 Transmission received, ${formData.authorName}!\n\n` +
            `Your story "${formData.storyTitle}" has been submitted to the Galactic Council for review.\n\n` +
            'You will receive a confirmation at your email address.',
            'success'
        );
        // Reset form
        e.target.reset();
        document.getElementById('wordCount').textContent = '0 words';
        document.getElementById('summaryCount').textContent = '0 / 200 characters';
    })
    .catch(error => {
        console.error('Submission error:', error);
        showNotification('Transmission failed! Please check your connection and try again.', 'error');
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    });
}

// === FAN FICTION FEATURES ===
function sortStories() {
    const sortBy = document.getElementById('sortFilter').value;
    const fanficList = document.querySelector('.fanfic-list');
    const stories = Array.from(document.querySelectorAll('.fanfic-item'));

    stories.sort((a, b) => {
        switch(sortBy) {
            case 'newest':
                return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
            case 'popular':
                return parseInt(b.getAttribute('data-likes')) - parseInt(a.getAttribute('data-likes'));
            case 'title':
                const titleA = a.querySelector('h3').textContent.toLowerCase();
                const titleB = b.querySelector('h3').textContent.toLowerCase();
                return titleA.localeCompare(titleB);
            default:
                return 0;
        }
    });

    // Re-append in new order
    stories.forEach(story => fanficList.appendChild(story));

    showNotification(`Stories sorted by ${sortBy}`, 'info');
}

function readStory(storyId) {
    const author = 'The Galactic Sewer Gazette';
    const stories = {
        1: {
            title: 'A Perfectly Ordinary Tuesday',
            content: `
                <p>The twin suns of Crapulon 5 winked wearily over the horizon, as if to say, "Not this again."</p>
                <p>With all the enthusiasm of two government employees working overtime, they begrudgingly cast their light upon the hapless, debris-strewn face of what had become known throughout that corner of the galaxy simply as The Planet-Sized Trailer Park.</p>
                <p>Rusting star cruisers leaned against half-collapsed cargo haulers. Satellite dishes outnumbered trees by several million to one. Somewhere in the distance, something exploded with enough confidence to suggest it had been doing so every morning for years.</p>
                <p>When the suns finally found a gap in the bent aluminum blinds of one particularly unimpressive dwelling, a single golden beam crept across the room until it landed squarely on the face of Jack Paintscraper.</p>
                <p>Jack remained perfectly still.</p>
                <p>He lay on a ragged tatami mat, fully clothed, one boot missing, sleeping off what could only be described as a perfectly ordinary Tuesday night.</p>
                <p>He had three excellent reasons for not moving. The first was the sunbeam, which he felt was being pushy. The second was his head, which had filed a formal complaint. The third was that there was, as far as Jack could determine without opening his eyes, absolutely nothing on Crapulon 5 worth getting up for.</p>
                <p>The universe, which has never once respected a well-reasoned argument, chose that moment to knock on his door.</p>
                <p>It was not a polite knock. It was the knock of someone who had crossed four star systems and a landfill to be here and intended to get his money's worth.</p>
                <p>"Go away," said Jack, with the boyish charm that had gotten him thrown out of bars on eleven planets. "I gave at the office."</p>
                <p>"You do not have an office, amigo," said a voice like gravel rolling around in a hubcap. "You do not have a job. According to the lady at the cantina, you do not even have a tab anymore."</p>
                <p>The door, which had never been much of a door, fell inward with a sigh of relief. Framed in the dust and the hard morning light stood a squat figure in a striped poncho and a hat roughly the size of a landing pad. In one paw he held a humming green blade. In the other he held Jack's missing boot.</p>
                <p>"Okie Juan Dokie," said the stranger. "I have come a long way to find you, Jack Paintscraper. The Ju-Ju tells me you are destined for great things."</p>
                <p>Jack opened one eye and considered this. He had been called many things in his life &mdash; flaneur, freeloader, and on one memorable occasion, "Your Honor, that's him" &mdash; but never <em>destined</em>.</p>
                <p>"The Ju-Ju," he said carefully, "has clearly got me mixed up with somebody else."</p>
                <p>"That is what I told the Ju-Ju," said Okie, tossing him the boot. "But the Ju-Ju insists. Get up. The New Galactic Order will be here by lunch, and I would like to be somewhere with a better bar."</p>
                <p>It was, Jack had to admit, the first sensible thing anyone had said to him all week.</p>
            `
        },
        2: {
            title: 'If the Cheddar Is Right',
            content: `
                <p>There are two kinds of jobs in the galaxy: the kind that are too dangerous, and the kind that don't pay enough. Biscotti and Ham Sandwich had built a modest career out of the narrow, wobbly strip of territory in between.</p>
                <p>"Just so we're clear," said Ham, as their ship settled onto the landing pad with the sound of a filing cabinet falling down a flight of stairs, "we are walking into the palace of the most ruthless crime lord in nine systems, to tell him to his face that we lost his shipment."</p>
                <p>"Misplaced," said Biscotti. "We <em>misplaced</em> his shipment. 'Lost' sounds careless."</p>
                <p>"We jettisoned forty tons of aged Gouda into a sun."</p>
                <p>"Because a Gutter Brigade patrol was about to board us. That's not careless. That's inventory management."</p>
                <p>The palace of Tub O The Gut rose out of the swamp ahead of them like something the swamp had been trying to cough up for years. Inside, it smelled the way a refrigerator smells when you come home from a long vacation.</p>
                <p>The kingpin himself did not so much sit on his sofa as occupy it, the way an army occupies a small country. He was eating. He was, as far as anyone knew, always eating; there was a rumor that he had once paused, briefly, sometime during the previous decade.</p>
                <p>"Biscotti," he rumbled. "Ham Sandwich. My two favorite pirates. Tell me you have my cheese."</p>
                <p>Ham looked at Biscotti. Biscotti looked at the ceiling, where something with too many legs was looking at Ham.</p>
                <p>"Funny story," said Biscotti.</p>
                <p>It was not, in the end, a funny story. Tub O listened to all of it without blinking, chewing slowly, the way a glacier chews a valley. When it was over he wiped his paws on a passing henchman and smiled, which was worse.</p>
                <p>"Boys," he said. "I'm not angry. I'm <em>hungry</em>. And you two are going to fix that. There is a vault on Ice Planet Cube. In that vault is the finest wheel of cheddar ever aged. It belongs to King Prosciutto."</p>
                <p>"And you want us to steal it," said Ham.</p>
                <p>"I want you to <em>retrieve</em> it. 'Steal' sounds careless."</p>
                <p>He snapped his fingers. Two enormous guards wheeled in a slab of solid cheddarite, tall as a doorway and glowing a soft, appetizing orange. From somewhere inside it, a former business associate gazed out at the room with an expression of mild surprise.</p>
                <p>"That," said Tub O, "is the last crew who told me a funny story."</p>
                <p>Ham looked at the slab. Then he looked at the door, which was a long way off and getting farther.</p>
                <p>Biscotti cleared his throat. "What's the pay?"</p>
                <p>The cheddar, as it turned out, was right. It usually was. That was the whole problem.</p>
            `
        },
        3: {
            title: 'Employee of the Month',
            content: `
                <p>The Battle Rodent Attack Transport Ship is the most feared vessel in the galaxy, which is a remarkable achievement for something shaped like a wedge of cheese. The engineers of the New Galactic Order insist the design is aerodynamic. Nobody has had the courage to point out that there is no air in space, largely because the last engineer who did is now part of the hull.</p>
                <p>On the command deck, Daddio stood before the great viewport with his mechanical arm folded behind his back and a martini in his other paw, rehearsing.</p>
                <p>"My King," he told his reflection. "The rebel base has been located. No &mdash; <em>I</em> have located the rebel base. Personally. With initiative." He adjusted his cap. "Are you proud of &mdash; no. Too needy."</p>
                <p>Behind him, in the troop bay, two thousand of the Gutter Brigade stood at attention and tried very hard to look like they couldn't hear.</p>
                <p>The holo-projector crackled. The hooded figure of King Prosciutto filled the deck, forty feet tall, holding a goblet of something green that was smoking slightly.</p>
                <p>"Lieutenant."</p>
                <p>"<em>Second</em> Lieutenant, Your Devilishness. Since Tuesday. There was a small ceremony. You were invited."</p>
                <p>"Was I." The King swirled his goblet. "Report."</p>
                <p>"We are approaching the home base of those rascally vermin, my King. The Ju-Ju is bad." Daddio allowed himself a small, hopeful smile. "And I like it."</p>
                <p>There was a long silence. Somewhere in the troop bay a trooper coughed, and was quietly removed.</p>
                <p>"Your predecessor," said the King at last, "also liked it."</p>
                <p>"Yes, my King."</p>
                <p>"Do you know where your predecessor is now, Daddio?"</p>
                <p>"I have heard rumors, my King."</p>
                <p>"He is a cautionary tale. I tell it at parties." The great yellow eyes narrowed. "Bring me the droid. The nervous one. Bring me R4T5, and I may, possibly, on a good day, consider remembering your name."</p>
                <p>The hologram winked out. Daddio stood very still for a moment, mustache trembling.</p>
                <p>"He said my name," he whispered.</p>
                <p>"Sir?" said the nearest trooper.</p>
                <p>"He said 'Daddio.' You all heard it. It's in the log." He drained the martini, drew his red blade, and turned to face two thousand deeply uncomfortable soldiers.</p>
                <p>"Gentlemen," he announced, "today we make somebody proud of us."</p>
            `
        },
        4: {
            title: 'There Are Always Three More',
            content: `
                <p>Ice Planet Cube sits in the Tray Sector of the Freezer System, deep in Quadrant Fridge, and it is every bit as welcoming as that sounds. The travel brochures describe it as "bracing." The travel brochures were written by someone who has never been there and intends to keep it that way.</p>
                <p>Princess Lima Beans stood at the mouth of the ice cave with her arms crossed, staring out at eleven thousand miles of absolutely nothing.</p>
                <p>"I was told," she said, "that this rebellion had a <em>base</em>."</p>
                <p>"This is the base, Your Highness," said B3VR brightly. "Technically it is a hole. But it is a hole with excellent structural integrity. I ran the numbers. Would you like to hear the numbers?"</p>
                <p>"I would rather be eaten by the planet."</p>
                <p>"That is statistically quite likely!" said B3VR, who had never once in his life read a room. "Fourteen percent."</p>
                <p>At their feet, R4T5 swiveled his dish-shaped ears toward the horizon and made a small, unhappy noise. R4T5 made a great many small, unhappy noises; it was more or less his native language. But this one had a particular quality to it &mdash; the quality of a droid who has just done some arithmetic and not enjoyed the answer.</p>
                <p>"What's wrong with him?" said the Princess.</p>
                <p>"He says he is picking up vibrations. Large ones. Rhythmic." B3VR tilted his head. "He would also like it noted for the record that he wanted to stay on the ship."</p>
                <p>"Noted."</p>
                <p>The ground shivered. A little snow slid off the roof of the cave. Far out on the white plain, something enormous lifted one leg, thought it over, and put it down again.</p>
                <p>It was the size of an apartment building. It was made of armor plate and bad intentions. It had pointed ears, yellow eyes, and the general air of a creature that has just noticed something small moving near a hole.</p>
                <p>"Oh," said B3VR. "A CAT CAT Walker. How fascinating. They are loaded to the whiskers with Gutter Brigade, you know. I have always wanted to see one up close."</p>
                <p>"You're about to." Princess Lima Beans unslung her blaster, checked the charge, and brushed the frost from her whiskers with the weary grace of royalty forced, once again, to do everything herself. "Beaver, you're with me. Droid &mdash;"</p>
                <p>R4T5 had already hidden behind her.</p>
                <p>"&mdash; fine. Droid, you're morale."</p>
                <p>There were three more Walkers behind the first one. There are always three more.</p>
            `
        }
    };

    const story = stories[storyId];
    if (story) {
        document.getElementById('modalStoryContent').innerHTML = `
            <h2>${story.title}</h2>
            <p class="story-byline">by ${author}</p>
            <hr class="story-rule">
            ${story.content}
            <div class="story-cta">
                <p>What happens next? That part is yours.</p>
                <a href="#submit" class="btn btn-primary" onclick="closeStoryModal()">WRITE YOUR OWN TALE</a>
            </div>
        `;
        document.getElementById('storyModal').style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeStoryModal() {
    document.getElementById('storyModal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    const modal = document.getElementById('storyModal');
    if (event.target === modal) {
        closeStoryModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeStoryModal();
    }
});

// === CHARACTER ANIMATIONS ===
function initCharacterAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.character-card, .merch-item, .fanfic-item').forEach(card => {
        observer.observe(card);
    });

    initCharacterIntel();
}

// === CHARACTER INTEL ===
// Hover or keyboard focus reveals the description (CSS); a tap or click pins it open.
// The name and hint are added here so the markup the admin editor publishes stays unchanged.
function initCharacterIntel() {
    const cards = document.querySelectorAll('.character-card');

    function closeAll(except) {
        cards.forEach(card => {
            if (card !== except) {
                const overlay = card.querySelector('.character-overlay');
                if (overlay) overlay.classList.remove('show');
            }
        });
    }

    cards.forEach(card => {
        const frame = card.querySelector('.character-image');
        const overlay = card.querySelector('.character-overlay');
        const img = card.querySelector('img');
        if (!frame || !overlay || !img) return;

        const name = document.createElement('h3');
        name.className = 'character-name';
        name.textContent = img.alt;
        overlay.prepend(name);

        const hint = document.createElement('span');
        hint.className = 'character-hint';
        hint.textContent = 'INTEL';
        hint.setAttribute('aria-hidden', 'true');
        frame.appendChild(hint);

        card.tabIndex = 0;

        card.addEventListener('click', function() {
            closeAll(card);
            overlay.classList.toggle('show');
        });

        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeAll(card);
                overlay.classList.toggle('show');
            } else if (e.key === 'Escape') {
                overlay.classList.remove('show');
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.character-card')) closeAll(null);
    });
}

// === NOTIFICATION SYSTEM ===
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 400px;
        padding: 20px 25px;
        background: linear-gradient(135deg, rgba(0, 0, 50, 0.98), rgba(0, 0, 30, 0.98));
        border: 3px solid ${type === 'error' ? '#d32f2f' : type === 'success' ? '#00ffff' : type === 'warning' ? '#ff6b00' : '#ffd700'};
        border-radius: 5px;
        color: white;
        font-family: 'Rajdhani', sans-serif;
        font-size: 1rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 30px ${type === 'error' ? 'rgba(211, 47, 47, 0.5)' : type === 'success' ? 'rgba(0, 255, 255, 0.5)' : type === 'warning' ? 'rgba(255, 107, 0, 0.5)' : 'rgba(255, 215, 0, 0.5)'};
        z-index: 100000;
        animation: slideIn 0.3s ease-out;
        white-space: pre-line;
        line-height: 1.5;
    `;

    notification.textContent = message;

    // Add close button
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 10px;
        font-size: 1.5rem;
        cursor: pointer;
        color: #ffd700;
        line-height: 1;
    `;
    closeBtn.onclick = () => notification.remove();
    notification.appendChild(closeBtn);

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// === EASTER EGGS ===
// Track if easter egg has been activated
let easterEggActivated = false;

// Function to activate the cheese easter egg
function activateCheeseEasterEgg() {
    if (easterEggActivated) return; // Only activate once per session
    easterEggActivated = true;

    showNotification(
        '🧀 CHEAT CODE ACTIVATED! 🧀\n\n' +
        'May the Ju-Ju Vibes Keep Giving Groovy Mojo!',
        'success'
    );

    // Add special glow effect
    document.body.style.animation = 'cheeseGlow 2s ease-in-out';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 2000);
}

// Method 1: Konami Code easter egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

// Method 2: Type "cheese"
let typedKeys = [];
const cheeseSequence = ['c', 'h', 'e', 'e', 's', 'e'];

// Method 3: Triple-click logo counter
let logoClickCount = 0;
let logoClickTimer = null;

document.addEventListener('keydown', function(e) {
    // Check for Konami Code
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateCheeseEasterEgg();
    }

    // Check for "cheese" typed
    typedKeys.push(e.key.toLowerCase());
    typedKeys = typedKeys.slice(-6);

    if (typedKeys.join('') === cheeseSequence.join('')) {
        activateCheeseEasterEgg();
    }

    // Check for Ctrl+Shift+C
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        activateCheeseEasterEgg();
    }
});

// Method 4: Triple-click the logo
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.main-logo');
    if (logo) {
        logo.addEventListener('click', function(e) {
            logoClickCount++;

            // Reset counter after 1 second of no clicks
            clearTimeout(logoClickTimer);
            logoClickTimer = setTimeout(() => {
                logoClickCount = 0;
            }, 1000);

            // Activate on triple-click
            if (logoClickCount === 3) {
                activateCheeseEasterEgg();
                logoClickCount = 0;
            }
        });

        // Add a subtle hint cursor
        logo.style.cursor = 'pointer';
    }
});

// Add cheese glow animation
const cheeseStyle = document.createElement('style');
cheeseStyle.textContent = `
    @keyframes cheeseGlow {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.3) hue-rotate(30deg); }
    }
`;
document.head.appendChild(cheeseStyle);

console.log('%c🧀 RATS WARS 🧀', 'font-size: 20px; font-weight: bold; color: #ffd700; text-shadow: 0 0 10px #ffd700;');
console.log('%cMay the Cheese be with you!', 'font-size: 14px; color: #00ffff;');
console.log('%cTip: There are secret cheesy surprises hidden on this page...', 'font-size: 12px; color: #999;');

// === GALLERY & CHARACTER LAYOUT ===
// Auto-detect landscape images and span them across 2 columns
function initGalleryLayout() {
    var images = document.querySelectorAll('.gallery-item img, .character-image img');
    images.forEach(function(img) {
        if (img.complete || (img.getAttribute('width') && img.getAttribute('height'))) {
            checkLandscape(img);
        } else {
            img.addEventListener('load', function() {
                checkLandscape(this);
            });
        }
    });
}

function checkLandscape(img) {
    // Declared dimensions are available before the image downloads, so the grid doesn't reflow later
    var width = img.naturalWidth || Number(img.getAttribute('width'));
    var height = img.naturalHeight || Number(img.getAttribute('height'));
    if (width > height) {
        var gridItem = img.closest('.gallery-item, .character-card');
        if (gridItem) gridItem.classList.add('landscape');
    }
}

// === VISITOR COUNTER ===
// The old counting service (CounterAPI v1) shut down; GoatCounter's tracking
// script (in index.html) now records each visit, and this just reads the
// running total back from GoatCounter's public counter endpoint to display
// in the footer. Ad blockers that block analytics domains will block this
// too, same as the old service - the '---' fallback covers that case.
// PRIOR_COUNT carries over the tally from the old service, which had reached
// 300 visits when it shut down; GoatCounter started counting from zero.
const PRIOR_COUNT = 300;
function initVisitorCounter() {
    const counterElement = document.getElementById('visitorCount');
    if (!counterElement) return;

    fetch('https://ntommer.goatcounter.com/counter/TOTAL.json')
        .then(function(response) {
            if (!response.ok) throw new Error('bad response');
            return response.json();
        })
        .then(function(data) {
            const digits = String(data.count || '').replace(/[^0-9]/g, '');
            const total = digits ? Number(digits) + PRIOR_COUNT : null;
            counterElement.textContent = total !== null
                ? total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : '---';
        })
        .catch(function() {
            counterElement.textContent = '---';
        });
}
