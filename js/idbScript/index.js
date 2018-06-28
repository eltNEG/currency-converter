function openDatabase() {
  //ensure browser supports service worker or return
  const navigator = window.navigator;
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }
  const previousVersion = "currencyConverter"
  window.indexedDB.deleteDatabase(previousVersion)
  const currentVersion = "currencyConverter-v1"
  const dbPromise = idb.open(currentVersion, 1, function(upgradeDb) {
    upgradeDb.createObjectStore('conversionRates', {keyPath:"pair"})

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
