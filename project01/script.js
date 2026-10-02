
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initSkillFilters();
  initEmailCopy();
  initContactForm();
  initStatCounters();
});

/* ==========================================================================
   Navigation & Content Tabs
   ========================================================================== */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const navLinks = document.querySelectorAll('.nav-link[data-tab]');

  function activateTab(tabId) {
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.tab === tabId);
    });
    tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      activateTab(tabId);
    });
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.dataset.tab;
      activateTab(tabId);
      
      const targetElement = document.getElementById('main-tabs-section');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ==========================================================================
   Skills Category Filter
   ========================================================================== */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.dataset.filter;

      skillCards.forEach(card => {
        if (filterCategory === 'all' || card.dataset.category === filterCategory) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   Copy Email to Clipboard with Toast
   ========================================================================== */
function initEmailCopy() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const email = copyBtn.dataset.email || 'axceldesigns@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast(`Copied to clipboard: ${email}`);
    }).catch(() => {
      showToast('Email: ' + email);
    });
  });
}

/* ==========================================================================
   Contact Form Submission Handler
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('sender-name');
    const name = nameInput ? nameInput.value.trim() : 'Friend';

    showToast(`Thank you, ${name}! Your message has been sent.`);
    contactForm.reset();
  });
}

/* ==========================================================================
   Animated Number Counters
   ========================================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  let animated = false;

  function runCounters() {
    if (animated) return;
    animated = true;
    const duration = 800; // ms
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      counters.forEach(counter => {
        const target = +counter.dataset.target;
        const suffix = counter.dataset.suffix || '';
        const currentVal = Math.round(target * easedProgress);
        counter.innerText = currentVal + suffix;
      });

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counters.forEach(counter => {
          const target = +counter.dataset.target;
          const suffix = counter.dataset.suffix || '';
          counter.innerText = target + suffix;
        });
      }
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounters();
      }
    });
  }, { threshold: 0.1 });

  const statsSection = document.querySelector('.stats-grid');
  if (statsSection) {
    observer.observe(statsSection);
  } else {
    runCounters();
  }
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-success-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    </span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3200);
}

// Global helper for opening contact tab from hero button
window.openContactTab = function() {
  const contactBtn = document.querySelector('.tab-btn[data-tab="contact"]');
  if (contactBtn) {
    contactBtn.click();
    const contactSection = document.getElementById('main-tabs-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
};
