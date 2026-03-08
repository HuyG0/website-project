let user = localStorage.getItem("user")

if(user){

document.getElementById("username").innerText="Xin chào " + user

}else{

document.getElementById("username").innerText="Chưa đăng nhập"

}

function logout(){

localStorage.removeItem("user")

location.reload()

}
