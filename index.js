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
const oldItemsListInDB = ref(database, "oldItemsList");

const inputFieldEl = document.querySelector("#input-field");
const shoppingListEl = document.querySelector("#shopping-list");
const oldItemsListEl = document.querySelector("#old-items-list");

const addBtn = document.querySelector("#add-button");
addBtn.addEventListener("click", () => {
  addItemToShoppingList(inputFieldEl.value);

  push(shoppingListInDB, inputFieldEl.value);
  clearInput();
});

onValue(shoppingListInDB, (snapshot) => {
  clearShoppingList();
  if (snapshot.exists()) {
    let shoppingList = Object.entries(snapshot.val());
    addListFromDatabaseToShoppingList(shoppingList);
  } else {
    shoppingListEl.innerHTML = "No Items Here Yet :(";
  }
});

onValue(oldItemsListInDB, (snapshot) => {
  clearOldList();
  if (snapshot.exists()) {
    let oldItemList = Object.entries(snapshot.val());
    addListFromDatabaseToOldList(oldItemList);
  } else {
    oldItemsListEl.innerHTML = "";
  }
});

const clearInput = () => {
  inputFieldEl.value = "";
};

const clearShoppingList = () => {
  shoppingListEl.innerHTML = "";
};

const clearOldList = () => {
  oldItemsListEl.innerHTML = "";
};

const addItemToShoppingList = (itemValue, itemId) => {
  let newEl = document.createElement("li");
  newEl.innerHTML = itemValue;
  newEl.id = itemId;
  newEl.className = "shopping--list--item";
  newEl.addEventListener("click", () => {
    addItemToOldList(itemValue, itemId);
    push(oldItemsListInDB, itemValue);
    deleteItemShoppingList(itemId);
  });
  shoppingListEl.append(newEl);
};

const addItemToOldList = (itemValue, itemId) => {
  let newEl = document.createElement("li");
  newEl.innerHTML = itemValue;
  newEl.id = itemId;
  newEl.draggable = true;
  newEl.className = "old--list--item";
  newEl.addEventListener("drag", () => {
    deleteItemOldList(itemId);
  });
  newEl.addEventListener("click", (event) => {
    push(shoppingListInDB, itemValue);
    deleteItemOldList(itemId);
  });
  oldItemsListEl.append(newEl);
};

const addListFromDatabaseToShoppingList = (shoppingListArray) => {
  shoppingListArray.map((e) => addItemToShoppingList(e[1], e[0]));
};

const addListFromDatabaseToOldList = (oldListArray) => {
  oldListArray.map((e) => addItemToOldList(e[1], e[0]));
};

const deleteItemShoppingList = (id) => {
  remove(ref(database, `shoppingList/${id}`));
};

const deleteItemOldList = (id) => {
  remove(ref(database, `oldItemsList/${id}`));
};
