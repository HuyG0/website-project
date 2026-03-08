let products = [

{
name:"Áo Việt Nam",
price:200000,
img:"images/aovn.png",
category:"fashion"
},

{
name:"Baby Oil",
price:150000,
img:"images/babyoil.png",
category:"accessories"
},

{
name:"Diddy",
price:100000,
img:"images/diddy.png",
category:"electronics"
},

{
name:"Pọt Ché",
price:500000,
img:"images/porsche.png",
category:"gaming"
}

]

function filterCategory(cat){

let productDiv = document.getElementById("products")

productDiv.innerHTML=""

products.forEach(p=>{

if(cat==="all" || p.category===cat){

productDiv.innerHTML += `
<div class="product">

<img src="${p.img}">

<h4>${p.name}</h4>

<p class="price">${p.price}đ</p>

<button onclick="addCart('${p.name}',${p.price},'${p.img}')">
Thêm vào giỏ
</button>

</div>
`

}

})

}

filterCategory("all")
