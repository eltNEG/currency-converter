function openDatabase() {
  //ensure browser supports service worker or return
  const navigator = window.navigator;
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  const dbPromise = idb.open("currencyConverter", 1, function(upgradeDb) {
        const store = upgradeDb.createObjectStore("cachedCurrencies", {
          keyPath: "value"
        });
        store.createIndex("byText", "text");
  });
  /*
  dbPromise.then(db => {
    const tx = db.transaction("cachedCurrencies", "readwrite");
    const store = tx.objectStore("cachedCurrencies");
    store.put({
      text: 'test',
      value: "value"
    })
  })
  */
  return dbPromise;
}

window.openDatabase = openDatabase;
//openDatabase();
