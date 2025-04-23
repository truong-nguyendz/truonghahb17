let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Thêm sản phẩm vào giỏ hàng
function addToCart(productElement) {
    const productId = productElement.getAttribute('data-id');
    const productName = productElement.getAttribute('data-name');
    const productPrice = parseInt(productElement.getAttribute('data-price'));
    const productImage = productElement.getAttribute('data-image');

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification(`Đã thêm "${productName}" vào giỏ hàng`);
}

// Lưu giỏ hàng vào localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Cập nhật số lượng hiển thị trên icon giỏ hàng
// Change this function in your shopping.js file
function updateCartCount() {
    // Target the specific giohang element instead of the first li
    const cartLink = document.querySelector('#giohang a');
    if (cartLink) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartLink.innerHTML = `<i class="fas fa-shopping-cart"></i> Giỏ hàng (${totalItems})`;
    }
}

// Hiển thị thông báo
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerText = message;

    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '15px',
        borderRadius: '5px',
        zIndex: 1000,
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Hiển thị giỏ hàng (trang shopping.html)
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart">Giỏ hàng của bạn đang trống</div>';
        document.getElementById('cart-total').textContent = '0₫';
        return;
    }

    let totalPrice = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="item-price">${item.price.toLocaleString()}₫ x ${item.quantity}</p>
                <p class="item-total">${itemTotal.toLocaleString()}₫</p>
                <div class="quantity-controls">
                    <button class="decrease" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase" data-id="${item.id}">+</button>
                    <button class="remove" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;

        cartContainer.appendChild(cartItem);
    });

    document.getElementById('cart-total').textContent = `${totalPrice.toLocaleString()}₫`;
}

// Tăng số lượng
function increaseQuantity(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += 1;
        saveCart();
        displayCart();
        updateCartCount();
    }
}

// Giảm số lượng
function decreaseQuantity(id) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            removeItem(id);
        } else {
            saveCart();
            displayCart();
            updateCartCount();
        }
    }
}

// Xóa sản phẩm khỏi giỏ
function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    displayCart();
    updateCartCount();
    showNotification('Đã xóa sản phẩm khỏi giỏ hàng');
}

// Xóa toàn bộ giỏ hàng
function clearCart() {
    cart = [];
    saveCart();
    displayCart();
    updateCartCount();
    showNotification('Đã xóa toàn bộ giỏ hàng');
}

// Thanh toán
function checkout() {
    showNotification('Đang tiến hành thanh toán...');
    setTimeout(() => {
        clearCart();
        showNotification('Đặt hàng thành công!');
    }, 2000);
}

// Khởi tạo khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    // Gắn lại data attributes nếu thiếu
    document.querySelectorAll('.product-item').forEach(item => {
        const img = item.querySelector('.product-image');
        if (img && !item.hasAttribute('data-id')) {
            item.setAttribute('data-id', img.getAttribute('data-id'));
            item.setAttribute('data-name', img.getAttribute('data-name'));
            item.setAttribute('data-price', img.getAttribute('data-price'));
            item.setAttribute('data-image', img.getAttribute('data-image'));
        }
    });

    updateCartCount();

    if (window.location.href.includes('shopping.html')) {
        displayCart();
    }

    // 🟢 EVENT DELEGATION – CHỐNG LỖI CLICK NHIỀU
    document.body.addEventListener('click', (e) => {
        const target = e.target;

        // Thêm vào giỏ hàng
        if (target.classList.contains('add-to-cart-btn')) {
            const product = target.closest('.product-item');
            if (product) addToCart(product);
        }

        // Tăng số lượng
        if (target.classList.contains('increase')) {
            increaseQuantity(target.getAttribute('data-id'));
        }

        // Giảm số lượng
        if (target.classList.contains('decrease')) {
            decreaseQuantity(target.getAttribute('data-id'));
        }

        // Xóa sản phẩm
        if (target.classList.contains('remove')) {
            removeItem(target.getAttribute('data-id'));
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById("menu-toggle");
    const menuItems = document.getElementById("menu-items");

    toggleBtn.addEventListener("click", function () {
      const isVisible = menuItems.style.display === "block";
      menuItems.style.display = isVisible ? "none" : "block";
    });
  });
  document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle for header-botton
    const headerToggle = document.getElementById('header-toggle');
    const mainMenu = document.querySelector('.dichuyen');
    
    if (headerToggle) {
        headerToggle.addEventListener('click', function() {
            mainMenu.classList.toggle('show');
        });
    }
    
    // Submenu toggles for mobile
    const menuItems = document.querySelectorAll('.menu');
    
    menuItems.forEach(item => {
        // Check if this menu item has a submenu
        const hasSubmenu = item.querySelector('.menu-a-ul');
        
        if (hasSubmenu && window.innerWidth <= 768) {
            const menuLink = item.querySelector('.menu-a');
            
            menuLink.addEventListener('click', function(e) {
                // Only prevent default if we're in mobile view
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    item.classList.toggle('active');
                }
            });
        }
    });
});
var n=3;
var i=1;
function next(){
    if(i==n)
        i=1;
    else i++
    document.getElementById("slide").setAttribute("src","image/slide_"+i+".png");
}
function back(){
    if(i==1)
        i=n;
    else i--
    document.getElementById("slide").setAttribute("src","image/slide_"+i+".png");
}
function autoplay() {
    intervalId = setInterval(next, 3000);
}


