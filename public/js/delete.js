console.log("ihdfjashdfas")
let btn = document.querySelector('#deletedest')
let popup =document.querySelector('.popup')

let btnyes = document.querySelector('#btnyes')
let btnno = document.querySelector('#btnno')

btn.addEventListener("click",function(e){
    e.preventDefault();
    console.log("Button was clicked")
    popup.style.display='block';
})

btnno.addEventListener("click",(e)=>{
    e.preventDefault()
    popup.style.display='none'
})



// btn.addEventListener("click",()=>{
//     console.log("Button was clicked")
//     popup.setAttribute("display","block")
// })