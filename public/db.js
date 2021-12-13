let db;
// create a new db request for a "BudgetDB" database.
const request = window.indexedDB.open("budgetDB", 1);

// create object store called "BudgetStore" and set autoIncrement to true
request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const budgetStore = db.createObjectStore("budgetDB", {
    keyPath: "listID",
    autoIncrement: true,
  });
  budgetStore.createIndex("transactionIndex", "transaction");
};

//When a user comes to the page, check if they are online.
//If so, run checkDatabase which grab what's in indexedDB and sends it back to the server.

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};
