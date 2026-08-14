(function(){
  var CURRENT_VERSION = document.querySelector('meta[name="cgl-version"]').content;
  var toast = document.getElementById('updateToast');
  var countdownEl = document.getElementById('updateCountdown');
  var refreshBtn = document.getElementById('updateNowBtn');
  var dismissBtn = document.getElementById('updateDismissBtn');
  var CHECK_INTERVAL_MS = 60000;
  var countdownTimer = null;
  var updateDetected = false;

  function startCountdown(){
    var seconds = 8;
    countdownEl.textContent = seconds;
    countdownTimer = setInterval(function(){
      seconds -= 1;
      countdownEl.textContent = seconds;
      if(seconds <= 0){
        clearInterval(countdownTimer);
        location.reload();
      }
    }, 1000);
  }

  function showToast(){
    if(updateDetected) return;
    updateDetected = true;
    toast.classList.add('is-shown');
    startCountdown();
  }

  refreshBtn.addEventListener('click', function(){
    clearInterval(countdownTimer);
    location.reload();
  });

  dismissBtn.addEventListener('click', function(){
    clearInterval(countdownTimer);
    toast.classList.remove('is-shown');
  });

  function checkForUpdate(){
    if(updateDetected) return;
    fetch(location.href.split('#')[0].split('?')[0] + '?_=' + Date.now(), { cache:'no-store' })
      .then(function(res){ return res.text(); })
      .then(function(html){
        var match = html.match(/name="cgl-version" content="([^"]+)"/);
        if(match && match[1] && match[1] !== CURRENT_VERSION){
          showToast();
        }
      })
      .catch(function(){});
  }

  setInterval(checkForUpdate, CHECK_INTERVAL_MS);
  document.addEventListener('visibilitychange', function(){
    if(document.visibilityState === 'visible') checkForUpdate();
  });
})();
