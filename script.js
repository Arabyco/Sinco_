// Preloader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('hidden');
    }, 1200);
});

// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');
if (window.matchMedia('(min-width: 769px)').matches) {
    let mx = 0, my = 0, cx = 0, cy = 0, dx = 0, dy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dx = e.clientX; dy = e.clientY; });
    function anim() {
        cx += (mx - cx) * 0.12; cy += (my - cy) * 0.12;
        dx += (mx - dx) * 0.35; dy += (my - dy) * 0.35;
        if(cursor) { cursor.style.left = cx - 12 + 'px'; cursor.style.top = cy - 12 + 'px'; }
        if(cursorDot) { cursorDot.style.left = dx - 2 + 'px'; cursorDot.style.top = dy - 2 + 'px'; }
        requestAnimationFrame(anim);
    }
    anim();
    document.querySelectorAll('a, button, .btn, .work-item, .pricing-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hover'));
    });
}

// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu
const toggle = document.getElementById('mobileToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => { toggle.classList.toggle('active'); links.classList.toggle('active'); });
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle.classList.remove('active'); links.classList.remove('active');
}));

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => obs.observe(el));

// Counter animation
let counted = false;
const counterObs = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting && !counted) {
        counted = true;
        document.querySelectorAll('.stat-number').forEach(stat => {
            const target = +stat.dataset.target;
            const dur = 2000;
            const start = performance.now();
            function upd(now) {
                const p = Math.min((now - start) / dur, 1);
                stat.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (target === 100 ? '%' : '+');
                if(p < 1) requestAnimationFrame(upd);
            }
            requestAnimationFrame(upd);
        });
    }
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if(statsEl) counterObs.observe(statsEl);

// FAQ
document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
        document.querySelectorAll('.faq-item').forEach(i => { if(i !== item) i.classList.remove('active'); });
        item.classList.toggle('active');
    });
});

// Order Modal
function openOrder(plan, price) {
    document.getElementById('formPlan').value = plan;
    document.getElementById('formPrice').value = price;
    document.getElementById('modalPlanLabel').textContent = plan + ' Plan';
    document.getElementById('modalPlanPrice').textContent = '$' + price;
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
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeOrder(); });

// Form submission
document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const fd = new FormData(this);
    const data = Object.fromEntries(fd);
    
    if(!data.name || !data.business || !data.email || !data.location) {
        this.classList.add('shake');
        setTimeout(() => this.classList.remove('shake'), 400);
        return;
    }
    
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    document.getElementById('submitText').style.display = 'none';
    document.getElementById('submitLoader').style.display = 'inline';
    
    try {
        const res = await fetch('https://formspree.io/f/mbdwddvg', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if(res.ok) {
            document.getElementById('orderForm').style.display = 'none';
            document.getElementById('formSuccess').style.display = 'block';
            setTimeout(() => { closeOrder(); }, 5000);
        } else throw new Error('Failed');
    } catch(err) {
        alert('Something went wrong. Email us at yassinelaraby18@gmail.com');
    } finally {
        btn.disabled = false;
        document.getElementById('submitText').style.display = 'inline';
        document.getElementById('submitLoader').style.display = 'none';
    }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if(t) t.scrollIntoView({ behavior: 'smooth' });
    });
});

console.log('%c SINCO STUDIOS %c Premium Web Design ',
    'background:#c8a45c;color:#000;padding:8px 12px;font-weight:bold;',
    'background:#111;color:#fff;padding:8px 12px;');