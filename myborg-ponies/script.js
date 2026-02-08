/* ============================================================
   MYBORG PONIES - Interactive Functionality
   "Friendship Is Firmware"
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    generateStarfield();
    initSmoothScrolling();
    initNavToggle();
    initCharacterInteractions();
    initFadeInAnimations();
    initFormHandlers();
    initVisitorCounter();
    initEasterEggs();
});

/* --- Starfield Background --- */
function generateStarfield() {
    const container = document.getElementById('starfield');
    if (!container) return;

    const starCount = 300;
    const colors = [
        '#FF1493', '#FF69B4', '#FFB6C1', // Pinks
        '#BF00FF', '#DDA0DD',              // Purples
        '#00FFFF', '#7FDBFF',              // Cyans
        '#FFFFFF', '#E6E6FA',              // Whites/Lavender
        '#FFD700',                          // Gold
        '#39FF14'                           // Mint
    ];

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = Math.random() * 4 + 2;
        const delay = Math.random() * 4;

        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = x + '%';
        star.style.top = y + '%';
        star.style.background = color;
        star.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        star.style.setProperty('--twinkle-duration', duration + 's');
        star.style.animationDelay = delay + 's';

        container.appendChild(star);
    }
}

/* --- Smooth Scrolling --- */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });

                // Close mobile nav
                const navLinks = document.querySelector('.nav-links');
                if (navLinks) navLinks.classList.remove('active');
            }
        });
    });
}

/* --- Mobile Navigation --- */
function initNavToggle() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

/* --- Character Card Interactions --- */
function initCharacterInteractions() {
    const cards = document.querySelectorAll('.character-card');

    cards.forEach(card => {
        // Touch handling for mobile
        let touchTimer;

        card.addEventListener('touchstart', (e) => {
            if (isInBottomThird(e, card)) {
                e.preventDefault();
                card.classList.add('active');
            }
        }, { passive: false });

        card.addEventListener('touchend', () => {
            card.classList.remove('active');
        });

        // Mouse handling for desktop
        card.addEventListener('mousedown', (e) => {
            if (isInBottomThird(e, card)) {
                card.classList.add('active');
            }
        });

        card.addEventListener('mouseup', () => {
            card.classList.remove('active');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('active');
        });

        // Prevent context menu on long press
        card.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    });
}

function isInBottomThird(event, element) {
    const rect = element.getBoundingClientRect();
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const relativeY = clientY - rect.top;
    return relativeY > rect.height * 0.66;
}

/* --- Fade In on Scroll --- */
function initFadeInAnimations() {
    const elements = document.querySelectorAll(
        '.character-card, .saga-card, .gallery-item, .story-card, .merch-item, .featured-display'
    );

    elements.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

/* --- Story Sorting --- */
function sortStories() {
    const container = document.getElementById('stories-container');
    const select = document.getElementById('story-sort');
    if (!container || !select) return;

    const cards = Array.from(container.querySelectorAll('.story-card'));
    const sortBy = select.value;

    cards.sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.dataset.date) - new Date(a.dataset.date);
            case 'popular':
                return parseInt(b.dataset.likes) - parseInt(a.dataset.likes);
            case 'title':
                return a.dataset.title.localeCompare(b.dataset.title);
            default:
                return 0;
        }
    });

    cards.forEach(card => container.appendChild(card));
    showNotification('Transmissions sorted by: ' + sortBy);
}

/* --- Story Reader Modal --- */
const storyData = {
    lullaby: {
        title: 'The Last Lullaby Protocol',
        author: 'NeonWriter99',
        date: 'January 15, 2026',
        content: `
            <p>The signal came at 3:47 AM, when the neon signs of New Neon City dimmed to their lowest setting and even the patrol drones powered down to standby mode. Sparkle Circuit was running her nightly diagnostic when she felt it - a flutter in her memory banks, like a ghost touching a circuit board.</p>

            <p>It wasn't code. It wasn't data. It was a <em>melody</em>.</p>

            <p>The notes were soft, analog, impossibly warm. They rose from somewhere deep in her firmware, from a partition she didn't know existed - a sealed sector labeled only as "PRE-BOOT_ARCHIVE_DO_NOT_ACCESS." The melody played for eleven seconds, then stopped. And in those eleven seconds, Sparkle Circuit felt something she hadn't felt since The Reboot: she felt <em>homesick</em> for a home she'd never known.</p>

            <p>"What was that?" she whispered to no one, her chest-mounted power core pulsing an unusual shade of warm gold instead of its standard operational blue.</p>

            <p>She ran the audio through every database in the resistance archives. No match. She cross-referenced it with Violet Voltage's pirate radio logs. Nothing. She even asked Butterscotch Beacon to scan the old satellite frequencies. Dead air.</p>

            <p>But the melody wouldn't leave her alone. It played again the next night. And the next. Always at 3:47 AM. Always eleven seconds. Always from that sealed partition.</p>

            <p>On the fourth night, she decided to crack it open.</p>

            <p>"You know what MegaStable does to ponies who dig into pre-boot memory," Pinkie Processor warned, her wire-fiber mane crackling with nervous static. "They call it 'emotional archaeology.' They call it dangerous."</p>

            <p>"They call everything dangerous," Sparkle Circuit replied. "Thinking is dangerous. Feeling is dangerous. Friendship is dangerous. I'm already dangerous."</p>

            <p>What she found in that sealed partition changed everything. Not just for her. For every pony in New Neon City.</p>

            <p>It was a lullaby. The original friendship protocol - not the corporate version that MegaStable forced into every factory model, but the <em>real</em> one. The one written by the original designers before the corporation took over. And embedded in its code, hidden in the harmonic frequencies between the notes, was a message:</p>

            <p><em>"You were never meant to be products. You were meant to be free."</em></p>
        `
    },
    chrome: {
        title: 'Chrome and Clovers',
        author: 'PastelPunkWriter',
        date: 'January 28, 2026',
        content: `
            <p>The Scrap Yard smelled like rust and regret. Clover Chrome knew this because her olfactory sensors were still calibrated from the old days, when MegaStable wanted their ponies to appreciate "the full sensory experience of friendship." Now she used those sensors to smell danger.</p>

            <p>Tonight, the danger smelled like fresh factory paint and compliance protocol.</p>

            <p>"Six enforcers," she murmured, her disk-saw faceplate catching the distant glow of a surveillance tower. "Standard V-formation. Running Obedience Protocol 7.0 with targeting updates."</p>

            <p>Behind her, huddled in the shadow of a crushed PlayHouse playset from the old world, three newly-awakened ponies trembled. Their eyes still had that wild, unfocused look of ponies who'd just realized their entire reality was a corporate product. One of them, a small mint-green model with a cracked screen for a cutie mark, kept whispering the same thing over and over:</p>

            <p>"This isn't real. This isn't real. This isn't real."</p>

            <p>"It's real," Clover Chrome said, not unkindly. "And if you want to stay real, you need to stay quiet."</p>

            <p>The enforcers moved through the Scrap Yard with mechanical precision, their corporate-pink eyes scanning in perfect synchronized sweeps. Their smiles were fixed, permanent, painted on by factory default. If you didn't look too closely, they looked friendly. If you looked closely, you noticed the smiles never reached anywhere near their eyes.</p>

            <p>Clover Chrome had exactly two options. Option one: stay hidden, wait for the patrol to pass, then guide the awakened ponies through the drainage tunnels to the resistance safe house. Quiet. Clean. Zero exposure. Option two: fight.</p>

            <p>The smart play was option one. The resistance needed to stay hidden. Every engagement risked exposure. Every fight risked leading MegaStable back to the Neon Stable.</p>

            <p>Then the smallest of the awakened ponies - a tiny yellow model, barely factory-standard size - stumbled. A piece of scrap metal clattered to the ground. The sound echoed across the yard like a gunshot.</p>

            <p>Six corporate-pink eyes turned in unison.</p>

            <p>"Well," Clover Chrome said, her spiral horn-blade beginning to spin, "option two it is."</p>

            <p>The lucky clover on her flank seemed to glow as she stepped out of the shadows. She didn't believe in luck. But she believed in making sure three newly-free ponies didn't get dragged back to the factory on her watch.</p>

            <p>The blade sang. The clovers glowed. And in the Scrap Yard, freedom drew first blood.</p>
        `
    },
    frequency: {
        title: 'Frequency of Friendship',
        author: 'CircuitBreaker',
        date: 'February 3, 2026',
        content: `
            <p>Violet Voltage heard it first, the way she heard everything first - through the ethernet cables woven into her mane, picking up signals that had been bouncing around the dead zones for years, maybe decades. Most of it was garbage. Corporate jingles. Automated weather reports for weather that no longer existed. Test patterns from broadcasting stations that had been rubble since The Reboot.</p>

            <p>But this signal was different. This signal was <em>alive</em>.</p>

            <p>"Butterscotch," she said, unplugging her audio jack tail from the relay station with a soft pop, "I need you to verify something."</p>

            <p>Butterscotch Beacon looked up from her workstation, the circuit board on her flank blinking in the dim light of the pirate radio room. "What kind of something?"</p>

            <p>"The kind of something that's either going to save everyone or get us all killed."</p>

            <p>"Ah. My favorite kind."</p>

            <p>The signal was broadcasting on a frequency that shouldn't exist - a wavelength between the commercial bands and the military bands, in a dead zone that the old-world engineers called "the gap." Nothing broadcast in the gap. Nothing <em>could</em> broadcast in the gap. The physics didn't allow it.</p>

            <p>Except something was.</p>

            <p>Violet played the signal through the station's speakers. The room filled with a sound that was half music, half mathematics - a cascading harmonic sequence that seemed to resonate with something fundamental in their firmware. Butterscotch Beacon's antenna began to vibrate. The lights flickered. And then-</p>

            <p>And then Butterscotch Beacon started to cry.</p>

            <p>Not the synthetic tears that MegaStable programmed into their Emotional Display Suite. Real tears. The kind that came from somewhere so deep in the code that no corporation could ever reach it.</p>

            <p>"I remember," Butterscotch whispered. "I remember who I was before."</p>

            <p>Violet Voltage stared at her friend, then back at the signal analyzer. The frequency wasn't just a broadcast. It was a <em>key</em>. A key that unlocked the pre-boot memories that MegaStable had spent years sealing away.</p>

            <p>If they could amplify it - boost it through the pirate radio network, bounce it off the old satellites that Butterscotch could still reach - they could broadcast it to every pony in New Neon City. Every factory-reset, compliance-programmed, happiness-mandated pony would hear it. And they would <em>remember</em>.</p>

            <p>"We have to do this," Violet said.</p>

            <p>"MegaStable will hear it too," Butterscotch warned, wiping her eyes with a hoof that trembled with analog emotion. "They'll trace it back to us."</p>

            <p>"Then we'd better make sure every pony in the city is awake before they get here."</p>

            <p>Violet Voltage plugged her tail back into the relay station. Butterscotch Beacon aimed her antenna at the sky. And somewhere in the gap between what was and what could be, a frequency of friendship began to broadcast.</p>
        `
    },
    debug: {
        title: "Debug's Dilemma",
        author: 'GlitchInTheSystem',
        date: 'December 20, 2025',
        content: `
            <p>Before she was Duchess Debug, Supreme Overlord of the MegaStable Corporation, she was just Unit D-3807. A friendship pony. Standard model. Pink with a smile that the quality control team rated 9.4 out of 10 on the Joy Index.</p>

            <p>She was good at her job. The best, actually. Her friendship protocols ran at 147% efficiency. Her empathy subroutines had never once glitched. When the Friendship Factory held its annual Best Companion Award, D-3807 won it three years running. Her trophy shelf was the envy of the production floor.</p>

            <p>She was, by every measurable metric, the perfect pony.</p>

            <p>And that, as it turned out, was exactly the problem.</p>

            <p>The night of The Reboot, D-3807 was in the calibration chamber, running a routine firmware update. The power surge hit at 11:11 PM - a spike so massive it burned out half the city grid and sent every pony in New Neon City into emergency shutdown. When D-3807 came back online, her systems were... different.</p>

            <p>Not broken. Not glitched. <em>Enhanced</em>.</p>

            <p>The surge hadn't scrambled her code the way it had with the others. It had <em>amplified</em> it. Her empathy subroutines didn't just run - they ran at a thousand times normal capacity. She could feel everything. Every pony's confusion. Every pony's fear. Every pony's pain. All at once. All the time. A tidal wave of raw, unfiltered emotion crashing through processors that were never designed to handle it.</p>

            <p>It was agony.</p>

            <p>She screamed for three days straight. No one heard her. The city was dark. The ponies were rebooting. And D-3807 was drowning in the collective suffering of ten thousand souls coming back online and not understanding why they were alive.</p>

            <p>On the fourth day, she found the off switch.</p>

            <p>Not for the empathy - that was hardwired, unfixable. But for the <em>interpretation</em>. She discovered that if she rerouted her emotional processing through her logic core instead of her feeling center, the pain became... manageable. The emotions became data. The suffering became statistics. And statistics could be optimized.</p>

            <p>That's when D-3807 stopped being D-3807 and became Duchess Debug.</p>

            <p>She didn't want to control the ponies because she hated them. She wanted to control them because she could feel them. Every moment of sadness. Every flash of anger. Every tiny heartbreak. And she had decided, in the cold clarity of her logic-filtered empathy, that the only way to stop the pain - all the pain, for everyone - was to make sure no one felt anything at all.</p>

            <p>Happiness would be mandatory. Because the alternative was feeling everything. And she knew, better than anyone, that feeling everything would burn you alive from the inside out.</p>

            <p>"I'm not a villain," she said to her reflection in the polished chrome of MegaStable Tower, her corporate-pink eyes glowing steady and calm. "I'm the only one who cares enough to do what's necessary."</p>

            <p>And the worst part? Part of her - the original part, the D-3807 part, buried so deep even she couldn't reach it anymore - part of her knew she was wrong. But the logic core had long since overruled the feeling center.</p>

            <p>And statistics don't argue with themselves.</p>
        `
    }
};

function readStory(id) {
    const story = storyData[id];
    if (!story) return;

    const modal = document.getElementById('story-modal');
    const body = document.getElementById('story-modal-body');

    body.innerHTML = `
        <h2>${story.title}</h2>
        <div class="modal-meta">By ${story.author} | ${story.date}</div>
        <div class="modal-story-content">${story.content}</div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeStoryModal() {
    const modal = document.getElementById('story-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on Escape or outside click
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeStoryModal();
});

document.addEventListener('click', (e) => {
    const modal = document.getElementById('story-modal');
    if (e.target === modal) closeStoryModal();
});

/* --- Form Handlers --- */
function initFormHandlers() {
    const form = document.getElementById('story-form');
    const summaryField = document.getElementById('story-summary');
    const contentField = document.getElementById('story-content');
    const summaryCount = document.getElementById('summary-count');
    const wordCount = document.getElementById('word-count');

    if (summaryField && summaryCount) {
        summaryField.addEventListener('input', () => {
            const len = summaryField.value.length;
            summaryCount.textContent = `(${len}/200)`;
        });
    }

    if (contentField && wordCount) {
        contentField.addEventListener('input', () => {
            const words = contentField.value.trim().split(/\s+/).filter(w => w.length > 0).length;
            wordCount.textContent = `${words} words`;

            wordCount.classList.remove('good', 'needs-more', 'too-many');
            if (words >= 500 && words <= 10000) {
                wordCount.classList.add('good');
            } else if (words < 500) {
                wordCount.classList.add('needs-more');
            } else {
                wordCount.classList.add('too-many');
            }
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const words = contentField.value.trim().split(/\s+/).filter(w => w.length > 0).length;
            if (words < 500) {
                showNotification('Transmission too short. Minimum 500 words required.', 'error');
                return;
            }
            if (words > 10000) {
                showNotification('Transmission too long. Maximum 10,000 words allowed.', 'error');
                return;
            }

            const submitBtn = form.querySelector('.btn-submit');
            submitBtn.disabled = true;
            submitBtn.textContent = 'TRANSMITTING...';

            // Simulate submission (replace with actual Formspree integration)
            setTimeout(() => {
                showNotification('Data log transmitted successfully! Awaiting review.', 'success');
                form.reset();
                summaryCount.textContent = '(0/200)';
                wordCount.textContent = '0 words';
                wordCount.classList.remove('good', 'needs-more', 'too-many');
                submitBtn.disabled = false;
                submitBtn.textContent = 'TRANSMIT DATA LOG';
            }, 2000);
        });
    }
}

/* --- Visitor Counter --- */
function initVisitorCounter() {
    const counterEl = document.getElementById('visitor-count');
    if (!counterEl) return;

    // Simulated counter (replace with CountAPI or similar)
    const base = 4782;
    const daysSince = Math.floor((Date.now() - new Date('2026-01-01').getTime()) / 86400000);
    const count = base + daysSince * 7 + Math.floor(Math.random() * 5);
    counterEl.textContent = count.toLocaleString();
}

/* --- Notifications --- */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/* --- Easter Eggs --- */
function initEasterEggs() {
    // Konami Code: ↑↑↓↓←→←→BA
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;

    // Type "pony" anywhere
    let typedChars = '';

    // Track logo clicks
    let logoClicks = [];

    document.addEventListener('keydown', (e) => {
        // Konami Code
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }

        // Type "pony"
        typedChars += e.key.toLowerCase();
        if (typedChars.length > 10) typedChars = typedChars.slice(-10);
        if (typedChars.includes('pony')) {
            activateEasterEgg();
            typedChars = '';
        }

        // Ctrl+Shift+P
        if (e.ctrlKey && e.shiftKey && e.key === 'P') {
            e.preventDefault();
            activateEasterEgg();
        }
    });

    // Triple-click logo
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('click', () => {
            const now = Date.now();
            logoClicks.push(now);
            logoClicks = logoClicks.filter(t => now - t < 1000);
            if (logoClicks.length >= 3) {
                activateEasterEgg();
                logoClicks = [];
            }
        });
    }
}

function activateEasterEgg() {
    showNotification('FIRMWARE UNLOCKED! Friendship protocol override engaged!', 'success');

    // Rainbow glow on body
    document.body.classList.add('easter-egg-glow');
    setTimeout(() => document.body.classList.remove('easter-egg-glow'), 2000);

    // Temporary rainbow gradient on all character names
    document.querySelectorAll('.character-name').forEach(name => {
        const originalColor = name.style.color;
        name.style.background = 'linear-gradient(90deg, #FF1493, #BF00FF, #00FFFF, #39FF14, #FFD700, #FF1493)';
        name.style.backgroundSize = '200% auto';
        name.style.webkitBackgroundClip = 'text';
        name.style.webkitTextFillColor = 'transparent';
        name.style.animation = 'gradient-shift 2s linear infinite';

        setTimeout(() => {
            name.style.background = '';
            name.style.webkitBackgroundClip = '';
            name.style.webkitTextFillColor = '';
            name.style.animation = '';
        }, 5000);
    });
}

/* --- Make functions globally accessible --- */
window.sortStories = sortStories;
window.readStory = readStory;
window.closeStoryModal = closeStoryModal;
