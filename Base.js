// Datos de productos
const productsData = [
  {
    id: 1,
    name: "Triple Cono",
    price: 29.55,
    originalPrice: 35.55,
    image: "helado - 1.png",
    category: "cremosos",
    description: "Migas de pan caramelizadas en helado cremoso de vainilla con un toque de canela."
  },
  {
    id: 2,
    name: "Frutos del bosque",
    price: 19.55,
    originalPrice: 22.55,
    image: "helado - 2.png",
    category: "especiales",
    description: "Chocolate negro con un toque picante de cayena: una experiencia de sabor única."
  },
  {
    id: 3,
    name: "Triple Copa",
    price: 29.55,
    originalPrice: 35.55,
    image: "helado - 3.png",
    category: "especiales",
    description: "Helado de maíz dulce inesperadamente delicioso con remolinos de caramelo."
  },
  {
    id: 4,
    name: "Triple Cono Mini",
    price: 24.99,
    originalPrice: 29.99,
    image: "helado - 1.png",
    category: "clasicos",
    description: "Vainilla de Madagascar con granos de vainilla real y crema fresca."
  },
  {
    id: 5,
    name: "Chocolate Belga",
    price: 26.99,
    originalPrice: 31.99,
    image: "helado - 6.png",
    category: "clasicos",
    description: "Chocolate belga 70% cacao con trozos de chocolate negro."
  },
  {
    id: 6,
    name: "Fresa Silvestre",
    price: 22.99,
    originalPrice: 27.99,
    image: "helado - 5.png",
    category: "frutales",
    description: "Fresas silvestres orgánicas con un toque de limón fresco."
  },
  {
    id: 7,
    name: "Chocolate Tailandés",
    price: 25.99,
    originalPrice: 30.99,
    image: "helado - 4.png",
    category: "frutales",
    description: "Mango tailandés maduro con un toque de jengibre fresco."
  },
  {
    id: 8,
    name: "Triple Copa Etiqueta negra",
    price: 27.99,
    originalPrice: 32.99,
    image: "helado - 3.png",
    category: "cremosos",
    description: "Helado de vainilla con trozos de galleta Oreo y crema batida."
  },
  {
    id: 9,
    name: "Menta Chocolate",
    price: 23.99,
    originalPrice: 28.99,
    image: "helado - 1.png",
    category: "cremosos",
    description: "Helado de menta fresca con chispas de chocolate negro."
  },
  {
    id: 10,
    name: "Café Colombiano",
    price: 26.99,
    originalPrice: 31.99,
    image: "helado - 2.png",
    category: "especiales",
    description: "Café colombiano tostado oscuro con caramelo salado."
  },
  {
    id: 11,
    name: "Pistacho Siciliano",
    price: 31.99,
    originalPrice: 36.99,
    image: "helado - 3.png",
    category: "especiales",
    description: "Pistachos de Sicilia tostados con trozos de almendra caramelizada."
  },
  {
    id: 12,
    name: "Limón Siciliano",
    price: 21.99,
    originalPrice: 26.99,
    image: "helado - 5.png",
    category: "frutales",
    description: "Limón siciliano fresco con ralladura de limón y merengue."
  }
];

// Cargar productos en la página
function loadProducts(category = 'all') {
  const productGrid = document.getElementById('productGrid');
  productGrid.innerHTML = '';
  
  const filteredProducts = category === 'all' 
    ? productsData 
    : productsData.filter(product => product.category === category);
  
  filteredProducts.forEach(product => {
    const productElement = document.createElement('div');
    productElement.className = 'product';
    productElement.dataset.id = product.id;
    productElement.dataset.name = product.name;
    productElement.dataset.price = product.price;
    productElement.dataset.image = product.image;
    productElement.dataset.category = product.category;
    
    productElement.innerHTML = `
      <div class="product-img">
        <img src="${product.image}" alt="${product.name}"/>
      </div>
      <div class="product-info">
        <span class="product-category">${getCategoryName(product.category)}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="price">$${product.price.toFixed(2)} <del>$${product.originalPrice.toFixed(2)}</del></div>
        <button class="btn btn-primary add-to-cart-btn">Añadir al Carrito</button>
      </div>
    `;
    
    productGrid.appendChild(productElement);
  });
  
  // Agregar event listeners a los nuevos botones
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productElement = e.target.closest('.product');
      const product = {
        id: productElement.dataset.id,
        name: productElement.dataset.name,
        price: parseFloat(productElement.dataset.price),
        image: productElement.dataset.image,
        category: productElement.dataset.category
      };
      showAddToCartModal(product);
    });
  });
}

function getCategoryName(category) {
  const categories = {
    'cremosos': 'Cremosos',
    'frutales': 'Frutales',
    'especiales': 'Especiales',
    'clasicos': 'Clásicos'
  };
  return categories[category] || category;
}

// Inicializar productos
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  
  // Filtros por categoría
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadProducts(btn.dataset.category);
    });
  });
  
  // Filtros en footer
  document.querySelectorAll('.footer-links a[data-category]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = link.dataset.category;
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      document.querySelector(`.category-btn[data-category="${category}"]`).classList.add('active');
      loadProducts(category);
      window.scrollTo({
        top: document.getElementById('products').offsetTop - 80,
        behavior: 'smooth'
      });
    });
  });

});
//Rafael estuvo aquí//

