$(document).ready(function() {
  $('#tweet-text').on('keyup', function() {
    const value = $( this ).val();
    const parent = $( this ).parent();
    const counter = parent.find('.counter');
    counter.val(140 - value.length);
    let counterVal = 140 - value.length;
    let color;
    color = counterVal < 0 ? 'red' : '#545149';
    $('output').css('color', color);
  })
});