//requires
const express = require("express")
const app = express()
const mustacheExpress = require('mustache-express')
const models = require("./models")
const bcrypt = require('bcrypt')

const saltRounds = 10


//parser
app.use(express.urlencoded())


//engine
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

//gets
app.get('/', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) =>
    res.render('register'))


app.listen(3000, () => {
    console.log("All systems go")
})