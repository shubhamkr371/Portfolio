import * as THREE from 'three';

// ============================================
// THREE.JS — INTERACTIVE PARTICLE NEBULA
// ============================================
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 0, 30);

// --- Particle System ---
const particleCount = 8000;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const sizes = new Float32Array(particleCount);

const palette = [
    new THREE.Color('#6366f1'),
    new THREE.Color('#14b8a6'),
    new THREE.Color('#ec4899'),
    new THREE.Color('#c084fc'),
];

for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 80;
    positions[i3 + 1] = (Math.random() - 0.5) * 80;
    positions[i3 + 2] = (Math.random() - 0.5) * 80;

    const color = palette[Math.floor(Math.random() * palette.length)];
    colors[i3]     = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    sizes[i] = Math.random() * 0.08 + 0.02;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const material = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// --- Mouse ---
let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

// --- Animation ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    particles.rotation.y = t * 0.03 + targetX * 0.2;
    particles.rotation.x = t * 0.01 + targetY * 0.2;

    // Subtle wave animation for positions
    const pos = geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        pos[i3 + 1] += Math.sin(t + pos[i3]) * 0.001;
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
    cursorX = e.clientX;
    cursorY = e.clientY;
});

function animateCursor() {
    requestAnimationFrame(animateCursor);
    followerX += (cursorX - followerX) * 0.12;
    followerY += (cursorY - followerY) * 0.12;

    if (cursor) cursor.style.transform = `translate(${cursorX - 3}px, ${cursorY - 3}px)`;
    if (follower) follower.style.transform = `translate(${followerX - 18}px, ${followerY - 18}px)`;
}
animateCursor();

// Cursor hover effect on interactive elements
document.querySelectorAll('a, button, .tilt-card, .skill-chip, .social-icon, .project-external').forEach(el => {
    el.addEventListener('mouseenter', () => cursor?.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor?.classList.remove('hovering'));
});


// ============================================
// TYPING ANIMATION
// ============================================
const typingTexts = [
    'AI/ML Models',
    'Data Pipelines',
    'Intelligent Systems',
    'Web Applications',
    'Neural Networks',
];

const typingEl = document.getElementById('typing-text');
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeWriter() {
    const current = typingTexts[textIndex];

    if (!isDeleting) {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
            isDeleting = true;
            setTimeout(typeWriter, 2000);
            return;
        }
    } else {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
        }
    }
    setTimeout(typeWriter, isDeleting ? 40 : 80);
}
typeWriter();


// ============================================
// SCROLL PROGRESS BAR
// ============================================
const progressBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    if (progressBar) progressBar.style.width = scrollPercent + '%';
});


// ============================================
// NAVBAR SCROLL EFFECT + ACTIVE LINKS
// ============================================
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }

    // Active nav link
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 200;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
        }
    });
});


// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
});


// ============================================
// ANIMATED SKILL BARS
// ============================================
const skillBarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.skill-bar-fill');
            fills.forEach(fill => {
                const width = fill.getAttribute('data-width');
                setTimeout(() => {
                    fill.style.width = width + '%';
                }, 200);
            });
            skillBarObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-group').forEach(group => {
    skillBarObserver.observe(group);
});


// ============================================
// 3D TILT EFFECT ON CARDS
// ============================================
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});


// ============================================
// MAGNETIC BUTTONS
// ============================================
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});


// ============================================
// PROFILE IMAGE PARALLAX TILT
// ============================================
const profileFrame = document.getElementById('profile-tilt');
if (profileFrame) {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 15;
        const y = (e.clientY / window.innerHeight - 0.5) * 15;
        profileFrame.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    });
}


// ============================================
// TOAST NOTIFICATION SYSTEM
// ============================================
function showToast(isSuccess, title, message) {
    const toastContainer = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${isSuccess ? 'success' : 'error'}`;
    
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">
                ${isSuccess ? 
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' :
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>'
                }
            </div>
            <div class="toast-text">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// ============================================
// CONTACT FORM - FormSubmit.co METHOD
// ============================================
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnSpan = submitBtn.querySelector('span');
        const btnIcon = submitBtn.querySelector('svg');
        
        // Get form inputs
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        
        // Validate inputs
        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            showToast(false, 'Validation Error', 'Please fill in all required fields.');
            return;
        }
        
        // Disable button during submission
        submitBtn.disabled = true;
        if (btnSpan) btnSpan.textContent = 'Sending...';
        
        // Using FormSubmit.co to send the email directly
        fetch("https://formsubmit.co/ajax/Shubhamkr371@gmail.com", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                Name: nameInput.value.trim(),
                Email: emailInput.value.trim(),
                Subject: subjectInput.value.trim() || "No Subject",
                Message: messageInput.value.trim(),
                _subject: "New Message from Portfolio: " + (subjectInput.value.trim() || "Contact Form")
            })
        })
            .then(response => {
                // FormSubmit.co returns 200 for success, any other status means error
                if (response.ok) {
                    return response.json().then(() => ({ success: true }));
                } else {
                    return response.json().then(errData => {
                        throw new Error(errData.message || `HTTP ${response.status}: ${response.statusText}`);
                    }).catch(() => {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    });
                }
            })
            .then(data => {
                showToast(true, 'Message Sent! 🎉', "Thanks for reaching out — I'll reply soon.");
                contactForm.reset();
            })
            .catch((err) => {
                console.error('FormSubmit error:', err);
                const isLocal = window.location.protocol === 'file:';
                let errMsg = err.message || 'Failed to send message';
                
                if (isLocal) {
                    errMsg = 'Security Error: Forms cannot be submitted directly from a local file (file:///). Please run this via a local server or host it online.';
                } else if (err.message.includes('Failed to fetch')) {
                    errMsg = 'Network error. Please check your connection and try again.';
                }
                
                showToast(false, 'Oops! Something went wrong.', errMsg);
            })
            .finally(() => {
                submitBtn.disabled = false;
                if (btnSpan) btnSpan.textContent = 'Send Message';
            });
    });
}


// ============================================
// MOBILE MENU TOGGLE
// ============================================
const mobileToggle = document.getElementById('mobile-toggle');
const navLinksEl = document.querySelector('.nav-links');

if (mobileToggle && navLinksEl) {
    mobileToggle.addEventListener('click', () => {
        navLinksEl.classList.toggle('mobile-open');
        mobileToggle.classList.toggle('active');
    });
}
