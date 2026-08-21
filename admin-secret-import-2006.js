import { auth } from "./firebase.js";

auth.onAuthStateChanged((user) => {
    if (!user || user.email !== "princekamboj94670@gmail.com") {
        alert("Access Denied");
        window.location.href = "index.html";
    }
});
import { db } from "./firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const products = [
{
name:"Samsung Galaxy S25",
price:74999,
category:"mobiles",
image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
description:"Samsung flagship 5G smartphone"
},
{
name:"iPhone 16",
price:79999,
category:"mobiles",
image:"https://images.unsplash.com/photo-1592750475338-74b7b21085ab",
description:"Latest Apple iPhone"
},
{
name:"OnePlus 13",
price:69999,
category:"mobiles",
image:"https://images.unsplash.com/photo-1580910051074-3eb694886505",
description:"Premium OnePlus smartphone"
},
{
name:"MacBook Air M4",
price:114999,
category:"laptops",
image:"https://images.unsplash.com/photo-1517336714739-489689fd1ca8",
description:"Apple lightweight laptop"
},
{
name:"Dell XPS 15",
price:139999,
category:"laptops",
image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
description:"Premium Windows laptop"
},
{
name:"Sony WH-1000XM5",
price:24999,
category:"electronics",
image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
description:"Noise cancelling headphones"
},
{
name:"Apple AirPods Pro 2",
price:22999,
category:"electronics",
image:"https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37",
description:"Premium wireless earbuds"
},
{
name:"Nike Air Max",
price:9999,
category:"fashion",
image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff",
description:"Sports shoes"
}
];

async function importProducts() {

  for (const product of products) {

    await addDoc(
      collection(db, "products"),
      product
    );

  }

  alert("✅ Products Imported Successfully");

}

importProducts();
