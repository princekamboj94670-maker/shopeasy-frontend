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

        if (!response.ok) {
            throw new Error("Backend response error");
        }

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

        products = [];

        // Firebase Products
        const snapshot = await getDocs(
            collection(db, "products")
        );

        snapshot.forEach((productDoc) => {

            products.push({
                id: productDoc.id,
                ...productDoc.data()
            });

        });
        // API Products
const response = await fetch(
    "https://dummyjson.com/products?limit=100"
);

const data = await response.json();

data.products.forEach(product => {

    products.push({
        id: "api_" + product.id,
        name: product.title,
        price: product.price,
        image: product.thumbnail,
        description: product.description,
        category: product.category
    });

});

        displayProducts(products);

        console.log(
            "✅ Total Products:",
            products.length
        );

    } catch (error) {

        console.error(error);

        productsDiv.innerHTML =
            "<h2>❌ Error Loading Products</h2>";

    }
}


// ===============================
// DISPLAY PRODUCTS
// ===============================

function displayProducts(productList) {

    if (!productsDiv) return;

    productsDiv.innerHTML = "";

    if (productList.length === 0) {

        productsDiv.innerHTML =
            "<h2>No Products Found</h2>";

        return;
    }

    productList.forEach(product => {

        productsDiv.innerHTML += `

        <div class="product">

            <img
                src="${product.image || ""}"
                alt="${product.name || "Product"}"
                onclick="openProduct('${product.id}')"
            >

            <h3 onclick="openProduct('${product.id}')">
                ${product.name || "Product"}
            </h3>

            <p>₹${product.price || 0}</p>

            <p>
                ${product.description || ""}
            </p>

            <button onclick="addToCart('${product.id}')">
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

    const product = products.find(
        p => p.id === id
    );

    if (!product) {

        alert("Product not found");

        return;
    }

    const item = cart.find(
        p => p.id === id
    );

    if (item) {

        item.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    saveCart();

    displayCart();

    alert(product.name + " added to cart 🛒");
}


// ===============================
// ADD TO WISHLIST
// ===============================

function addToWishlist(id) {

    const product = products.find(
        p => p.id === id
    );

    if (!product) return;

    const exists = wishlist.find(
        p => p.id === id
    );

    if (exists) {

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
            Number(item.price || 0) *
            Number(item.quantity || 1);

        cartDiv.innerHTML += `

        <div class="cart-item">

            <img
                src="${item.image || ""}"
                width="70"
                alt="${item.name || "Product"}"
            >

            <div>

                <h3>${item.name}</h3>

                <p>₹${item.price}</p>

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

    const item = cart.find(
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

    const item = cart.find(
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

            const text =
                this.value
                    .toLowerCase()
                    .trim();

            const filtered =
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

                const filtered =
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
        "Admin-products.html";
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
// REFRESH PRODUCTS
// ===============================

function refreshProducts() {

    if (
        category &&
        category.value !== "all"
    ) {

        const filtered =
            products.filter(product =>
                product.category ===
                category.value
            );

        displayProducts(filtered);

    } else {

        displayProducts(products);

    }
}


// ===============================
// REFRESH CART
// ===============================

function refreshCart() {

    saveCart();

    displayCart();
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
    300000
);


// ===============================
// MAKE FUNCTIONS AVAILABLE TO HTML
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

window.refreshProducts =
    refreshProducts;

window.refreshCart =
    refreshCart;


console.log(
    "✅ ShopEasy Frontend Started"
);
console.log(
    "🔗 Backend URL:",
    API_URL
);
import { auth } from "./firebase.js";

auth.onAuthStateChanged((user) => {
    const adminBtn = document.getElementById("adminBtn");

    if (!adminBtn) return;

    if (user && user.email === "princekamboj94670@gmail.com") {
        adminBtn.style.display = "block";
    } else {
        adminBtn.style.display = "none";
    }
});
