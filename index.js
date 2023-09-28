import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://realtime-database-3ad02-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.querySelector("#input-field");
const shoppingListEl = document.querySelector("#shopping-list");

const addBtn = document.querySelector("#add-button");
addBtn.addEventListener("click", () => {
  addItemToShoppingList(inputFieldEl.value);

  push(shoppingListInDB, inputFieldEl.value);
  clearInput();
});

onValue(shoppingListInDB, (snapshot) => {
  clearList();
  if (snapshot.exists()) {
    let shoppingList = Object.entries(snapshot.val());
    addListFromDatabaseToShoppingList(shoppingList);
  } else {
    shoppingListEl.innerHTML = "No Items Here Yet :(";
  }
});

const clearInput = () => {
  inputFieldEl.value = "";
};

const clearList = () => {
  shoppingListEl.innerHTML = "";
};

const addItemToShoppingList = (itemValue, itemId) => {
  let newEl = document.createElement("li");
  newEl.innerHTML = itemValue;
  newEl.id = itemId;
  newEl.addEventListener("click", () => {
    deleteItem(itemId);
  });
  shoppingListEl.append(newEl);
};

const addListFromDatabaseToShoppingList = (shoppingListArray) => {
  shoppingListArray.map((e) => addItemToShoppingList(e[1], e[0]));
};

const deleteItem = (id) => {
  remove(ref(database, `shoppingList/${id}`));
};
