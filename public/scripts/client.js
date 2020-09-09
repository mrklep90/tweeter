/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  const createTweetElement = function(tweet) {
    
    const date = new Date(tweet.created_at);
    
    let $tweet = `
    <article class="tweet">
    <header>
    <img src=${tweet.user.avatars}>
    <span class="name">${tweet.user.name}</span>
    <span class="handle">${tweet.user.handle}</span>
    </header>
    <p>
    ${tweet.content.text}
    </p>
    <footer>
    <span>${date}</span>
    <span><i class="fab fa-font-awesome-flag"></i><i class="fas fa-retweet"></i><i class="fas fa-heart"></i></span>
    </footer>
    <article>`
    
    return $tweet
    
  };
  
  const renderTweets = function(tweets) {
    
    let $tweet;
    
    for (const tweet of tweets) {
      $tweet = createTweetElement(tweet);
      $('#tweets-container').append($tweet);
    }
    
  };
  
  const loadTweets = function() {

    $.ajax({
      url: '/tweets/',
      method: 'GET',
      dataType: 'JSON' 
    }).then(function(response) {
      renderTweets(response);
    })

  };

  loadTweets();

  $('form').on('submit', (evt) => {
    evt.preventDefault();
    $.ajax({
      url: '/tweets/',
      method: 'POST',
      data: $('textarea').serialize()
    }).then(function(response) {
      $('form').trigger('reset');
      console.log(response);
    })
  })
  
});
