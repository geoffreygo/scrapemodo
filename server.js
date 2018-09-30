var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var request = require("request");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");
// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapemodo";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes
app.get("/", function (req, res) {
    res.render("index");
})

app.get("/scrape", function (req, res) {
    console.log("in scrape route");
    request("https://www.gizmodo.com/", function (err, response, html) {
        if (err) {
            console.log(err);
        }
        var $ = cheerio.load(html);

        $("article.postlist__item").each(function (i, element) {

            var result = {};

            result.title = $(this)
                .children("header")
                .children("h1")
                .text();
            result.link = $(this)
                .children("header")
                .children("h1")
                .children("a")
                .attr("href");
            result.summary = $(this)
                .children("div.item__content")
                .children("div.excerpt")
                .children("p")
                .text();
            result.picLink = $(this)
                .children("div.item__content")
                .children("figure.asset")
                .children("a")
                .children("div.img-wrapper")
                .children("picture")
                .children("source")
                .attr("data-srcset");
            result.saved = false;
            // console.log("RESULT:\n", result);
            db.Article.findOne({ title: result.title })
            .then(function(article) {
                if (!article) {
                    db.Article.create(result)
                    .then(function (dbArticle) {
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                }
            })          
        });
        setTimeout(function() {res.sendStatus(200)}, 4500);
    });
});

app.get("/articles", function (req, res) {
    console.log("in articles route");
    db.Article.find({ "saved": false }).then(function (articles) {
        res.json(articles);
    })
});

app.post("/articles", function(req, res) {
    console.log("in delete route");
    db.Article.deleteMany({ "saved": false })
    .then(function() {
        res.render("index");
    })
})

app.get("/saved", function(req, res) {
    db.Article.find({ saved: true }).then(function(articles) {
        res.json(articles);
    })
})

app.post("/saved/:id", function(req, res) {
    db.Article.updateOne({ "_id": req.params.id }, { $set: { "saved": true } })
    .then(function() {
        res.end();
    })
})

app.post("/unsave/:id", function(req, res) {
    db.Article.updateOne({ "_id": req.params.id }, { $set: { "saved": false } })
    .then(function() {
        res.end();
    })
})

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(article) {
        res.json(article);
    })
    .catch(function(err) {
        console.log(err);
    })
});

app.post("/articles/:id", function (req, res) {
    db.Comment.create(req.body)
    .then(function(comment) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: comment._id }, { new: true })
        .then(function(article) {
            res.json(article);
        })
        .catch(function(err) {
            console.log(err);
        })
    })
});

app.post("/comment/:id", function(req, res) {
    db.Comment.update({ _id: req.params.id}, { $set: { title: req.body.title, body: req.body.body } })
    .then(function() {
        res.end();
    })
})

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
