let db;
// create a new db request for a "BudgetDB" database.
const request = window.indexedDB.open("budgetDB", 1);

// create object store called "BudgetStore" and set autoIncrement to true
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  db.createObjectStore("budgetStore", { autoIncrement: true });
};

//When a user comes to the page, check if they are online.
//If so, run checkDatabase which grab what's in indexedDB and sends it back to the server.

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    console.log("Backend Online!");
    checkDatabase();
  }
};

//If we are offline, this function is called.
//It saves the users single input in the indexedDB object store.

function saveRecord(record) {
  // create a transaction on the pending db with readwrite access
  const transaction = db.transaction(["budgetStore"], "readwrite");
  // access your pending object store
  const budgetStore = transaction.objectStore("budgetStore");
  // add record to your store with add method.
  budgetStore.add(record);
}

//function that grabs whats in the indexedDB and sends it to the server

function checkDatabase() {
  // open a transaction on your pending db
  let transaction = db.transaction(["budgetStore"], "readwrite");

  // access your pending object store
  const budgetStore = transaction.objectStore("budgetStore");

  // get all records from store and set to a variable

  const getAll = budgetStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          // if successful, open a transaction on your pending db
          if (response.length !== 0) {
            transaction = db.transaction(["budgetStore"], "readwrite");
            // access your pending object store
            const currentStore = transaction.objectStore("budgetStore");
            // clear all items in your store
            currentStore.clear();
            console.log("Clearing Store!");
          }
        });
    }
  };
}

//DO LAST
request.onerror = function (event) {
  // log error here
};

//If we are online, run the checkDatabase function.
window.addEventListener("online", checkDatabase);
