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
    const synchronizeAnimations = () => {
            const animatedElements = document.querySelectorAll('.g1, .g2, .g3, .g4, .g5');
            const nowInSeconds = Date.now() / 1000;

            animatedElements.forEach(element => {
                // Get the animation duration from the element's computed style
                const style = window.getComputedStyle(element);
                const animationDuration = parseFloat(style.animationDuration);

                // If duration is valid, calculate the delay
                if (!isNaN(animationDuration) && animationDuration > 0) {
                    // The delay is the negative remainder of the current time divided by the duration.
                    // This effectively fast-forwards the animation to its "correct" current state.
                    const delay = -(nowInSeconds % animationDuration);
                    
                    // Apply the calculated delay as an inline style
                    element.style.animationDelay = `${delay}s`;
                }
            });
        };

        synchronizeAnimations();
    document.body.classList.add('loading');

    setTimeout(() => {
        gsap.to(".intro", { opacity: 1, duration: 1 });
        initTypewriter();
    }, 1000);
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
            document.body.classList.remove('loading');
            lenis.start();
            gsap.to("section:not(.intro)", { opacity: 1, duration: 1, stagger: 0.2 });
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

// About Me
gsap.from(".about-content p", {
    scrollTrigger: {
        trigger: ".about",
        start: "top 80%",
        toggleActions: "play none none reverse",
    },
    opacity: 0,
    y: 50,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
    filter: "blur(10px)",
});

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
gsap.from(".skills-logos img", {
    scrollTrigger: {
        trigger: ".skills-ambitions",
        start: "top 80%",
        toggleActions: "play none none reverse",
    },
    opacity: 0,
    y: 50,
    stagger: 0.1,
    duration: 1,
    ease: "power3.out",
});