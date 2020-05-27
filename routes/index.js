const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const { check } = require("express-validator");
const fetch = require("node-fetch");
const session = require("express-session")


let saltRounds = 10
let games = [];
let gamesFiltered = [];
let searchedGame = [];
let gamesForHomePage = [];

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

router.get("/home", (req, res) => {
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
            gamesForHomePage = games.slice(1, 15);

            res.render("api", { games: gamesForHomePage });
        });
});

router.get("/games/:id", (req, res) => {
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
            res.render("games", { game: games });
        });
});

router.get("/filtered-games", (req, res) => {
    res.render("filtered-games", { filteredGames: gamesFiltered });
});

router.get("/game-search", (req, res) => {
    console.log(searchedGame);
    res.render("game-search", { gameSearched: searchedGame[0] });
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
    }).then(function(user) {
        if (!user) {
            res.render("login", { message: "username not found, please try again." });
        } else {
            bcrypt.compare(req.body.loginPass, user.password, function(err, result) {
                if (result == true) {
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
});

/*=============================================================================*/
///REGISTER POST////
/*=============================================================================*/
router.post(
    "/registerUser", [
        check("username").custom((value) => {
            return User.findByUsername(value).then((user) => {
                if (user) {
                    return console.log(user);
                }
            });
        }),
        check("email").custom((value) => {
            return User.findByEmail(value).then((user) => {
                if (user) {
                    return Promise.reject("Account is tied to Email");
                }
            });
        }),
        check("pass1").custom((value) => {
            if (value !== req.body.pass2) {
                throw new Error("Passwords do not match, please try again");
            }
        }),
    ],
    (req, res) => {
        bcrypt.hash(req.body.pass1, saltRounds, function(err, hash) {
            db.User.create({
                username: req.body.username,
                password: hash,
                first: req.body.firstName,
                last: req.body.lastName,
                email: req.body.email,
            }).then(function(data) {
                if (data) {
                    res.redirect("/");
                }
            });
        });
    }
);

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
    let category = req.body.dropdown;
    gamesFiltered = games.filter(function(x) {
        return x.genre == category;
    });
    res.redirect("/filtered-games");
});

router.post("/game-search", (req, res) => {
    let gameSearched = req.body.gameSearch;
    searchedGame = games.filter(function(x) {
        return x.name == gameSearched;
    });
    console.log(searchedGame);

    res.redirect("/game-search");
});

module.exports = router;