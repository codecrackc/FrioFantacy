// Sistema de usuarios y autenticación
class AuthSystem {
  constructor() {
    this.currentUser = null;
    this.users = JSON.parse(localStorage.getItem('frioFantasyUsers')) || [];
    this.orders = JSON.parse(localStorage.getItem('frioFantasyOrders')) || {};
    this.init();
  }
  
  init() {
    // Verificar si hay usuario en sesión
    const savedUser = localStorage.getItem('frioFantasyCurrentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      this.updateUI();
    }
    
    // Event listeners
    document.getElementById('userBtn').addEventListener('click', () => this.showAuthModal());
    document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
    
    // Tabs de autenticación
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        document.getElementById(`${tab.dataset.tab}Form`).classList.add('active');
        document.getElementById('authModalTitle').textContent = 
          tab.dataset.tab === 'login' ? 'Iniciar Sesión' : 'Registrarse';
      });
    });
    
    // Formulario de login
    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.login();
    });
    
    // Formulario de registro
    document.getElementById('registerForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.register();
    });
  }
  
  showAuthModal() {
    if (this.currentUser) {
      this.showOrderHistory();
    } else {
      showModal(document.getElementById('authModal'));
    }
  }
  
  login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.currentUser = user;
      localStorage.setItem('frioFantasyCurrentUser', JSON.stringify(user));
      this.updateUI();
      hideModal(document.getElementById('authModal'));
      showNotification(`¡Bienvenido de nuevo, ${user.name}!`);
      
      // Cargar carrito del usuario
      if (user.cart && user.cart.length > 0) {
        cart = user.cart;
        updateCartCount();
        renderCartItems();
        updateCartTotal();
      }
    } else {
      showNotification('Correo o contraseña incorrectos');
    }
  }
  
  register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const phone = document.getElementById('registerPhone').value;
    
    // Validar que el email no exista
    if (this.users.some(u => u.email === email)) {
      showNotification('Este correo ya está registrado');
      return;
    }
    
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      phone,
      cart: [],
      orders: []
    };
    
    this.users.push(newUser);
    this.currentUser = newUser;
    
    localStorage.setItem('frioFantasyUsers', JSON.stringify(this.users));
    localStorage.setItem('frioFantasyCurrentUser', JSON.stringify(newUser));
    
    this.updateUI();
    hideModal(document.getElementById('authModal'));
    showNotification(`¡Bienvenido a Frio Fantasy, ${name}!`);
  }
  
  logout() {
    // Guardar carrito actual en el usuario
    if (this.currentUser) {
      this.currentUser.cart = cart;
      const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
      if (userIndex !== -1) {
        this.users[userIndex] = this.currentUser;
        localStorage.setItem('frioFantasyUsers', JSON.stringify(this.users));
      }
    }
    
    this.currentUser = null;
    localStorage.removeItem('frioFantasyCurrentUser');
    this.updateUI();
    showNotification('Sesión cerrada correctamente');
  }
  
  updateUI() {
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');
    const userBtn = document.getElementById('userBtn');
    
    if (this.currentUser) {
      userInfo.style.display = 'flex';
      userName.textContent = this.currentUser.name.split(' ')[0];
      userBtn.innerHTML = '<i class="fas fa-user-check"></i>';
      userBtn.title = 'Mi cuenta';
    } else {
      userInfo.style.display = 'none';
      userBtn.innerHTML = '<i class="fas fa-user"></i>';
      userBtn.title = 'Iniciar sesión';
    }
  }
  
  saveUserCart() {
    if (this.currentUser) {
      this.currentUser.cart = cart;
      const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
      if (userIndex !== -1) {
        this.users[userIndex] = this.currentUser;
        localStorage.setItem('frioFantasyUsers', JSON.stringify(this.users));
      }
    }
  }
  
  saveOrder(order) {
    if (!this.currentUser) return;
    
    if (!this.orders[this.currentUser.id]) {
      this.orders[this.currentUser.id] = [];
    }
    
    this.orders[this.currentUser.id].push(order);
    localStorage.setItem('frioFantasyOrders', JSON.stringify(this.orders));
    
    // Actualizar usuario
    this.currentUser.orders.push(order.id);
    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex !== -1) {
      this.users[userIndex] = this.currentUser;
      localStorage.setItem('frioFantasyUsers', JSON.stringify(this.users));
    }
  }
  
  getOrderHistory() {
    if (!this.currentUser || !this.orders[this.currentUser.id]) {
      return [];
    }
    
    return this.orders[this.currentUser.id].sort((a, b) => b.id - a.id);
  }
  
  showOrderHistory() {
    const history = this.getOrderHistory();
    const container = document.getElementById('orderHistoryContainer');
    
    if (history.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #666;">No tienes pedidos anteriores</p>';
    } else {
      container.innerHTML = history.map(order => `
        <div class="order-history-item">
          <div class="order-history-header">
            <div>
              <strong>Pedido #${order.number}</strong>
              <div style="font-size: 0.9rem; color: #666;">${order.date}</div>
            </div>
            <div style="font-weight: 600; color: var(--primary);">
              $${order.total.toFixed(2)}
            </div>
          </div>
          <div class="order-history-items">
            ${order.items.map(item => `
              <div>${item.quantity}x ${item.name}</div>
            `).join('')}
          </div>
          <div class="order-history-total">
            Total: $${order.total.toFixed(2)}
          </div>
        </div>
      `).join('');
    }
    
    showModal(document.getElementById('orderHistoryModal'));
  }
}

// Inicializar sistema de autenticación
const authSystem = new AuthSystem();