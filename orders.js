import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyClNlPV9avthcPgSbC7daYJ0Y51tUznqc4",
  authDomain: "shopeasy-b59d1.firebaseapp.com",
  projectId: "shopeasy-b59d1",
  storageBucket: "shopeasy-b59d1.firebasestorage.app",
  messagingSenderId: "1057945325787",
  appId: "1:1057945325787:web:7dcd4ce00f2cb89d217cfe"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ordersDiv = document.getElementById("orders");

async function loadOrders() {

  ordersDiv.innerHTML = "<h3>Loading...</h3>";

  try {

    const snapshot = await getDocs(collection(db, "orders"));

    ordersDiv.innerHTML = "";

    if (snapshot.empty) {
      ordersDiv.innerHTML = "<h3>No Orders Found</h3>";
      return;
    }

    snapshot.forEach((item) => {

      const order = item.data();

      ordersDiv.innerHTML += `

      <div style="border:1px solid #ccc;padding:15px;margin:10px;border-radius:10px;">

        <h3>👤 ${order.name}</h3>

        <p>📞 ${order.phone}</p>

        <p>📍 ${order.address}</p>

        <p>🏙 ${order.city}</p>

        <p>💳 ${order.payment}</p>

        <p>📅 ${order.date}</p>

        <p><b>Status:</b> ${order.status}</p>

        <hr>

        <p>
        🟡 Pending
        ${order.status=="Pending" || order.status=="Packed" || order.status=="Shipped" || order.status=="Delivered" ? "✅" : "⬜"}
        </p>

        <p>
        📦 Packed
        ${order.status=="Packed" || order.status=="Shipped" || order.status=="Delivered" ? "✅" : "⬜"}
        </p>

        <p>
        🚚 Shipped
        ${order.status=="Shipped" || order.status=="Delivered" ? "✅" : "⬜"}
        </p>

        <p>
        ✅ Delivered
        ${order.status=="Delivered" ? "✅" : "⬜"}
        </p>

        ${
          order.status=="Pending" || order.status=="Packed"
          ? `<button onclick="cancelOrder('${item.id}')">❌ Cancel Order</button>`
          : ""
        }

      </div>

      `;

    });

  } catch (error) {

    console.log(error);

    ordersDiv.innerHTML = "<h3>Error Loading Orders</h3>";

  }

}

window.cancelOrder = async function(id){

  await updateDoc(doc(db,"orders",id),{
    status:"Cancelled"
  });

  alert("Order Cancelled Successfully");

  loadOrders();

}

loadOrders();
