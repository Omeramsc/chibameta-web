import './style.css'

const totalImages = 18;

// Cinematic Gallery Generation with Balanced Columns
const generateGallery = () => {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    // Create 3 columns
    const columns = [1, 2, 3].map(i => {
        const col = document.createElement('div');
        col.className = `portfolio-column col-${i}`;
        grid.appendChild(col);
        return col;
    });

    for (let i = 1; i <= totalImages; i++) {
        const item = document.createElement('div');
        item.className = 'grid-item reveal';
        item.setAttribute('data-full', `/assets/concerts/full/${i}.jpg`);
        item.setAttribute('data-index', i - 1);
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `View concert photography photo ${i} by Omer Turner`);
        
        item.innerHTML = `
            <img src="/assets/concerts/thumb/${i}.jpg" alt="Concert Photography by Omer Turner - Gallery Item ${i}" loading="lazy" aria-label="View full resolution version of concert photography ${i}">
            <div class="item-overlay">
                <span class="view-btn">VIEW</span>
            </div>
        `;

        
        setupTilt(item);

        // Distribute to the shortest column
        let shortest = columns[0];
        for (let j = 1; j < columns.length; j++) {
            if (columns[j].scrollHeight < shortest.scrollHeight) {
                shortest = columns[j];
            }
        }
        shortest.appendChild(item);
    }
};

// Magnetic Tilt Effect
const setupTilt = (el) => {
    el.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = el.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        
        const img = el.querySelector('img');
        const multiplier = 30; // Tilt intensity
        
        img.style.transform = `scale(1.1) rotateX(${-y * multiplier}deg) rotateY(${x * multiplier}deg)`;
    });

    el.addEventListener('mouseleave', () => {
        const img = el.querySelector('img');
        img.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
    });
};

// Column Parallax Engine
const setupParallax = () => {
    const grid = document.getElementById('portfolio-grid');
    if (!grid) return;

    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768) return; // Disable on mobile

        const sectionRect = grid.getBoundingClientRect();
        const sectionTop = sectionRect.top + window.scrollY;
        
        // Only start parallax when the section is near the viewport
        const startOffset = sectionTop - window.innerHeight;
        const scrolled = Math.max(0, window.scrollY - startOffset);

        const cols = document.querySelectorAll('.portfolio-column');
        const speeds = [0.05, -0.1, 0.08]; // Different speeds for each column
        
        cols.forEach((col, i) => {
            const shift = scrolled * speeds[i];
            col.style.transform = `translateY(${shift}px)`;
        });
    });
};

// Reveal Animations on Scroll
const revealElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
};

// Lightbox Logic
const setupLightbox = () => {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');
    const portfolioGrid = document.getElementById('portfolio-grid');
    let currentIndex = 0;
    let lastFocusedElement = null;

    const openLightbox = (index) => {
        if (index < 0) index = totalImages - 1;
        if (index >= totalImages) index = 0;
        
        currentIndex = index;
        const item = document.querySelector(`.grid-item[data-index="${index}"]`);
        if (!item) return;
        const fullSrc = item.getAttribute('data-full');
        
        lightboxImg.src = item.querySelector('img').src;
        const tempImg = new Image();
        tempImg.src = fullSrc;
        tempImg.onload = () => { if (currentIndex === index) lightboxImg.src = fullSrc; };
        
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    };



    const closeLightbox = () => {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocusedElement) lastFocusedElement.focus();
    };

    portfolioGrid.addEventListener('click', (e) => {
        const item = e.target.closest('.grid-item');
        if (!item) return;
        lastFocusedElement = item;
        openLightbox(parseInt(item.getAttribute('data-index')));
    });

    // Keyboard support for opening (Enter/Space)
    portfolioGrid.addEventListener('keydown', (e) => {
        const item = e.target.closest('.grid-item');
        if (item && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            lastFocusedElement = item;
            openLightbox(parseInt(item.getAttribute('data-index')));
        }
    });

    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
        if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
        
        // Basic Focus Trap
        if (e.key === 'Tab') {
            e.preventDefault();
            closeBtn.focus();
        }
    });
};

// Hero Parallax Effect
const heroParallax = () => {
    const heroImg = document.querySelector('.hero-bg img');
    if (!heroImg) return;
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            heroImg.style.transform = `scale(1.05) translateY(${scrolled * 0.3}px)`;
        }
    });
};

// Navbar Background & Signature Reveal on Scroll
const navbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    const portfolio = document.getElementById('portfolio');
    if (!navbar || !portfolio) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const portfolioTop = portfolio.offsetTop;

        // Hide navbar if we've scrolled to the portfolio section
        if (scrolled >= portfolioTop - 100) {
            navbar.classList.add('navbar--hidden');
        } else {
            navbar.classList.remove('navbar--hidden');
        }

        // Handle visual states when visible
        if (scrolled > 50 && scrolled < portfolioTop - 100) {
            navbar.style.background = 'rgba(3, 3, 3, 0.2)'; // Very subtle hint of a bar
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.height = '80px';
        } else {
            navbar.style.background = 'transparent';
            navbar.style.backdropFilter = 'none';
            navbar.style.height = '100px';
        }
    });
};

// Hero Content Fade on Scroll
const heroFade = () => {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroHeight = document.getElementById('hero').offsetHeight;
        
        // Fade out completely by the time we reach half of hero height
        let opacity = 1 - (scrolled / (heroHeight * 0.5));
        if (opacity < 0) opacity = 0;
        if (opacity > 1) opacity = 1;
        
        heroContent.style.opacity = opacity;
        
        // Hide completely to prevent any "drag" or overlap bugs
        if (opacity <= 0) {
            heroContent.style.visibility = 'hidden';
            heroContent.style.pointerEvents = 'none';
        } else {
            heroContent.style.visibility = 'visible';
            heroContent.style.pointerEvents = 'all';
        }
    });
};

// Randomize Hero Tagline
const randomizeTagline = () => {
    const subtitle = document.querySelector('.subtitle');
    if (!subtitle) return;
    
    const taglines = [
        "CAPTURING THE ENERGY OF LIVE MUSIC",
        "MOMENTS FROM THE FRONT ROW"
    ];
    
    const randomIndex = Math.floor(Math.random() * taglines.length);
    subtitle.textContent = taglines[randomIndex];
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generateGallery();
    setupParallax();
    revealElements();
    setupLightbox();
    heroParallax();
    navbarScroll();
    heroFade();
    randomizeTagline();
});

// For Vite HMR
if (import.meta.hot) {
    import.meta.hot.accept(() => {
        generateGallery();
        setupParallax();
        revealElements();
        setupLightbox();
    });
}
