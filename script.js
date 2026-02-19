// ===================================
// SMOOTH SCROLL NAVIGATION
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// SCROLL-TRIGGERED ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for fade-in animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.about-card, .feature-item, .waitlist-content, .section-title, .section-label'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in-element');
        fadeInObserver.observe(el);
    });
});

// ===================================
// STAGGER ANIMATIONS FOR CARDS
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const aboutCards = document.querySelectorAll('.about-card');
    aboutCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.15}s`;
    });
});

// ===================================
// PARALLAX EFFECT ON SCROLL
// ===================================
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;

            // Parallax on hero title
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle && scrolled < window.innerHeight) {
                heroTitle.style.transform = `translateY(${scrolled * 0.3}px)`;
                heroTitle.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
            }

            // Parallax on hero subtitle
            const heroSubtitle = document.querySelector('.hero-subtitle');
            if (heroSubtitle && scrolled < window.innerHeight) {
                heroSubtitle.style.transform = `translateY(${scrolled * 0.2}px)`;
                heroSubtitle.style.opacity = 1 - (scrolled / window.innerHeight) * 0.6;
            }

            ticking = false;
        });
        ticking = true;
    }
});

// ===================================
// MAGNETIC BUTTON EFFECT
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const magneticButtons = document.querySelectorAll('.btn');

    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
});

// ===================================
// ACTIVE NAVIGATION STATE
// ===================================
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.style.color = 'var(--color-text-primary)';
            } else {
                navLink.style.color = '';
            }
        }
    });
});

// ===================================
// SMOOTH REVEAL ON HOVER
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.about-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.about-icon');
            if (icon) icon.style.transform = 'scale(1.1) rotate(5deg)';
        });

        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.about-icon');
            if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
});

// ===================================
// SCROLL PROGRESS INDICATOR
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 2px;
        background: var(--color-accent);
        width: 0%;
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
});

// ===================================
// WAITLIST FORM SUBMISSION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('waitlist-form');
    const successMsg = document.getElementById('waitlist-success');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
            Submitting...
        `;

        // Add spinner animation
        if (!document.getElementById('spin-style')) {
            const spinStyle = document.createElement('style');
            spinStyle.id = 'spin-style';
            spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
            document.head.appendChild(spinStyle);
        }

        try {
            const data = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Show success, hide form
                form.style.display = 'none';
                successMsg.classList.add('visible');
                window.scrollTo({ top: document.getElementById('waitlist').offsetTop - 100, behavior: 'smooth' });
            } else {
                throw new Error('Submission failed');
            }
        } catch (err) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            alert('Something went wrong. Please try again or email us directly.');
        }
    });
});
