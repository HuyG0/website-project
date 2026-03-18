// Biến toàn cục
let cart = JSON.parse(localStorage.getItem('cart')) || [];
cart = cart.filter(item => item !== null);

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let currentFilter = 'all';
let searchTerm = '';

// Dữ liệu sản phẩm mẫu
const products = [
    // Thời trang
    { id: 1, name: 'Áo thun nam', price: 199000, oldPrice: 299000, image: 'https://via.placeholder.com/300x300', category: 'thoitrang', rating: 4.5, sold: 150, tag: 'sale' },
    { id: 2, name: 'Quần jean nữ', price: 349000, oldPrice: 499000, image: 'https://via.placeholder.com/300x300', category: 'thoitrang', rating: 4.8, sold: 89, tag: 'new' },
    { id: 3, name: 'Váy đầm dự tiệc', price: 599000, oldPrice: 899000, image: 'https://via.placeholder.com/300x300', category: 'thoitrang', rating: 4.7, sold: 45 },
    { id: 4, name: 'Điện thoại thông minh', price: 7990000, oldPrice: 9990000, image: 'https://via.placeholder.com/300x300', category: 'dientu', rating: 4.9, sold: 234, tag: 'sale' },
    { id: 5, name: 'Laptop cao cấp', price: 15990000, oldPrice: 18990000, image: 'https://via.placeholder.com/300x300', category: 'dientu', rating: 4.8, sold: 67 },
    { id: 6, name: 'Tai nghe không dây', price: 1290000, oldPrice: 1990000, image: 'https://via.placeholder.com/300x300', category: 'dientu', rating: 4.6, sold: 456, tag: 'new' },
    { id: 7, name: 'Nồi chiên không dầu', price: 1590000, oldPrice: 2490000, image: 'https://via.placeholder.com/300x300', category: 'giadung', rating: 4.7, sold: 123 },
    { id: 8, name: 'Máy xay sinh tố', price: 890000, oldPrice: 1290000, image: 'https://via.placeholder.com/300x300', category: 'giadung', rating: 4.5, sold: 89, tag: 'sale' },
    { id: 9, name: 'Bộ dao nhà bếp', price: 450000, oldPrice: 690000, image: 'https://via.placeholder.com/300x300', category: 'giadung', rating: 4.4, sold: 234 },
    { id: 10, name: 'Sách dạy nấu ăn', price: 180000, oldPrice: 250000, image: 'https://via.placeholder.com/300x300', category: 'sach', rating: 4.6, sold: 78, tag: 'new' }
];

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    cleanCart();
    displayProducts();
    updateCartCount();
    checkLoginStatus();
    
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        searchTerm = e.target.value.toLowerCase();
        displayProducts();
    });
    
    document.getElementById('searchBtn').addEventListener('click', function() {
        searchTerm = document.getElementById('searchInput').value.toLowerCase();
        displayProducts();
    });
});

// Kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
    if (currentUser) {
        document.querySelector('.auth-buttons').style.display = 'none';
        document.querySelector('.user-info').style.display = 'flex';
        document.getElementById('usernameDisplay').textContent = currentUser.username;
    } else {
        document.querySelector('.auth-buttons').style.display = 'flex';
        document.querySelector('.user-info').style.display = 'none';
    }
}

// Format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

// Hiển thị sản phẩm
function displayProducts() {
    const productGrid = document.getElementById('productGrid');
    let filteredProducts = products;
    
    if (currentFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === currentFilter);
    }
    
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

// Lọc sản phẩm
function filterProducts(category) {
    currentFilter = category;
    document.querySelectorAll('.categories li').forEach(li => {
        li.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    displayProducts();
}

// Cuộn đến sản phẩm
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// ===== GIỎ HÀNG =====
function cleanCart() {
    cart = cart.filter(item => item !== null);
    saveCart();
}

function saveCart() {
    try {
        const cleanData = cart.filter(item => item !== null);
        localStorage.setItem('cart', JSON.stringify(cleanData));
        cart = cleanData;
    } catch (error) {
        console.error('Lỗi khi lưu giỏ hàng:', error);
    }
}

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

// THÊM VÀO GIỎ - KIỂM TRA ĐĂNG NHẬP
function addToCart(productId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để mua hàng!');
        openLoginModal();
        return;
    }
    
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

// MỞ GIỎ HÀNG - KIỂM TRA ĐĂNG NHẬP
function openCartModal() {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để xem giỏ hàng!');
        openLoginModal();
        return;
    }
    
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

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

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

// ===== THANH TOÁN - KIỂM TRA ĐĂNG NHẬP =====
function openCheckoutModal() {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để thanh toán!');
        openLoginModal();
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Giỏ hàng của bạn đang trống!');
        return;
    }
    
    closeCartModal();
    document.getElementById('checkoutModal').style.display = 'block';
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

function processPayment() {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để thanh toán!');
        closeCheckoutModal();
        openLoginModal();
        return;
    }
    
    const form = document.getElementById('checkoutForm');
    
    if (!form.checkValidity()) {
        showNotification('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    const paymentMethod = document.getElementById('paymentMethod').value;
    
    if (!paymentMethod) {
        showNotification('Vui lòng chọn phương thức thanh toán!');
        return;
    }
    
    // Lưu đơn hàng
    const order = {
        user: currentUser.username,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        paymentMethod: paymentMethod,
        items: cart,
        total: document.getElementById('total').textContent,
        date: new Date().toISOString()
    };
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    showNotification('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
    
    // Xóa giỏ hàng
    cart = [];
    saveCart();
    updateCartCount();
    
    // Đóng modal
    closeCheckoutModal();
    form.reset();
}

// ===== ĐĂNG NHẬP / ĐĂNG KÝ =====
function openLoginModal() {
    closeRegisterModal();
    document.getElementById('loginModal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.getElementById('loginForm').reset();
}

function openRegisterModal() {
    closeLoginModal();
    document.getElementById('registerModal').style.display = 'block';
}

function closeRegisterModal() {
    document.getElementById('registerModal').style.display = 'none';
    document.getElementById('registerForm').reset();
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showNotification('Vui lòng nhập đầy đủ thông tin!');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = { username: user.username, email: user.email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showNotification('Đăng nhập thành công!');
        closeLoginModal();
        checkLoginStatus();
    } else {
        showNotification('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
}

function register() {
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (!username || !email || !password || !confirmPassword) {
        showNotification('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Mật khẩu xác nhận không khớp!');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(u => u.username === username)) {
        showNotification('Tên đăng nhập đã tồn tại!');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        showNotification('Email đã được sử dụng!');
        return;
    }
    
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    showNotification('Đăng ký thành công! Vui lòng đăng nhập.');
    closeRegisterModal();
    openLoginModal();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showNotification('Đã đăng xuất thành công!');
    checkLoginStatus();
    
    // Đóng tất cả modal
    closeCartModal();
    closeCheckoutModal();
    closeNotificationModal();
}

// ===== THÔNG BÁO =====
function showNotification(message) {
    const modal = document.getElementById('notificationModal');
    const messageEl = document.getElementById('notificationMessage');
    messageEl.textContent = message;
    modal.style.display = 'block';
}

function closeNotificationModal() {
    document.getElementById('notificationModal').style.display = 'none';
}

// Đóng modal khi click bên ngoài
window.onclick = function(event) {
    const modals = ['cartModal', 'checkoutModal', 'notificationModal', 'loginModal', 'registerModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Debug
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    showNotification('Đã xóa toàn bộ giỏ hàng!');
}
