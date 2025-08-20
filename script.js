if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

// Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// GSAP + ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);

// --- LOADING SEQUENCE ---

document.addEventListener('DOMContentLoaded', () => {
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        document.body.classList.add('loading'); // Only add loading if typewriter exists
        setTimeout(() => {
            const introSection = document.querySelector('.intro');
            if (introSection) {
                gsap.to(introSection, { opacity: 1, duration: 1 });
                initTypewriter();
            }

            // New GSAP animation for hero-links a
            const heroLinks = document.querySelector('.hero-links a');
            if (heroLinks) { // Only run if hero links exist
                gsap.from(".hero-links a", {
                    opacity: 0,
                    y: 20,
                    filter: "blur(6px)",
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out",
                    delay: 0.5 // Add a slight delay after intro animation
                });
            }
        }, 1000);
    } else {
        // For pages without typewriter effect (like portfolio.html)
        document.body.classList.remove('loading'); // Remove loading class if present
        lenis.start(); // Start lenis unconditionally
    }
});

// --- ANIMATIONS ---

// Typewriter Effect
const texts = ["kadri24", "Kadri Gjini", "Welcome"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterElement = document.getElementById('typewriter');
let firstTime = true;

function type() {
    const currentText = texts[textIndex];
    if (isDeleting) {
        typewriterElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentText.length) {
        if (firstTime && textIndex === 0) {
            document.body.classList.remove('loading'); // Re-enable for typewriter pages
            lenis.start(); // Re-enable for typewriter pages
            firstTime = false;
        }
        isDeleting = true;
        setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(type, 500);
    } else {
        setTimeout(type, isDeleting ? 80 : 150);
    }
}

function initTypewriter() {
    if (typewriterElement) {
        type();
    }
}



// My Story - Image Hover Effect
document.querySelectorAll('.game').forEach(game => {
    const imageId = game.dataset.image;
    const image = document.getElementById(imageId);

    game.addEventListener('mouseenter', () => {
        gsap.to(image, { opacity: 1, duration: 0.2 });
    });

    game.addEventListener('mouseleave', () => {
        gsap.to(image, { opacity: 0, duration: 0.2 });
    });
});

// Skills & Ambitions
const skillsAmbitionsSection = document.querySelector('.skills-ambitions');
if (skillsAmbitionsSection) {
    gsap.from(".skills-logos img", {
        scrollTrigger: {
            trigger: skillsAmbitionsSection,
            start: "top 80%",
            toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
    });
}

// Generic Scroll Reveal for .scroll-reveal-item
document.querySelectorAll('.scroll-reveal-item').forEach(item => {
    // Set initial state using GSAP
    gsap.set(item, { opacity: 0, y: 100, filter: "blur(10px)" });

    gsap.to(item, { // Use gsap.to to animate to default values
        scrollTrigger: {
            trigger: item.closest('section'),
            start: "top 75%",
            toggleActions: "play none none reverse",
        },
        opacity: 1, // Animate to full opacity
        y: 0,       // Animate to original Y position
        filter: "blur(0px)", // Animate to no blur
        duration: 1,
        ease: "power3.out",
    });
});

// Sync animation based on current time
window.addEventListener('load', () => {
    const now = new Date();
    const ms = now.getHours() * 3600000 + now.getMinutes() * 60000 + now.getSeconds() * 1000 + now.getMilliseconds();

    const animations = [
        {selector: '.g1', duration: 30000},
        {selector: '.g2', duration: 20000},
        {selector: '.g3', duration: 40000},
        {selector: '.g4', duration: 40000},
        {selector: '.g5', duration: 20000},
    ];

    animations.forEach(anim => {
        const el = document.querySelector(anim.selector);
        if (!el) return;
        const progress = (ms % anim.duration) / anim.duration;
        el.style.animationDelay = `-${progress * anim.duration}ms`;
    });
});