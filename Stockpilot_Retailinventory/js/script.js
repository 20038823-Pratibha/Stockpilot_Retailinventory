/* ============================================================
   StockPilot — site JavaScript
   ICT726 Assignment 3 | Pratibha Khakural (20038823)

   01  Mobile navigation toggle
   02  Stock level bars on the home page
   03  Gallery lightbox
   04  Contact form validation
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 01  MOBILE NAVIGATION ---------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      primaryNav.classList.toggle('is-open', !isOpen);
    });

    // Close the menu with the Escape key so keyboard users are not trapped
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-open');
        navToggle.focus();
      }
    });
  }


  /* ---------- 02  STOCK LEVEL BARS ---------- */
  // Each bar starts at width 0 and grows to its real level, so the card
  // reads as live data rather than a static picture.
  var fills = document.querySelectorAll('.stock-fill');

  if (fills.length > 0) {
    window.setTimeout(function () {
      for (var i = 0; i < fills.length; i++) {
        fills[i].style.width = fills[i].getAttribute('data-level') + '%';
      }
    }, 250);
  }


  /* ---------- 03  GALLERY LIGHTBOX ---------- */
  var lightbox = document.getElementById('lightbox');

  if (lightbox) {
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxCaption = document.getElementById('lightboxCaption');
    var lightboxClose = document.getElementById('lightboxClose');
    var thumbButtons = document.querySelectorAll('.gallery-btn');
    var lastFocused = null;

    function openLightbox(button) {
      var thumb = button.querySelector('img');
      lastFocused = button;

      lightboxImg.setAttribute('src', button.getAttribute('data-full'));
      lightboxImg.setAttribute('alt', thumb.getAttribute('alt'));
      lightboxCaption.textContent = button.getAttribute('data-caption');

      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocused) {
        lastFocused.focus();
      }
    }

    for (var t = 0; t < thumbButtons.length; t++) {
      thumbButtons[t].addEventListener('click', function () {
        openLightbox(this);
      });
    }

    lightboxClose.addEventListener('click', closeLightbox);

    // Clicking the dark area around the image also closes it
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  }


  /* ---------- 04  CONTACT FORM VALIDATION ---------- */
  var form = document.getElementById('contactForm');

  if (form) {
    var status = document.getElementById('formStatus');

    // Rules for each field: the element, its error box, and what counts as valid
    var rules = [
      {
        id: 'fullName',
        test: function (v) { return v.trim().length >= 2; },
        message: 'Enter your full name, at least 2 characters.'
      },
      {
        id: 'email',
        test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
        message: 'Enter an email address in the format name@example.com.'
      },
      {
        id: 'phone',
        test: function (v) {
          if (v.trim() === '') { return true; }        // optional field
          return /^[0-9 +()-]{8,20}$/.test(v.trim());
        },
        message: 'Use numbers, spaces and + ( ) - only, 8 to 20 characters.'
      },
      {
        id: 'shopName',
        test: function (v) { return v.trim().length >= 2; },
        message: 'Tell us the name of your shop.'
      },
      {
        id: 'enquiry',
        test: function (v) { return v !== ''; },
        message: 'Choose what your message is about.'
      },
      {
        id: 'message',
        test: function (v) { return v.trim().length >= 20; },
        message: 'Give us a bit more detail — at least 20 characters.'
      },
      {
        id: 'consent',
        test: function (v, el) { return el.checked; },
        message: 'Tick the box so we know we can reply to you.'
      }
    ];

    function checkField(rule) {
      var el = document.getElementById(rule.id);
      var errorBox = document.getElementById(rule.id + 'Error');
      var wrapper = el.closest('.field');
      var valid = rule.test(el.value, el);

      if (valid) {
        errorBox.textContent = '';
        wrapper.classList.remove('has-error');
        el.setAttribute('aria-invalid', 'false');
      } else {
        errorBox.textContent = rule.message;
        wrapper.classList.add('has-error');
        el.setAttribute('aria-invalid', 'true');
      }

      return valid;
    }

    // Re-check a field once the user has left it, so errors clear as they fix them
    for (var r = 0; r < rules.length; r++) {
      (function (rule) {
        var el = document.getElementById(rule.id);
        if (!el) { return; }
        el.addEventListener('blur', function () { checkField(rule); });
        el.addEventListener('input', function () {
          if (el.closest('.field').classList.contains('has-error')) {
            checkField(rule);
          }
        });
      })(rules[r]);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();   // static site, so nothing is actually sent

      var allValid = true;
      var firstBad = null;

      for (var i = 0; i < rules.length; i++) {
        var ok = checkField(rules[i]);
        if (!ok && firstBad === null) {
          firstBad = document.getElementById(rules[i].id);
        }
        if (!ok) { allValid = false; }
      }

      if (allValid) {
        status.className = 'form-status is-success';
        status.textContent = 'Thanks ' + document.getElementById('fullName').value.trim() +
          ', your message is on its way. We reply within one business day.';
        form.reset();
        status.focus();
      } else {
        status.className = 'form-status is-error';
        status.textContent = 'Some details still need fixing. Check the highlighted fields below.';
        if (firstBad) { firstBad.focus(); }
      }
    });
  }

});