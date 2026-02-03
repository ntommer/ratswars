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
    // In a real implementation, this would fetch the full story from a database
    const stories = {
        1: {
            title: 'The Battle of Cheese Station',
            author: 'SpaceRodent42',
            content: `
                <h2>The Battle of Cheese Station</h2>
                <p><em>by SpaceRodent42</em></p>
                <hr style="border-color: #ffd700; margin: 20px 0;">

                <p>The alarms shrieked through the corridors of Cheese Station, their wailing cry echoing off the aged metal walls. Captain Whiskers' whiskers twitched as he studied the holographic display before him—six Imperial cruisers, emerging from hyperspace like hunters closing in on wounded prey.</p>

                <p>"How long until they're in firing range?" he asked, his voice steady despite the fear gnawing at his gut.</p>

                <p>"Twelve minutes, sir," replied Lieutenant Squeakers, her paws dancing across the control console. "Maybe fifteen if we're lucky."</p>

                <p>Whiskers' gaze swept across the command center. Young faces, all of them. Most had joined the rebellion within the past year, drawn by tales of freedom and justice. They didn't deserve to die here, not like this.</p>

                <p>"Begin evacuation procedures," he ordered. "Priority alpha—get everyone to the escape pods."</p>

                <p>"What about the cheese, sir?" Squeakers asked quietly.</p>

                <p>Ah yes, the cheese. Cheese Station wasn't just a hiding spot—it housed the largest repository of aged cheddar in the known galaxy. The rebellion had spent years gathering it, stockpile by stockpile, knowing that whoever controlled the cheese controlled the hearts and minds of rodents across the stars.</p>

                <p>"We can't take it with us," Whiskers said, the words tasting bitter on his tongue. "And we can't let the Empire have it."</p>

                <p>He turned to face his crew, seeing the understanding dawn in their eyes. If they couldn't save the cheese, they'd have to destroy it. Destroy years of work, countless resources, and perhaps the rebellion's last hope of turning the tide of this war.</p>

                <p>"Set the self-destruct," he commanded. "We have ten minutes to get every soul off this station."</p>

                <p>As his crew scrambled to comply, Whiskers allowed himself one last look at the massive storage chambers visible through the viewport. Mountains of golden cheddar, aged to perfection, each wheel a small fortune. In another life, another war, it might have been beautiful.</p>

                <p>"Sir, incoming transmission from the lead Imperial cruiser," Squeakers announced.</p>

                <p>"Put it through."</p>

                <p>The holographic display shimmered, resolving into the sneering face of Admiral Claws, his feline features twisted with triumph.</p>

                <p>"Captain Whiskers, how delightful to finally meet you. Surrender the station and its contents, and I promise your crew will be treated with... minimal hostility."</p>

                <p>Whiskers smiled, showing his teeth. "Admiral, I have a counter-offer."</p>

                <p>"I'm listening."</p>

                <p>"You can have the station," Whiskers said calmly. "But you'll have to pick up the pieces."</p>

                <p>He cut the transmission and turned to his crew. "Everyone out. Now. That's an order."</p>

                <p>Eight minutes later, the last escape pod launched from Cheese Station. From his position at the helm of the pod, Whiskers watched the station growing smaller in the distance. The Imperial cruisers were closing in, no doubt preparing boarding parties.</p>

                <p>His paw hovered over the detonation trigger.</p>

                <p>"For the rebellion," he whispered, and pressed the button.</p>

                <p>The explosion lit up space like a newborn star. Cheese Station, and all the Empire's dreams of conquest, became nothing more than debris and memory.</p>

                <p>In the pod's silence, broken only by the soft breathing of his crew, Whiskers allowed himself a moment of grief. They had lost the cheese, lost the station, lost precious resources.</p>

                <p>But they had won something more important: they had shown the Empire that some things, some freedoms, were worth more than any treasure. And as long as rebels like them drew breath, the fight would continue.</p>

                <p>"Set course for the Rendezvous Point," he ordered. "And someone tell command we're going to need a new plan."</p>

                <p>As the pod's engines hummed to life, carrying them away from the wreckage, Whiskers couldn't help but smile. The Empire might have won this battle, but the war was far from over.</p>

                <p style="text-align: center; margin-top: 40px;"><em>— THE END —</em></p>
            `
        },
        2: {
            title: "Commander Squeak's First Flight",
            author: 'GalacticTail',
            content: `
                <h2>Commander Squeak's First Flight</h2>
                <p><em>by GalacticTail</em></p>
                <hr style="border-color: #ffd700; margin: 20px 0;">

                <p>The simulator pod smelled of metal and fear—mostly the fear. Squeak's paws trembled as she strapped herself into the pilot's seat, the harness cutting into her shoulders like a physical manifestation of her anxiety.</p>

                <p>"This is just a simulation," she whispered to herself. "Just a simulation. Nothing can actually hurt you."</p>

                <p>But her body didn't believe her. Her heart hammered against her ribs like it was trying to escape, and her breath came in short, sharp gasps.</p>

                <p>"Cadet Squeak, you may begin when ready," came the instructor's voice through the comm system.</p>

                <p><em>Ready</em>. What a concept. Was anyone ever truly ready for their first flight?</p>

                <p style="text-align: center; margin-top: 40px;"><em>— To be continued... —</em></p>
                <p style="text-align: center; color: #00ffff;">This is a demo. In a production environment, full stories would be stored in a database.</p>
            `
        },
        3: {
            title: 'The Mystery of the Dark Rodent',
            author: 'TailWriter99',
            content: `
                <h2>The Mystery of the Dark Rodent</h2>
                <p><em>by TailWriter99</em></p>
                <hr style="border-color: #ffd700; margin: 20px 0;">

                <p>Agent Scurry had investigated many strange occurrences during his time with Rebel Intelligence, but this was different. This was <em>wrong</em>.</p>

                <p>The reports had started three weeks ago: a shadowy figure spotted in the lower decks of the Flagship. At first, command dismissed them as stress-induced hallucinations—space travel did that to some rats. But then the figure was captured on security footage.</p>

                <p>Sort of.</p>

                <p>The image was grainy, distorted, as if reality itself bent around the figure. But there was no mistaking the silhouette: a rat, standing in a corridor where no rat should have been. And then, between one frame and the next, it was gone.</p>

                <p style="text-align: center; margin-top: 40px;"><em>— To be continued... —</em></p>
                <p style="text-align: center; color: #00ffff;">This is a demo. In a production environment, full stories would be stored in a database.</p>
            `
        },
        4: {
            title: 'Love in the Time of Hyperspace',
            author: 'StarshipRomance',
            content: `
                <h2>Love in the Time of Hyperspace</h2>
                <p><em>by StarshipRomance</em></p>
                <hr style="border-color: #ffd700; margin: 20px 0;">

                <p>"Hand me the plasma wrench," Engineer Rat said, his voice muffled from inside the hyperdrive housing.</p>

                <p>Tech Rat grabbed the tool from the kit, her circuits-tattooed paws steady despite the ship's violent shaking. "Here. But I'm telling you, the problem isn't mechanical—it's in the navigational computer."</p>

                <p>"And I'm telling <em>you</em>," Engineer Rat emerged from the housing, fur matted with grease, "that if we don't stabilize the plasma flow, the navigational computer won't matter because we'll be scattered across three star systems."</p>

                <p>They glared at each other for a moment, the hyperdrive's ominous whine filling the silence between them.</p>

                <p style="text-align: center; margin-top: 40px;"><em>— To be continued... —</em></p>
                <p style="text-align: center; color: #00ffff;">This is a demo. In a production environment, full stories would be stored in a database.</p>
            `
        }
    };

    const story = stories[storyId];
    if (story) {
        document.getElementById('modalStoryContent').innerHTML = story.content;
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

    // Initialize tap-and-hold for character cards
    initCharacterTapAndHold();
}

// === CHARACTER TAP AND HOLD ===
function initCharacterTapAndHold() {
    const characterCards = document.querySelectorAll('.character-card');

    characterCards.forEach(card => {
        const overlay = card.querySelector('.character-overlay');
        const imageContainer = card.querySelector('.character-image');
        let isTouchingBottomThird = false;

        // Helper function to check if touch/click is in bottom third
        function isInBottomThird(event, element) {
            const rect = element.getBoundingClientRect();
            const y = event.clientY || (event.touches && event.touches[0].clientY);
            const relativeY = y - rect.top;
            const threshold = rect.height * (2/3); // Bottom third starts at 2/3 down
            return relativeY >= threshold;
        }

        // Touch events (mobile)
        imageContainer.addEventListener('touchstart', function(e) {
            if (isInBottomThird(e, imageContainer)) {
                isTouchingBottomThird = true;
                e.preventDefault();
                overlay.classList.add('show');
            } else {
                isTouchingBottomThird = false;
            }
        }, { passive: false });

        imageContainer.addEventListener('touchend', function(e) {
            if (isTouchingBottomThird) {
                e.preventDefault();
                overlay.classList.remove('show');
                isTouchingBottomThird = false;
            }
        }, { passive: false });

        imageContainer.addEventListener('touchcancel', function(e) {
            if (isTouchingBottomThird) {
                e.preventDefault();
            }
            overlay.classList.remove('show');
            isTouchingBottomThird = false;
        }, { passive: false });

        // Mouse events (desktop) - press and hold
        imageContainer.addEventListener('mousedown', function(e) {
            if (isInBottomThird(e, imageContainer)) {
                e.preventDefault();
                overlay.classList.add('show');
            }
        });

        imageContainer.addEventListener('mouseup', function(e) {
            overlay.classList.remove('show');
        });

        imageContainer.addEventListener('mouseleave', function(e) {
            overlay.classList.remove('show');
        });

        // Prevent context menu on long press in bottom third only
        imageContainer.addEventListener('contextmenu', function(e) {
            if (isInBottomThird(e, imageContainer)) {
                e.preventDefault();
            }
        });
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

// === VISITOR COUNTER ===
// GitHub repository configuration
const GITHUB_CONFIG = {
    owner: 'ntommer',
    repo: 'ratswars',
    branch: 'main',
    filePath: 'visitor-count.json'
};

// Initialize visitor counter
async function initVisitorCounter() {
    try {
        await fetchAndDisplayCount();
        await incrementVisitorCount();
    } catch (error) {
        console.error('Error initializing visitor counter:', error);
        const counterElement = document.getElementById('visitorCount');
        if (counterElement) {
            counterElement.textContent = 'Error loading count';
        }
    }
}

// Fetch the current visitor count from GitHub
async function fetchAndDisplayCount() {
    try {
        // Fetch from raw GitHub URL (public, no auth needed)
        const rawUrl = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.filePath}`;
        const response = await fetch(rawUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch visitor count');
        }

        const data = await response.json();
        const counterElement = document.getElementById('visitorCount');

        if (counterElement) {
            counterElement.textContent = formatNumber(data.count || 0);
        }

        return data;
    } catch (error) {
        console.error('Error fetching visitor count:', error);
        throw error;
    }
}

// Increment the visitor count using serverless API
async function incrementVisitorCount() {
    try {
        // Call the serverless function (no authentication needed - handled server-side!)
        const response = await fetch('/api/increment-visitor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Failed to increment visitor count');
            return;
        }

        const data = await response.json();

        if (data.success) {
            console.log(`Visitor count updated to ${data.count}`);
            // Update the display with the new count
            const counterElement = document.getElementById('visitorCount');
            if (counterElement) {
                counterElement.textContent = formatNumber(data.count);
            }
        } else {
            console.error('Error from API:', data.error);
        }
    } catch (error) {
        console.error('Error incrementing visitor count:', error);
        // Don't throw - just log the error so page load continues
    }
}

// Format number with commas for better readability
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
