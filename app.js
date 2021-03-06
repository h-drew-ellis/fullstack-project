//requires
const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const routes = require("./routes/index");
const models = require("./models");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");
const session = require("express-session");
const PORT = process.env.PORT || 3000;

app.use(express.static("css"));
app.use(
    session({
        secret: "racecar",
        resave: false,
        saveUninitialized: true,
    })
);


//parser
app.use(express.urlencoded());


///routes
app.use("/", routes);

//engine
app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");





app.listen(PORT, () => {
    console.log("All systems go");
});