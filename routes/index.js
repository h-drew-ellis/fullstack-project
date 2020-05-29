const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const { check } = require("express-validator");
const fetch = require("node-fetch");
const session = require("express-session");
const app = express();
app.use(express.static("css"));
app.use(
  session({
    secret: "racecar",
    resave: false,
    saveUninitialized: true,
  })
);

////Arrays
let saltRounds = 10;
let games = [];
let gamesFiltered = [];
let searchedGame = [];
let gamesForHomePage = [];
let watchListGames = [];

/*=============================================================================*/
/*=============================================================================*/
/// GETS////
/*=============================================================================*/
/*=============================================================================*/
/*=============================================================================*/
router.get("/", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/home", authentication, (req, res) => {
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
    })
    .then(() => {
      fetch("https://api.rawg.io/api/games?page=5")
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
        });
    })
    .then(() => {
      fetch("https://api.rawg.io/api/games?page=6")
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
        });
    })
    .then(() => {
      fetch("https://api.rawg.io/api/games?page=15")
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
        });
    })
    .then(() => {
      fetch("https://api.rawg.io/api/games?page=20")
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
        });
    })
    .then(() => {
      gamesForHomePage = games.slice(1, 11);

      res.render("api", { games: gamesForHomePage });
    });
});

router.get("/games/:id", authentication, (req, res) => {
  games = [];
  let id = req.params.id;
  console.log("initialize");

  fetch(`https://api.rawg.io/api/games/${id}`)
    .then((response) => response.json())

    .then((gameInfo) => {
      console.log("game info");
      games.push({
        name: gameInfo.name,
        released: gameInfo.released,
        image: gameInfo.background_image,
        rating: gameInfo.rating,
        genre: gameInfo.genres[0].name,
        id: gameInfo.id,
      });
      console.log("pushing game");
      res.render("games", { game: games });
      console.log("render");
    });
});

router.get("/filtered-games", authentication, (req, res) => {
  res.render("filtered-games", { filteredGames: gamesFiltered });
});

router.get("/game-search", authentication, (req, res) => {
  res.render("game-search", { gameSearched: searchedGame[0] });
});

router.get("/users", (req, res) => {
  db.watchlists
    .findAll({
      where: {
        userId: req.session.userId,
      },
    })
    .then((games) => {
      res.render("userPage", { watchListGames: games });
    });
});

router.get("/userSearch", authentication, (req, res) => {
  db.User.findAll().then((users) => {
    console.log(users);
    res.render("user-search", { users: users });
  });
});

/*=============================================================================*/
/*=============================================================================*/
/// POSTS////
/*=============================================================================*/
/*=============================================================================*/
/*=============================================================================*/

/*=============================================================================*/
///LOGIN POST////
/*=============================================================================*/
router.post("/login", (req, res) => {
  db.User.findOne({
    where: {
      username: req.body.loginUser,
    },
  }).then(function (user) {
    if (!user) {
      res.render("login", { message: "username not found, please try again." });
    } else {
      bcrypt.compare(req.body.loginPass, user.password, function (err, result) {
        if (result == true) {
          if (req.session) {
            req.session.authUser = true;
            //writing to session
            req.session.userId = user.dataValues.id;
          }
          console.log("logging in");

          res.redirect("/home");
        } else {
          bcrypt.compare(req.body.loginPass, user.password, function (
            err,
            result
          ) {
            if (result == true) {
              if (result) {
                req.session.authUser = true;
              }
              console.log("logging in");
              res.redirect("/home");
            } else {
              res.render("login", {
                message: "Invalid Password please try again.",
              });
            }
          });
        }
      });
    }
  });
});

/*=============================================================================*/
///REGISTER POST////
/*=============================================================================*/
router.post("/registerUser", (req, res) => {
  bcrypt.hash(req.body.pass1, saltRounds, function (err, hash) {
    db.User.create({
      username: req.body.username,
      password: hash,
      first: req.body.firstName,
      last: req.body.lastName,
      email: req.body.email,
    }).then(function (data) {
      if (data) {
        res.redirect("/");
      }
    });
  });
});

router.post("/games/specific-game", (req, res) => {
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

router.post("/filtered-games", (req, res) => {
  let category = req.body.category;
  gamesFiltered = games.filter(function (x) {
    return x.genre == category;
  });
  res.redirect("/filtered-games");
});

router.post("/game-search", (req, res) => {
  let gameSearched = req.body.gameSearch;
  searchedGame = games.filter(function (x) {
    return x.name == gameSearched;
  });

  res.redirect("/game-search");
});

router.post("/watchlist", (req, res) => {
  let name = req.body.namex;
  let released = req.body.released;
  let image = req.body.image;
  let userId = req.session.userId;
  let genre = req.body.genre;
  let gameId = req.body.gameId;
  console.log("printing name");
  console.log(name);
  //   let rating = parseInt(req.body.rating);
  let rating = 5;

  db.watchlists
    .create({
      genre: genre,
      gameId: gameId,
      userId: userId,
      name: name,
      released: released,
      image: image,
      rating: rating,
    })
    .then((watchlist) => {
      db.watchlists
        .findAll({
          where: {
            userId: req.session.userId,
          },
        })
        .then((x) => {
          for (let i = 0; i < x.length; i++) {
            watchListGames.push({
              id: x[i].dataValues.id,
              genre: x[i].dataValues.genre,
              userId: x[i].dataValues.userId,
              name: x[i].dataValues.name,
              released: x[i].dataValues.released,
              image: x[i].dataValues.image,
              rating: x[i].dataValues.rating,
            });
          }
        });
    });
  res.redirect("/home");
});

router.post("/addFriend", (req, res) => {
  let friend = req.body.userId;

  res.redirect("/userSearch");
});

function authentication(req, res, next) {
  if (req.session) {
    if (req.session.authUser) {
      next();
    } else {
      res.redirect("/register");
    }
  } else {
    res.redirect("/home");
  }
}

module.exports = router;
