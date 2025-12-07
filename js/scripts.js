(function () {
  // UI interactions for the portfolio (cleaned and deduplicated)
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');
  const themeToggle = document.getElementById('themeToggle');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const downloadCvBtn = document.getElementById('downloadCvBtn');

  // Mobile nav
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
  }

  // Theme toggle
  function setTheme(theme) {
    if (theme === 'light') document.body.classList.add('light');
    else document.body.classList.remove('light');
    localStorage.setItem('site-theme', theme);
  }
  (function initTheme() {
    const savedTheme = localStorage.getItem('site-theme') || 'dark';
    setTheme(savedTheme);
    if (themeToggle) themeToggle.addEventListener('click', () => {
      const next = document.body.classList.contains('light') ? 'dark' : 'light';
      setTheme(next);
    });
  })();

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (mainNav && mainNav.classList.contains('open')) mainNav.classList.remove('open');
      }
    });
  });

  // Card tilt effect (only on non-touch devices for better performance)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) {
    document.querySelectorAll('.project-card, .stat-card, .cv-summary, .cv-details, .contact-card, .timeline-item').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;
        const rx = Math.max(-6, Math.min(6, dy * 6));
        const ry = Math.max(-6, Math.min(6, dx * -6));
        card.style.transform = `translateY(-8px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave', () => card.style.transform = '');
    });
  }

  // Fix viewport height on mobile (address bar issue)
  function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  setViewportHeight();
  window.addEventListener('resize', setViewportHeight);
  window.addEventListener('orientationchange', setViewportHeight);

  // Close mobile nav when clicking outside
  if (mainNav) {
    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('open') &&
        !mainNav.contains(e.target) &&
        !mobileToggle.contains(e.target)) {
        mainNav.classList.remove('open');
      }
    });
  }

  // Enhanced contact form handling
  (function () {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    const submitBtn = contactForm.querySelector('.submit-btn');
    const createMessage = (type, text) => { const div = document.createElement('div'); div.className = `form-message ${type}`; div.textContent = text; return div; };

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const existingMsg = contactForm.querySelector('.form-message'); if (existingMsg) existingMsg.remove();
      const formData = new FormData(contactForm);
      const name = formData.get('name') || '';
      const email = formData.get('email') || '';
      const message = formData.get('message') || '';

      if (name.length < 2 || email.length < 5 || message.length < 10) {
        contactForm.appendChild(createMessage('error', 'Please fill in all fields correctly'));
        return;
      }

      submitBtn && submitBtn.classList.add('loading');
      submitBtn && (submitBtn.disabled = true);

      try {
        const endpoint = contactForm.getAttribute('action');
        const response = await fetch(endpoint, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
        // Formspree returns 200 or redirects - both mean success
        if (response && (response.ok || response.status === 200 || response.redirected)) {
          contactForm.appendChild(createMessage('success', "Message sent successfully! I'll get back to you soon."));
          contactForm.reset();
        } else {
          contactForm.appendChild(createMessage('error', 'Failed to send message. Please try again or email directly.'));
        }
      } catch (err) {
        console.error(err);
        contactForm.appendChild(createMessage('error', 'There was a problem sending your message.'));
      } finally {
        submitBtn && submitBtn.classList.remove('loading');
        submitBtn && (submitBtn.disabled = false);
      }
    });
  })();

  // Download CV to PDF (enhanced with proper formatting)
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        // Wait for jsPDF to load
        if (!window.jspdf || !window.jspdf.jsPDF) {
          alert('PDF library is loading, please try again in a moment.');
          return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
          unit: 'pt',
          format: 'letter',
          orientation: 'portrait'
        });

        // Professional CV layout with enhanced spacing
        const leftMargin = 60;
        const rightMargin = 60;
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const contentWidth = pageWidth - leftMargin - rightMargin;
        let yPos = 70;
        const lineHeight = 14; // Standard line height for readability
        const sectionSpacing = 28; // Space between major sections
        const subSectionSpacing = 18; // Space between subsections

        // Add subtle background accent for header
        doc.setFillColor(124, 92, 255);
        doc.rect(0, 0, pageWidth, 2, 'F'); // Top accent line

        // Header - Name
        doc.setFont('times', 'bold');
        doc.setFontSize(28);
        doc.setTextColor(40, 40, 40);
        doc.text('WILMER BACCA', leftMargin, yPos);
        yPos += 18;

        // Professional divider line under name
        doc.setDrawColor(124, 92, 255);
        doc.setLineWidth(0.5);
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += 14;

        // Subtitle
        doc.setFont('times', 'italic');
        doc.setFontSize(14);
        doc.setTextColor(80, 80, 80);
        doc.text('Junior Software Developer', leftMargin, yPos);
        yPos += sectionSpacing;

        // Reset color
        doc.setTextColor(0, 0, 0);

        // Contact Section with icons representation
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text('Email: wilmer.bacca1991@gmail.com', leftMargin, yPos);
        doc.text('Location: Remote / Willing to relocate', leftMargin + 200, yPos);
        yPos += sectionSpacing;

        // Divider line
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(leftMargin, yPos, pageWidth - rightMargin, yPos);
        yPos += sectionSpacing;

        // Profile Section
        doc.setFont('times', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(40, 40, 40);
        doc.text('PROFESSIONAL PROFILE', leftMargin, yPos);
        yPos += subSectionSpacing;
        doc.setFont('times', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        const profileText = 'Experienced Software Developer (34) with 12+ years in systems programming, developer tooling and ML infrastructure. Winner of multiple international awards and fellowships. Strong background in C++, Python and cross-platform engineering.';
        const profileLines = doc.splitTextToSize(profileText, contentWidth);
        profileLines.forEach((line, i) => {
          doc.text(line, leftMargin, yPos + (i * lineHeight));
        });
        yPos += (profileLines.length * lineHeight) + sectionSpacing;

        // Experience Section
        doc.setFont('times', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(40, 40, 40);
        doc.text('PROFESSIONAL EXPERIENCE', leftMargin, yPos);
        yPos += subSectionSpacing;

        // Job 1
        doc.setFont('times', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        doc.text('Lead Systems Engineer', leftMargin, yPos);
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text('2021 - Present', pageWidth - rightMargin - 50, yPos);
        yPos += lineHeight;
        doc.setFont('times', 'italic');
        doc.setTextColor(60, 60, 60);
        doc.text('Nimbus Analytics', leftMargin, yPos);
        yPos += lineHeight + 2;
        doc.setFont('times', 'normal');
        doc.setTextColor(50, 50, 50);
        doc.text('• Architected core data processing pipeline, reduced latency by 67%', leftMargin, yPos);
        yPos += lineHeight;
        doc.text('• Led a team of 6 engineers and drove platform reliability improvements', leftMargin, yPos);
        yPos += subSectionSpacing;

        // Job 2
        doc.setFont('times', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        doc.text('Senior Software Engineer', leftMargin, yPos);
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text('2017 - 2020', pageWidth - rightMargin - 50, yPos);
        yPos += lineHeight;
        doc.setFont('times', 'italic');
        doc.setTextColor(60, 60, 60);
        doc.text('OpenLab Research', leftMargin, yPos);
        yPos += lineHeight + 2;
        doc.setFont('times', 'normal');
        doc.setTextColor(50, 50, 50);
        doc.text('• Developed internal tooling for model experimentation and reproducibility', leftMargin, yPos);
        yPos += lineHeight;
        doc.text('• Built performance-critical components used in university collaborations', leftMargin, yPos);
        yPos += subSectionSpacing;

        // Job 3
        doc.setFont('times', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        doc.text('Software Developer', leftMargin, yPos);
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text('2012 - 2017', pageWidth - rightMargin - 50, yPos);
        yPos += lineHeight;
        doc.setFont('times', 'italic');
        doc.setTextColor(60, 60, 60);
        doc.text('Various Startups & Research Groups', leftMargin, yPos);
        yPos += lineHeight + 2;
        doc.setFont('times', 'normal');
        doc.setTextColor(50, 50, 50);
        doc.text('• Startup and research roles building backend services, CLIs and libraries', leftMargin, yPos);
        yPos += sectionSpacing;

        // Education Section
        doc.setFont('times', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(40, 40, 40);
        doc.text('EDUCATION', leftMargin, yPos);
        yPos += subSectionSpacing;

        doc.setFont('times', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        doc.text('M.Sc. (Research) - Systems & Software Engineering', leftMargin, yPos);
        yPos += lineHeight;
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text('International Technical University (2015)', leftMargin, yPos);
        yPos += subSectionSpacing - 4;

        doc.setFont('times', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(50, 50, 50);
        doc.text('B.Sc. - Computer Science', leftMargin, yPos);
        yPos += lineHeight;
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text('Universidad Nacional (2012)', leftMargin, yPos);
        yPos += sectionSpacing;

        // Skills Section
        doc.setFont('times', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(40, 40, 40);
        doc.text('TECHNICAL SKILLS', leftMargin, yPos);
        yPos += subSectionSpacing;
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        const skills = 'C++, Python, Ruby, Go, Rust, SQL, Linux, Distributed Systems, Performance Optimization, Secure Coding';
        const skillsLines = doc.splitTextToSize(skills, contentWidth);
        skillsLines.forEach((line, i) => {
          doc.text(line, leftMargin, yPos + (i * lineHeight));
        });
        yPos += (skillsLines.length * lineHeight) + sectionSpacing;

        // Awards Section
        doc.setFont('times', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(40, 40, 40);
        doc.text('AWARDS & RECOGNITION', leftMargin, yPos);
        yPos += subSectionSpacing;
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text('• Winner - International Interuniversity Software Challenge (2021)', leftMargin, yPos);
        yPos += lineHeight;
        doc.text('• Best Software Project - MIT Global Hackathon (2019)', leftMargin, yPos);
        yPos += lineHeight;
        doc.text('• Research Fellowship - Technical University Collaboration (2017)', leftMargin, yPos);
        yPos += sectionSpacing;

        // Projects Section
        doc.setFont('times', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(40, 40, 40);
        doc.text('KEY PROJECTS', leftMargin, yPos);
        yPos += subSectionSpacing;
        doc.setFont('times', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text('• FastGraph - Real-time Graph Engine (C++)', leftMargin, yPos);
        yPos += lineHeight;
        doc.text('• InSight - ML Interpretability Toolkit (Python)', leftMargin, yPos);
        yPos += lineHeight;
        doc.text('• DevFlow - Developer Tooling Suite (Ruby, JS)', leftMargin, yPos);
        yPos += sectionSpacing + 10;

        // Footer
        doc.setFont('times', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('References available on request', leftMargin, yPos);

        // Save the PDF
        doc.save('Wilmer_Bacca_CV.pdf');
      } catch (e) {
        console.warn('CV PDF download failed', e);
        // Fallback to text version
        try {
          const resp = await fetch('Wilmer_Bacca_CV.txt');
          const text = await resp.text();
          const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Wilmer_Bacca_CV.txt';
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        } catch (e2) {
          alert('Could not download CV. Please try again.');
        }
      }
    });
  }

  // Cookie consent & analytics loader
  function createCookieConsent() {
    if (document.getElementById('cookieConsent')) return;
    const c = document.createElement('div'); c.id = 'cookieConsent'; c.innerHTML = `\n      <div class="cookie-inner">\n        <div class="cookie-text">We use cookies for analytics to improve the site. Do you accept?</div>\n        <div class="cookie-actions"><button id="cookieAccept" class="btn">Accept</button><button id="cookieDecline" class="btn ghost">Decline</button></div>\n      </div>\n    `; document.body.appendChild(c);
    const accept = document.getElementById('cookieAccept'); const decline = document.getElementById('cookieDecline');
    const stored = localStorage.getItem('cookie-consent'); if (stored === 'accepted') { loadAnalytics(); c.remove(); } if (stored === 'declined') { c.remove(); }
    accept && accept.addEventListener('click', () => { localStorage.setItem('cookie-consent', 'accepted'); loadAnalytics(); c.remove(); });
    decline && decline.addEventListener('click', () => { localStorage.setItem('cookie-consent', 'declined'); c.remove(); });
  }

  function loadAnalytics() {
    try {
      const provider = document.querySelector('meta[name="analytics-provider"]')?.getAttribute('content');
      const siteId = document.querySelector('meta[name="analytics-site-id"]')?.getAttribute('content');
      if (!provider) return;
      if (provider === 'plausible') {
        const s = document.createElement('script'); s.defer = true; s.setAttribute('data-domain', siteId || 'example.com'); s.src = 'https://plausible.io/js/plausible.js'; document.head.appendChild(s); return;
      }
      if (provider === 'ga' || provider === 'ga4') {
        if (siteId) { const s = document.createElement('script'); s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${siteId}`; document.head.appendChild(s); window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); } window.gtag = window.gtag || gtag; gtag('js', new Date()); gtag('config', siteId); }
      }
    } catch (e) { console.warn('Analytics failed', e); }
  }

  createCookieConsent();

  // Equalize project card heights to match FastGraph (first card)
  function equalizeProjectCards() {
    const cards = document.querySelectorAll('#projects .project-card');
    if (!cards || cards.length < 2) return;

    // Add resizing class for fade animation
    cards.forEach(c => c.classList.add('resizing'));

    // reset to natural height first so each card can display all content
    cards.forEach(c => c.style.minHeight = '');

    // Small delay to allow browser to recalculate layout
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // measure each card's natural height after rendering
        const heights = Array.from(cards).map(c => c.offsetHeight);
        const maxHeight = Math.max(...heights);

        // apply max height as minHeight so all cards are equal and all content is visible
        cards.forEach(c => {
          c.style.minHeight = maxHeight + 'px';
          c.classList.remove('resizing');
          c.classList.add('resized');
        });

        // Clean up animation class after transition
        setTimeout(() => {
          cards.forEach(c => c.classList.remove('resized'));
        }, 500);
      });
    });
  }

  if (document.readyState === 'complete') equalizeProjectCards();
  else window.addEventListener('load', equalizeProjectCards);

  let __eqTimer;
  window.addEventListener('resize', () => { clearTimeout(__eqTimer); __eqTimer = setTimeout(equalizeProjectCards, 150); });

})();

