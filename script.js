// Biến toàn cục
let cart = JSON.parse(localStorage.getItem('cart')) || [];
cart = cart.filter(item => item !== null);

let currentFilter = 'all';
let searchTerm = '';

// Dữ liệu sản phẩm mẫu
const products = [
    // Thời trang
    { id: 1, name: 'Áo thun nam', price: 199000, oldPrice: 299000, image: 'https://via.placeholder.com/300x300', category: 'thoitrang', rating: 4.5, sold: 150, tag: 'sale' },
    { id: 2, name: 'Quần jean nữ', price: 349000, oldPrice: 499000, image: 'https://via.placeholder.com/300x300', category: 'thoitrang', rating: 4.8, sold: 89, tag: 'new' },
    { id: 3, name: 'Váy đầm dự tiệc', price: 599000, oldPrice: 899000, image: 'https://via.placeholder.com/300x300', category: 'thoitrang', rating: 4.7, sold: 45 },
    
    // Điện tử
    { id: 4, name: 'Điện thoại thông minh', price: 7990000, oldPrice: 9990000, image: 'https://via.placeholder.com/300x300', category: 'dientu', rating: 4.9, sold: 234, tag: 'sale' },
    { id: 5, name: 'Laptop cao cấp', price: 15990000, oldPrice: 18990000, image: 'https://via.placeholder.com/300x300', category: 'dientu', rating: 4.8, sold: 67 },
    { id: 6, name: 'Tai nghe không dây', price: 1290000, oldPrice: 1990000, image: 'https://via.placeholder.com/300x300', category: 'dientu', rating: 4.6, sold: 456, tag: 'new' },
    
    // Gia dụng
    { id: 7, name: 'Nồi chiên không dầu', price: 1590000, oldPrice: 2490000, image: 'https://via.placeholder.com/300x300', category: 'giadung', rating: 4.7, sold: 123 },
    { id: 8, name: 'Máy xay sinh tố', price: 890000, oldPrice: 1290000, image: 'https://via.placeholder.com/300x300', category: 'giadung', rating: 4.5, sold: 89, tag: 'sale' },
    { id: 9, name: 'Bộ dao nhà bếp', price: 450000, oldPrice: 690000, image: 'https://via.placeholder.com/300x300', category: 'giadung', rating: 4.4, sold: 234 },
    
    // Sách
    { id: 10, name: 'Sách dạy nấu ăn', price: 180000, oldPrice: 250000, image: 'https://via.placeholder.com/300x300', category: 'sach', rating: 4.6, sold: 78, tag: 'new' },
    { id: 11, name: 'Tiểu thuyết bestseller', price: 120000, oldPrice: 150000, image: 'https://via.placeholder.com/300x300', category: 'sach', rating: 4.8, sold: 345 },
    
    // Thể thao
    { id: 12, name: 'Giày chạy bộ', price: 890000, oldPrice: 1290000, image: 'https://via.placeholder.com/300x300', category: 'thethao', rating: 4.7, sold: 167, tag: 'sale' },
    { id: 13, name: 'Bóng đá', price: 250000, oldPrice: 350000, image: 'https://via.placeholder.com/300x300', category: 'thethao', rating: 4.5, sold: 89 },
    
    // Làm đẹp
    { id: 14, name: 'Son môi cao cấp', price: 320000, oldPrice: 450000, image: 'https://via.placeholder.com/300x300', category: 'lamdep', rating: 4.8, sold: 567, tag: 'new' },
    { id: 15, name: 'Kem dưỡng da', price: 450000, oldPrice: 650000, image: 'https://via.placeholder.com/300x300', category: 'lamdep', rating: 4.7, sold: 234 },
    
    // Thực phẩm
    { id: 16, name: 'Hộp quà trái cây', price: 350000, oldPrice: 450000, image: 'https://via.placeholder.com/300x300', category: 'thucpham', rating: 4.6, sold: 123 },
    { id: 17, name: 'Set quà tết', price: 890000, oldPrice: 1290000, image: 'https://via.placeholder.com/300x300', category: 'thucpham', rating: 4.8, sold: 45, tag: 'sale' }
];

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    cleanCart();
    displayProducts();
    updateCartCount();
    
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        searchTerm = e.target.value.toLowerCase();
        displayProducts();
    });
    
    document.getElementById('searchBtn').addEventListener('click', function() {
        searchTerm = document.getElementById('searchInput').value.toLowerCase();
        displayProducts();
    });
});

// Format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

// Hiển thị sản phẩm
function displayProducts() {
    const productGrid = document.getElementById('productGrid');
    let filteredProducts = products;
    
    // Lọc theo danh mục
    if (currentFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === currentFilter);
    }
    
    // Lọc theo tìm kiếm
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<div class="no-products">Không tìm thấy sản phẩm</div>';
        return;
    }
    
    let html = '';
    filteredProducts.forEach(product => {
        html += `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.tag ? `<span class="product-tag ${product.tag}">${product.tag === 'sale' ? 'GIẢM GIÁ' : 'MỚI'}</span>` : ''}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">${formatPrice(product.price)}</span>
                        ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
                    </div>
                    <div class="product-rating">
                        ${generateStars(product.rating)}
                        <span>(${product.sold} đã bán)</span>
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                </div>
            </div>
        `;
    });
    
    productGrid.innerHTML = html;
}

// Tạo sao đánh giá
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Lọc sản phẩm theo danh mục
function filterProducts(category) {
    currentFilter = category;
    
    // Cập nhật active class
    document.querySelectorAll('.categories li').forEach(li => {
        li.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    displayProducts();
}

// Cuộn đến phần sản phẩm
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Hàm làm sạch giỏ hàng
function cleanCart() {
    cart = cart.filter(item => item !== null);
    saveCart();
}

// Cập nhật số lượng giỏ hàng
function updateCartCount() {
    try {
        if (!Array.isArray(cart)) {
            cart = [];
        }
        
        const validCart = cart.filter(item => 
            item !== null && 
            typeof item === 'object' && 
            item.hasOwnProperty('quantity') &&
            !isNaN(item.quantity)
        );
        
        const count = validCart.reduce((total, item) => {
            return total + (parseInt(item.quantity) || 0);
        }, 0);
        
        document.getElementById('cartCount').textContent = count;
    } catch (error) {
        console.error('Lỗi khi cập nhật số lượng giỏ hàng:', error);
        document.getElementById('cartCount').textContent = '0';
    }
}

// Lưu giỏ hàng vào localStorage
function saveCart() {
    try {
        const cleanData = cart.filter(item => item !== null);
        localStorage.setItem('cart', JSON.stringify(cleanData));
        cart = cleanData;
    } catch (error) {
        console.error('Lỗi khi lưu giỏ hàng:', error);
    }
}

// Thêm vào giỏ hàng
function addToCart(productId) {
    try {
        const product = products.find(p => p.id === productId);
        if (!product) {
            console.error('Không tìm thấy sản phẩm!');
            return;
        }
        
        if (!Array.isArray(cart)) {
            cart = [];
        }
        
        cart = cart.filter(item => item !== null);
        
        const existingItem = cart.find(item => item && item.id === productId);
        
        if (existingItem) {
            existingItem.quantity = (parseInt(existingItem.quantity) || 0) + 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        saveCart();
        updateCartCount();
        showNotification('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        showNotification('Có lỗi xảy ra, vui lòng thử lại!');
    }
}

// Mở modal giỏ hàng
function openCartModal() {
    try {
        cleanCart();
        const modal = document.getElementById('cartModal');
        if (!modal) {
            console.error('Không tìm thấy modal giỏ hàng!');
            return;
        }
        displayCartItems();
        modal.style.display = 'block';
    } catch (error) {
        console.error('Lỗi khi mở giỏ hàng:', error);
        showNotification('Có lỗi xảy ra khi mở giỏ hàng!');
    }
}

// Đóng modal giỏ hàng
function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

// Hiển thị giỏ hàng
function displayCartItems() {
    const cartItems = document.getElementById('cartItems');
    
    try {
        if (!Array.isArray(cart)) {
            cart = [];
        }
        
        const validCart = cart.filter(item => {
            return item !== null && 
                   typeof item === 'object' && 
                   item.hasOwnProperty('id') &&
                   item.hasOwnProperty('name') &&
                   item.hasOwnProperty('price') &&
                   item.hasOwnProperty('quantity');
        });
        
        if (validCart.length !== cart.length) {
            cart = validCart;
            saveCart();
        }
        
        if (validCart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Giỏ hàng của bạn đang trống</div>';
            document.getElementById('subtotal').textContent = formatPrice(0);
            document.getElementById('total').textContent = formatPrice(0);
            return;
        }
        
        let html = '';
        let subtotal = 0;
        
        validCart.forEach((item) => {
            const price = parseInt(item.price) || 0;
            const quantity = parseInt(item.quantity) || 0;
            const itemTotal = price * quantity;
            subtotal += itemTotal;
            
            html += `
                <div class="cart-item">
                    <img src="${item.image || 'https://via.placeholder.com/80x80'}" alt="${item.name || 'Sản phẩm'}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name || 'Không có tên'}</div>
                        <div class="cart-item-price">${formatPrice(price)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${quantity - 1})">-</button>
                            <input type="number" class="quantity-input" value="${quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${quantity + 1})">+</button>
                        </div>
                    </div>
                    <div class="cart-item-total">${formatPrice(itemTotal)}</div>
                    <i class="fas fa-trash remove-item" onclick="removeFromCart(${item.id})"></i>
                </div>
            `;
        });
        
        cartItems.innerHTML = html;
        
        const shipping = subtotal > 0 ? 30000 : 0;
        const total = subtotal + shipping;
        
        document.getElementById('subtotal').textContent = formatPrice(subtotal);
        document.getElementById('total').textContent = formatPrice(total);
        
    } catch (error) {
        console.error('Lỗi khi hiển thị giỏ hàng:', error);
        cartItems.innerHTML = '<div class="error-message">Có lỗi xảy ra khi hiển thị giỏ hàng</div>';
    }
}

// Cập nhật số lượng
function updateQuantity(productId, newQuantity) {
    try {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        
        cart = cart.filter(item => item !== null);
        
        const itemIndex = cart.findIndex(item => item && item.id === productId);
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = parseInt(newQuantity) || 1;
            saveCart();
            updateCartCount();
            displayCartItems();
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật số lượng:', error);
        showNotification('Có lỗi xảy ra khi cập nhật số lượng!');
    }
}

// Xóa khỏi giỏ hàng
function removeFromCart(productId) {
    try {
        cart = cart.filter(item => item !== null && item.id !== productId);
        saveCart();
        updateCartCount();
        displayCartItems();
        showNotification('Đã xóa sản phẩm khỏi giỏ hàng!');
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        showNotification('Có lỗi xảy ra khi xóa sản phẩm!');
    }
}

// Mở modal thanh toán
function openCheckoutModal() {
    if (cart.length === 0) {
        showNotification('Giỏ hàng của bạn đang trống!');
        return;
    }
    closeCartModal();
    document.getElementById('checkoutModal').style.display = 'block';
}

// Đóng modal thanh toán
function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// Xử lý thanh toán
function processPayment() {
    const form = document.getElementById('checkoutForm');
    
    if (!form.checkValidity()) {
        showNotification('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    if (!paymentMethod) {
        showNotification('Vui lòng chọn phương thức thanh toán!');
        return;
    }
    
    // Xử lý thanh toán ở đây
    showNotification('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
    
    // Xóa giỏ hàng
    cart = [];
    saveCart();
    updateCartCount();
    
    // Đóng modal
    closeCheckoutModal();
    
    // Reset form
    form.reset();
}

// Hiển thị thông báo
function showNotification(message) {
    const modal = document.getElementById('notificationModal');
    const messageEl = document.getElementById('notificationMessage');
    messageEl.textContent = message;
    modal.style.display = 'block';
}

// Đóng modal thông báo
function closeNotificationModal() {
    document.getElementById('notificationModal').style.display = 'none';
}

// Đóng modal khi click bên ngoài
window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');
    const notificationModal = document.getElementById('notificationModal');
    
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target === checkoutModal) {
        checkoutModal.style.display = 'none';
    }
    if (event.target === notificationModal) {
        notificationModal.style.display = 'none';
    }
}

// Hàm xóa tất cả giỏ hàng (debug)
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    showNotification('Đã xóa toàn bộ giỏ hàng!');
}
