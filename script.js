// SpringBee Hub - Interactive Features

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Update active nav link
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
        // Update sidebar active
        const sidebarLink = document.querySelector(`.sidebar-link[href="${this.getAttribute('href')}"]`);
        if (sidebarLink) {
            document.querySelectorAll('.sidebar-link').forEach(a => a.classList.remove('active'));
            sidebarLink.classList.add('active');
        }
    });
});

// Sidebar link click
document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // External links: let browser navigate normally
        if (href.startsWith('/') || href.startsWith('http')) return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        document.querySelectorAll('.sidebar-link').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
    });
});

// Scroll spy - update active sidebar link on scroll
const sections = document.querySelectorAll('section[id]');
const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// FAQ toggle
// ============================================
// Contact form
// ============================================

// Contact form AJAX submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const company = formData.get('company');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Send to Feishu via Cloudflare Worker (CORS proxy)
        fetch('https://feishu-notify.late-butterfly-c370.workers.dev/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, company, subject, message })
        })
        .then(response => response.json())
        .then(result => {
            if (result.code === 0) {
                const fields = contactForm.querySelectorAll('.form-group, .form-row, button[type=submit]');
                fields.forEach(f => f.style.display = 'none');
                document.getElementById('formSuccess').style.display = 'block';
                setTimeout(() => {
                    fields.forEach(f => f.style.display = '');
                    document.getElementById('formSuccess').style.display = 'none';
                    contactForm.reset();
                    toggleContactModal();
                }, 3000);
            } else {
                alert('Send failed, please try again later.');
            }
        })
        .catch(err => {
            console.error('Feishu notification failed:', err);
            alert('Send failed, please try again later.');
        });
    });
}

// Contact modal toggle
function toggleContactModal() {
    const overlay = document.getElementById('contactModalOverlay');
    if (!overlay) return;
    overlay.classList.toggle('active');
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
}

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('contactModalOverlay');
        if (overlay && overlay.classList.contains('active')) {
            toggleContactModal();
        }
    }
});

// Network tabs
document.querySelectorAll('.net-tab').forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.net-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.net-panel').forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        const panelId = `panel-${this.dataset.tab}`;
        document.getElementById(panelId).classList.add('active');
    });
});
