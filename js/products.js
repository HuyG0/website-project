let products = [

{
name:"Áo hoodie",
price:200000,
img:"image/aovn.png"
},

{
name:"Giày sneaker",
price:500000,
img:"image/aovn.png"
},

{
name:"Tai nghe gaming",
price:350000,
img:"https://via.placeholder.com/200"
},

{
name:"Chuột gaming",
price:250000,
img:"https://via.placeholder.com/200"
}

]

let container = document.getElementById("products")

products.forEach((p,i)=>{

container.innerHTML += `
<div class="product">

<img src="${p.img}">
<h4>${p.name}</h4>

<p class="price">${p.price}đ</p>

<button onclick="addCart(${i})">
Thêm vào giỏ
</button>

</div>
`

})
