//requires
const express = require("express")
const mustacheExpress = require('mustache-express')
const models = require("./models")
app.use(require('./routes'))

//vars
const app = express()

//parser
app.use(express.urlencoded())

//engine
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')


app.listen(300, () => {
    console.log("All systems go")
})