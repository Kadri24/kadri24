if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});

const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);

document.addEventListener('DOMContentLoaded', () => {
    const typewriterElement = document.getElementById('typewriter');

    if (typewriterElement) {
        document.body.classList.add('loading'); 
        setTimeout(() => {
            const introSection = document.querySelector('.intro');
            if (introSection) {
                gsap.to(introSection, { opacity: 1, duration: 1 });
                initTypewriter();
            }
        }, 1000);
    } 
    else {
        document.body.classList.remove('loading'); 
        lenis.start(); 
        const heroTitle = document.querySelector('.hero-title');
        const heroLinks = document.querySelectorAll('.hero-links a');
        
        if (heroTitle && heroLinks.length > 0) {
            
            gsap.set(heroTitle, { opacity: 0, y: 50, filter: "blur(10px)" });
            gsap.set(heroLinks, { opacity: 0, y: 50, filter: "blur(10px)" });

            const tl = gsap.timeline({ delay: 0 });
            tl.to(heroTitle, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1,
                ease: "power3.out"
            });

            tl.to(heroLinks, {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.1
            }, "-=0.5");
        }
    }
});


const texts = ["kadri24", "Welcome"];
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

document.querySelectorAll('.scroll-reveal-item').forEach(item => {
    gsap.set(item, { opacity: 0, y: 100, filter: "blur(10px)" });

    gsap.to(item, {
        scrollTrigger: {
            trigger: item.closest('section'),
            start: "top 75%",
            toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out",
    });
});

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