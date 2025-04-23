let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Lưu giỏ hàng vào localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartCount() {
    const cartCount = document.getElementById('cart-items-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Hiển thị thông báo
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerText = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Hiển thị giỏ hàng
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
    let totalItems = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        totalItems += item.quantity;

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

// Thanh toán - Chuyển hướng đến trang thanh toán
function checkout() {
    if (cart.length === 0) {
        showNotification('Giỏ hàng của bạn đang trống!');
        return;
    }
    
    // Chuyển hướng đến trang thanh toán
    window.location.href = 'checkout.html';
}

// Khởi tạo khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    // Hiển thị giỏ hàng
    displayCart();
    updateCartCount();

    // Xử lý sự kiện click
    document.body.addEventListener('click', (e) => {
        const target = e.target;

        // Tăng số lượng
        if (target.classList.contains('increase')) {
            increaseQuantity(target.getAttribute('data-id'));
        }

        // Giảm số lượng
        if (target.classList.contains('decrease')) {
            decreaseQuantity(target.getAttribute('data-id'));
        }

        // Xóa sản phẩm
        if (target.classList.contains('remove') || target.parentElement.classList.contains('remove')) {
            const removeBtn = target.classList.contains('remove') ? target : target.parentElement;
            removeItem(removeBtn.getAttribute('data-id'));
        }
    });
});