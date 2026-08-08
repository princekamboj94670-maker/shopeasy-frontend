import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Products
let products = [];

// Local Storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// HTML Elements
const productsDiv = document.getElementById("products");
const cartDiv = document.getElementById("cart");
const totalDiv = document.getElementById("total");
const search = document.getElementById("search");
const category = document.getElementById("category");

// Save Cart
function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Load Products From Firebase
async function loadProducts(){

    productsDiv.innerHTML = "<h2>Loading Products...</h2>";

    try{

        const snapshot = await getDocs(collection(db,"products"));

        products = [];

        snapshot.forEach((productDoc)=>{

            products.push({
                id: productDoc.id,
                ...productDoc.data()
            });

        });

        displayProducts(products);

    }catch(error){

        productsDiv.innerHTML = "<h2>Error Loading Products</h2>";

        console.log(error);

    }

}

// Display Products
function displayProducts(productList){

    productsDiv.innerHTML = "";

    productList.forEach(product=>{

        productsDiv.innerHTML += `

        <div class="product">

            <img src="${product.image}" onclick="alert('${product.id}'); openProduct('${product.id}')">

            <h3 onclick="alert('${product.id}'); openProduct('${product.id}')">
            ${product.name}
            </h3>

            <p>₹${product.price}</p>

            <p>${product.description || ""}</p>

            <button onclick="addToCart('${product.id}')">
            🛒 Add To Cart
            </button>

            <button class="wishlist-btn"
            onclick="addToWishlist('${product.id}')">
            ❤️ Wishlist
            </button>

        </div>

        `;

    });

}
// Add To Cart
function addToCart(id){

    let item = cart.find(p => p.id === id);

    if(item){

        item.quantity++;

    }else{

        let product = products.find(p => p.id === id);

        cart.push({
            ...product,
            quantity:1
        });

    }

    saveCart();

    displayCart();

}

// Add To Wishlist
function addToWishlist(id){

    let product = products.find(p => p.id === id);

    let exist = wishlist.find(p => p.id === id);

    if(exist){

        alert("Already in Wishlist ❤️");

        return;

    }

    wishlist.push(product);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    alert(product.name + " added to Wishlist ❤️");

}

// Display Cart
function displayCart(){

    if(!cartDiv || !totalDiv) return;

    cartDiv.innerHTML = "";

    let total = 0;

    cart.forEach(item=>{

        total += item.price * item.quantity;

        cartDiv.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}" width="70">

            <div>

                <h3>${item.name}</h3>

                <p>₹${item.price}</p>

                <p>Quantity : ${item.quantity}</p>

            </div>

            <div class="cart-buttons">

                <button onclick="decreaseQty('${item.id}')">-</button>

                <button onclick="increaseQty('${item.id}')">+</button>

                <button onclick="removeItem('${item.id}')">
                Remove
                </button>

            </div>

        </div>

        `;

    });

    totalDiv.innerHTML =  "Total : ₹" + total;
}
// Increase Quantity
function increaseQty(id){

    let item = cart.find(p => p.id === id);

    if(item){
        item.quantity++;
    }

    saveCart();
    displayCart();

}

// Decrease Quantity
function decreaseQty(id){

    let item = cart.find(p => p.id === id);

    if(!item) return;

    if(item.quantity > 1){

        item.quantity--;

    }else{

        removeItem(id);
        return;

    }

    saveCart();
    displayCart();

}

// Remove Item
function removeItem(id){

    cart = cart.filter(item => item.id !== id);

    saveCart();

    displayCart();

}

// Search Products
if(search){

search.addEventListener("keyup", function(){

    let text = this.value.toLowerCase();

    let filtered = products.filter(product =>

        product.name.toLowerCase().includes(text)

    );

    displayProducts(filtered);

});

}

// Category Filter
if(category){

category.addEventListener("change", function(){

    if(this.value === "all"){

        displayProducts(products);

    }else{

        let filtered = products.filter(product =>

            product.category === this.value

        );

        displayProducts(filtered);

    }

});

}
// Open Product Details
function openProduct(id){

    localStorage.setItem("selectedProduct", id);

    window.location.href = "product.html";

}

// Open Admin Dashboard
function openAdmin(){

    window.location.href = "admin.html";

}

// Open Admin Products
function openAdminProducts(){

    window.location.href = "admin-products.html";

}

// Logout
function logout(){

    localStorage.removeItem("loggedIn");

    alert("Logged Out Successfully!");

    window.location.href = "login.html";

}

// Page Load
window.addEventListener("load", ()=>{

    loadProducts();

    displayCart();

});
// Refresh Products After Search Clear
if(search){

search.addEventListener("search", ()=>{

    displayProducts(products);

});

}

// Safe Category Refresh
function refreshProducts(){

    if(category && category.value !== "all"){

        let filtered = products.filter(product =>
            product.category === category.value
        );

        displayProducts(filtered);

    }else{

        displayProducts(products);

    }

}

// Refresh Cart
function refreshCart(){

    saveCart();

    displayCart();

}

// Reload Products From Firebase
async function reloadProducts(){

    await loadProducts();

}

// Auto Refresh Every 30 Seconds
setInterval(()=>{

    reloadProducts();

},30000);

// App Started
console.log("✅ ShopEasy Loaded Successfully");

// End of File
    window.openAdmin = function () {
    window.location.href = "admin.html";
};

window.openAdminProducts = function () {
    window.location.href = "admin-products.html";
};
window.openProduct = openProduct;
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
window.removeItem = removeItem;
window.openAdmin = openAdmin;
window.openAdminProducts = openAdminProducts;
window.logout = logout;
  
