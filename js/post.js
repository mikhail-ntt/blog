$(function(){"use strict";var t=encodeURIComponent(document.location.href);$.getJSON("http://free.sharedcount.com/?apikey=d730c518430eabcabc46ab79528c744067afa17e&url="+t,function(t){0!==t.Facebook.total_count&&$(".count-facebook").html(t.Facebook.total_count).fadeIn(),0!==t.Twitter&&$(".count-twitter").html(t.Twitter).fadeIn(),0!==t.GooglePlusOne&&$(".count-googleplus").html(t.GooglePlusOne).fadeIn(),0!==t.LinkedIn&&$(".count-linkedin").html(t.LinkedIn).fadeIn(),0!==t.StumbleUpon&&$(".count-stumbleupon").html(t.StumbleUpon).fadeIn()}),$.getJSON("http://www.reddit.com/api/info.json?jsonp=?&url="+t,function(t){var n=t.data.children.length;n>0&&$(".count-reddit").html(n).fadeIn()}),$.getJSON("http://feeds.delicious.com/v2/json/urlinfo/data?url="+t+"&callback=?",function(t){var n=0;t.length>0&&(n=t[0].total_posts),0!==n&&$(".count-delicious").html(t[0].total_posts).fadeIn()})}),$(function(){"use strict";$(".button").click(function(t){t.preventDefault();var n=$(this);window.open(n.attr("href"),n.attr("title"),"width=640,height=300")}),$("h2").each(function(t,n){var e=$(n),o=e.attr("id");o&&e.append($("<a/>").addClass("link").attr("href","#"+o).append('<i class="icon icon-link"></i>'))})});