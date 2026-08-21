import { auth } from "./firebase.js";

auth.onAuthStateChanged((user) => {

    if (!user) {
        alert("Please Login First");
        window.location.href = "login.html";
        return;
    }

    if (user.email !== "princekamboj94670@gmail.com") {
        alert("Access Denied");
        window.location.href = "index.html";
        return;
    }

    // Sirf admin hi orders load karega
    loadOrders();

});
import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const ordersDiv = document.getElementById("orders");

async function loadOrders() {

    ordersDiv.innerHTML = "<h2>Loading Orders...</h2>";

    try {

        const querySnapshot = await getDocs(collection(db, "orders"));

        if (querySnapshot.empty) {
            ordersDiv.innerHTML = "<h2>No Orders Found</h2>";
            return;
        }

        ordersDiv.innerHTML = "";

        querySnapshot.forEach((orderDoc) => {

            const order = orderDoc.data();

            let cartItems = "";

            if (order.cart && order.cart.length > 0) {

                order.cart.forEach(item => {

                    cartItems += `
                    <li>
                    ${item.name} × ${item.qty}
                    </li>
                    `;

                });

            } else {

                cartItems = "<li>No Products</li>";

            }

            ordersDiv.innerHTML += `

            <div style="
            border:1px solid #ccc;
            padding:15px;
            margin:15px;
            border-radius:10px;
            background:#f7f7f7;
            ">

            <h2>Order ID</h2>

            <p>${orderDoc.id}</p>

            <p><b>Name:</b> ${order.name}</p>

            <p><b>Phone:</b> ${order.phone}</p>

            <p><b>Address:</b> ${order.address}</p>

            <p><b>City:</b> ${order.city}</p>

            <p><b>Pincode:</b> ${order.pincode}</p>

            <p><b>Payment:</b> ${order.payment}</p>

<p><b>Date:</b> ${order.date}</p>

<p>
<b>Status:</b>

<select onchange="updateStatus('${orderDoc.id}', this.value)">

<option value="Pending" ${order.status=="Pending"?"selected":""}>Pending</option>

<option value="Packed" ${order.status=="Packed"?"selected":""}>Packed</option>

<option value="Shipped" ${order.status=="Shipped"?"selected":""}>Shipped</option>

<option value="Delivered" ${order.status=="Delivered"?"selected":""}>Delivered</option>

</select>

</p>

<h3>Products</h3>

            <ul>
            ${cartItems}
            </ul>
           <button onclick="editProduct('${doc.id}')">✏️ Edit</button>
            <button onclick="deleteOrder('${orderDoc.id}')">
            Delete Order
            </button>

            </div>

            `;

        });

    } catch (error) {

        ordersDiv.innerHTML = "<h2>Error Loading Orders</h2>";

        alert(error.message);

    }

}
window.updateStatus = async function(id,status){

    await updateDoc(
        doc(db,"orders",id),
        { status: status }
    );

    alert("Status Updated");

}
window.deleteOrder = async function(id){

    if(confirm("Delete this order?")){

        await deleteDoc(doc(db,"orders",id));

        alert("Order Deleted");

        loadOrders();

    }

}


