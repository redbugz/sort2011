$(document).ready(function(){
  $.getJSON("http://api.flickr.com/services/feeds/groups_pool.gne?id=24857194@N00&format=json", 
          function(data){ 
            $.each(data.items, function(i,item){ 
              $("<img/>").attr("src", item.media.m.replace("_m.jpg","_z.jpg")).appendTo("#gallery"); 
            }); 
    Galleria.loadTheme('galleria/themes/classic/galleria.classic.min.js');
    $("#gallery").galleria({
        width: 640,
        height: 500,
        transition: "fade",
        autoplay: true,
        lightbox: true
        
    });
  });

  var rssurl = "http://newsroom.lds.org/rss.xqy?q=temples";
var yqlurl = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20rss%20where%20url%3D%40feedurl&format=xml&diagnostics=true&feedurl="+rssurl;
$.get(rssurl, function(data) {
    var $xml = $(data);
    $xml.find("item").each(function() {
        var $this = $(this),
            item = {
                title: $this.find("title").text(),
                link: $this.find("link").text(),
                description: $this.find("description").text(),
                pubDate: $this.find("pubDate").text(),
                author: $this.find("author").text()
        }
        //Do something with item here...
        var link = $("<a></a>").attr("href", item.link).text(item.title).append("<br>");
        $("<p></p>").html(item.description).prepend(link).append("<br>").appendTo("#footer_column1 .footer_text");
    });
    });
    
});