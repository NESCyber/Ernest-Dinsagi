/* -------------------------------------------------------------
   THE STORY WE ONCE WROTE - INTERACTION & ANIMATION LOGIC
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. LOADING SCREEN
    // ==========================================
    const loader = document.getElementById('loader');
    const progressBar = document.querySelector('.loader-progress');
    
    // Simulate loading progress based on document state
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Hide loader after reaching 100%
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    loader.style.display = 'none';
                    // Trigger typewriter check in case section 6 is somehow visible
                    checkReveal();
                }, 800);
            }, 500);
        }
        progressBar.style.width = `${progress}%`;
    }, 80);

    // ==========================================
    // 2. CANVAS PARTICLES (Floating Stars / Embers)
    // ==========================================
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = { x: null, y: null, radius: 100 };

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Blueprints
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height + canvas.height; // Start below screen or randomly
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = -(Math.random() * 0.5 + 0.2); // Slow upward float
            // Pink, gold or white tint
            const colorChoices = [
                'rgba(255, 141, 161, ', // accent pink
                'rgba(212, 175, 55, ',  // gold
                'rgba(255, 255, 255, '  // white
            ];
            this.colorBase = colorChoices[Math.floor(Math.random() * colorChoices.length)];
            this.opacity = Math.random() * 0.5 + 0.1;
            this.alphaDirection = Math.random() > 0.5 ? 0.005 : -0.005; // Twinkle factor
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.colorBase + this.opacity + ')';
            ctx.fill();
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Twinkle opacity oscillation
            this.opacity += this.alphaDirection;
            if (this.opacity > 0.75 || this.opacity < 0.05) {
                this.alphaDirection = -this.alphaDirection;
            }

            // Recycle particles that drift off top
            if (this.y < -10) {
                this.y = canvas.height + 10;
                this.x = Math.random() * canvas.width;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            if (this.x < -10 || this.x > canvas.width + 10) {
                this.speedX = -this.speedX;
            }

            // Mouse interaction push
            if (mouse.x != null && mouse.y != null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    let directionX = dx / distance;
                    let directionY = dy / distance;
                    this.x += directionX * force * 1.5;
                    this.y += directionY * force * 1.5;
                }
            }
        }
    }

    // Initialize particles
    function initParticles() {
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 11000);
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
            // Randomize current Y so they don't start clustered at bottom
            particlesArray[i].y = Math.random() * canvas.height;
        }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    // Animation Loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // ==========================================
    // 3. BACKGROUND MUSIC (Audio Controller)
    // ==========================================
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const playIcon = document.querySelector('.icon-play');
    const muteIcon = document.querySelector('.icon-mute');
    const audioContainer = document.getElementById('audioContainer');

    // Reduce volume slightly to make it an ambient backing track
    bgMusic.volume = 0.35;

    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play()
                .then(() => {
                    playIcon.classList.add('hidden');
                    muteIcon.classList.remove('hidden');
                    audioContainer.classList.add('playing');
                })
                .catch(err => {
                    console.log("Audio autoplay prevented by browser permissions.", err);
                });
        } else {
            bgMusic.pause();
            playIcon.classList.remove('hidden');
            muteIcon.classList.add('hidden');
            audioContainer.classList.remove('playing');
        }
    });


    // ==========================================
    // 4. NAVIGATION BAR (Sticky & Mobile responsive)
    // ==========================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinksList = document.getElementById('navLinks');
    const navLinks = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');

    // Scroll listener for sticky background
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        highlightNav();
    });

    // Mobile Menu Toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksList.classList.toggle('active');
    });

    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksList.classList.remove('active');
        });
    });

    // Highlight current active link depending on viewport position
    function highlightNav() {
        let scrollPos = window.scrollY + 200; // Offset
        sections.forEach(section => {
            if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${section.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }


    // ==========================================
    // 5. SCROLL REVEAL (Intersection Observer)
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve if we only want animation once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Fallback trigger in case scroll position is loaded midway
    function checkReveal() {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                el.classList.add('revealed');
            }
        });
    }


    // ==========================================
    // 6. TYPEWRITER EFFECT (Love Letter)
    // ==========================================
    const loveLetterContainer = document.getElementById('loveLetterText');
    const letterSection = document.getElementById('letter');
    
    const letterParagraphs = [
        "<p class='letter-salutation'>To Dinsagi,</p>",
        "<p>There are chapters in our lives that we write with permanent ink, and ours is one of them. Looking back at the classrooms in Tamale, the quiet moments sharing tea while the world rushed around us, and the times we couldn't stand to be apart for even a second, I realize how deeply you shaped my world. I loved you with every fiber of my being.</p>",
        "<p>Although our paths have diverged, and the silence has taken the place of our conversations, none of that dims the light of what we shared. I write this not to hold on, but to honor what was. If I had the choice, in another life, I would still choose you.</p>",
        "<p class='letter-closing'>With respect and warmth,</p>",
        "<p class='letter-signature'>Always ❤️</p>"
    ];

    let letterStarted = false;

    // Observer to start typing when letter is visible
    const letterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !letterStarted) {
                letterStarted = true;
                startTypewriter();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    letterObserver.observe(letterSection);

    function startTypewriter() {
        loveLetterContainer.innerHTML = '';
        loveLetterContainer.classList.add('typewriter-cursor');
        
        let pIndex = 0;
        let charIndex = 0;
        let currentHTML = "";
        
        function typeChar() {
            if (pIndex < letterParagraphs.length) {
                // If opening a new paragraph, extract structural tags
                const fullParaText = letterParagraphs[pIndex];
                
                // Parse out the tag and target text inside
                // e.g. <p class='...'>Text</p>
                const openingTagMatch = fullParaText.match(/^<p[^>]*>/);
                const openingTag = openingTagMatch ? openingTagMatch[0] : "<p>";
                const rawText = fullParaText.replace(/^<p[^>]*>/, '').replace(/<\/p>$/, '');
                
                if (charIndex === 0) {
                    currentHTML += openingTag;
                }
                
                // Handle inner tags (like <em> or ❤️ emoji bounds) safely
                // Simple parser to output characters
                if (charIndex < rawText.length) {
                    let char = rawText[charIndex];
                    // Skip over standard styling tags if present (e.g. <em>) to avoid typing HTML code
                    if (char === '<') {
                        let tagCloseIndex = rawText.indexOf('>', charIndex);
                        if (tagCloseIndex !== -1) {
                            currentHTML += rawText.substring(charIndex, tagCloseIndex + 1);
                            charIndex = tagCloseIndex + 1;
                            setTimeout(typeChar, 15);
                            return;
                        }
                    }
                    
                    currentHTML += char;
                    loveLetterContainer.innerHTML = currentHTML + "</p>";
                    charIndex++;
                    
                    // Typing speed adjustments: spaces/punctuation pause slightly longer
                    let speed = 22;
                    if (char === '.' || char === ',' || char === '!') {
                        speed = 350; // Dramatic pause
                    } else if (char === ' ') {
                        speed = 30;
                    }
                    setTimeout(typeChar, speed);
                } else {
                    currentHTML += "</p>";
                    loveLetterContainer.innerHTML = currentHTML;
                    pIndex++;
                    charIndex = 0;
                    setTimeout(typeChar, 400); // Pause before next paragraph
                }
            } else {
                // Done typing
                loveLetterContainer.classList.remove('typewriter-cursor');
            }
        }
        
        typeChar();
    }


    // ==========================================
    // 7. MASONRY LAZY IMAGE LOADER
    // ==========================================
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    lazyImages.forEach(img => {
        function showImage() {
            img.classList.add('loaded');
            // Hide the background SVG icon/placeholder slowly once true image is loaded
            const placeholder = img.previousElementSibling;
            if (placeholder && (placeholder.classList.contains('gallery-placeholder') || placeholder.classList.contains('svg-placeholder-container'))) {
                placeholder.style.opacity = '0';
                setTimeout(() => placeholder.style.display = 'none', 500);
            }
        }

        if (img.complete && img.naturalWidth > 0) {
            // Already loaded successfully
            showImage();
        } else {
            // Wait for it to load
            img.addEventListener('load', showImage);
        }
        
        // If image fails, keep showing the clean custom SVG vector placeholder
        img.addEventListener('error', () => {
            img.style.display = 'none';
        });
    });


    // ==========================================
    // 8. FULLSCREEN LIGHTBOX GALLERY
    // ==========================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    let activeImageIndex = 0;
    
    // Open lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-index')) - 1;
            openLightbox(index);
        });
    });
    
    function openLightbox(index) {
        activeImageIndex = index;
        const currentItem = galleryItems[activeImageIndex];
        const img = currentItem.querySelector('img');
        const title = currentItem.querySelector('.gallery-overlay h3').innerText;
        const desc = currentItem.querySelector('.gallery-overlay p').innerText;
        
        // Update lightbox content
        // If the real image isn't available, we show a styled canvas/SVG message inside lightbox
        if (img && img.classList.contains('loaded')) {
            lightboxImg.src = img.src;
            lightboxImg.style.display = 'block';
        } else {
            // Fallback for visual check if local files are missing
            const placeholderSvg = currentItem.querySelector('svg').cloneNode(true);
            lightboxImg.style.display = 'none';
            // Custom drawing placeholder
            lightboxImg.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(placeholderSvg));
            lightboxImg.style.display = 'block';
        }
        
        lightboxCaption.innerHTML = `<strong>${title}</strong><br>${desc}`;
        
        // Show lightbox
        lightbox.setAttribute('aria-hidden', 'false');
        setTimeout(() => {
            lightbox.style.opacity = '1';
            lightbox.classList.add('show-img');
        }, 50);
        
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    }
    
    // Close Lightbox
    function closeLightbox() {
        lightbox.classList.remove('show-img');
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.setAttribute('aria-hidden', 'true');
        }, 400);
        document.body.style.overflow = ''; // Unlock scroll
    }
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Click on backdrop closing
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === document.querySelector('.lightbox-content-wrapper')) {
            closeLightbox();
        }
    });

    // Navigation arrows
    function showNextImage() {
        activeImageIndex = (activeImageIndex + 1) % galleryItems.length;
        openLightbox(activeImageIndex);
    }
    
    function showPrevImage() {
        activeImageIndex = (activeImageIndex - 1 + galleryItems.length) % galleryItems.length;
        openLightbox(activeImageIndex);
    }
    
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (lightbox.getAttribute('aria-hidden') === 'false') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    });

    // ==========================================
    // 10. INTERACTIVE CLICK HEARTS EFFECT
    // ==========================================
    document.addEventListener('click', (e) => {
        // Prevent heart spawns on buttons, links, or visualizer bars to avoid visual overlap
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) {
            return;
        }

        const heart = document.createElement('span');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤️';
        
        // Random horizontal travel and rotation
        const tx = (Math.random() * 80 - 40) + 'px';
        const rot = (Math.random() * 60 - 30) + 'deg';
        heart.style.setProperty('--tx', tx);
        heart.style.setProperty('--rot', rot);
        
        // Position at cursor
        heart.style.left = e.pageX + 'px';
        heart.style.top = e.pageY + 'px';
        
        document.body.appendChild(heart);
        
        // Delete after animation completes
        setTimeout(() => {
            heart.remove();
        }, 1200);
    });

    // ==========================================
    // 11. TIMELINE TIME SPAN COUNTER (Animate count-up)
    // ==========================================
    function animateCounter(elementId, targetValue, duration = 2000) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentValue = Math.floor(easeProgress * targetValue);
            element.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = targetValue.toLocaleString();
            }
        }
        
        requestAnimationFrame(update);
    }

    const beginningSection = document.getElementById('beginning');
    let counterStarted = false;
    
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counterStarted) {
                counterStarted = true;
                
                // Calculate date difference dynamically: 15 May 2021 to 3 May 2026
                const startDate = new Date('2021-05-15T08:00:00');
                const endDate = new Date('2026-05-03T12:00:00');
                const diffMs = endDate - startDate;
                
                const targetDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const targetHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const targetMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                
                animateCounter('spanDays', targetDays, 2200);
                animateCounter('spanHours', targetHours, 1800);
                animateCounter('spanMinutes', targetMinutes, 1500);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    if (beginningSection) counterObserver.observe(beginningSection);

    // ==========================================
    // 12. ANNIVERSARY VAULT LOCK BOX
    // ==========================================
    const lockInput = document.getElementById('lockInput');
    const lockSubmitBtn = document.getElementById('lockSubmitBtn');
    const lockMessage = document.getElementById('lockMessage');
    const hiddenMemoryCard = document.getElementById('hiddenMemoryCard');
    const vaultLockIcon = document.getElementById('vaultLockIcon');
    
    if (lockSubmitBtn && lockInput) {
        function checkVaultCode() {
            const code = lockInput.value.trim();
            // Code represents official beginning date: 07-06-2021 (07062021)
            if (code === '07062021') {
                lockMessage.textContent = 'Decryption successful. Vault unlocked ❤️';
                lockMessage.className = 'lock-message success';
                vaultLockIcon.textContent = '🔓';
                hiddenMemoryCard.classList.remove('hidden');
                
                // Lock elements
                lockInput.disabled = true;
                lockSubmitBtn.disabled = true;
            } else {
                lockMessage.textContent = 'Incorrect date. Reflect on the beginning milestone...';
                lockMessage.className = 'lock-message error';
                lockInput.value = '';
                lockInput.focus();
            }
        }
        
        lockSubmitBtn.addEventListener('click', checkVaultCode);
        lockInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') checkVaultCode();
        });
    }
});

// ==========================================
// 9. VIDEO PLAYBACK CONTROL
// ==========================================
function togglePlay(videoId, overlayId) {
    const video = document.getElementById(videoId);
    const overlay = document.getElementById(overlayId);
    
    if (video.paused) {
        // Pause all other playing videos first
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach(v => {
            if (v.id !== videoId && !v.paused) {
                v.pause();
                // Show corresponding overlay
                const otherOverlayId = v.id.replace('memoryVideo', 'videoOverlay');
                const otherOverlay = document.getElementById(otherOverlayId);
                if (otherOverlay) otherOverlay.classList.remove('hidden');
            }
        });
        
        // Play selected video
        video.play()
            .then(() => {
                overlay.classList.add('hidden');
            })
            .catch(err => {
                console.log("Video playback error: ", err);
            });
    } else {
        video.pause();
        overlay.classList.remove('hidden');
    }
    
    // When video ends, show overlay controls again
    video.onended = () => {
        overlay.classList.remove('hidden');
    };
}
