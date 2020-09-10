/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  // ---------------------------------------------------------------------
  // For mitigating XSS, is used during construction of tweets
  // ---------------------------------------------------------------------
  const textEncoder = function(string) {
    let encodedText = '';
    const characterMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };
    for (let s of string) {
      if (characterMap[s]) {
        s = characterMap[s];
        encodedText += s;
      } else {
        encodedText += s;
      }
    }
    return encodedText;
  };
  // ---------------------------------------------------------------------
  // Builds tweet article using template
  // ---------------------------------------------------------------------
  const createTweetElement = function(tweet) {
    const tweetText = textEncoder(tweet.content.text);
    const days = Math.floor((new Date().getTime() - new Date(tweet.created_at).getTime()) / (1000 * 60 * 60 * 24));
    
    const $tweet = `
    <article class="tweet">
    <header>
    <img src=${tweet.user.avatars}>
    <span class="name">${tweet.user.name}</span>
    <span class="handle">${tweet.user.handle}</span>
    </header>
    <p>
    ${tweetText}
    </p>
    <footer>
    <span>${days} days ago</span>
    <span><i class="fab fa-font-awesome-flag"></i><i class="fas fa-retweet"></i><i class="fas fa-heart"></i></span>
    </footer>
    <article>`;
    
    return $tweet;
  };
  // ---------------------------------------------------------------------
  // Attaches tweet article to tweet container
  // ---------------------------------------------------------------------
  const renderTweets = function(tweets) {
    let $tweet;
    // Handles array of tweets for initial page load
    if (tweets.length > 0) {
      for (const tweet of tweets) {
        $tweet = createTweetElement(tweet);
        $('#tweets-container').append($tweet);
      }
    // Adds single tweet to top of container
    } else {
      $tweet = createTweetElement(tweets);
      $('#tweets-container').prepend($tweet);
    }
  };
  // ---------------------------------------------------------------------
  // Retrieves JSON tweets to be built
  // ---------------------------------------------------------------------
  const loadTweets = function(recentTweet) {
    $.ajax({
      url: '/tweets/',
      method: 'GET',
      dataType: 'JSON'
    }).then(function(response) {
      // Sorts JSON array by creation date (newest first)
      const sortedResponse = response.sort(function(a, b) {
        return b.created_at - a.created_at;
      });
      // Default behavior to pass entire array
      if (!recentTweet) {
        renderTweets(sortedResponse);
      // Only passes the first item from JSON array if function parameter specified
      } else if (recentTweet) {
        renderTweets(sortedResponse.shift());
      }
    });
  };
  // ---------------------------------------------------------------------
  // Called on page load in order to display entire tweet array
  // ---------------------------------------------------------------------
  loadTweets();
  // ---------------------------------------------------------------------
  // New tweet submissions
  // ---------------------------------------------------------------------
  $('form').on('submit', (evt) => {
    evt.preventDefault();
    $('.alert').empty();
    // Error checking
    if ($('#tweet-text').val().length > 140) {
      $('.alert').append('Tweet exceeds the 140 character limitation!');
      $('.alert').slideDown();
      $('.alert').css('display', 'flex');
    } else if ($('#tweet-text').val().length === 0) {
      $('.alert').append("You can't Tweet without a Tweet!");
      $('.alert').slideDown();
      $('.alert').css('display', 'flex');
    } else {
      $('.alert').slideUp();
      // Adds tweet to JSON array
      $.ajax({
        url: '/tweets/',
        method: 'POST',
        data: $('form').serialize()
      }).then(function() {
        $('form').trigger('reset');
        // Loads the new tweet on page
        loadTweets(true);
      });
    }
  });
  
});
