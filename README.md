# scrapemodo

This is a node, mongo, and express app. It uses request to get articles from
Gizmodo's home page and cheerio to get the html. The app then saves 
the title, link, summary, and image (if there is one) to Mongo and 
displays them.

Functionality:
  - Scrape articles - checks to see if there are articles on the home
    page of Gizmodo that are not on scrapemodo yet
  - Save articles - these are persistent since they're in Mongo
  - Create a comment for a saved article using the Article Comment button
  - Update a comment or add to it
  - Clear articles - will clear out all but the saved articles
  
  https://scrapemodo.herokuapp.com/
