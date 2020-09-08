$(document).ready(function() {
  console.log('DOM has loaded...');
  $('#tweet-text').on('keyup', function() {
    const value = $( this ).val();
    const parent = $( this ).parent();
    const counter = parent.find('.counter');
    counter.val(140 - value.length);
    let counterVal = counter.val();
    console.log(counterVal);
    if (counterVal < 0) {
    }
  })
});