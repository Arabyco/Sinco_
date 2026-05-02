// Golden Dust Intro
const intro = document.getElementById('intro');
const introLogo = document.getElementById('introLogo');
const canvas = document.getElementById('introCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const maxParticles = 120;
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * Math.min(canvas.width, canvas.height) * 0.8;
        this.x = canvas.width / 2 + Math.cos(angle) * distance;
        this.y = canvas.height / 2 + Math.sin(angle) * distance;
        this.targetX = canvas.width / 2;
        this.targetY = canvas.height / 2;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.speed = Math.random() * 0.02 + 0.005;
        this.progress = Math.random();
        this.orbitRadius = Math.random() * 40 + 20;
        this.orbitAngle = Math.random() * Math.PI * 2;
        this.orbitSpeed = (Math.random() - 0.5) * 0.01;
        this.sparkle = Math.random() * 0.3;
    }
    update() {
        this.progress += this.speed;
        this.orbitAngle += this.orbitSpeed;
        if (this.progress >= 1) {
            this.orbitAngle = Math.random() * Math.PI * 2;
            this.orbitRadius = Math.random() * 40 + 20;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.size = Math.random() * 2 + 0.5;
        }
        const targetProgress = Math.min(this.progress, 1);
        const eased = 1 - Math.pow(1 - targetProgress, 3);
        this.x += ((this.targetX + Math.cos(this.orbitAngle) * this.orbitRadius) - this.x) * eased * 0.05;
        this.y += ((this.targetY + Math.sin(this.orbitAngle) * this.orbitRadius) - this.y) * eased * 0.05;
        this.sparkle = Math.sin(Date.now() * 0.01 + this.orbitAngle) * 0.3;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 182, 106, ${Math.max(0, this.opacity + this.sparkle)})`;
        ctx.fill();
    }
}

for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    animationId = requestAnimationFrame(animate);
}
animate();

setTimeout(() => {
    introLogo.classList.add('visible');
}, 1000);

setTimeout(() => {
    cancelAnimationFrame(animationId);
    intro.classList.add('hidden');
    document.body.style.overflow = '';
}, 3000);

document.body.style.overflow = 'hidden';

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');
if (window.matchMedia('(min-width: 769px)').matches && cursor && cursorDot) {
    let mx = 0, my = 0, cx = 0, cy = 0, dx = 0, dy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dx = e.clientX; dy = e.clientY; });
    (function anim() {
        cx += (mx - cx) * 0.1; cy += (my - cy) * 0.1;
        dx += (mx - dx) * 0.3; dy += (my - dy) * 0.3;
        cursor.style.left = cx - 10 + 'px'; cursor.style.top = cy - 10 + 'px';
        cursorDot.style.left = dx - 2 + 'px'; cursorDot.style.top = dy - 2 + 'px';
        requestAnimationFrame(anim);
    })();
    document.querySelectorAll('a, button, .btn, .service-card, .pricing-card, .faq-item, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 40));

// Mobile menu
const toggle = document.getElementById('mobileToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => { toggle.classList.toggle('active'); links.classList.toggle('active'); });
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { toggle.classList.remove('active'); links.classList.remove('active'); }));

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
revealEls.forEach(el => obs.observe(el));

// Counter animation
let counted = false;
const counterObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) {
        counted = true;
        document.querySelectorAll('.stat-number').forEach(stat => {
            const target = +stat.dataset.target;
            const dur = 1800;
            const start = performance.now();
            (function upd(now) {
                const p = Math.min((now - start) / dur, 1);
                stat.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (target === 100 ? '%' : '+');
                if (p < 1) requestAnimationFrame(upd);
            })(start);
        });
    }
}, { threshold: 0.5 });
const statsWrap = document.querySelector('.hero-stats');
if (statsWrap) counterObs.observe(statsWrap);

// FAQ
document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
        document.querySelectorAll('.faq-item').forEach(i => { if (i !== item) i.classList.remove('active'); });
        item.classList.toggle('active');
    });
});

// Order modal
function openOrder(plan, price, deposit) {
    const remaining = price - deposit;
    document.getElementById('formPlan').value = plan;
    document.getElementById('formPrice').value = price;
    document.getElementById('formDeposit').value = deposit;
    document.getElementById('modalPlanLabel').textContent = plan + ' Plan';
    document.getElementById('modalPlanPrice').textContent = '$' + price;
    document.getElementById('depositAmount').textContent = '$' + deposit;
    document.getElementById('summaryDeposit').textContent = '$' + deposit;
    document.getElementById('summaryRemaining').textContent = '$' + remaining;
    document.getElementById('orderForm').style.display = 'block';
    document.getElementById('formSuccess').style.display = 'none';
    document.getElementById('orderForm').reset();
    document.getElementById('orderModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeOrder() {
    document.getElementById('orderModal').classList.remove('active');
    document.body.style.overflow = '';
}
document.querySelector('.modal-overlay').addEventListener('click', closeOrder);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeOrder(); });

// Form submission to Formspree
document.getElementById('orderForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const fd = new FormData(this);
    const data = Object.fromEntries(fd);

    if (!data.name || !data.business || !data.email || !data.industry || !data.location) {
        this.classList.add('shake');
        setTimeout(() => this.classList.remove('shake'), 350);
        return;
    }

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    document.getElementById('submitText').style.display = 'none';
    document.getElementById('submitLoader').style.display = 'inline';

    try {
        const res = await fetch('https://formspree.io/f/xgodoazr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                plan: data.plan,
                price: '$' + data.price,
                deposit: '$' + data.deposit,
                name: data.name,
                business: data.business,
                email: data.email,
                phone: data.phone,
                industry: data.industry,
                location: data.location,
                message: data.message
            })
        });
        if (res.ok) {
            document.getElementById('orderForm').style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
            setTimeout(() => closeOrder(), 5000);
        } else throw new Error('Failed');
    } catch (err) {
        alert('Something went wrong. Please email us: sincostudioss@gmail.com');
    } finally {
        btn.disabled = false;
        document.getElementById('submitText').style.display = 'inline';
        document.getElementById('submitLoader').style.display = 'none';
    }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
});

// Hero floating particles
const heroParticles = document.getElementById('heroParticles');
if (heroParticles) {
    for (let i = 0; i < 20; i++) {
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: #c8a45c;
            border-radius: 50%;
            opacity: ${Math.random() * 0.3 + 0.05};
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        heroParticles.appendChild(dot);
    }
    const style = document.createElement('style');
    style.textContent = `@keyframes float { 0% { transform: translateY(0) translateX(0); opacity: 0; } 10% { opacity: 0.3; } 90% { opacity: 0.3; } 100% { transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px); opacity: 0; } }`;
    document.head.appendChild(style);
}

console.log('%c SINCO STUDIOS %c Premium Web Design ',
    'background:#c8a45c;color:#000;padding:6px 12px;font-weight:bold;',
    'background:#111;color:#fff;padding:6px 12px;');
console.log('%c Contact: sincostudioss@gmail.com', 'color:#c8a45c;');
