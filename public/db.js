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
