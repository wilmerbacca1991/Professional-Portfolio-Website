// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Viewport height fix for mobile (address bar)
    function setViewportHeight(){
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            const isDark = !document.body.classList.contains('light-theme');
            localStorage.setItem('darkTheme', isDark);
            themeToggle.innerHTML = isDark ? '🌗' : '🌓';
        });

        // Check for saved theme preference
        const prefersDark = localStorage.getItem('darkTheme') === 'true';
        if (prefersDark) {
            document.body.classList.remove('light-theme');
            themeToggle.innerHTML = '🌗';
        }
    }
});

// Section navigation - show/hide sections on click
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const targetId = href.substring(1);
            
            // Don't intercept contact or home links - let them scroll normally
            if (targetId === 'contact' || targetId === 'home' || href === '#') {
                return; // Allow default scroll behavior
            }
            
            e.preventDefault();
            
            const targetSection = document.getElementById(targetId);
            
            if (targetSection && targetSection.classList.contains('section-content')) {
                // Hide all section-content sections
                document.querySelectorAll('.section-content').forEach(section => {
                    section.classList.remove('active');
                });
                
                // Show the target section
                targetSection.classList.add('active');
                
                // Scroll to the section
                setTimeout(() => {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        });
    });
});

// Smooth scroll for anchor links (for contact and home)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#contact' || href === '#home' || href === '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Navbar scroll behavior
let lastScroll = 0;
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.classList.add('navbar-hidden');
    } else {
        navbar.classList.remove('navbar-hidden');
    }
    lastScroll = currentScroll;
});

// Form validation and submission handling
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (!this.checkValidity()) {
            e.stopPropagation();
            this.classList.add('was-validated');
            return;
        }

        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading-spinner"></span>Sending...';

        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: new FormData(this),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Show success message
                const alert = document.createElement('div');
                alert.className = 'alert alert-success mt-3';
                alert.role = 'alert';
                alert.innerHTML = 'Message sent successfully! I\'ll get back to you soon.';
                this.appendChild(alert);
                this.reset();
                this.classList.remove('was-validated');
                
                // Remove alert after 5 seconds
                setTimeout(() => alert.remove(), 5000);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            // Show error message
            const alert = document.createElement('div');
            alert.className = 'alert alert-danger mt-3';
            alert.role = 'alert';
            alert.innerHTML = 'There was a problem sending your message. Please try again later.';
            this.appendChild(alert);
            
            // Remove alert after 5 seconds
            setTimeout(() => alert.remove(), 5000);
        }

        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    });
}

// Project card animations
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
document.querySelectorAll('.project-card').forEach(card => {
    if(!isTouch){
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    }
});

// Handle prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function handleReducedMotion() {
    document.body.classList.toggle('reduce-motion', prefersReducedMotion.matches);
}
prefersReducedMotion.addEventListener('change', handleReducedMotion);
handleReducedMotion();