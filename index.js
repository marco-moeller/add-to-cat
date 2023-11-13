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

let shoppingList = [];
let oldItemList = [];

const recycleBinEl = document.querySelector("#recycle-bin");
recycleBinEl.addEventListener("drop", (event) => {
  event.preventDefault();
  deleteItemOldList(event.dataTransfer.getData("text/plain"));
  deleteItemShoppingList(event.dataTransfer.getData("text/plain"));
});
recycleBinEl.addEventListener("dragover", (event) => {
  event.preventDefault();
});

const addBtn = document.querySelector("#add-button");
addBtn.addEventListener("click", () => {
  buttonClick();
});

const buttonClick = () => {
  if (!isInList(inputFieldEl.value.toLowerCase())) {
    push(shoppingListInDB, inputFieldEl.value.toLowerCase());
  }
  clearInput();
};

const isInList = (newItem) => {
  let isInShoppingList = false;
  let isInOldList = false;
  shoppingList.map((element) => {
    if (element.includes(newItem)) {
      isInShoppingList = true;
    }
  });
  oldItemList.map((element) => {
    if (element.includes(newItem)) {
      isInOldList = true;
    }
  });
  console.log(isInShoppingList);
  console.log(isInOldList);

  return isInShoppingList || isInOldList;
};

onValue(shoppingListInDB, (snapshot) => {
  clearShoppingList();
  if (snapshot.exists()) {
    shoppingList = Object.entries(snapshot.val());
    addListFromDatabaseToShoppingList(shoppingList);
  } else {
    shoppingListEl.innerHTML = "No Items Here Yet :(";
  }
});

onValue(oldItemsListInDB, (snapshot) => {
  clearOldList();
  if (snapshot.exists()) {
    oldItemList = Object.entries(snapshot.val());
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
  const newEl = createNewItem(itemValue, itemId, "shopping--list--item", [
    {
      type: "click",
      function: () => {
        addItemToOldList(itemValue, itemId);
        push(oldItemsListInDB, itemValue);
        deleteItemShoppingList(itemId);
      },
    },
  ]);
  shoppingListEl.append(newEl);
};

const addItemToOldList = (itemValue, itemId) => {
  const newEl = createNewItem(itemValue, itemId, "old--list--item", [
    {
      type: "click",
      function: () => {
        push(shoppingListInDB, itemValue);
        deleteItemOldList(itemId, itemValue);
      },
    },
  ]);

  oldItemsListEl.append(newEl);
};

const createNewItem = (itemValue, itemId, className, eventhandlerList) => {
  let newEl = document.createElement("li");
  newEl.innerHTML = itemValue;
  newEl.id = itemId;
  newEl.draggable = true;
  newEl.addEventListener("dragstart", dragstartHandler);
  newEl.className = className;
  eventhandlerList.map((eventHandler) =>
    newEl.addEventListener(eventHandler.type, eventHandler.function)
  );
  return newEl;
};

const addListFromDatabaseToShoppingList = (shoppingListArray) => {
  shoppingListArray
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map((e) => addItemToShoppingList(e[1], e[0]));
};

const addListFromDatabaseToOldList = (oldListArray) => {
  oldListArray
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map((e) => addItemToOldList(e[1], e[0]));
};

const deleteItemShoppingList = (id) => {
  remove(ref(database, `shoppingList/${id}`));
};

const deleteItemOldList = (id) => {
  remove(ref(database, `oldItemsList/${id}`));
};

const dragstartHandler = (ev) => {
  ev.dataTransfer.setData("text/plain", ev.target.id);
};
