// check for indexDB browser support
let db;
// create a new db request for a "budget" database.
const request = indexedDB.open("budget")

request.onupgradeneeded = function (event) {
    const db = event.target.result
    db.createObjectStore("pending", { autoIncrement: true });
    // create object store called "pending" and set autoIncrement to true
  };

  request.onsuccess = function({target}) {
      db = target.result
    //   returns the online STATUS  of the browser

    if (navigator.onLine){
        checkDatabase();

    }
  };

  request.onerror = function( event){
      console.log(event)
    //   this for log error here
  };
  function saveRecord(record) {
    console.log(record);
  
    const transaction = db.transaction("pending", "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record)

  }
  function checkDatabase(){
      const transaction = db.transaction("pending", "readwrite");
      const store = transaction.objectStore("pending");
      const getAll = store.getAll()

      getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
          fetch("/api/transaction/bulk", {
            method: "POST",
            body: JSON.stringify(getAll.result),
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json"
            }
          })
            .then(response => response.json())
            .then(() => {
              // delete records if successful
              const transaction = db.transaction(["pending"], "readwrite");
              const store = transaction.objectStore("pending");
              store.clear();
            });
        }
      };
  }

//   listen to app online
window.addEventListener("online", checkDatabase);