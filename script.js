// Book intro animation
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('bookIntro').classList.add('hidden');
    }, 2400);
});

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');
if (window.matchMedia('(min-width: 769px)').matches && cursor && cursorDot) {
    let mx = 0, my = 0, cx = 0, cy = 0, dx = 0, dy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dx = e.clientX; dy = e.clientY; });
    (function anim() {
        cx += (mx - cx) * 0.1; cy += (my - cy) * 0.1;
        dx += (mx - dx) * 0.3; dy += (my - dy) * 0.3;
        cursor.style.left = cx - 11 + 'px'; cursor.style.top = cy - 11 + 'px';
        cursorDot.style.left = dx - 2 + 'px'; cursorDot.style.top = dy - 2 + 'px';
        requestAnimationFrame(anim);
    })();
    document.querySelectorAll('a, button, .btn, .service-card, .pricing-card, .faq-item, input, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Navbar
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

// Form submission
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
        const res = await fetch('https://formspree.io/f/mbdwddvg', {
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
        alert('Something went wrong. Please email us: yassinelaraby18@gmail.com');
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

console.log('%c SINCO STUDIOS %c Premium Web Design ',
    'background:#c8a45c;color:#000;padding:6px 12px;font-weight:bold;font-size:13px;',
    'background:#111;color:#fff;padding:6px 12px;font-size:13px;');
