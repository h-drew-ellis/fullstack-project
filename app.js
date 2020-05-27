//requires

const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const models = require("./models");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");


const saltRounds = 10;

let games = [];
let gamesFiltered = [];
let searchedGame = [];

//parser
app.use(express.urlencoded());

//engine
app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");


//gets
app.get("/", (req, res) => {
  res.render("login");
});

app.get("/mainpage", (req, res) => {
  fetch("https://api.rawg.io/api/games?page_size=40")
    .then((response) => response.json())
    .then((gameInfo) => {
      for (let i = 0; i < gameInfo.results.length; i++) {
        games.push({
          name: gameInfo.results[i].name,
          released: gameInfo.results[i].released,
          image: gameInfo.results[i].background_image,
          rating: gameInfo.results[i].rating,
          genre: gameInfo.results[i].genres[0].name,
          id: gameInfo.results[i].id,
        });
      }
      res.render("api", { games: games });
      //   console.log(games);
    });
});

app.get("/register", (req, res) => res.render("register"));

app.get("/games/:id", (req, res) => {
  games = [];
  let id = req.params.id;
  console.log(id);
  fetch(`https://api.rawg.io/api/games/${id}`)
    .then((response) => response.json())
    .then((gameInfo) => {
      games.push({
        name: gameInfo.name,
        released: gameInfo.released,
        image: gameInfo.background_image,
        rating: gameInfo.rating,
        genre: gameInfo.genres[0].name,
        id: gameInfo.id,
      });

      console.log(games);
    })
    .then(() => {
      res.render("games", { game: games });
    });
});

app.get("/filtered-games", (req, res) => {
  console.log(gamesFiltered);
  res.render("filtered-games", { filteredGames: gamesFiltered });
});

app.get("/game-search", (req, res) => {
  console.log(searchedGame);
  res.render("game-search", { gameSearched: searchedGame[0] });
});

//posts

app.post("/games/specific-game", (req, res) => {
  let id = req.body.gameId;
  console.log(id);
  fetch(`https://api.rawg.io/api/games/${id}`)
    .then((response) => response.json())
    .then((gameInfo) => {
      for (let i = 0; i < gameInfo.results.length; i++) {
        games.push({
          name: gameInfo.results[i].name,
          released: gameInfo.results[i].released,
          image: gameInfo.results[i].background_image,
          rating: gameInfo.results[i].rating,
          id: gameInfo.results[i].id,
        });
      }
      //   console.log(games);
    });
  res.render("games");
});

app.post("/filtered-games", (req, res) => {
  let category = req.body.dropdown;
  gamesFiltered = games.filter(function (x) {
    return x.genre == category;
  });
  res.redirect("/filtered-games");
});

app.post("/game-search", (req, res) => {
  let gameSearched = req.body.gameSearch;
  searchedGame = games.filter(function (x) {
    return x.name == gameSearched;
  });


  res.redirect("/game-search");
});

app.listen(3000, () => {
  console.log("All systems go");
});
