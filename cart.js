// Variables globales del carrito
let cart = [];
let currentProduct = null;
let quantity = 1;
let orderCounter = JSON.parse(localStorage.getItem('frioFantasyOrderCounter')) || 1;

// Elementos del DOM
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const addToCartModal = document.getElementById('addToCartModal');
const cartModal = document.getElementById('cartModal');
const checkoutModal = document.getElementById('checkoutModal');
const confirmationModal = document.getElementById('confirmationModal');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalPrice = document.getElementById('cartTotalPrice');
const modalProductDetails = document.getElementById('modalProductDetails');
const modalProductName = document.getElementById('modalProductName');
const modalTotalPrice = document.getElementById('modalTotalPrice');
const quantityDisplay = document.getElementById('quantityDisplay');
const decreaseQuantity = document.getElementById('decreaseQuantity');
const increaseQuantity = document.getElementById('increaseQuantity');
const confirmAddToCart = document.getElementById('confirmAddToCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutForm = document.getElementById('checkoutForm');
const deliveryOptions = document.querySelectorAll('.delivery-option');
const deliveryAddressGroup = document.getElementById('deliveryAddressGroup');
const orderNumberDisplay = document.getElementById('orderNumber');
const qrCodeDisplay = document.getElementById('qrCodeDisplay');

// Funciones del carrito
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  // Guardar en usuario si está logueado
  if (authSystem.currentUser) {
    authSystem.saveUserCart();
  }
  
  // Guardar en localStorage como respaldo
  localStorage.setItem('frioFantasyCart', JSON.stringify(cart));
}

function updateCartTotal() {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotalPrice.textContent = `$${total.toFixed(2)}`;
  return total;
}

function renderCartItems() {
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="text-align: center; color: #666;">Tu carrito está vacío</p>';
    return;
  }
  
  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="cart-item-title">${item.name}</div>
        <div>Cantidad: ${item.quantity}</div>
        <div style="font-size: 0.9rem; color: #666;">$${item.price.toFixed(2)} c/u</div>
      </div>
      <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
    `;
    cartItemsContainer.appendChild(cartItem);
  });
}

function addToCart(product, qty) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
      category: product.category,
      quantity: qty
    });
  }
  
  updateCartCount();
  renderCartItems();
  updateCartTotal();
  showNotification(`${qty} ${product.name} añadido al carrito`);
}

function clearCart() {
  cart = [];
  updateCartCount();
  renderCartItems();
  updateCartTotal();
}

// Funciones para mostrar/ocultar modales
function showModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function showAddToCartModal(product) {
  currentProduct = product;
  quantity = 1;
  
  modalProductName.textContent = product.name;
  modalProductDetails.innerHTML = `
    <p><strong>${product.name}</strong></p>
    <p>${getCategoryName(product.category)}</p>
    <p>Precio unitario: $${product.price.toFixed(2)}</p>
  `;
  quantityDisplay.textContent = quantity;
  modalTotalPrice.textContent = `Total: $${(product.price * quantity).toFixed(2)}`;
  
  showModal(addToCartModal);
}

function showCheckoutModal() {
  if (cart.length === 0) {
    showNotification('Tu carrito está vacío');
    return;
  }
  
  // Rellenar datos si el usuario está logueado
  if (authSystem.currentUser) {
    document.getElementById('customerName').value = authSystem.currentUser.name;
    document.getElementById('customerEmail').value = authSystem.currentUser.email;
    document.getElementById('customerPhone').value = authSystem.currentUser.phone;
  }
  
  hideModal(cartModal);
  showModal(checkoutModal);
}

function showConfirmationModal() {
  hideModal(checkoutModal);
  
  // Generar número de orden
  const orderNumber = `ORD-${orderCounter.toString().padStart(6, '0')}`;
  orderNumberDisplay.textContent = orderNumber;
  orderCounter++;
  localStorage.setItem('frioFantasyOrderCounter', JSON.stringify(orderCounter));
  
  // Generar código QR simulado
  generateQRCode(orderNumber);
  
  // Crear objeto de orden
  const order = {
    id: Date.now(),
    number: orderNumber,
    date: new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    items: [...cart],
    total: updateCartTotal(),
    customer: {
      name: document.getElementById('customerName').value,
      email: document.getElementById('customerEmail').value,
      phone: document.getElementById('customerPhone').value
    },
    delivery: document.querySelector('.delivery-option.selected').dataset.type,
    address: document.getElementById('deliveryAddress').value || 'Recoger en tienda',
    payment: document.getElementById('paymentMethod').value
  };
  
  // Guardar orden en el sistema
  authSystem.saveOrder(order);
  
  // Vaciar carrito
  clearCart();
  
  showModal(confirmationModal);
}

function generateQRCode(orderNumber) {
  qrCodeDisplay.innerHTML = `
    <div style="text-align: center;">
      <i class="fas fa-qrcode" style="font-size: 3rem; margin-bottom: 10px; color: #666;"></i>
      <div style="font-family: monospace; font-size: 0.9rem; margin-top: 10px;">${orderNumber}</div>
      <div style="margin-top: 5px; font-size: 0.8rem;">Frio Fantasy Helados</div>
    </div>
  `;
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Cargar carrito guardado
  const savedCart = localStorage.getItem('frioFantasyCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
    renderCartItems();
    updateCartTotal();
  }
  
  // Botón del carrito
  cartBtn.addEventListener('click', () => {
    renderCartItems();
    updateCartTotal();
    showModal(cartModal);
  });
  
  // Cerrar modales
  document.getElementById('closeAddToCartModal').addEventListener('click', () => hideModal(addToCartModal));
  document.getElementById('closeCartModal').addEventListener('click', () => hideModal(cartModal));
  document.getElementById('closeCheckoutModal').addEventListener('click', () => hideModal(checkoutModal));
  document.getElementById('closeConfirmationModal').addEventListener('click', () => hideModal(confirmationModal));
  document.getElementById('closeAuthModal').addEventListener('click', () => hideModal(document.getElementById('authModal')));
  document.getElementById('closeOrderHistoryModal').addEventListener('click', () => hideModal(document.getElementById('orderHistoryModal')));
  
  // Cerrar modales al hacer clic fuera
  [addToCartModal, cartModal, checkoutModal, confirmationModal, 
   document.getElementById('authModal'), document.getElementById('orderHistoryModal')].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          hideModal(modal);
        }
      });
    }
  });
  
  // Control de cantidad
  decreaseQuantity.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantityDisplay.textContent = quantity;
      modalTotalPrice.textContent = `Total: $${(currentProduct.price * quantity).toFixed(2)}`;
    }
  });
  
  increaseQuantity.addEventListener('click', () => {
    quantity++;
    quantityDisplay.textContent = quantity;
    modalTotalPrice.textContent = `Total: $${(currentProduct.price * quantity).toFixed(2)}`;
  });
  
  // Confirmar añadir al carrito
  confirmAddToCart.addEventListener('click', () => {
    addToCart(currentProduct, quantity);
    hideModal(addToCartModal);
  });
  
  // Proceder al pago
  checkoutBtn.addEventListener('click', showCheckoutModal);
  
  // Opciones de entrega
  deliveryOptions.forEach(option => {
    option.addEventListener('click', () => {
      deliveryOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
      
      if (option.dataset.type === 'delivery') {
        deliveryAddressGroup.style.display = 'block';
        document.getElementById('deliveryAddress').required = true;
      } else {
        deliveryAddressGroup.style.display = 'none';
        document.getElementById('deliveryAddress').required = false;
      }
    });
  });
  
  // Formulario de checkout
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validar formulario
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const deliveryType = document.querySelector('.delivery-option.selected').dataset.type;
    const address = document.getElementById('deliveryAddress').value;
    const payment = document.getElementById('paymentMethod').value;
    
    if (!name || !email || !phone || !payment) {
      showNotification('Por favor, completa todos los campos obligatorios');
      return;
    }
    
    if (deliveryType === 'delivery' && !address.trim()) {
      showNotification('Por favor, ingresa una dirección de entrega');
      return;
    }
    
    // Mostrar confirmación
    showConfirmationModal();
  });
});