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
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
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
function toggleFaq(el) {
    const item = el.parentElement;
    const wasOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    // Toggle clicked
    if (!wasOpen) {
        item.classList.add('open');
    }
}

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
