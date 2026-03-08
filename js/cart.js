let cart = JSON.parse(localStorage.getItem("cart")) || []

function addCart(index){

cart.push(products[index])

localStorage.setItem("cart",JSON.stringify(cart))

alert("Đã thêm vào giỏ")

}
