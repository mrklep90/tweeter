/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  const createTweetElement = function(tweet) {

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
    
    function escape (string) {
      return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return characterMap[s];
      });
    }
    
    const date = new Date(tweet.created_at);
    const today = new Date();
    const days = Math.floor((today.getTime() - date.getTime()) / (1000*60*60*24));
    const tweetText = escape(tweet.content.text);
    
    let $tweet = `
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
    <article>`
    
    return $tweet
    
  };
  
  const renderTweets = function(tweets) {
    
    let $tweet;

    if (tweets.length > 0) {
      for (const tweet of tweets) {
        $tweet = createTweetElement(tweet);
        $('#tweets-container').append($tweet);
      }
    } else {
      $tweet = createTweetElement(tweets);
      $('#tweets-container').prepend($tweet);
    }
    
  };
  
  const loadTweets = function(recentTweet) {

    $.ajax({
      url: '/tweets/',
      method: 'GET',
      dataType: 'JSON' 
    }).then(function(response) {
      let sortedResponse = response.sort(function (a, b) {
        return b.created_at - a.created_at;
      })
      if (!recentTweet) {
        renderTweets(sortedResponse);
      } else if (recentTweet) {
        renderTweets(sortedResponse.shift());
      }
    })

  };

  loadTweets();

  $('form').on('submit', (evt) => {
    evt.preventDefault();
    if ($('#tweet-text').val().length > 140) {
      $('.alert').empty();
      $('.alert').append('Tweet exceeds the 140 character limitation!');
      $('.alert').slideDown();
      $('.alert').css('display', 'flex');
    } else if ($('#tweet-text').val().length === 0) {
      $('.alert').empty();
      $('.alert').append("You can't Tweet without a Tweet!");
      $('.alert').slideDown();
      $('.alert').css('display', 'flex');
    } else {
      $('.alert').slideUp();
      $('.alert').empty();
      evt.preventDefault();
      $.ajax({
        url: '/tweets/',
        method: 'POST',
        data: $('form').serialize()
      }).then(function(response) {
        $('form').trigger('reset');
        loadTweets(true);
      })
    }
  })
  
});
