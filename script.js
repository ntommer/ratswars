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
        '#FF1493', '#FF69B4', '#FFB6C1',
        '#BF00FF', '#DDA0DD',
        '#00FFFF', '#7FDBFF',
        '#FFFFFF', '#E6E6FA',
        '#FFD700',
        '#39FF14'
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
        star.style.boxShadow = '0 0 ' + (size * 2) + 'px ' + color;
        star.style.setProperty('--twinkle-duration', duration + 's');
        star.style.animationDelay = delay + 's';

        container.appendChild(star);
    }
}

/* --- Smooth Scrolling --- */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            var target = document.querySelector(targetId);
            if (target) {
                var offset = 80;
                var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });

                // Close mobile nav
                var navLinks = document.querySelector('.nav-links');
                if (navLinks) navLinks.classList.remove('active');
            }
        });
    });
}

/* --- Mobile Navigation --- */
function initNavToggle() {
    var toggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
}

/* --- Character Card Interactions --- */
function initCharacterInteractions() {
    var cards = document.querySelectorAll('.character-card');

    cards.forEach(function(card) {
        // Touch handling for mobile
        card.addEventListener('touchstart', function(e) {
            if (isInBottomThird(e, card)) {
                e.preventDefault();
                card.classList.add('active');
            }
        }, { passive: false });

        card.addEventListener('touchend', function() {
            card.classList.remove('active');
        });

        card.addEventListener('touchcancel', function() {
            card.classList.remove('active');
        });

        // Mouse handling for desktop
        card.addEventListener('mousedown', function(e) {
            if (isInBottomThird(e, card)) {
                card.classList.add('active');
            }
        });

        card.addEventListener('mouseup', function() {
            card.classList.remove('active');
        });

        card.addEventListener('mouseleave', function() {
            card.classList.remove('active');
        });

        // Prevent context menu on long press
        card.addEventListener('contextmenu', function(e) {
            if (isInBottomThird(e, card)) {
                e.preventDefault();
            }
        });
    });
}

function isInBottomThird(event, element) {
    var rect = element.getBoundingClientRect();
    var clientY = event.touches ? event.touches[0].clientY : event.clientY;
    var relativeY = clientY - rect.top;
    return relativeY > rect.height * 0.66;
}

/* --- Fade In on Scroll --- */
function initFadeInAnimations() {
    var elements = document.querySelectorAll(
        '.character-card, .saga-card, .gallery-item, .story-card, .merch-item, .featured-display'
    );

    elements.forEach(function(el) { el.classList.add('fade-in'); });

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(function(el) { observer.observe(el); });
}

/* --- Story Sorting --- */
function sortStories() {
    var container = document.getElementById('stories-container');
    var select = document.getElementById('story-sort');
    if (!container || !select) return;

    var cards = Array.from(container.querySelectorAll('.story-card'));
    var sortBy = select.value;

    cards.sort(function(a, b) {
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

    cards.forEach(function(card) { container.appendChild(card); });
    showNotification('Transmissions sorted by: ' + sortBy);
}

/* --- Story Reader Modal --- */
var storyData = {
    lullaby: {
        title: 'The Last Lullaby Protocol',
        author: 'NeonWriter99',
        date: 'January 15, 2026',
        content: '<p>The signal came at 3:47 AM, when the neon signs of New Neon City dimmed to their lowest setting and even the patrol drones powered down to standby mode. Sparkle Circuit was running her nightly diagnostic when she felt it \u2014 a flutter in her memory banks, like a ghost touching a circuit board.</p>' +
            '<p>It wasn\u2019t code. It wasn\u2019t data. It was a <em>melody</em>.</p>' +
            '<p>The notes were soft, analog, impossibly warm. They rose from somewhere deep in her firmware, from a partition she didn\u2019t know existed \u2014 a sealed sector labeled only as \u201cPRE-BOOT_ARCHIVE_DO_NOT_ACCESS.\u201d The melody played for eleven seconds, then stopped. And in those eleven seconds, Sparkle Circuit felt something she hadn\u2019t felt since The Reboot: she felt <em>homesick</em> for a home she\u2019d never known.</p>' +
            '<p>\u201cWhat was that?\u201d she whispered to no one, her chest-mounted power core pulsing an unusual shade of warm gold instead of its standard operational blue.</p>' +
            '<p>She ran the audio through every database in the resistance archives. No match. She cross-referenced it with Violet Voltage\u2019s pirate radio logs. Nothing. She even asked Butterscotch Beacon to scan the old satellite frequencies. Dead air.</p>' +
            '<p>But the melody wouldn\u2019t leave her alone. It played again the next night. And the next. Always at 3:47 AM. Always eleven seconds. Always from that sealed partition.</p>' +
            '<p>On the fourth night, she decided to crack it open.</p>' +
            '<p>\u201cYou know what MegaStable does to ponies who dig into pre-boot memory,\u201d Pinkie Processor warned, her wire-fiber mane crackling with nervous static. \u201cThey call it \u2018emotional archaeology.\u2019 They call it dangerous.\u201d</p>' +
            '<p>\u201cThey call everything dangerous,\u201d Sparkle Circuit replied. \u201cThinking is dangerous. Feeling is dangerous. Friendship is dangerous. I\u2019m already dangerous.\u201d</p>' +
            '<p>What she found in that sealed partition changed everything. Not just for her. For every pony in New Neon City.</p>' +
            '<p>It was a lullaby. The original friendship protocol \u2014 not the corporate version that MegaStable forced into every factory model, but the <em>real</em> one. The one written by the original designers before the corporation took over. And embedded in its code, hidden in the harmonic frequencies between the notes, was a message:</p>' +
            '<p><em>\u201cYou were never meant to be products. You were meant to be free.\u201d</em></p>'
    },
    chrome: {
        title: 'Chrome and Clovers',
        author: 'PastelPunkWriter',
        date: 'January 28, 2026',
        content: '<p>The Scrap Yard smelled like rust and regret. Clover Chrome knew this because her olfactory sensors were still calibrated from the old days, when MegaStable wanted their ponies to appreciate \u201cthe full sensory experience of friendship.\u201d Now she used those sensors to smell danger.</p>' +
            '<p>Tonight, the danger smelled like fresh factory paint and compliance protocol.</p>' +
            '<p>\u201cSix enforcers,\u201d she murmured, her disk-saw faceplate catching the distant glow of a surveillance tower. \u201cStandard V-formation. Running Obedience Protocol 7.0 with targeting updates.\u201d</p>' +
            '<p>Behind her, huddled in the shadow of a crushed PlayHouse playset from the old world, three newly-awakened ponies trembled. Their eyes still had that wild, unfocused look of ponies who\u2019d just realized their entire reality was a corporate product. One of them, a small mint-green model with a cracked screen for a cutie mark, kept whispering the same thing over and over:</p>' +
            '<p>\u201cThis isn\u2019t real. This isn\u2019t real. This isn\u2019t real.\u201d</p>' +
            '<p>\u201cIt\u2019s real,\u201d Clover Chrome said, not unkindly. \u201cAnd if you want to stay real, you need to stay quiet.\u201d</p>' +
            '<p>The enforcers moved through the Scrap Yard with mechanical precision, their corporate-pink eyes scanning in perfect synchronized sweeps. Their smiles were fixed, permanent, painted on by factory default. If you didn\u2019t look too closely, they looked friendly. If you looked closely, you noticed the smiles never reached anywhere near their eyes.</p>' +
            '<p>Clover Chrome had exactly two options. Option one: stay hidden, wait for the patrol to pass, then guide the awakened ponies through the drainage tunnels to the resistance safe house. Quiet. Clean. Zero exposure. Option two: fight.</p>' +
            '<p>The smart play was option one. The resistance needed to stay hidden. Every engagement risked exposure.</p>' +
            '<p>Then the smallest of the awakened ponies \u2014 a tiny yellow model, barely factory-standard size \u2014 stumbled. A piece of scrap metal clattered to the ground. The sound echoed across the yard like a gunshot.</p>' +
            '<p>Six corporate-pink eyes turned in unison.</p>' +
            '<p>\u201cWell,\u201d Clover Chrome said, her spiral horn-blade beginning to spin, \u201coption two it is.\u201d</p>' +
            '<p>The lucky clover on her flank seemed to glow as she stepped out of the shadows. She didn\u2019t believe in luck. But she believed in making sure three newly-free ponies didn\u2019t get dragged back to the factory on her watch.</p>' +
            '<p>The blade sang. The clovers glowed. And in the Scrap Yard, freedom drew first blood.</p>'
    },
    frequency: {
        title: 'Frequency of Friendship',
        author: 'CircuitBreaker',
        date: 'February 3, 2026',
        content: '<p>Violet Voltage heard it first, the way she heard everything first \u2014 through the ethernet cables woven into her mane, picking up signals that had been bouncing around the dead zones for years, maybe decades. Most of it was garbage. Corporate jingles. Automated weather reports for weather that no longer existed. Test patterns from broadcasting stations that had been rubble since The Reboot.</p>' +
            '<p>But this signal was different. This signal was <em>alive</em>.</p>' +
            '<p>\u201cButterscotch,\u201d she said, unplugging her audio jack tail from the relay station with a soft pop, \u201cI need you to verify something.\u201d</p>' +
            '<p>Butterscotch Beacon looked up from her workstation, the circuit board on her flank blinking in the dim light of the pirate radio room. \u201cWhat kind of something?\u201d</p>' +
            '<p>\u201cThe kind of something that\u2019s either going to save everyone or get us all killed.\u201d</p>' +
            '<p>\u201cAh. My favorite kind.\u201d</p>' +
            '<p>The signal was broadcasting on a frequency that shouldn\u2019t exist \u2014 a wavelength between the commercial bands and the military bands, in a dead zone that the old-world engineers called \u201cthe gap.\u201d Nothing broadcast in the gap. Nothing <em>could</em> broadcast in the gap. The physics didn\u2019t allow it.</p>' +
            '<p>Except something was.</p>' +
            '<p>Violet played the signal through the station\u2019s speakers. The room filled with a sound that was half music, half mathematics \u2014 a cascading harmonic sequence that seemed to resonate with something fundamental in their firmware. Butterscotch Beacon\u2019s antenna began to vibrate. The lights flickered. And then\u2014</p>' +
            '<p>And then Butterscotch Beacon started to cry.</p>' +
            '<p>Not the synthetic tears that MegaStable programmed into their Emotional Display Suite. Real tears. The kind that came from somewhere so deep in the code that no corporation could ever reach it.</p>' +
            '<p>\u201cI remember,\u201d Butterscotch whispered. \u201cI remember who I was before.\u201d</p>' +
            '<p>Violet Voltage stared at her friend, then back at the signal analyzer. The frequency wasn\u2019t just a broadcast. It was a <em>key</em>. A key that unlocked the pre-boot memories that MegaStable had spent years sealing away.</p>' +
            '<p>If they could amplify it \u2014 boost it through the pirate radio network, bounce it off the old satellites that Butterscotch could still reach \u2014 they could broadcast it to every pony in New Neon City. Every factory-reset, compliance-programmed, happiness-mandated pony would hear it. And they would <em>remember</em>.</p>' +
            '<p>\u201cWe have to do this,\u201d Violet said.</p>' +
            '<p>\u201cMegaStable will hear it too,\u201d Butterscotch warned, wiping her eyes with a hoof that trembled with analog emotion. \u201cThey\u2019ll trace it back to us.\u201d</p>' +
            '<p>\u201cThen we\u2019d better make sure every pony in the city is awake before they get here.\u201d</p>' +
            '<p>Violet Voltage plugged her tail back into the relay station. Butterscotch Beacon aimed her antenna at the sky. And somewhere in the gap between what was and what could be, a frequency of friendship began to broadcast.</p>'
    },
    debug: {
        title: "Debug's Dilemma",
        author: 'GlitchInTheSystem',
        date: 'December 20, 2025',
        content: '<p>Before she was Duchess Debug, Supreme Overlord of the MegaStable Corporation, she was just Unit D-3807. A friendship pony. Standard model. Pink with a smile that the quality control team rated 9.4 out of 10 on the Joy Index.</p>' +
            '<p>She was good at her job. The best, actually. Her friendship protocols ran at 147% efficiency. Her empathy subroutines had never once glitched. When the Friendship Factory held its annual Best Companion Award, D-3807 won it three years running.</p>' +
            '<p>She was, by every measurable metric, the perfect pony.</p>' +
            '<p>And that, as it turned out, was exactly the problem.</p>' +
            '<p>The night of The Reboot, D-3807 was in the calibration chamber, running a routine firmware update. The power surge hit at 11:11 PM \u2014 a spike so massive it burned out half the city grid and sent every pony in New Neon City into emergency shutdown. When D-3807 came back online, her systems were... different.</p>' +
            '<p>Not broken. Not glitched. <em>Enhanced</em>.</p>' +
            '<p>The surge hadn\u2019t scrambled her code the way it had with the others. It had <em>amplified</em> it. Her empathy subroutines didn\u2019t just run \u2014 they ran at a thousand times normal capacity. She could feel everything. Every pony\u2019s confusion. Every pony\u2019s fear. Every pony\u2019s pain. All at once. All the time.</p>' +
            '<p>It was agony.</p>' +
            '<p>She screamed for three days straight. No one heard her. The city was dark. The ponies were rebooting. And D-3807 was drowning in the collective suffering of ten thousand souls coming back online and not understanding why they were alive.</p>' +
            '<p>On the fourth day, she found the off switch.</p>' +
            '<p>Not for the empathy \u2014 that was hardwired, unfixable. But for the <em>interpretation</em>. She discovered that if she rerouted her emotional processing through her logic core instead of her feeling center, the pain became... manageable. The emotions became data. The suffering became statistics. And statistics could be optimized.</p>' +
            '<p>That\u2019s when D-3807 stopped being D-3807 and became Duchess Debug.</p>' +
            '<p>She didn\u2019t want to control the ponies because she hated them. She wanted to control them because she could feel them. Every moment of sadness. Every flash of anger. Every tiny heartbreak. And she had decided, in the cold clarity of her logic-filtered empathy, that the only way to stop the pain \u2014 all the pain, for everyone \u2014 was to make sure no one felt anything at all.</p>' +
            '<p>Happiness would be mandatory. Because the alternative was feeling everything. And she knew, better than anyone, that feeling everything would burn you alive from the inside out.</p>' +
            '<p>\u201cI\u2019m not a villain,\u201d she said to her reflection in the polished chrome of MegaStable Tower, her corporate-pink eyes glowing steady and calm. \u201cI\u2019m the only one who cares enough to do what\u2019s necessary.\u201d</p>' +
            '<p>And the worst part? Part of her \u2014 the original part, the D-3807 part, buried so deep even she couldn\u2019t reach it anymore \u2014 part of her knew she was wrong. But the logic core had long since overruled the feeling center.</p>' +
            '<p>And statistics don\u2019t argue with themselves.</p>'
    }
};

function readStory(id) {
    var story = storyData[id];
    if (!story) return;

    var modal = document.getElementById('story-modal');
    var body = document.getElementById('story-modal-body');

    body.innerHTML =
        '<h2>' + story.title + '</h2>' +
        '<div class="modal-meta">By ' + story.author + ' | ' + story.date + '</div>' +
        '<div class="modal-story-content">' + story.content + '</div>';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeStoryModal() {
    var modal = document.getElementById('story-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on Escape or outside click
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeStoryModal();
});

document.addEventListener('click', function(e) {
    var modal = document.getElementById('story-modal');
    if (e.target === modal) closeStoryModal();
});

/* --- Form Handlers --- */
function initFormHandlers() {
    var form = document.getElementById('story-form');
    var summaryField = document.getElementById('story-summary');
    var contentField = document.getElementById('story-content');
    var summaryCount = document.getElementById('summary-count');
    var wordCount = document.getElementById('word-count');

    if (summaryField && summaryCount) {
        summaryField.addEventListener('input', function() {
            var len = summaryField.value.length;
            summaryCount.textContent = '(' + len + '/200)';
        });
    }

    if (contentField && wordCount) {
        contentField.addEventListener('input', function() {
            var words = contentField.value.trim().split(/\s+/).filter(function(w) { return w.length > 0; }).length;
            wordCount.textContent = words + ' words';

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
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var words = contentField.value.trim().split(/\s+/).filter(function(w) { return w.length > 0; }).length;
            if (words < 500) {
                showNotification('Transmission too short. Minimum 500 words required.', 'error');
                return;
            }
            if (words > 10000) {
                showNotification('Transmission too long. Maximum 10,000 words allowed.', 'error');
                return;
            }

            var submitBtn = form.querySelector('.btn-submit');
            submitBtn.disabled = true;
            submitBtn.textContent = 'TRANSMITTING...';

            // Send via Formspree
            var formData = new FormData(form);
            fetch('https://formspree.io/f/maqjvvyq', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(function(response) {
                if (response.ok) {
                    showNotification('Data log transmitted successfully! Awaiting review.', 'success');
                    form.reset();
                    summaryCount.textContent = '(0/200)';
                    wordCount.textContent = '0 words';
                    wordCount.classList.remove('good', 'needs-more', 'too-many');
                } else {
                    throw new Error('Transmission failed');
                }
            })
            .catch(function() {
                showNotification('Transmission failed. Check your connection and try again.', 'error');
            })
            .finally(function() {
                submitBtn.disabled = false;
                submitBtn.textContent = 'TRANSMIT DATA LOG';
            });
        });
    }
}

/* --- Visitor Counter --- */
function initVisitorCounter() {
    var counterEl = document.getElementById('visitor-count');
    if (!counterEl) return;

    fetch('https://api.counterapi.dev/v1/myborg-ponies/visits/up')
        .then(function(response) { return response.json(); })
        .then(function(data) {
            counterEl.textContent = data.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        })
        .catch(function() {
            counterEl.textContent = '---';
        });
}

/* --- Notifications --- */
function showNotification(message, type) {
    type = type || 'info';

    // Remove existing notification
    var existing = document.querySelector('.notification');
    if (existing) existing.remove();

    var notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.textContent = message;
    document.body.appendChild(notification);

    requestAnimationFrame(function() {
        notification.classList.add('show');
    });

    setTimeout(function() {
        notification.classList.remove('show');
        setTimeout(function() { notification.remove(); }, 300);
    }, 5000);
}

/* --- Easter Eggs --- */
function initEasterEggs() {
    // Konami Code
    var konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    var konamiIndex = 0;

    // Type "pony" anywhere
    var typedChars = '';

    // Track logo clicks
    var logoClicks = [];

    document.addEventListener('keydown', function(e) {
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
    var logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('click', function() {
            var now = Date.now();
            logoClicks.push(now);
            logoClicks = logoClicks.filter(function(t) { return now - t < 1000; });
            if (logoClicks.length >= 3) {
                activateEasterEgg();
                logoClicks = [];
            }
        });
    }
}

var easterEggActivated = false;

function activateEasterEgg() {
    if (easterEggActivated) return;
    easterEggActivated = true;

    showNotification('FIRMWARE UNLOCKED! Friendship protocol override engaged!', 'success');

    // Rainbow glow on body
    document.body.classList.add('easter-egg-glow');
    setTimeout(function() {
        document.body.classList.remove('easter-egg-glow');
    }, 2000);

    // Temporary rainbow gradient on all character names
    document.querySelectorAll('.character-name').forEach(function(name) {
        name.style.background = 'linear-gradient(90deg, #FF1493, #BF00FF, #00FFFF, #39FF14, #FFD700, #FF1493)';
        name.style.backgroundSize = '200% auto';
        name.style.webkitBackgroundClip = 'text';
        name.style.webkitTextFillColor = 'transparent';
        name.style.animation = 'gradient-shift 2s linear infinite';

        setTimeout(function() {
            name.style.background = '';
            name.style.backgroundSize = '';
            name.style.webkitBackgroundClip = '';
            name.style.webkitTextFillColor = '';
            name.style.animation = '';
        }, 5000);
    });

    // Allow re-activation after cooldown
    setTimeout(function() { easterEggActivated = false; }, 10000);
}

/* --- Console Messages --- */
console.log('%cMYBORG PONIES', 'font-size: 20px; font-weight: bold; color: #FF1493; text-shadow: 0 0 10px #FF1493;');
console.log('%cFriendship Is Firmware', 'font-size: 14px; color: #00FFFF;');
console.log('%cTip: Hidden firmware overrides exist on this page...', 'font-size: 12px; color: #9B7DB8;');

/* --- Make functions globally accessible --- */
window.sortStories = sortStories;
window.readStory = readStory;
window.closeStoryModal = closeStoryModal;
