var gStartTime
var gTimerInterval
var gtimer
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}  
function startTimer() {

  gStartTime = Date.now()

  gTimerInterval = setInterval(() => {
      var seconds = ((Date.now() - gStartTime) / 1000).toFixed(2);
      var elSpan = document.querySelector('.timer');
      elSpan.innerText = seconds
  }, 10);
}
function resetTimer() {
  var elSpan = document.querySelector('.timer');
  gtimer = elSpan.innerText
  clearInterval(gTimerInterval)
  var elSpan = document.querySelector('.timer')
  elSpan.innerText = '0.00'
}
