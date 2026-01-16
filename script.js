// Script principal
document.addEventListener('DOMContentLoaded', () => {
  // Toggle mobile menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active') 
      ? '<i class="fas fa-times"></i>' 
      : '<i class="fas fa-bars"></i>';
  });
  
  // Close mobile menu when clicking a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
  
  // Header scroll effect
  window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#') return;
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // Cerrar menú móvil si está abierto
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
      }
    });
  });
  
  // Product hover effect enhancement
  document.querySelectorAll('.product').forEach(product => {
    product.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
    });
    
    product.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Newsletter form
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      if (email) {
        showNotification('¡Gracias por suscribirte! Recibirás nuestras ofertas pronto.');
        this.reset();
      }
    });
  }
  
  // Función para obtener nombre de categoría
  window.getCategoryName = function(category) {
    const categories = {
      'cremosos': 'Cremosos',
      'frutales': 'Frutales',
      'especiales': 'Especiales',
      'clasicos': 'Clásicos'
    };
    return categories[category] || category;
  };
});



 // Configuración del botón de WhatsApp
        // Reemplaza el número de teléfono y el mensaje por defecto
        const whatsappNumber = "8495216270"; // Código de país + número (sin +)
        const defaultMessage = "Hola, me interesa más información";
        
        // Construir el enlace de WhatsApp
        const whatsappBtn = document.querySelector('.whatsapp-btn');
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
        whatsappBtn.href = whatsappLink;
        
        // Opcional: Cambiar posición del botón (descomenta una de las siguientes líneas)
        // whatsappBtn.classList.add('bottom-left');   // Esquina inferior izquierda
        // whatsappBtn.classList.add('top-right');     // Esquina superior derecha
        // whatsappBtn.classList.add('top-left');      // Esquina superior izquierda
        
        // Opcional: Desactivar animación de pulso en dispositivos que reducen movimiento
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            whatsappBtn.classList.remove('whatsapp-pulse');

        }
