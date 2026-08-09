import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ===============================
// BACKEND CONNECTION
// ===============================

const API_URL = "https://shopeasy-backend-2o2i.onrender.com";

async function testBackend() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        console.log("✅ Backend Connected:", data);

    } catch (error) {
        console.error("❌ Backend Connection Failed:", error);
    }
}

testBackend();


// ===============================
// PRODUCTS
// ===============================

let products = [];


// ===============================
// LOCAL STORAGE
// ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];


// ===============================
// HTML ELEMENTS
// ===============================

const productsDiv = document.getElementById("products");
const cartDiv = document.getElementById("cart");
const totalDiv = document.getElementById("total");
const search = document.getElementById("search");
const category = document.getElementById("category");


// ===============================
// SAVE CART
// ===============================

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// ===============================
// LOAD PRODUCTS FROM FIREBASE
// ===============================

async function loadProducts() {

    if (!productsDiv) return;

    productsDiv.innerHTML = "<h2>Loading Products...</h2>";

    try {

        const snapshot = await getDocs(
            collection(db, "products")
        );

        products = [];

        snapshot.forEach((productDoc) => {

            products.push({
                id: productDoc.id,
                ...productDoc.data()
            });

        });

        displayProducts(products);

    } catch (error) {

        productsDiv.innerHTML =
            "<h2>Error Loading Products</h2>";

        console.error("Firebase Error:", error);

    }
}


// ===============================
// DISPLAY PRODUCTS
// ===============================

function displayProducts(productList) {

    if (!productsDiv) return;

    productsDiv.innerHTML = "";

    productList.forEach(product => {

        productsDiv.innerHTML += `

        <div class="product">

            <img
                src="${product.image || ""}"
                onclick="openProduct('${product.id}')"
            >

            <h3
                onclick="openProduct('${product.id}')"
            >
                ${product.name || "Product"}
            </h3>

            <p>₹${product.price || 0}</p>

            <p>
                ${product.description || ""}
            </p>

            <button
                onclick="addToCart('${product.id}')"
            >
                🛒 Add To Cart
            </button>

            <button
                class="wishlist-btn"
                onclick="addToWishlist('${product.id}')"
            >
                ❤️ Wishlist
            </button>

        </div>

        `;

    });
}


// ===============================
// ADD TO CART
// ===============================

function addToCart(id) {

    let item = cart.find(p => p.id === id);

    if (item) {

        item.quantity++;

    } else {

        let product = products.find(
            p => p.id === id
        );

        if (!product) return;

        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    displayCart();
}


// ===============================
// ADD TO WISHLIST
// ===============================

function addToWishlist(id) {

    let product = products.find(
        p => p.id === id
    );

    if (!product) return;

    let exist = wishlist.find(
        p => p.id === id
    );

    if (exist) {

        alert("Already in Wishlist ❤️");
        return;

    }

    wishlist.push(product);

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    alert(
        product.name +
        " added to Wishlist ❤️"
    );
}


// ===============================
// DISPLAY CART
// ===============================

function displayCart() {

    if (!cartDiv || !totalDiv) return;

    cartDiv.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        total +=
            Number(item.price) *
            Number(item.quantity);

        cartDiv.innerHTML += `

        <div class="cart-item">

            <img
                src="${item.image || ""}"
                width="70"
            >

            <div>

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ₹${item.price}
                </p>

                <p>
                    Quantity:
                    ${item.quantity}
                </p>

            </div>

            <div class="cart-buttons">

                <button
                    onclick="decreaseQty('${item.id}')"
                >
                    -
                </button>

                <button
                    onclick="increaseQty('${item.id}')"
                >
                    +
                </button>

                <button
                    onclick="removeItem('${item.id}')"
                >
                    Remove
                </button>

            </div>

        </div>

        `;

    });

    totalDiv.innerHTML =
        "Total : ₹" + total;
}


// ===============================
// INCREASE QUANTITY
// ===============================

function increaseQty(id) {

    let item = cart.find(
        p => p.id === id
    );

    if (item) {
        item.quantity++;
    }

    saveCart();
    displayCart();
}


// ===============================
// DECREASE QUANTITY
// ===============================

function decreaseQty(id) {

    let item = cart.find(
        p => p.id === id
    );

    if (!item) return;

    if (item.quantity > 1) {

        item.quantity--;

    } else {

        removeItem(id);
        return;

    }

    saveCart();
    displayCart();
}


// ===============================
// REMOVE ITEM
// ===============================

function removeItem(id) {

    cart = cart.filter(
        item => item.id !== id
    );

    saveCart();
    displayCart();
}


// ===============================
// SEARCH
// ===============================

if (search) {

    search.addEventListener(
        "keyup",
        function () {

            let text =
                this.value.toLowerCase();

            let filtered =
                products.filter(product =>
                    (product.name || "")
                        .toLowerCase()
                        .includes(text)
                );

            displayProducts(filtered);

        }
    );

}


// ===============================
// CATEGORY FILTER
// ===============================

if (category) {

    category.addEventListener(
        "change",
        function () {

            if (this.value === "all") {

                displayProducts(products);

            } else {

                let filtered =
                    products.filter(product =>
                        product.category ===
                        this.value
                    );

                displayProducts(filtered);

            }

        }
    );

}


// ===============================
// OPEN PRODUCT
// ===============================

function openProduct(id) {

    localStorage.setItem(
        "selectedProduct",
        id
    );

    window.location.href =
        "product.html";
}


// ===============================
// ADMIN
// ===============================

function openAdmin() {

    window.location.href =
        "admin.html";
}


function openAdminProducts() {

    window.location.href =
        "admin-products.html";
}


// ===============================
// LOGOUT
// ===============================

function logout() {

    localStorage.removeItem(
        "loggedIn"
    );

    alert(
        "Logged Out Successfully!"
    );

    window.location.href =
        "login.html";
}


// ===============================
// RELOAD PRODUCTS
// ===============================

async function reloadProducts() {

    await loadProducts();

}


// ===============================
// PAGE LOAD
// ===============================

window.addEventListener(
    "load",
    () => {

        loadProducts();
        displayCart();

    }
);


// ===============================
// AUTO REFRESH
// ===============================

setInterval(
    () => {

        reloadProducts();

    },
    30000
);


// ===============================
// MAKE FUNCTIONS AVAILABLE
// TO HTML ONCLICK
// ===============================

window.openProduct =
    openProduct;

window.addToCart =
    addToCart;

window.addToWishlist =
    addToWishlist;

window.increaseQty =
    increaseQty;

window.decreaseQty =
    decreaseQty;

window.removeItem =
    removeItem;

window.openAdmin =
    openAdmin;

window.openAdminProducts =
    openAdminProducts;

window.logout =
    logout;


// ===============================
// APP STARTED
// ===============================

console.log(
    "✅ ShopEasy Frontend Loaded"
);
