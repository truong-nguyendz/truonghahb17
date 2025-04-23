let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
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

// Hiển thị sản phẩm trong trang thanh toán
function displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    if (!checkoutItems) return;
    
    checkoutItems.innerHTML = '';
    
    if (cart.length === 0) {
        window.location.href = 'shopping.html';
        return;
    }
    
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItemMini = document.createElement('div');
        cartItemMini.className = 'cart-item-mini';
        cartItemMini.innerHTML = `
            <div class="cart-item-mini-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-mini-details">
                <h4>${item.name}</h4>
                <p class="cart-mini-price">${item.price.toLocaleString()}₫ x ${item.quantity}</p>
                <p class="cart-mini-total">${itemTotal.toLocaleString()}₫</p>
            </div>
        `;
        
        checkoutItems.appendChild(cartItemMini);
    });
    
    document.getElementById('checkout-total').textContent = `${totalPrice.toLocaleString()}₫`;
}

// Xử lý sự kiện khi chọn phương thức thanh toán
document.addEventListener('DOMContentLoaded', () => {
    displayCheckoutItems();
    
    // Xử lý sự kiện khi chọn phương thức thanh toán
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            // Xóa class selected khỏi tất cả các phương thức
            paymentMethods.forEach(m => m.classList.remove('selected'));
            // Thêm class selected vào phương thức được chọn
            method.classList.add('selected');
            // Cập nhật giá trị của input hidden
            document.getElementById('payment-method').value = method.getAttribute('data-method');
        });
    });
    
    // Xử lý sự kiện khi submit form
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Kiểm tra các trường bắt buộc
        const fullname = document.getElementById('fullname').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        
        if (!fullname || !phone || !email || !address || !city) {
            showNotification('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }
        
        // Xử lý đặt hàng thành công
        showNotification('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.');
        
        // Xóa giỏ hàng
        localStorage.removeItem('cart');
        
        // Chuyển về trang chủ sau 2 giây
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });
});