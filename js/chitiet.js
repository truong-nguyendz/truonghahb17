function changeImage(src) {
    document.getElementById('main-image').src = src;
}

// Xử lý số lượng sản phẩm
document.querySelector('.decrease').addEventListener('click', function() {
    let value = parseInt(document.querySelector('.quantity-value').textContent);
    if (value > 1) {
        document.querySelector('.quantity-value').textContent = value - 1;
    }
});

document.querySelector('.increase').addEventListener('click', function() {
    let value = parseInt(document.querySelector('.quantity-value').textContent);
    document.querySelector('.quantity-value').textContent = value + 1;
});

// Chọn kích cỡ
let sizeOptions = document.querySelectorAll('.size-option');
sizeOptions.forEach(option => {
    option.addEventListener('click', function() {
        sizeOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
    });
});

// Backtop button
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $("#backtop").fadeIn();
        } else {
            $("#backtop").fadeOut();
        }
    });
    $("#backtop").click(function () {
        $("html, body").animate(
            {
                scrollTop: 0,
            },
            400
        );
    });
});