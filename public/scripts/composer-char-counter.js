// ---------------------------------------------------------------------
//  Updates the text character counter
// ---------------------------------------------------------------------
$(document).ready(function() {
  $('#tweet-text').on('keyup', function() {
    const value = $(this).val();
    const parent = $(this).parent();
    const counter = parent.find('.counter');
    let counterVal = 140 - value.length;
    counter.val(counterVal);
    let color;
    color = counterVal < 0 ? 'red' : '#545149';
    $('output').css('color', color);
  });
});