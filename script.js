document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  /* ==========================================================================
     THEME TOGGLE (LIGHT / DARK)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve saved theme or use system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else {
    htmlElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  /* ==========================================================================
     NAVBAR & MOBILE MENU
     ========================================================================== */
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change navbar height and add shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle mobile menu
  menuToggle.addEventListener('click', () => {
    navbar.classList.toggle('menu-open');
  });

  // Close mobile menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('menu-open');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navbar.classList.contains('menu-open') && !navbar.contains(e.target)) {
      navbar.classList.remove('menu-open');
    }
  });

  /* ==========================================================================
     TYPEWRITER EFFECT (HERO SUBTITLE)
     ========================================================================== */
  const words = [
    "Ingeniera Física",
    "Especialista en Gestión de la Innovación",
    "Líder de Proyectos STEAM",
    "Cofundadora de FabLab UNAL",
    "Apasionada por la Transformación Digital"
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typewriterElement = document.getElementById('typewriter');
  let typingDelay = 100;
  let erasingDelay = 50;
  let newWordDelay = 2000; // delay between words

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = erasingDelay;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingDelay = newWordDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingDelay = 500;
    }

    setTimeout(type, typingDelay);
  }

  // Start Typewriter
  setTimeout(type, 1000);

  /* ==========================================================================
     TIMELINE FILTERING
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active state on buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      timelineItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('hidden');
          // Brief timeout to let display take effect before opacity transition
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          // Wait for transition before hiding display
          setTimeout(() => {
            item.classList.add('hidden');
          }, 300);
        }
      });
    });
  });

  /* ==========================================================================
     SCROLLSPY (ACTIVE NAV LINKS)
     ========================================================================== */
  const sections = document.querySelectorAll('section');
  
  const scrollSpyOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section is in the middle of screen
    threshold: 0
  };

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, scrollSpyOptions);

  sections.forEach(section => {
    scrollSpyObserver.observe(section);
  });

  /* ==========================================================================
     SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  /* ==========================================================================
     SKILLS PROGRESS ANIMATION
     ========================================================================== */
  const skillProgressBars = document.querySelectorAll('.skill-progress');
  
  const skillObserverOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.2
  };

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const targetWidth = progressBar.getAttribute('data-progress');
        progressBar.style.width = targetWidth;
        observer.unobserve(progressBar);
      }
    });
  }, skillObserverOptions);

  skillProgressBars.forEach(bar => {
    skillObserver.observe(bar);
  });

  /* ==========================================================================
     COPY TO CLIPBOARD (REFERENCES)
     ========================================================================== */
  const copyButtons = document.querySelectorAll('.btn-copy');

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const textToCopy = button.getAttribute('data-copy');
      const originalContent = button.innerHTML;
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        
        // Show success state
        button.classList.add('copied');
        button.innerHTML = `<i data-lucide="check" class="icon-check"></i> <span>¡Copiado!</span>`;
        lucide.createIcons(); // Re-render check icon
        
        setTimeout(() => {
          button.classList.remove('copied');
          button.innerHTML = originalContent;
          lucide.createIcons();
        }, 2000);
        
      } catch (err) {
        console.error('Error al copiar el texto: ', err);
      }
    });
  });

  /* ==========================================================================
     CONTACT FORM HANDLING & VALIDATION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const successMessage = document.getElementById('success-message');
  const btnResetForm = document.getElementById('btn-reset-form');
  const submitBtn = document.getElementById('form-submit-btn');

  // Simple Email Validation regex
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Handle Input validation indicators
  const inputs = contactForm.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const parent = input.parentElement;
      if (input.value.trim() !== '') {
        parent.classList.remove('invalid');
      }
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isFormValid = true;

    // Check Name
    const nameInput = document.getElementById('form-name');
    if (nameInput.value.trim() === '') {
      nameInput.parentElement.classList.add('invalid');
      isFormValid = false;
    } else {
      nameInput.parentElement.classList.remove('invalid');
    }

    // Check Email
    const emailInput = document.getElementById('form-email');
    if (!isValidEmail(emailInput.value.trim())) {
      emailInput.parentElement.classList.add('invalid');
      isFormValid = false;
    } else {
      emailInput.parentElement.classList.remove('invalid');
    }

    // Check Message
    const messageInput = document.getElementById('form-message');
    if (messageInput.value.trim() === '') {
      messageInput.parentElement.classList.add('invalid');
      isFormValid = false;
    } else {
      messageInput.parentElement.classList.remove('invalid');
    }

    if (isFormValid) {
      // Show loading state
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Enviando...</span> <i data-lucide="loader-2" class="animate-spin"></i>`;
      lucide.createIcons();

      // Send the request via FormSubmit AJAX endpoint
      fetch("https://formsubmit.co/ajax/sofiarojasmb@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          Nombre: nameInput.value.trim(),
          Email: emailInput.value.trim(),
          Mensaje: messageInput.value.trim(),
          _subject: "Nuevo contacto desde tu Hoja de Vida Interactiva",
          _captcha: "false"
        })
      })
      .then(response => response.json())
      .then(data => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        lucide.createIcons();

        if (data.success === "true" || data.success === true) {
          // Show Success Message panel
          successMessage.classList.add('active');
          // Trigger Canvas Confetti celebration!
          triggerConfetti();
        } else {
          if (data.message && (data.message.toLowerCase().includes('activate') || data.message.toLowerCase().includes('confirm'))) {
            alert("¡Casi listo! FormSubmit necesita verificar tu correo. Por favor, revisa tu bandeja de entrada o carpeta de SPAM en sofiarojasmb@gmail.com y haz clic en el enlace de activación que te enviaron.");
          } else {
            alert("Hubo un error al enviar el mensaje: " + (data.message || "Por favor intenta de nuevo."));
          }
        }
      })
      .catch(error => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        lucide.createIcons();
        console.error('Error:', error);
        alert("Hubo un problema de conexión. Por favor intenta de nuevo.");
      });
    }
  });

  btnResetForm.addEventListener('click', () => {
    // Hide success panel
    successMessage.classList.remove('active');
    // Clear form
    contactForm.reset();
  });

  // Confetti function
  function triggerConfetti() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#3b82f6', '#14b8a6']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#3b82f6', '#14b8a6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  /* ==========================================================================
     BACK TO TOP BUTTON
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'all';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
    }
  });

  /* ==========================================================================
     MOUSE TRACKING INTERACTION
     ========================================================================== */
  const cursorGlow = document.getElementById('cursor-glow');
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (cursorGlow && !isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.opacity = '1';
      requestAnimationFrame(() => {
        cursorGlow.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
      });
    });

    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
  }

  // Spotlight card effects
  const cards = document.querySelectorAll('.card, .contact-card');
  if (cards.length > 0 && !isTouchDevice) {
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }
});
