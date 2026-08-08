let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

let wishlistDiv = document.getElementById("wishlist");

function saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function displayWishlist() {

    wishlistDiv.innerHTML = "";

    if (wishlist.length === 0) {
        wishlistDiv.innerHTML = "<h2>Your Wishlist is Empty ❤️</h2>";
        return;
    }

    wishlist.forEach(item => {

        wishlistDiv.innerHTML += `
        <div class="product">

            <img src="${item.image}">

            <h3>${item.name}</h3>

            <p>₹${item.price}</p>

            <button onclick="addToCart(${item.id})">
            Add To Cart
            </button>

            <button onclick="removeWishlist(${item.id})">
            Remove
            </button>

        </div>
        `;

    });

}

function addToCart(id) {

    let product = wishlist.find(p => p.id === id);

    let item = cart.find(p => p.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();

    alert(product.name + " added to Cart 🛒");
}

function removeWishlist(id) {

    wishlist = wishlist.filter(item => item.id !== id);

    saveWishlist();

    displayWishlist();

}

displayWishlist();
