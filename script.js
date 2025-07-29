// Optimized Device Detection
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const supportsWebGL = (() => { const c = document.createElement('canvas'); return !!(c.getContext('webgl') || c.getContext('experimental-webgl')); })();

// Three.js Initialization (Optimized)
let scene, camera, renderer, hearts = [], animationId;
function initThreeJS() {
    if (!supportsWebGL) return;
    const container = document.getElementById('canvas-container');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Create Hearts (Reduced count for mobile)
    const heartCount = isMobile ? 10 : 20;
    for (let i = 0; i < heartCount; i++) {
        const heartShape = new THREE.Shape();
        heartShape.moveTo(5, 5); heartShape.bezierCurveTo(5, 5, 4, 0, 0, 0); heartShape.bezierCurveTo(-6, 0, -6, 3.5, -6, 3.5);
        heartShape.bezierCurveTo(-6, 5.5, -4, 7.7, 0, 10); heartShape.bezierCurveTo(4, 7.7, 6, 5.5, 6, 3.5);
        heartShape.bezierCurveTo(6, 3.5, 6, 0, 0, 0);
        const geometry = new THREE.ShapeGeometry(heartShape);
        const material = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(0.9 + Math.random() * 0.1, 0.7, 0.5), transparent: true, opacity: 0.7 });
        const heart = new THREE.Mesh(geometry, material);
        heart.position.set((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 10);
        heart.rotation.z = Math.random() * Math.PI * 2;
        heart.userData = { speedY: Math.random() * 0.02 + 0.01, speedRotation: Math.random() * 0.02 + 0.01, amplitude: Math.random() * 0.5 + 0.5 };
        scene.add(heart);
        hearts.push(heart);
    }
    animate();
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Animation Loop (Optimized with requestAnimationFrame)
function animate() {
    animationId = requestAnimationFrame(animate);
    hearts.forEach(h => {
        h.position.y += h.userData.speedY;
        h.rotation.z += h.userData.speedRotation;
        h.position.x += Math.sin(Date.now() * 0.001 + h.position.y) * 0.001 * h.userData.amplitude;
        if (h.position.y > 15) h.position.y = -15;
    });
    camera.position.x = Math.sin(Date.now() * 0.0005) * 0.5;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}

// Step Management
let currentStep = 1, totalSteps = 5;
function nextStep() {
    if (currentStep >= totalSteps) return;
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep++;
    const nextEl = document.getElementById(`step${currentStep}`);
    nextEl.classList.add('active');
    gsap.fromTo(nextEl, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' });
    document.getElementById('progress-bar').style.width = `${(currentStep / totalSteps) * 100}%`;
    nextEl.querySelector('.btn')?.focus();
}

// Event Listeners
document.getElementById('start-btn').addEventListener('click', nextStep);
document.getElementById('next-btn-2').addEventListener('click', nextStep);
document.getElementById('next-btn-3').addEventListener('click', nextStep);
document.getElementById('next-btn-4').addEventListener('click', nextStep);
document.getElementById('confetti-btn').addEventListener('click', () => { triggerConfetti(); triggerBalloons(); });

// Confetti and Balloons (Optimized)
function triggerConfetti() {
    const duration = 3000, animationEnd = Date.now() + duration;
    const interval = setInterval(() => {
        if (Date.now() > animationEnd) return clearInterval(interval);
        confetti({ particleCount: 50 * ((animationEnd - Date.now()) / duration), startVelocity: 30, spread: 360, zIndex: 1000, origin: { x: Math.random() * 0.8 + 0.1, y: Math.random() - 0.2 } });
    }, 250);
}

function triggerBalloons() {
    const canvas = document.getElementById('balloon-canvas');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight; canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    const balloons = Array.from({ length: 12 }, () => ({ x: Math.random() * canvas.width, y: canvas.height + Math.random() * 100, r: 28 + Math.random() * 18, color: ['#ffb6d5', '#e94560', '#000'][Math.floor(Math.random() * 3)], speed: 1.2 + Math.random() * 1.5, sway: Math.random() * 2 + 1, swayPhase: Math.random() * Math.PI * 2 }));
    let frame = 0;
    const anim = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        balloons.forEach(b => {
            ctx.beginPath(); ctx.ellipse(b.x + Math.sin(frame / 30 + b.swayPhase) * b.sway * 8, b.y, b.r * 0.7, b.r, 0, 0, Math.PI * 2);
            ctx.fillStyle = b.color; ctx.shadowColor = '#fff'; ctx.shadowBlur = 18; ctx.fill();
            b.y -= b.speed; b.x += Math.sin(frame / 30 + b.swayPhase) * b.sway;
        });
        if (++frame < 220) requestAnimationFrame(anim); else canvas.style.display = 'none';
    };
    anim();
}

// GSAP and Anime.js Enhancements
// GSAP and Anime.js Enhancements
gsap.registerPlugin(ScrollTrigger);

// Enhanced animation for the reason cards
gsap.from(".reason-card", {
    scrollTrigger: {
        trigger: ".reason-card",
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
    },
    opacity: 0,
    y: 50,
    stagger: 0.2,
    ease: "power3.out",
});

gsap.to('.memory-photo', { 
    scrollTrigger: { 
        trigger: '.memory-photo', 
        start: 'top 80%', 
        end: 'bottom 20%', 
        scrub: 1 
    }, 
    rotateY: 360, 
    scale: 1.2, 
    ease: 'power2.inOut' 
});

// Interactive tilt effect for the memory photo
const memoryPhoto = document.querySelector('.memory-photo');
if (memoryPhoto) {
    memoryPhoto.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = memoryPhoto.getBoundingClientRect();
        const x = e.clientX - left - width / 2;
        const y = e.clientY - top - height / 2;
        const rotateX = (-y / height) * 20; // Tilt up/down
        const rotateY = (x / width) * 20; // Tilt left/right
        gsap.to(memoryPhoto, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 500, // Adds depth
            ease: "power1.out",
        });
    });

    memoryPhoto.addEventListener('mouseleave', () => {
        gsap.to(memoryPhoto, {
            rotationX: 0,
            rotationY: 0,
            ease: "power1.out",
        });
    });
}
anime({
    targets: '#morphPath',
    d: [
        { value: 'M50 80 Q20 60 20 35 Q20 20 40 20 Q50 20 50 30 Q50 20 60 20 Q80 20 80 35 Q80 60 50 80 Z' },
        { value: 'M50 80 Q10 60 10 35 Q10 10 40 10 Q50 10 50 30 Q50 10 60 10 Q90 10 90 35 Q90 60 50 80 Z' }
    ],
    duration: 3200, direction: 'alternate', loop: true, easing: 'easeInOutQuad'
});

document.addEventListener('DOMContentLoaded', () => {
    const themes = [
        'shiny-black',
        'pastel-dream',
        'ocean-breeze',
        'sunset-glow',
        'enchanted-forest',
        'starlight'
    ];
    let currentThemeIndex = 0;

    const preloader = document.getElementById('preloader');
    const app = document.getElementById('app');
    const themeSwitcher = document.getElementById('theme-switcher');

    // --- THEME MANAGEMENT ---
    function setTheme(themeName) {
        document.body.setAttribute('data-theme', themeName);
    }

    themeSwitcher.addEventListener('click', () => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        setTheme(themes[currentThemeIndex]);
    });

    // Set initial theme
    setTheme(themes[currentThemeIndex]);

    // --- PRELOADER ---
    window.addEventListener('load', () => {
        gsap.to(preloader, { opacity: 0, duration: 0.5, onComplete: () => preloader.style.display = 'none' });
        gsap.from(app, { opacity: 0, duration: 1, delay: 0.5 });
    });

    // --- PERSONALIZATION ---
    const birthdayName = prompt("Who is this birthday card for?", "ASHRA");
    const creatorName = prompt("Who is this card from?", "You");

    if (birthdayName) {
        document.getElementById('birthday-name').textContent = birthdayName;
    }
    if (creatorName) {
        document.getElementById('creator-name').textContent = creatorName;
    }

    initThreeJS();
    document.querySelector('.step.active .btn')?.focus();
});

// The rest of the script remains the same...
