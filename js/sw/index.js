function registerServiceWorker() {
  const navigator = window.navigator
  if (!navigator.serviceWorker) return;
  
  navigator.serviceWorker.register("./sw.js").then(function(reg) {    
    if (!navigator.serviceWorker.controller) {
      console.log('no controller')
      return;
    }

    if (reg.waiting) {
      _updateReady(reg.waiting);
      return;
    }

    if (reg.installing) {
      _trackInstalling(reg.installing);
      return;
    }

    reg.addEventListener("updatefound", function() {
      _trackInstalling(reg.installing);
    });
    
  }).catch((err) => console.log('sw not registered. error = ' + err));

  // Ensure refresh is only called once.
  // This works around a bug in "force update on reload".
  var refreshing;
  navigator.serviceWorker.addEventListener("controllerchange", function() {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
}

const _updateReady = (worker) => {
  const reply = confirm("Update to new version?")
  if (reply) {
    console.log('skipWaiting')
    worker.postMessage({action: "skipWaiting"})
  }
}

const _trackInstalling = (worker) => {
  worker.addEventListener('statechange', () => {
    if (worker.state == 'installed'){
      _updateReady(worker)
    }
  })
}

registerServiceWorker()
