// Typewriter Portfolio Animation System
// Using Lenis + GSAP for smooth scrolling

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    touchMultiplier: 2
});

// GSAP + Lenis Integration
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Update ScrollTrigger when Lenis scrolls
lenis.on('scroll', ScrollTrigger.update);

// Document Ready
document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initParallaxEffects();
});

// Typewriter Effect
function initTypewriter() {
    const texts = ["kadri24", "coming soon"];
    const typewriterElement = document.getElementById('typewriter');
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeAnimation() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            // Remove characters (backspace effect)
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length; // Move to next text
                setTimeout(typeAnimation, 500); // Pause before typing next text
                return;
            }
            setTimeout(typeAnimation, 80); // Faster backspace
        } else {
            // Add characters (typing effect)
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(typeAnimation, 2000); // Pause before deleting (2 seconds)
                return;
            }
            setTimeout(typeAnimation, 150); // Normal typing speed
        }
    }

    // Clear initial text and start animation
    typewriterElement.textContent = '';
    
    // Start typing after a brief delay
    setTimeout(() => {
        typeAnimation();
    }, 1000);
}

// Parallax Effects for Hero Info
function initParallaxEffects() {
    // Hero info parallax
    const heroInfo = document.querySelector('.hero-info');
    if (heroInfo) {
        gsap.to(heroInfo, {
            y: -30,
            ease: "none",
            scrollTrigger: {
                trigger: heroInfo,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }
}

// Performance optimization
ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
}); 