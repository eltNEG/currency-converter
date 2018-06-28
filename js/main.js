"use strict";

const dbPromise = window.openDatabase();

const handleSubmit = () => {
  event.preventDefault();
  const currencyValIn = document.getElementById("currencyIn").value;
  const currencyOut = document.getElementById("currencyOut");
  const selectInCurr = document.getElementById("selectInCurr").value;
  const selectOutCurr = document.getElementById("selectOutCurr").value;
  if (currencyValIn <= 0) {
    return;
  }
  currencyOut.value = ''
  currencyOut.placeholder = "converting...";
  fetch(
    `https://free.currencyconverterapi.com/api/v5/convert?q=${selectInCurr}_${selectOutCurr}&compact=y`
  )
    .then(resp => resp.json())
    .then(data => {
      const value = data[`${selectInCurr}_${selectOutCurr}`].val;
      console.log(value);
      currencyOut.value = currencyIn.value * value;
    });
};

const arrow = document.getElementById("arror");
arrow.addEventListener(
  "click",
  event => {
    const selectInCurr = document.getElementById("selectInCurr");
    const selectOutCurr = document.getElementById("selectOutCurr");
    const currencyIn = document.getElementById("currencyIn");
    const currencyOut = document.getElementById("currencyOut");

    let inVal = currencyIn.value;
    let outVal = currencyOut.value;
    currencyIn.value = outVal;
    currencyOut.value = inVal;

    let selectedInCurr = selectInCurr.value;
    let selectedOutCurr = selectOutCurr.value;
    selectInCurr.value = selectedOutCurr;
    selectOutCurr.value = selectedInCurr;
  },
  false
);

fetch(`https://free.currencyconverterapi.com/api/v5/currencies`)
  .then(response =>{ 
    if(!response.ok){
      console.log('fetch error')
    }
    return response.json()
  }, err => {
    console.log(err)
  })
  .then(response => {
    const currencies = response.results;
    const symbols = Object.keys(currencies);
    let options = [];
    for (const sym of symbols) {
      options.push({
        text: currencies[sym].currencyName,
        value: sym
      });
    }
    /*
    dbPromise.then(db => {
      if (!db) {
        console.log('no db')
        return
      };
      console.log('db seen');
      const tx = db.transaction("cachedCurrencies", "readwrite");
      const store = tx.objectStore("cachedCurrencies");
      options.forEach(option => store.put(option));
    });
    */
    makeSelectCurrencyOptions(options);
  })
  .catch(err => {
    console.log(err)
    /*
    dbPromise.then(db =>{
      if(!db) return;
      const tx = db.transaction("cachedCurrencies")
      tx.objectStore('cachedCurrencies').index('byText').getAll()
      .then(currencyOptions => makeSelectCurrencyOptions(currencyOptions))
    })
    */
  });


const makeSelectCurrencyOptions = options => {
  let optionListIn = document.getElementById("selectInCurr");
  options.forEach(option =>
    optionListIn.add(new Option(option.text, option.value, option.selected))
  );

  let optionListOut = document.getElementById("selectOutCurr");

  options.forEach(option =>
    optionListOut.add(new Option(option.text, option.value, option.selected))
  );
};

window.handleSubmit = handleSubmit;
