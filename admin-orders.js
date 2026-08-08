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

  ordersDiv.innerHTML = "";

  const snapshot = await getDocs(collection(db, "orders"));

  snapshot.forEach((item) => {

    const order = item.data();

    ordersDiv.innerHTML += `
      <div style="border:1px solid #ccc;padding:15px;margin:10px;border-radius:10px;">
        <h3>${order.name}</h3>
        <p>📞 ${order.phone}</p>
        <p>📍 ${order.address}</p>
        <p>🚚 Status : ${order.status}</p>

        <button onclick="changeStatus('${item.id}','Pending')">Pending</button>

<button onclick="changeStatus('${item.id}','Packed')">Packed</button>

<button onclick="changeStatus('${item.id}','Shipped')">Shipped</button>

<button onclick="changeStatus('${item.id}','Delivered')">Delivered</button>
<button onclick="changeStatus('${item.id}','Cancelled')">
❌ Cancelled
</button>
      </div>
    `;
  });

}

window.changeStatus = async function(id, status){

  await updateDoc(doc(db,"orders",id),{
    status: status
  });

  alert("Status Updated");

  loadOrders();
}

loadOrders();
