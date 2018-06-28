function openDatabase() {
  //ensure browser supports service worker or return
  const navigator = window.navigator;
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  const dbPromise = idb.open("currencyConverter", 2, function(upgradeDb) {
        switch(upgradeDb.oldVersion){
          case 0:
            const store = upgradeDb.createObjectStore("cachedCurrencies", {
              keyPath: "value"
            });
            store.createIndex("byText", "text");
          case 1:
            upgradeDb.createObjectStore('conversionRates', {keyPath:"pair"})
        }
        
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
