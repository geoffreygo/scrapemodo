function renderArticles(data, saved) {
    if (data.length === 0) {
        $("#articles").append("<div class='card mt-3'><div class='card-header text-center'><h1>There are no articles! You can:</h1></div class='card-body'><a href='/scrape'><h1 class='text-center'>Scrape new articles!</h1></a><a href='/saved'><h1 class='text-center'>Go to saved articles!</h1></a></div>")
    } else {
        $("#articles").empty();
        if (!saved) {
            for (var i = 0; i < data.length; i++) {
            $("#articles").prepend("<div class='card mt-3'><div class='card-header' data-id='" + data[i]._id + "'>" + data[i].title + "<a class='pl-2' href='" + data[i].link + "' target='_blank'>Read article</a><button class='btn btn-danger my-2 my-sm-0 saveBtn float-right'>Save article</button></div class='card-body'><img class='pix pl-2 pt-2 pb-2' src='" + data[i].picLink + "'/><p class='summaries pl-2 pr-2 pt-2 pb-2'>" + data[i].summary + "</p></div>");
            }
        } else {
            for (var i = 0; i < data.length; i++) {
            $("#articles").prepend("<div class='card mt-3'><div class='card-header' data-id='" + data[i]._id + "'>" + data[i].title + "<a class='pl-2' href='" + data[i].link + "' target='_blank'>Read article</a><button class='btn btn-danger my-2 my-sm-0 commentBtn float-right ml-3'data-toggle='modal' data-target='#commentModal'>Article comment</button><button class='btn btn-danger my-2 my-sm-0 delBtn float-right'>Delete saved article</button></div class='card-body'><img class='pix pl-2 pt-2 pb-2' src='" + data[i].picLink + "'/><p class='summaries pl-2 pr-2 pt-2 pb-2'>" + data[i].summary + "</p></div>");
            
        }
    }
}
};

$.getJSON("/articles", function(data) {
    renderArticles(data, false);
  });

$("#scrapeBtn").on("click", function(event) {
    event.preventDefault();
    $.ajax({
        method: "GET",
        url: "/scrape"
      }).then(function() {
          setTimeout(location.reload(), 2000) ;
      })
})

$(document).on("click", ".saveBtn", function(event) {
    event.preventDefault();
    var id = $(this).parent().attr("data-id");
    $.ajax({
        method: "POST",
        url: "/saved/" + id
      })
    .then(function() {
        $.getJSON("/saved", function(data) {
            renderArticles(data, true);
          })
    });
});

$(document).on("click", ".delBtn", function(event) {
    event.preventDefault();
    var id = $(this).parent().attr("data-id");
    $.ajax({
        method: "POST",
        url: "/unsave/" + id
      })
    .then(function() {
        $.getJSON("/saved", function(data) {
            renderArticles(data, true);
          })
    });
});

$("#saved").on("click", function(event) {
    event.preventDefault();
    $.getJSON("/saved", function(data) {
        renderArticles(data, true);
        })
})

$("#home").on("click", function(event) {
    event.preventDefault();
    $.getJSON("/articles", function(data) {
        renderArticles(data, false);
      })
})