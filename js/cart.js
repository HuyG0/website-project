function addCart(name,price,img){

let cart = JSON.parse(localStorage.getItem("cart")) || []

cart.push({
name:name,
price:price,
img:img
})

localStorage.setItem("cart",JSON.stringify(cart))

alert("Đã thêm vào giỏ hàng")

}
