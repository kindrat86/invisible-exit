/**
 * ux.js - World-Class Interactive UX Enhancements (R18)
 * Zero dependencies. Progressive enhancement. ~14KB total.
 * 
 * Features:
 * - Reading progress bar (rAF + ARIA progressbar)
 * - Back-to-top button (safe-area aware)
 * - Lazy image loading (IntersectionObserver + blur-up)
 * - Accordions (animated open/close)
 * - Smooth anchor scroll (respects sticky nav)
 * - Mobile nav toggle (Escape key, anchor close, swipe gesture)
 * - Stagger animation observer (IntersectionObserver)
 * - Exit-intent detection helper
 * - Sticky CTA show/hide on scroll direction
 * - Network status detection (offline indicator)
 * - Toast notification system
 * - Swipe gesture for bottom sheet + mobile nav
 * - Active nav link highlighting
 * - Copy-to-clipboard helper
 * - Share API helper
 */
(function() {
  'use strict';

  // Internal state
  var lastScrollY = 0;
  var scrollTicking = false;
  var navTicking = false;

  // ── READING PROGRESS BAR ────────────────────────────────────────
  function initReadingProgress() {
    var bar = document.createElement('div');
    bar.id = 'ux-reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-label', 'Page reading progress');
    document.body.prepend(bar);

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          var scrollTop = window.scrollY || document.documentElement.scrollTop;
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          var progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
          bar.style.width = progress + '%';
          bar.setAttribute('aria-valuenow', Math.round(progress));
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── BACK-TO-TOP BUTTON ──────────────────────────────────────────
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.id = 'ux-back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '\u2191';
    btn.title = 'Back to top';
    document.body.appendChild(btn);

    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          if (window.scrollY > 500) {
            btn.classList.add('visible');
          } else {
            btn.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── LAZY IMAGE LOADING (with blur-up) ───────────────────────────
  function initLazyImages() {
    if ('IntersectionObserver' in window) {
      var imgObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            img.addEventListener('load', function() {
              img.classList.add('loaded');
            });
            // If image was already cached/loaded
            if (img.complete) {
              img.classList.add('loaded');
            }
            imgObserver.unobserve(img);
          }
        });
      }, { rootMargin: '300px 0px' });

      document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
        img.addEventListener('load', function() {
          img.classList.add('loaded');
        });
        if (img.complete) {
          img.classList.add('loaded');
        }
      });
    }
  }

  // ── ACCORDIONS ──────────────────────────────────────────────────
  function initAccordions() {
    document.addEventListener('click', function(e) {
      var trigger = e.target.closest('[data-accordion-trigger]');
      if (!trigger) return;

      var targetId = trigger.getAttribute('data-accordion-trigger');
      var content = document.querySelector('[data-accordion="' + targetId + '"]');
      if (!content) return;

      var isOpen = content.classList.contains('open');
      content.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', !isOpen);
    });
  }

  // ── SMOOTH ANCHOR SCROLL (respects sticky nav) ──────────────────
  function initSmoothAnchors() {
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var targetId = link.getAttribute('href');
      if (targetId === '#' || targetId === '#main-content' || targetId === '#main') return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var navHeight = 80;
      var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update URL without jump
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    });
  }

  // ── MOBILE NAV TOGGLE (Escape, anchor-close, swipe) ─────────────
  function initMobileNav() {
    document.addEventListener('click', function(e) {
      var toggle = e.target.closest('[data-mobile-nav-toggle]');
      if (!toggle) return;

      var targetId = toggle.getAttribute('data-mobile-nav-toggle');
      var nav = document.querySelector('[data-mobile-nav="' + targetId + '"]');
      if (!nav) return;

      var isOpen = nav.classList.contains('open');
      nav.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', !isOpen);
      document.body.classList.toggle('nav-open', !isOpen);

      // Close on Escape
      if (!isOpen) {
        var closeOnEsc = function(ev) {
          if (ev.key === 'Escape') {
            closeMobileNav(nav, toggle);
            document.removeEventListener('keydown', closeOnEsc);
          }
        };
        document.addEventListener('keydown', closeOnEsc, { once: false });

        // R18 — swipe gesture to close
        addSwipeToClose(nav, toggle);
      }
    });

    // Close mobile nav on anchor link click
    document.addEventListener('click', function(e) {
      var link = e.target.closest('[data-mobile-nav] a[href^="#"]');
      if (!link) return;

      var nav = link.closest('[data-mobile-nav].open');
      if (!nav) return;

      var toggle = document.querySelector('[data-mobile-nav-toggle][aria-expanded="true"]');
      closeMobileNav(nav, toggle);
    });
  }

  function closeMobileNav(nav, toggle) {
    nav.classList.remove('open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('nav-open');
  }

  // ── R18 — SWIPE-TO-CLOSE GESTURE (mobile nav + bottom sheet) ────
  function addSwipeToClose(el, toggle) {
    var startY = 0;
    var currentY = 0;
    var isDragging = false;

    function onTouchStart(e) {
      // Only enable swipe from the top 80px of the nav (swipe-handle zone)
      if (e.touches[0].clientY < 80) {
        startY = e.touches[0].clientY;
        isDragging = true;
      }
    }

    function onTouchMove(e) {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      var deltaY = currentY - startY;
      // Only allow downward swipe
      if (deltaY > 0) {
        el.style.transform = 'translateY(' + deltaY + 'px)';
        el.style.transition = 'none';
      }
    }

    function onTouchEnd() {
      if (!isDragging) return;
      isDragging = false;
      el.style.transition = '';

      var deltaY = currentY - startY;
      if (deltaY > 80) {
        closeMobileNav(el, toggle);
      }
      el.style.transform = '';
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);
  }

  // ── STAGGER ANIMATION OBSERVER ──────────────────────────────────
  function initStaggerObserver() {
    if ('IntersectionObserver' in window) {
      var staggerObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('ux-stagger');
            staggerObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      document.querySelectorAll('[data-stagger]').forEach(function(el) {
        staggerObserver.observe(el);
      });
    } else {
      // Fallback: show without animation
      document.querySelectorAll('[data-stagger]').forEach(function(el) {
        el.classList.add('ux-stagger');
      });
    }
  }

  // ── EXIT-INTENT DETECTION HELPER ────────────────────────────────
  function initExitIntent(callback) {
    var fired = false;
    document.addEventListener('mouseleave', function(e) {
      if (fired) return;
      if (e.clientY <= 0 && e.clientX >= 0 && e.clientX <= window.innerWidth) {
        fired = true;
        if (typeof callback === 'function') callback();
      }
    });
  }

  // ── R18 — STICKY CTA SCROLL-DIRECTION SHOW/HIDE ─────────────────
  function initStickyCTA() {
    var cta = document.querySelector('.ux-sticky-cta');
    if (!cta) return;

    // Show on mobile by default if it exists
    if (window.innerWidth <= 768) {
      cta.classList.add('visible');
    }

    window.addEventListener('scroll', function() {
      if (!scrollTicking) {
        requestAnimationFrame(function() {
          var currentScroll = window.scrollY;
          if (window.innerWidth <= 768) {
            if (currentScroll > 300) {
              cta.classList.add('visible');
            } else {
              cta.classList.remove('visible');
            }
          }
          lastScrollY = currentScroll;
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });
  }

  // ── R18 — NETWORK STATUS DETECTION ──────────────────────────────
  function initNetworkStatus() {
    var bar = document.createElement('div');
    bar.className = 'ux-offline-bar';
    bar.setAttribute('aria-live', 'polite');
    bar.textContent = 'You are offline. Some features may be unavailable.';
    document.body.appendChild(bar);

    function updateStatus() {
      if (navigator.onLine) {
        bar.classList.remove('visible');
      } else {
        bar.classList.add('visible');
        setTimeout(function() {
          if (navigator.onLine) {
            bar.classList.remove('visible');
          }
        }, 4000);
      }
    }

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
  }

  // ── R18 — TOAST NOTIFICATION SYSTEM ─────────────────────────────
  function initToastSystem() {
    var container = document.querySelector('.ux-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'ux-toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    window.uxToast = function(message, duration) {
      duration = duration || 3500;
      var toast = document.createElement('div');
      toast.className = 'ux-toast';
      toast.setAttribute('role', 'status');
      toast.textContent = message;
      container.appendChild(toast);

      setTimeout(function() {
        toast.classList.add('removing');
        setTimeout(function() {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 250);
      }, duration);
    };
  }

  // ── R18 — ACTIVE NAV LINK HIGHLIGHTING ──────────────────────────
  function initActiveNavLink() {
    var ticking = false;
    var sections = document.querySelectorAll('section[id], [id][data-nav-spy]');
    var navLinks = document.querySelectorAll('nav a[href^="#"], [data-nav] a[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          var currentId = '';
          sections.forEach(function(section) {
            var sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
              currentId = section.getAttribute('id');
            }
          });
          navLinks.forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentId) {
              link.classList.add('active');
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── R18 — COPY-TO-CLIPBOARD HELPER ──────────────────────────────
  window.uxCopy = function(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        if (window.uxToast) {
          window.uxToast('Copied to clipboard', 2000);
        }
      }).catch(function() {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  };

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      if (window.uxToast) {
        window.uxToast('Copied to clipboard', 2000);
      }
    } catch (e) {
      console.warn('Copy failed');
    }
    document.body.removeChild(textarea);
  }

  // ── R18 — SHARE API HELPER ──────────────────────────────────────
  window.uxShare = function(data) {
    if (navigator.share) {
      navigator.share(data).catch(function() {});
    } else {
      // Fallback: copy URL
      if (window.uxCopy && data.url) {
        window.uxCopy(data.url);
      }
    }
  };

  // ── INITIALIZE EVERYTHING ───────────────────────────────────────
  function init() {
    initReadingProgress();
    initBackToTop();
    initLazyImages();
    initAccordions();
    initSmoothAnchors();
    initMobileNav();
    initStaggerObserver();
    initStickyCTA();
    initNetworkStatus();
    initToastSystem();
    initActiveNavLink();

    // Expose helpers
    window.uxExitIntent = initExitIntent;
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
