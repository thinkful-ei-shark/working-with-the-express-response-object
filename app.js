const express = require("express");
const morgan = require("morgan");

const app = express();

const books = require("./books-data.js");
const playstore = require("./playstore-data.js");

app.use(morgan("common"));

app.get("/apps", (req, res) => {
  const { sort, genres } = req.query;
  const listOfGenres = [
    "action",
    "puzzle",
    "strategy",
    "casual",
    "arcade",
    "card",
  ];
  if (sort) {
    if (!["rating", "app"].includes(sort)) {
      return res.status(400).send("Sort must be rating or app");
    }
  }

  if (!listOfGenres.includes(genres)) {
    return res.status(400).send("Invalid genre");
  }

  let results = playstore.filter((store) =>
    store.Genres.toLowerCase().includes(genres.toLowerCase())
  );
  if (sort) {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }
  res.json(results);
});

app.get("/books", (req, res) => {
  const { search = "", sort } = req.query;

  if (sort) {
    if (!["title", "rank"].includes(sort)) {
      return res.status(400).send("Sort must be one of title or rank");
    }
  }

  let results = books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

  if (sort) {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
    });
  }
  res.json(results);
});

app.listen(8000, () => {
  console.log("http://localhost:8000");
});
