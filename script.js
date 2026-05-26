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

// ============================================
// Dynamic FAQ Loading from GitHub
// ============================================
(function loadFaqFromGitHub() {
    const FAQ_REPO = 'SpringbeeHub/sensorbees-hub';
    const FAQ_BRANCH = 'main';
    const FAQ_FOLDER = 'faq';
    const faqList = document.getElementById('faq-list');
    if (!faqList) return;

    const apiBase = `https://api.github.com/repos/${FAQ_REPO}/contents/${FAQ_FOLDER}?ref=${FAQ_BRANCH}`;

    // Simple markdown-to-HTML converter (handles basic cases)
    function markdownToHtml(md) {
        // Remove frontmatter
        md = md.replace(/^---[\s\S]*?---\n*/, '');
        // Bold
        md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // Italic
        md = md.replace(/\*(.+?)\*/g, '<em>$1</em>');
        // Numbered list
        md = md.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
        // Unordered list
        md = md.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
        // Wrap consecutive <li> in <ul>
        md = md.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
        // Paragraphs
        md = md.replace(/\n\n/g, '</p><p>');
        md = '<p>' + md + '</p>';
        // Clean up empty paragraphs
        md = md.replace(/<p>\s*<\/p>/g, '');
        return md;
    }

    fetch(apiBase)
        .then(res => {
            if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
            return res.json();
        })
        .then(files => {
            if (!Array.isArray(files) || files.length === 0) {
                console.log('No FAQ files found in GitHub repo');
                return;
            }

            // Filter .md files
            const mdFiles = files.filter(f => f.name.endsWith('.md'));
            if (mdFiles.length === 0) return;

            // Fetch all FAQ markdown files
            return Promise.all(mdFiles.map(f =>
                fetch(f.download_url).then(r => r.text()).then(text => ({
                    title: '',
                    body: text
                }))
            ));
        })
        .then(faqItems => {
            if (!faqItems || faqItems.length === 0) return;

            // Clear existing content
            faqList.innerHTML = '';

            // Render each FAQ
            faqItems.forEach(item => {
                // Parse frontmatter for title
                const frontmatterMatch = item.body.match(/^---[\s\S]*?title:\s*["']?(.+?)["']?\s*$/m);
                const title = frontmatterMatch ? frontmatterMatch[1].trim() : 'FAQ';

                const faqEl = document.createElement('div');
                faqEl.className = 'faq-item';
                faqEl.innerHTML = `
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span><span class="q-badge">Q</span> ${title}</span>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        ${markdownToHtml(item.body)}
                    </div>
                `;
                faqList.appendChild(faqEl);
            });
        })
        .catch(err => {
            console.warn('Failed to load FAQ from GitHub:', err);
            // Fallback: keep existing static FAQ (noscript content won't show,
            // so add default FAQ items)
            faqList.innerHTML = `
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span><span class="q-badge">Q</span> What frequency band should I use?</span>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>For China, use CN470. For Europe, use EU868. For North America, use US915. Make sure your gateway and sensors are configured to the same frequency plan.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span><span class="q-badge">Q</span> How long does the sensor battery last?</span>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>Battery life depends on reporting interval. At 1 report per 5 minutes, most SpringBees sensors last 2~5 years.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span><span class="q-badge">Q</span> What is the wireless range of LoRaWAN?</span>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>Line-of-sight: up to 15km with outdoor gateway. Urban: 2~5km. Indoor: 500m~1km through walls.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span><span class="q-badge">Q</span> Can I use my own cloud platform?</span>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>Yes. ChirpStack supports MQTT and HTTP integrations to forward data to any platform — AWS IoT, Azure, ThingsBoard, Grafana, or your custom backend.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span><span class="q-badge">Q</span> How do RS485 sensors connect wirelessly?</span>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>RS485 sensors connect to a LoRaWAN RS485 node via Modbus RTU. The node reads sensor data periodically and transmits via LoRaWAN to the gateway.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span><span class="q-badge">Q</span> LoRaWAN vs Cellular — which should I choose?</span>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p><strong>Choose LoRaWAN</strong> when you have many sensors in a concentrated area, need long battery life, and can deploy a gateway. <strong>Choose Cellular</strong> when you have few sensors in remote locations or need quick standalone deployment.</p>
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question" onclick="toggleFaq(this)">
                        <span><span class="q-badge">Q</span> How do I register a sensor on ChirpStack?</span>
                        <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer">
                        <p>In ChirpStack: go to your Application → Devices → Add. Enter DevEUI, AppEUI, and AppKey from the sensor label. Select the correct Device Profile (OTAA recommended).</p>
                    </div>
                </div>
            `;
        });
})();

// Contact form AJAX submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(contactForm);

        // Submit to Netlify Forms
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        })
        .then(response => {
            if (response.ok) {
                // Also notify Feishu via our serverless function
                fetch('/.netlify/functions/notify-feishu', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        email: formData.get('email'),
                        company: formData.get('company'),
                        subject: formData.get('subject'),
                        message: formData.get('message')
                    })
                }).catch(err => console.warn('Feishu notification failed:', err));

                // Show success message
                const fields = contactForm.querySelectorAll('.form-group, .form-row, button[type=submit]');
                fields.forEach(f => f.style.display = 'none');
                document.getElementById('formSuccess').style.display = 'block';
                // Reset after 3 seconds and close modal
                setTimeout(() => {
                    fields.forEach(f => f.style.display = '');
                    document.getElementById('formSuccess').style.display = 'none';
                    contactForm.reset();
                    toggleContactModal();
                }, 3000);
            }
        })
        .catch(error => console.error('Form submission error:', error));
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
