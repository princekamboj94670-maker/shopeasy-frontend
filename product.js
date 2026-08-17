import { db } from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
alert("Product JS Loaded");

const selectedId = localStorage.getItem("selectedProduct");

const productDetails = document.getElementById("productDetails");

async function loadProduct() {

    const snap = await getDoc(doc(db, "products", selectedId));

    if (!snap.exists()) {

        productDetails.innerHTML = "<h2>Product Not Found</h2>";

        return;

    }

    const product = snap.data();

    productDetails.innerHTML = `

    <div class="product-details">

<div class="discount-badge">
🔥 20% OFF
</div>

<img src="${product.image}" width="300">

<h2>${product.name}</h2>

<div class="rating">
⭐⭐⭐⭐⭐ 4.8
</div>

<h3 style="color:green;">
₹${product.price}
</h3>

<p>${product.description}</p>

<p style="color:#2874f0;">
🚚 Free Delivery Available
</p>

<p style="color:#2e7d32;">
✅ In Stock
</p>

<button id="cartBtn">
🛒 Add To Cart
</button>

<button id="buyBtn">
⚡ Buy Now
</button>

</div>
    `;

    document.getElementById("cartBtn").onclick = function () {

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        let item = cart.find(p => p.id === selectedId);

        if (item) {

            item.quantity++;

        } else {

            cart.push({
                id: selectedId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });

        }

        localStorage.setItem("cart", JSON.stringify(cart));

        alert("✅ Product Added To Cart");

    };

    document.getElementById("buyBtn").onclick = function () {

        window.location.href = "checkout.html";

    };

}

loadProduct();
window.loadProduct = loadProduct;

