"use strict";

const dbPromise = window.openDatabase();

const handleSubmit = () => {
  event.preventDefault();
  const currencyValIn = document.getElementById("currencyIn").value;
  const currencyOut = document.getElementById("currencyOut");
  const selectInCurrr = document.getElementById("selectInCurr").value;
  const selectOutCurrr = document.getElementById("selectOutCurr").value;
  const symbol = selectOutCurrr.split(' ')[1] === 'undefined' ? '' : selectOutCurrr.split(' ')[1];

  const selectInCurr = selectInCurrr.split(' ')[0]
  const selectOutCurr = selectOutCurrr.split(' ')[0]

  if (currencyValIn <= 0) {
    return;
  }
  currencyOut.value = "";
  currencyOut.placeholder = "converting...";
  fetch(
    `https://free.currencyconverterapi.com/api/v5/convert?q=${selectInCurr}_${selectOutCurr},${selectOutCurr}_${selectInCurr}&compact=y`
  )
    .then(resp => resp.json())
    .then(data => {
      const value = data[`${selectInCurr}_${selectOutCurr}`].val;
      const _value = data[`${selectOutCurr}_${selectInCurr}`].val
      currencyOut.value = `${symbol} ${currencyIn.value * value}`;
      dbPromise.then(db => {
        if (!db) {
          console.log("no db");
          return;
        }
        const tx = db.transaction("conversionRates", "readwrite");
        const store = tx.objectStore("conversionRates");
        store.put({
          pair: `${selectInCurr}_${selectOutCurr}`,
          rate: value,
          time: new Date()
        });
        store.put({
          pair: `${selectOutCurr}_${selectInCurr}`,
          rate: _value,
          time: new Date()
        });
      });
    }).catch(err => {
      console.log(err)
      dbPromise.then(db => {
        if(!db) return
        const tx = db.transaction("conversionRates");
        const store = tx.objectStore("conversionRates");
        store.openCursor()
        .then(function findPair(cursor) {
          if(!cursor) {
            currencyOut.placeholder = 'NETWORK ERROR!'
            return
          }
          if (cursor.value.pair === `${selectInCurr}_${selectOutCurr}`){
            currencyOut.value = `${symbol} ${currencyIn.value * cursor.value.rate}`;
            return
          }
          return cursor.continue().then(findPair)
        })
      })
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

    currencyIn.value = '';
    currencyOut.value = 0;

    let selectedInCurr = selectInCurr.value;
    let selectedOutCurr = selectOutCurr.value;
    selectInCurr.value = selectedOutCurr;
    selectOutCurr.value = selectedInCurr;
  },
  false
);

fetch(`https://free.currencyconverterapi.com/api/v5/currencies`)
  .then(
    response => {
      if (!response.ok) {
        console.log("fetch error");
      }
      return response.json();
    },
    err => {
      console.log(err);
    }
  )
  .then(response => {
    const currencies = response.results;
    const symbols = Object.keys(currencies);
    let options = [];
    for (const sym of symbols) {
      options.push({
        text: `${sym} - ${currencies[sym].currencyName}`,
        value: `${sym} ${currencies[sym].currencySymbol}`,
      });
    }
    makeSelectCurrencyOptions(options);
  })
  .catch(err => {
    console.log(err);
  });

const makeSelectCurrencyOptions = options => {
  let optionListIn = document.getElementById("selectInCurr");
  options.forEach(option =>{
    optionListIn.add(new Option(option.text, option.value, option.selected))
  });

  let optionListOut = document.getElementById("selectOutCurr");

  options.forEach(option =>
    optionListOut.add(new Option(option.text, option.value, option.selected))
  );
};

fetch('./js/ping').catch(()=>setTimeout(() => alert('This page is being served in offline mode'), 3000))

window.handleSubmit = handleSubmit;
