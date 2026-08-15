import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const productsDiv = document.getElementById("products");

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");

document.getElementById("addProduct").addEventListener("click", async () => {

    const name = nameInput.value.trim();
    const price = Number(priceInput.value);
    const image = imageInput.value.trim();
    const description = descriptionInput.value.trim();
    const category = categoryInput.value;

    if (!name || !price || !image || !description) {
        alert("Please fill all fields.");
        return;
    }

    try {

        await addDoc(collection(db, "products"), {
            name,
            price,
            image,
            description,
            category
        });

        alert("✅ Product Added Successfully!");

    } catch (error) {

        alert(error.message);
        console.log(error);

    }

    nameInput.value = "";
    priceInput.value = "";
    imageInput.value = "";
    descriptionInput.value = "";

    loadProducts();

});

async function loadProducts() {

    productsDiv.innerHTML = "<h2>Loading Products...</h2>";

    const snapshot = await getDocs(collection(db, "products"));

    productsDiv.innerHTML = "";

    snapshot.forEach((productDoc) => {

        const product = productDoc.data();

        productsDiv.innerHTML += `
        <div class="product-card">

            <img src="${product.image}" width="120">

            <h3>${product.name}</h3>

            <p>₹${product.price}</p>

            <p>${product.description}</p>

            <p><b>Category:</b> ${product.category || "General"}</p>

            <button onclick="editProduct('${productDoc.id}')">
            ✏️ Edit
            </button>

            <button onclick="deleteProduct('${productDoc.id}')">
            🗑️ Delete
            </button>

        </div>
        `;

    });

}

// Edit Product
window.editProduct = async function(id){

    const productRef = doc(db, "products", id);

    const productSnap = await getDoc(productRef);

    if(!productSnap.exists()){
        alert("Product Not Found!");
        return;
    }

    const product = productSnap.data();

    const newName = prompt("Product Name", product.name);
    const newPrice = prompt("Product Price", product.price);
    const newImage = prompt("Image URL", product.image);
    const newDescription = prompt("Description", product.description);

    if(!newName || !newPrice || !newImage || !newDescription){
        return;
    }

    await updateDoc(productRef,{
        name: newName,
        price: Number(newPrice),
        image: newImage,
        description: newDescription,
        category: product.category || "General"
    });

    alert("✅ Product Updated Successfully!");

    loadProducts();

}

// Delete Product
window.deleteProduct = async function(id){

    if(confirm("Delete this product?")){

        await deleteDoc(doc(db,"products",id));

        alert("🗑️ Product Deleted Successfully!");

        loadProducts();

    }

}

// Load Products on Page Open
loadProducts();
