document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ Portfolio website loaded successfully");

  initializeAnimations();
  
  initializeCounters();
  
  initializeSkillBars();
  
  initializeFormValidation();
  
  initializeNavbarEffects();

  initializeProjectFilter();
});

function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        entry.target.classList.add('opacity-100', 'translate-y-0'); 
        
      }
    });
  }, observerOptions);

  
  document.querySelectorAll('.animate-fadeInUp').forEach(el => {
    el.classList.add('opacity-0', 'translate-y-3'); 
    observer.observe(el);
  });
  
}


function initializeCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; 
        const step = target / (duration / 16); 
        let current = 0;
        
        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        };
        
        updateCounter();
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
}

function initializeSkillBars() {
  const progressBars = document.querySelectorAll('.progress-bar[data-width]');
  
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
          bar.style.width = width;
        }, 500);
        
        progressObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });
  
  progressBars.forEach(bar => progressObserver.observe(bar));
}


function initializeFormValidation() {
  const forms = document.querySelectorAll('.needs-validation');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      event.stopPropagation();
      
      if (form.checkValidity()) {
        
        showSuccessMessage();
        form.reset();
        form.classList.remove('was-validated');
      } else {
        
        showErrorMessage('Por favor, complete todos los campos requeridos correctamente.');
      }
      
      form.classList.add('was-validated');
    });
  });
  
  
}


function initializeNavbarEffects() {
  const navbar = document.querySelector('.navbar');
  
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        navbar.classList.add('bg-opacity-75', 'shadow'); 
      } else {
        navbar.classList.remove('bg-opacity-75', 'shadow');
      }
    });
  }
  
  updateActiveNavLink();
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showSuccessMessage() {
  // Create and show success toast
  const toast = createToast('¡Mensaje enviado exitosamente!', 'success');
  showToast(toast);
}

function showErrorMessage(message) {
  
  const toast = createToast(message, 'error');
  showToast(toast);
}

function createToast(message, type) {
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white ${type === 'success' ? 'bg-success' : 'bg-danger'} border-0`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2"></i>
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  
  return toast;
}

function showToast(toast) {
  
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(toastContainer);
  }
  
  toastContainer.appendChild(toast);
  
  const bsToast = new bootstrap.Toast(toast, {
    autohide: true,
    delay: 3000
  });
  
  bsToast.show();
  
  
  toast.addEventListener('hidden.bs.toast', () => {
    toast.remove();
  });
}

function updateActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkHref = link.getAttribute('href');
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    }
  });
}


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = document.querySelector('.navbar').offsetHeight;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});


function initializeLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) { 
            img.src = img.dataset.src;
            img.removeAttribute('data-src'); 
          }
          
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

initializeLazyLoading();


document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function() {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="bi bi-send-fill me-2"></i>Enviar Mensaje';
        submitBtn.disabled = false;
      }, 3000);
    }
  });
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modals = document.querySelectorAll('.modal.show');
    modals.forEach(modal => {
      const bsModal = bootstrap.Modal.getInstance(modal);
      if (bsModal) bsModal.hide();
    });
  }
});

let resizeTimeout;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function() {
    
    updateActiveNavLink();
  }, 250);
});


function initializeProjectFilter() {
  const filterLinks = document.querySelectorAll('.nav-pills .nav-link');
  const projectItems = document.querySelectorAll('.project-item');

  filterLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      
      filterLinks.forEach(l => l.classList.remove('active'));
      
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      projectItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block'; 
        } else {
          item.style.display = 'none'; 
        }
      });
    });
  });
}

