//requires
const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const routes = require('./routes/index')
const models = require("./models");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");
const session = require("express-session")


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

app.use('/', routes)

app.listen(3000, () => {
    console.log("All systems go");
});