// Sidebar active link tracking
document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = [];
    
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const section = document.querySelector(href);
            if (section) sections.push({ link, section });
        }
    });

    // Click handler
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Scroll spy
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(({ link, section }) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 120) current = link.getAttribute('href');
        });
        if (current) {
            sidebarLinks.forEach(l => l.classList.remove('active'));
            const active = document.querySelector(`.sidebar-link[href="${current}"]`);
            if (active) active.classList.add('active');
        }
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
